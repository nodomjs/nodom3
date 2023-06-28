import { NEvent } from "../core/event";
import { GlobalCache } from "../core/globalcache";
import { ModuleFactory } from "../core/modulefactory";
import { createDirective } from "../core/nodom";
import { Renderer } from "../core/renderer";
import { Router } from "../core/router";
import { Util } from "../core/util";
export default (function () {
    /**
     * 指令类型初始化
     * 每个指令类型都有一个名字、处理函数和优先级，处理函数不能用箭头函数
     * 处理函数在渲染时执行，包含两个参数 module(模块)、dom(目标虚拟dom)、src(源虚拟dom)
     * 处理函数的this指向指令
     * 处理函数的返回值 true 表示继续，false 表示后续指令不再执行
     */
    /**
     * module 指令
     * 用于指定该元素为模块容器，表示子模块
     * 用法 x-module='模块类名'
     */
    createDirective('module', function (module, dom) {
        let m;
        //存在moduleId，表示已经渲染过，不渲染
        let mid = module.objectManager.getDomParam(dom.key, 'moduleId');
        if (mid) {
            m = ModuleFactory.get(mid);
        }
        else {
            let cls = this.value;
            m = ModuleFactory.get(cls);
            if (!m) {
                return true;
            }
            m.templateModuleId = this.templateModuleId;
            mid = m.id;
            //保留modelId
            module.objectManager.setDomParam(dom.key, 'moduleId', mid);
            Renderer.currentModule.addChild(m);
        }
        //保存到dom上，提升渲染性能
        dom.moduleId = mid;
        //变成文本节点，作为子模块占位符，子模块渲染后替换占位符
        delete dom.tagName;
        //设置props，如果改变了props，启动渲染
        let o = {};
        if (dom.props) {
            for (let p of Object.keys(dom.props)) {
                let v = dom.props[p];
                if (p[0] === '$') { //数据
                    if (!o.$data) {
                        o.$data = {};
                    }
                    o.$data[p.substring(1)] = v;
                    //删除属性
                    delete dom.props[p];
                }
                else {
                    o[p] = v;
                }
            }
        }
        //传递给模块
        m.setProps(o, dom);
        return true;
    }, 8);
    /**
     *  model指令
     */
    createDirective('model', function (module, dom) {
        let model = module.get(dom.model, this.value);
        if (model) {
            dom.model = model;
        }
        return true;
    }, 1);
    /**
     * 指令名 repeat
     * 描述：重复指令
     */
    createDirective('repeat', function (module, dom) {
        let rows = this.value;
        // 无数据，不渲染
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
        for (let i = 0; i < rows.length; i++) {
            if (!rows[i]) {
                continue;
            }
            if (idxName) {
                rows[i][idxName] = i;
            }
            let d = Renderer.renderDom(module, src, rows[i], parent, rows[i].__key);
            //删除index属性
            if (idxName) {
                delete d.props['index'];
            }
        }
        //启用该指令
        this.disabled = false;
        return false;
    }, 2);
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
    createDirective('recur', function (module, dom) {
        const src = dom.vdom;
        //当前节点是递归节点存放容器
        if (dom.props.hasOwnProperty('ref')) {
            //如果出现在repeat中，src为单例，需要在使用前清空子节点，避免沿用上次的子节点
            src.children = [];
            //递归存储名
            const name = '$recurs.' + (dom.props['ref'] || 'default');
            let node = module.objectManager.get(name);
            if (!node) {
                return true;
            }
            let model = dom.model;
            let cond = node.getDirective('recur');
            let m = model[cond.value];
            //不存在子层数组，不再递归
            if (!m) {
                return true;
            }
            //克隆，后续可以继续用
            let node1 = node.clone();
            node1.removeDirective('recur');
            dom.children || (dom.children = []);
            if (!Array.isArray(m)) { //非数组recur
                Renderer.renderDom(module, node1, m, dom, m.__key);
            }
            else { //数组内recur，依赖repeat得到model，repeat会取一次数组元素，所以需要dom model
                Renderer.renderDom(module, node1, model, dom, m.__key);
            }
        }
        else { //递归节点
            let data = dom.model[this.value];
            if (!data) {
                return true;
            }
            //递归名，默认default
            const name = '$recurs.' + (dom.props['name'] || 'default');
            if (!module.objectManager.get(name)) {
                module.objectManager.set(name, src);
            }
        }
        return true;
    }, 2);
    /**
     * 指令名 if
     * 描述：条件指令
     */
    createDirective('if', function (module, dom) {
        if (!dom.parent) {
            return;
        }
        module.objectManager.setDomParam(dom.parent.key, '$if', this.value);
        return this.value;
    }, 5);
    /**
     * 指令名 else
     * 描述：else指令
     */
    createDirective('else', function (module, dom) {
        if (!dom.parent) {
            return;
        }
        return !module.objectManager.getDomParam(dom.parent.key, '$if');
    }, 5);
    /**
     * elseif 指令
     */
    createDirective('elseif', function (module, dom) {
        if (!dom.parent) {
            return;
        }
        let v = module.objectManager.getDomParam(dom.parent.key, '$if');
        if (v === true) {
            return false;
        }
        else {
            if (!this.value) {
                return false;
            }
            else {
                module.objectManager.setDomParam(dom.parent.key, '$if', true);
            }
        }
        return true;
    }, 5);
    /**
     * elseif 指令
     */
    createDirective('endif', function (module, dom) {
        if (!dom.parent) {
            return;
        }
        module.objectManager.removeDomParam(dom.parent.key, '$if');
        //endif 不显示
        return false;
    }, 5);
    /**
     * 指令名 show
     * 描述：显示指令
     */
    createDirective('show', function (module, dom) {
        //show指令参数 {origin:通过style设置的初始display属性,rendered:是否渲染过}
        let showParam = module.objectManager.getDomParam(dom.key, '$show');
        //为false且未渲染过，则不渲染
        if (!this.value && (!showParam || !showParam.rendered)) {
            return false;
        }
        if (!showParam) {
            showParam = {};
            module.objectManager.setDomParam(dom.key, '$show', showParam);
        }
        let style = dom.props['style'];
        const reg = /display\s*\:[\w\-]+/;
        let regResult;
        let display;
        if (style) {
            regResult = reg.exec(style);
            //保存第一个style display属性
            if (regResult !== null) {
                let ra = regResult[0].split(':');
                display = ra[1].trim();
                //保存第一个display属性
                if (!showParam.origin && display !== 'none') {
                    showParam.origin = display;
                }
            }
        }
        // 渲染标识，value为false且尚未进行渲染，则不渲染
        if (!this.value) {
            if (style) {
                if (display) {
                    //把之前的display替换为none
                    if (display !== 'none') {
                        style = style.substring(0, regResult.index) + 'display:none' + style.substring(regResult.index + regResult[0].length);
                    }
                }
                else {
                    style += ';display:none';
                }
            }
            else {
                style = 'display:none';
            }
        }
        else {
            //设置渲染标志
            showParam.rendered = true;
            if (display === 'none') {
                if (showParam.origin) {
                    style = style.substring(0, regResult.index) + 'display:' + showParam.origin + style.substring(regResult.index + regResult[0].length);
                }
                else {
                    style = style.substring(0, regResult.index) + style.substring(regResult.index + regResult[0].length);
                }
            }
        }
        if (style) {
            dom.props['style'] = style;
        }
        return true;
    }, 5);
    /**
     * 指令名 field
     * 描述：字段指令
     */
    createDirective('field', function (module, dom) {
        dom.assets || (dom.assets = {});
        //修正staticnum
        if (dom.staticNum === 0) {
            dom.staticNum = 1;
        }
        let dataValue = module.get(dom.model, this.value);
        switch (dom.props['type']) {
            case 'radio':
                let value = dom.props['value'];
                dom.props['name'] = this.value;
                if (dataValue == value) {
                    dom.props['checked'] = 'checked';
                    dom.assets['checked'] = true;
                }
                else {
                    delete dom.props['checked'];
                    dom.assets['checked'] = false;
                }
                break;
            case 'checkbox':
                //设置状态和value
                let yv = dom.props['yes-value'];
                //当前值为yes-value
                if (dataValue == yv) {
                    dom.props['value'] = yv;
                    dom.assets['checked'] = true;
                }
                else { //当前值为no-value
                    dom.props['value'] = dom.props['no-value'];
                    dom.assets['checked'] = false;
                }
                break;
            case 'select':
                dom.props['value'] = dataValue;
                dom.assets['value'] = dataValue;
            default:
                let v = (dataValue !== undefined && dataValue !== null) ? dataValue : '';
                dom.props['value'] = v;
                dom.assets['value'] = v;
        }
        let event = GlobalCache.get('$fieldChangeEvent');
        if (!event) {
            event = new NEvent(null, 'change', function (model, dom) {
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
                    }
                    else {
                        v = dom.props['yes-value'];
                    }
                }
                else if (type === 'radio') {
                    if (!el.checked) {
                        v = undefined;
                    }
                }
                //修改字段值,需要处理.运算符
                let arr = field.split('.');
                if (arr.length === 1) {
                    model[field] = v;
                }
                else {
                    let temp = model;
                    field = arr.pop();
                    for (let i = 0; i < arr.length && temp; i++) {
                        temp = temp[arr[i]];
                    }
                    if (temp) {
                        temp[field] = v;
                    }
                }
            });
            //存储字段change事件钩子
            GlobalCache.set('$fieldChangeEvent', event);
        }
        dom.vdom.addEvent(event);
        return true;
    }, 10);
    /**
     * route指令
     */
    createDirective('route', function (module, dom) {
        //a标签需要设置href
        if (dom.tagName.toLowerCase() === 'a') {
            dom.props['href'] = 'javascript:void(0)';
        }
        dom.props['path'] = this.value;
        //有激活属性
        if (dom.props['active']) {
            let acName = dom.props['active'];
            delete dom.props['active'];
            //active 转expression
            Router.addActiveField(module, this.value, dom.model, acName);
            if ((Router.currentPath && this.value.startsWith(Router.currentPath) || !Router.currentPath) && dom.model[acName]) {
                Router.go(this.value);
            }
        }
        //添加click事件,避免重复创建事件对象，创建后缓存
        let event = GlobalCache.get('$routeClickEvent');
        if (!event) {
            event = new NEvent(module, 'click', function (model, dom, evObj, e) {
                let path = dom.props['path'];
                if (Util.isEmpty(path)) {
                    return;
                }
                Router.go(path);
            });
            GlobalCache.set('$routeClickEvent', event);
        }
        //为virtual dom添加事件
        dom.vdom.addEvent(event);
        return true;
    }, 10);
    /**
     * 增加router指令
     */
    createDirective('router', function (module, dom) {
        Router.routerKeyMap.set(module.id, dom.key);
        return true;
    }, 10);
    /**
     * 插头指令
     * 用于模块中，可实现同名替换
     */
    createDirective('slot', function (module, dom) {
        this.value = this.value || 'default';
        let mid = dom.parent.moduleId;
        const src = dom.vdom;
        //父dom有module指令，表示为替代节点，替换子模块中的对应的slot节点；否则为子模块定义slot节点
        if (mid) {
            let m = ModuleFactory.get(mid);
            if (m) {
                //缓存当前替换节点
                m.objectManager.set('$slots.' + this.value, {
                    dom: src,
                    model: dom.model,
                    module: ModuleFactory.get(this.templateModuleId)
                });
            }
        }
        else { //源slot节点
            const cfg = module.objectManager.get('$slots.' + this.value);
            const children = cfg ? cfg.dom.children : src.children;
            if (children && children.length > 0) {
                //渲染时添加s作为后缀，避免与模块内dom key冲突（相同model情况下）
                if (src.hasProp('innerrender')) { //inner render模式
                    for (let d of children) {
                        Renderer.renderDom(module, d, dom.model, dom.parent, dom.model['__key'] + 's');
                    }
                }
                else if (cfg) { // 默认模式
                    //绑定数据
                    cfg.module.modelManager.bindModel(cfg.model, module);
                    for (let d of cfg.dom.children) {
                        Renderer.renderDom(cfg.module, d, cfg.model, dom.parent, cfg.model['__key'] + 's');
                    }
                }
            }
        }
        return false;
    }, 5);
}());
//# sourceMappingURL=directiveinit.js.map