import { NError } from "../core/error";
import { NEvent } from "../core/event";
import { GlobalCache } from "../core/globalcache";
import { Model } from "../core/model";
import { Module } from "../core/module";
import { ModuleFactory } from "../core/modulefactory";
import { Nodom, NodomMessage} from "../core/nodom";
import { Renderer } from "../core/renderer";
import { RenderedDom } from "../core/types";
import { Util } from "../core/util";

/**
     * 指令类型初始化
     * @remarks
     * 每个指令类型都有一个名字、处理函数和优先级，处理函数`不能用箭头函数`
     * 处理函数在渲染时执行，包含两个参数 module(模块)、dom(目标虚拟dom)
     * 处理函数的this指向指令对象
     * 处理函数的返回值`true`表示继续，`false`表示后续指令不再执行，同时该节点不加入渲染树 
     */
(function () {
    /**
     * module 指令
     * 用于指定该元素为模块容器，表示子模块
     * 用法 x-module='模块类名'
     */
    Nodom.createDirective(
        'module',
        function (module: Module, dom: RenderedDom) {
            let m: Module;
            //存在moduleId，表示已经渲染过，不渲染
            let mid = <number>module.objectManager.getDomParam(dom.key, 'moduleId');
            if (mid) {
                m = ModuleFactory.get(mid);
            } else {
                const cls = this.value;
                m = ModuleFactory.get(cls);
                if (!m) {
                    return true;
                }
                m.templateModuleId = this.templateModuleId;
                mid = m.id;
                //保留modelId
                module.objectManager.setDomParam(dom.key, 'moduleId', mid);
                Renderer.getCurrentModule().addChild(m);
            }
            //保存到dom上，提升渲染性能
            dom.moduleId = <number>mid;
            //变成文本节点，作为子模块占位符，子模块渲染后替换占位符
            delete dom.tagName;
            //设置props，如果改变了props，启动渲染
            const o = {};
            if (dom.props) {
                for (const p of Object.keys(dom.props)) {
                    const v = dom.props[p];
                    if (p[0] === '$') { //数据
                        if (!o['$data']) {
                            o['$data'] = {};
                        }
                        o['$data'][p.substring(1)] = v;
                        //删除属性
                        delete dom.props[p];
                    } else {
                        o[p] = v;
                    }
                }
            }
            //传递给模块
            m.setProps(o, dom);
            return true;
        },
        8
    );

    /**
     *  model指令
     */
    Nodom.createDirective(
        'model',
        function (module: Module, dom: RenderedDom) {
            const model: Model = module.get(dom.model,this.value);
            if (model) {
                dom.model = model;
            }
            return true;
        },
        1
    );

    /**
     * 指令名 repeat
     * 描述：重复指令
     */
    Nodom.createDirective(
        'repeat',
        function (module: Module, dom: RenderedDom) {
            const rows = this.value;
            // 无数据不渲染
            if (!Util.isArray(rows) || rows.length === 0) {
                return false;
            }
            const src = dom.vdom;
            //索引名
            const idxName = src.getProp('index');
            const parent = dom.parent;
            //禁用该指令
            this.disabled = true;
            //避免在渲染时对src设置了model，此处需要删除
            for(let i = 0; i < rows.length; i++) {
                if(!rows[i]){
                    continue;
                }
                if (idxName && typeof rows[i] === 'object') {
                    rows[i][<string>idxName] = i;
                }
                const d = Renderer.renderDom(module, src, rows[i], parent, rows[i].__key);
                //删除index属性
                if (idxName) {
                    delete d.props['index'];
                }
            }
            //启用该指令
            this.disabled = false;
            return false;
        },
        2
    );

    /**
     * 递归指令
     * 作用：在dom内部递归，用于具有相同数据结构的节点递归生成
     * 递归指令不允许嵌套
     * name表示递归名字，必须与内部的recur标签的ref保持一致，名字默认为default
     * 典型模版
     * ```
     * <recur name='r1'>
     *      <element1>...</element1>
     *      <element2>...</element2>
     *      <recur ref='r1' />
     * </recur>
     * ```
     */
    Nodom.createDirective(
        'recur',
        function (module: Module, dom: RenderedDom) {
            const src = dom.vdom;
            //当前节点是递归节点存放容器
            if (dom.props.hasOwnProperty('ref')) {
                //如果出现在repeat中，src为单例，需要在使用前清空子节点，避免沿用上次的子节点
                src.children = [];
                //递归存储名
                const name = '$recurs.' + (dom.props['ref'] || 'default');
                const node = module.objectManager.get(name);
                if (!node) {
                    return true;
                }
                const model = dom.model;
                const cond = node.getDirective('recur');
                const m = model[cond.value];
                //不存在子层数组，不再递归
                if (!m) {
                    return true;
                }
                //克隆，后续可以继续用
                const node1 = node.clone();
                node1.removeDirective('recur');
                dom.children ||= [];
                if (!Array.isArray(m)) {  //非数组recur
                    Renderer.renderDom(module,node1,m,dom,m.__key);
                }else{  //数组内recur，依赖repeat得到model，repeat会取一次数组元素，所以需要dom model
                    Renderer.renderDom(module,node1,model,dom,m['__key']);
                }
                //删除ref属性
                delete dom.props['ref'];
            } else { //递归节点
                const data = dom.model[this.value];
                if (!data) {
                    return true;
                }
                //递归名，默认default
                const name = '$recurs.' + (dom.props['name'] || 'default');
                //删除name属性
                delete dom.props['name'];
                //保存递归定义的节点
                if (!module.objectManager.get(name)) {
                    module.objectManager.set(name, src);
                }
            }
            return true;
        },
        2
    );

    /**
     * 指令名 if
     * 描述：条件指令
     */
    Nodom.createDirective('if',
        function (module: Module, dom: RenderedDom) {
            if(!dom.parent){
                return;
            }
            module.objectManager.setDomParam(dom.parent.key, '$if', this.value);
            return this.value;
        },
        5
    );

    /**
     * 指令名 else
     * 描述：else指令
     */
    Nodom.createDirective(
        'else',
        function (module: Module, dom: RenderedDom) {
            if(!dom.parent){
                return;
            }
            return  !module.objectManager.getDomParam(dom.parent.key, '$if');
        },
        5
    );

    /**
     * elseif 指令
     */
    Nodom.createDirective('elseif',
        function (module: Module, dom: RenderedDom) {
            if(!dom.parent){
                return;
            }
            const v = module.objectManager.getDomParam(dom.parent.key, '$if');
            if (v === true) {
                return false;
            } else {
                if (!this.value) {
                    return false;
                } else {
                    module.objectManager.setDomParam(dom.parent.key, '$if', true);
                }
            }
            return true;
        },
        5
    );

    /**
     * elseif 指令
     */
    Nodom.createDirective(
        'endif',
        function (module: Module, dom: RenderedDom) {
            if(!dom.parent){
                return;
            }
            module.objectManager.removeDomParam(dom.parent.key, '$if');
            //endif 不显示
            return false;
        },
        5
    );

    /**
     * 指令名 show
     * 描述：显示指令
     */
    Nodom.createDirective(
        'show',
        function (module: Module, dom: RenderedDom) {
            //show指令参数 {origin:通过style设置的初始display属性,rendered:是否渲染过}
            let showParam = module.objectManager.getDomParam(dom.key, '$show');
            //为false且未渲染过，则不渲染
            if(!this.value && (!showParam || !showParam['rendered'])){
                return false;
            }
            if(!showParam){
                showParam = {};
                module.objectManager.setDomParam(dom.key, '$show',showParam);
            }
            let style = dom.props['style'];
            const reg =  /display\s*\:[\w\-]+/;
            let regResult;
            let display;
            if(style){
                regResult = reg.exec(style);
                //保存第一个style display属性
                if(regResult !== null){
                    const ra = regResult[0].split(':');
                    display = ra[1].trim();
                    //保存第一个display属性
                    if(!showParam['origin'] && display !== 'none'){
                        showParam['origin'] = display;
                    }
                }
            }

            // 渲染标识，value为false且尚未进行渲染，则不渲染
            if(!this.value){  
                if(style){
                    if(display){
                        //把之前的display替换为none
                        if(display!=='none'){
                            style = style.substring(0,regResult.index) + 'display:none' + style.substring(regResult.index + regResult[0].length);
                        }
                    }else{
                        style += ';display:none';
                    }
                }else{
                    style = 'display:none';
                }
            }else{
                //设置渲染标志
                showParam['rendered'] = true;
                if(display === 'none'){
                    if(style){
                        if(showParam['origin']){
                            style = style.substring(0,regResult.index) + 'display:' + showParam['origin'] + style.substring(regResult.index + regResult[0].length);
                        }else{
                            style = style.substring(0,regResult.index) + style.substring(regResult.index + regResult[0].length);
                        }
                    }
                }
            }
            if(style){
                dom.props['style'] = style;
            }
            return true;
        },
        5
    );
    
    /**
     * 指令名 field
     * 描述：字段指令
     */
    Nodom.createDirective('field',
        function (module: Module, dom: RenderedDom) {
            dom.assets ||= {};
            //修正staticnum
            if(dom.staticNum === 0){
                dom.staticNum = 1;
            }
            const dataValue = module.get(dom.model,this.value);
            if(dom.tagName === 'select'){
                dom.props['value'] = dataValue;
                //延迟设置value，避免option尚未渲染
                setTimeout(()=>{
                    const el = <HTMLSelectElement>module.domManager.getElement(dom.key);
                    if(el){
                        el.value = <string>dataValue;
                    }
                },0)
            }else if(dom.tagName === 'input'){
                switch(dom.props['type']){
                    case 'radio':
                        const value = dom.props['value'];
                        dom.props['name'] = this.value;
                        if (dataValue == value) {
                            dom.props['checked'] = 'checked';
                            dom.assets['checked'] = true;
                        } else {
                            delete dom.props['checked'];
                            dom.assets['checked'] = false;
                        }
                        break;
                    case 'checkbox':
                        //设置状态和value
                        const yv = dom.props['yes-value'];
                        //当前值为yes-value
                        if (dataValue == yv) {
                            dom.props['value'] = yv;
                            dom.assets['checked'] = true;
                        } else { //当前值为no-value
                            dom.props['value'] = dom.props['no-value'];
                            dom.assets['checked'] = false;
                        }
                        break;
                    default:
                        const v = (dataValue !== undefined && dataValue !== null) ? dataValue : '';
                        dom.props['value'] = v;
                        dom.assets['value'] = v;
                }
            }else{
                const v = (dataValue !== undefined && dataValue !== null) ? dataValue : '';
                dom.props['value'] = v;
                dom.assets['value'] = v;
            }
            //设置dom参数，避免二次添加事件
            if (!module.objectManager.getDomParam(dom.key,'$addedFieldEvent')) {
                module.objectManager.setDomParam(dom.key,'$addedFieldEvent',true);
                const event = new NEvent(null, 'change',
                    function (model, dom) {
                        const el = this.getElement(dom.key);
                        if (!el) {
                            return;
                        }
                        const directive = dom.vdom.getDirective('field');
                        const type = dom.props['type'];
                        let field = directive.value;
                        let v = el.value;
                        //根据选中状态设置checkbox的value
                        if (type === 'checkbox') {
                            if (dom.props['yes-value'] == v) {
                                v = dom.props['no-value'];
                            } else {
                                v = dom.props['yes-value'];
                            }
                        } else if (type === 'radio') {
                            if (!el.checked) {
                                v = undefined;
                            }
                        }
                        //修改字段值,需要处理.运算符
                        const arr = field.split('.')
                        if (arr.length === 1) {
                            model[field] = v;
                        } else {
                            let temp = model;
                            field = arr.pop();
                            for (let i = 0; i < arr.length && temp; i++) {
                                temp = temp[arr[i]];
                            }
                            if (temp) {
                                temp[field] = v;
                            }
                        }
                    }
                );
                dom.vdom.addEvent(event,0);
            }
            return true;
        },
        10
    );

    /**
     * route指令
     */
    Nodom.createDirective('route',
        function (module: Module, dom: RenderedDom) {
            if(!Nodom['$Router']){
                throw new NError('uninit',NodomMessage.TipWords.route);
            }
            //a标签需要设置href
            if (dom.tagName === 'a') {
                dom.props['href'] = 'javascript:void(0)';
            }
            dom.props['path'] = this.value;
            //有激活属性
            if (dom.props['active']) {
                const acName = dom.props['active'];
                delete dom.props['active'];
                //active 转expression
                const router = Nodom['$Router'];
                //添加激活model
                router.addActiveModel(module.id,this.value, dom.model, acName);
                //路由状态为激活，尝试激活路径
                if (dom.model[acName]) {
                    router.activePath(this.value);
                }
            }
            //添加click事件,避免重复创建事件对象，创建后缓存
            let event: NEvent = <NEvent>GlobalCache.get('$routeClickEvent');
            if (!event) {
                event = new NEvent(module, 'click',
                    function (model, dom) {
                        const path = dom.props['path'];
                        if (Util.isEmpty(path)) {
                            return;
                        }
                        Nodom['$Router'].go(path);
                    }
                );
                GlobalCache.set('$routeClickEvent', event);
            }
            //为virtual dom添加事件
            dom.vdom.addEvent(event);
            return true;
        },
        10
    );

    /**
     * 增加router指令
     */
    Nodom.createDirective('router',
        function (module: Module, dom: RenderedDom) {
            if(!Nodom['$Router']){
                throw new NError('uninit',NodomMessage.TipWords.route)
            }
            //建立新子节点            
            dom.children = [{key:dom.key+'_r',model:dom.model}];
            Nodom['$Router'].registRouter(module.id, Renderer.getCurrentModule(),dom);
            return true;
        },
        10
    );

    /**
     * 插头指令
     * 用于模块中，可实现同名替换
     */
    Nodom.createDirective('slot',
        function (module: Module, dom: RenderedDom) {
            this.value = this.value || 'default';
            const mid = dom.parent.moduleId;
            const src = dom.vdom;
            const slotName = '$slots.' + this.value;
            //父dom有module指令，表示为替代节点，替换子模块中的对应的slot节点；否则为子模块定义slot节点
            if (mid) {
                const m = ModuleFactory.get(mid);
                if (m) {
                    let cfg = m.objectManager.get(slotName);
                    if(!cfg){
                        cfg = {};
                        m.objectManager.set(slotName,cfg);
                    }
                    cfg.dom = src;
                    cfg.model = dom.model;
                    cfg.module = module;
                }
            } else { //源slot节点
                let cfg = module.objectManager.get(slotName);
                //内部有slot，但是使用时并未设置slot
                if(!cfg){
                    cfg = {type:1};
                }else if(!cfg.type){
                    //1 innerrender(通过当前模块渲染），2outerrender(通过模板所属模块渲染)
                    cfg.type = src.hasProp('innerrender')?1:2;
                    //首次渲染，需要检测是否绑定父dom model
                    for (const d of cfg.dom.children) {
                        if(check(d)){
                            //设定bind标志
                            cfg.needBind = true;
                            break;
                        }
                    }
                    /**
                     * 检测是否存在节点的statickNum=-1
                     * @param d -   带检测节点
                     * @returns     true/false
                     */
                    function check(d){
                        if(d.staticNum === -1){
                            return true;
                        }
                        //深度检测
                        if(d.children){
                            for(const d1 of d.children){
                                if(check(d1)){
                                    return true;
                                }
                            }
                        }
                    }
                }
                //渲染时添加s作为后缀，避免与模块内dom key冲突（相同model情况下）
                if(cfg.dom && cfg.dom.children && cfg.dom.children.length>0){
                    //渲染时添加s作为后缀，避免与模块内dom key冲突（相同model情况下）
                    if (cfg.type === 1) { //inner render模式
                        for (const d of cfg.dom.children) {
                            Renderer.renderDom(module, d, dom.model, dom.parent, dom.model['__key']+'s');
                        }
                    }else { // 外部渲染模式
                        //绑定数据
                        if(cfg.needBind){
                            cfg.module.modelManager.bindModel(cfg.model, module);
                        }
                        for (const d of cfg.dom.children) {
                            Renderer.renderDom(cfg.module, d, cfg.model, dom.parent, cfg.model['__key']+'s');
                        }
                    }
                }else{  //未在父模块配置slot，则直接渲染
                    return true;
                }
            }
            return false;
        },
        5
    );
}());