import { Module } from "./module";
import { ModuleFactory } from "./modulefactory";
import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { Expression } from "./expression";
import { CssManager } from "./cssmanager";
import { EventManager } from "./eventmanager";
import { IRenderedDom } from "./types";

/**
 * 渲染器
 */
export class Renderer {
    /**
     * 等待渲染列表（模块名）
     */
    public static waitList: Array < number > = [];

    /**
     * 当前模块根dom
     */
    private static currentModuleRoot:IRenderedDom;
    /**
     * 添加到渲染列表
     * @param module 模块
     */
    public static add(module:Module) {
        //如果已经在列表中，不再添加
        if (!this.waitList.includes(module.id)) {
            //计算优先级
            this.waitList.push(module.id);
        }
    }
    
    /**
     * 从渲染队列移除
     * @param moduleId 
     */
    public static remove(moduleId:number){
        let index;
        if((index = this.waitList.indexOf(moduleId)) !== -1){
            //不能破坏watiList顺序，用null替换
            this.waitList.splice(index,1,null);
        }
    }
    /**
     * 队列渲染
     */
    public static render() {
        for(;this.waitList.length>0;){
            let id = this.waitList[0];
            if(id){ //存在id为null情况，remove方法造成
                ModuleFactory.get(id).render();
            }
            //渲染后移除
            this.waitList.shift();
        }
    }

    /**
     * 渲染dom
     * @param module            模块 
     * @param src               源dom
     * @param model             模型，如果src已经带有model，则此参数无效
     * @param parent            父dom
     * @param key               key 附加key，放在domkey的后面
     * @returns 
     */
    public static renderDom(module:Module,src:VirtualDom,model:Model,parent?:IRenderedDom,key?:string):IRenderedDom{
        let dst:IRenderedDom = {
            key:key?src.key+'_'+key:src.key,
            vdom:src
        }
        
        if(src.tagName){
            dst.tagName = src.tagName;
            dst.props = {};
        }else{
            dst.textContent = src.textContent;
        }
        
        //设置model
        model = src.model || model;
        //设置当前根root
        if(!parent){
            this.currentModuleRoot = dst;
        }else{
            if(!model){
                model = parent.model;
            }
            // 设置父对象
            dst.parent = parent;
        }
        // 默认根model
        if(!model){
            model = module.model;
        }
        
        dst.model = model;
        dst.staticNum = src.staticNum;
        if(src.staticNum>0){
            src.staticNum--;
        }
        
        //先处理model指令
        if(src.directives && src.directives.length>0 && src.directives[0].type.name === 'model'){
            src.directives[0].exec(module,dst);
        }
        if(dst.tagName){
            if(!dst.notChange){
                handleProps();
                //处理style，如果为style，则不处理assets和events
                if(!CssManager.handleStyleDom(module,src,Renderer.currentModuleRoot,src.getProp('scope') === 'this')){
                    //assets
                    if(src.assets && src.assets.size>0){
                        for(let p of src.assets){
                            dst[p[0]] = p[1];
                        }
                    }
                }
                if(!handleDirectives()){
                    return null;
                }
            }
            
            //复制源dom事件到事件工厂
            if(src.events && !module.eventFactory.getEvent(dst.key)){
                for(let evt of src.events){
                    module.eventFactory.addEvent(dst.key,evt);
                }
            }
            // 子节点
            if(src.children && src.children.length>0){
                dst.children = [];
                for(let c of src.children){
                    Renderer.renderDom(module,c,dst.model,dst,key?key:null);
                }
            }
        }else if(!dst.notChange){
            if(src.expressions){ //文本节点
                let value = '';
                src.expressions.forEach((v) => {
                    if (v instanceof Expression) { //处理表达式
                        let v1 = v.val(module,dst.model);
                        value += v1 !== undefined ? v1 : '';
                    } else {
                        value += v;
                    }
                });
                dst.textContent = value;
                dst.staticNum = -1;
            }else{
                dst.textContent = src.textContent;
            }
        }
        //添加到dom tree
        if(parent){
            parent.children.push(dst);
        }
        return dst;

        /**
         * 处理指令
         * @returns     true继续执行，false不执行后续渲染代码
         */
        function handleDirectives():boolean {
            if(!src.directives || src.directives.length===0){
                return true;
            }
            dst.staticNum = -1;
            for(let d of src.directives){
                //model指令不执行
                if(d.type.name==='model'){
                    continue;
                }
                if(!d.exec(module,dst)){
                    return false;
                }
            }
            return true;
        }
        
        /**
         * 处理属性（带表达式）
         */
        function handleProps() {
            if(!src.props || src.props.size === 0){
                return;
            }
            //因为存在大小写，所以用正则式进行匹配
            const styleReg = /^style$/i;
            const classReg = /^class$/i;
            let value;
            for(let k of src.props){
                if(Array.isArray(k[1])){  //数组，需要合并
                    value = [];
                    for(let i=0;i<k[1].length;i++){
                        let a = k[1][i];
                        if(a instanceof Expression){
                            value.push(a.val(module,dst.model));
                            dst.staticNum = -1;
                        }else{
                            value.push(a);
                        }
                    }
                    if(styleReg.test(k[0])){
                        value = src.getStyleString(value);
                    }else if(classReg.test(k[0])){
                        value = src.getClassString(value);
                    }
                }else if(k[1] instanceof Expression){
                    value = k[1].val(module,dst.model);
                    dst.staticNum = -1;
                }else{
                    value = k[1];
                }
                dst.props[k[0]] = value;
            }
        }
    }

    /**
     * 更新到html树
     * @param module    模块
     * @param src       渲染节点
     * @returns         渲染后的节点    
     */
    public static updateToHtml(module: Module,src:IRenderedDom):Node {
        let el = module.getElement(src.key);
        if(!el){
            return this.renderToHtml(module,src,null);
        }else if(src.tagName){   //html dom节点已存在
            //修改$vdom
            el['$vdom'] = src;
            module.saveElement(src.key,el);
            let attrs = (<HTMLElement>el).attributes;
            let arr = [];
            for(let i=0;i<attrs.length;i++){
                arr.push(attrs[i].name);
            }
            //设置属性
            for(let p of Object.keys(src.props)){
                (<HTMLElement>el).setAttribute(p,src.props[p]===undefined?'':src.props[p]);
                let ind;
                if((ind=arr.indexOf(p)) !== -1){
                    arr.splice(ind,1);
                }
            }
            //清理多余attribute
            if(arr.length>0){
                for(let a of arr){
                    (<HTMLElement>el).removeAttribute(a);
                }
            }
            //处理asset
            if (src.assets) {
                for (let k of Object.keys(src.assets)) {
                    el[k] = src.assets[k];
                }    
            }
        }else{  //文本节点
            (<any>el).textContent = src.textContent;
        }
        return el;
    }

    /**
     * 渲染到html树
     * @param module 	        模块
     * @param src               渲染节点
     * @param parentEl 	        父html
     * @param isRenderChild     是否渲染子节点
     */
    public static renderToHtml(module: Module,src:IRenderedDom, parentEl:HTMLElement,isRenderChild?:boolean):Node {
        let el;
        if(src.tagName){
            el = newEl(src);
        }else{
            el = newText(src);
        }
        //先创建子节点，再添加到html dom树，避免频繁添加
        if(el && src.tagName  && isRenderChild){
            genSub(el, src);
        }
        if(el && parentEl){
            parentEl.appendChild(el);
        }
        return el;
        
        /**
         * 新建element节点
         * @param dom 		虚拟dom
         * @returns 		新的html element
         */
        function newEl(dom:IRenderedDom): HTMLElement {
            //style不处理
            if(dom.tagName.toLowerCase() === 'style'){
                return;
            }
            //创建element
            let el= document.createElement(dom.tagName);
            //保存虚拟dom
            el['$vdom'] = dom;
            //把el引用与key关系存放到cache中
            module.saveElement(dom.key,el);
            //保存自定义key对应element
            if(dom.props['key']){
                module.saveElement(dom.props['key'],el);
            }
            //子模块容器的处理由子模块处理
            if(!dom.subModuleId){
                //设置属性
                for(let p of Object.keys(dom.props)){
                    el.setAttribute(p,dom.props[p]===undefined?'':dom.props[p]);
                }
                //asset
                if(dom.assets){
                    for (let p of Object.keys(dom.assets)) {
                        el[p] = dom.assets[p];
                    }
                }
                //处理event
                EventManager.bind(module,dom);
            }
            return el;
        }

        /**
         * 新建文本节点
         */
        function newText(dom:IRenderedDom): Node {
            //样式表处理，如果是样式表文本，则不添加到dom树
            if(CssManager.handleStyleTextDom(module,dom)){
                 return;
            }
            let node = document.createTextNode(<string>dom.textContent || '');
            module.saveElement(dom.key,node);
            return node;
        }

        /**
         * 生成子节点
         * @param pEl 	父节点
         * @param vdom  虚拟dom节点	
         */
        function genSub(pEl: Node, vdom: IRenderedDom) {
            if (vdom.children && vdom.children.length > 0) {
                vdom.children.forEach(item => {
                    let el1;
                    if (item.tagName) {
                        el1 = newEl(item);
                        genSub(el1, item);
                    } else {
                        el1 = newText(item);
                    }
                    if(el1){
                        pEl.appendChild(el1);
                    }
                });
            }
        }
    }

    /**
     * 处理更改的dom节点
     * @param module        待处理模块
     * @param changeDoms    更改的dom参数数组
     */
    public static handleChangedDoms(module:Module,changeDoms:any[]){
        //保留原有html节点
        for(let item of changeDoms){
            let o = {};
            if(item[1]){
                //新节点
                o['new'] = module.getElement(item[1].key);
            }
            if(item[2]){
                o['old'] = module.getElement(item[2].key);
            }
            if(item[3]){
                //旧父节点
                o['p'] = module.getElement(item[3].key);
            }
            item.els = o;
            //从模块移除
            if(item[0] === 3){
                module.freeNode(item[1]);
            }else if(item[0] === 5){
                module.freeNode(item[2]);
            }
        }
        //第二轮待处理数组
        const secondArr = [];
        for(let item of changeDoms){
            //父htmlelement，新html节点，旧html节点
            let pEl,n1,n2;
            switch(item[0]){
                case 1: //添加
                    pEl = item.els.p;
                    n1 = Renderer.renderToHtml(module,item[1],null,true);
                    if(pEl.children && pEl.children.length-1>item[4]){
                        pEl.insertBefore(n1,pEl.children[item[4]]);
                    }else{
                        pEl.appendChild(n1);
                    }
                    break;
                case 2: //修改
                    Renderer.updateToHtml(module,item[1]);
                    break;
                case 3: //删除
                    pEl = item.els.p;
                    n1 = item.els.new;
                    if(pEl && n1 && n1.parentElement === pEl){
                        pEl.removeChild(n1);
                    }
                    break;
                case 4: //移动
                    //移动时可能存在节点尚未添加，对应目标index不可及，需要加入第二轮处理
                    pEl = item.els.p;    
                    n1 = module.getElement(item[1].key);
                    // 插入节点时，可能存在move的位置与现节点相同
                    if(n1 && n1 !== pEl.children[item[4]]){
                        if(pEl.children.length>item[4]){
                            pEl.insertBefore(n1,pEl.children[item[4]]);
                        }else if(pEl.children.length === item[4]){  //刚好放在最后
                            pEl.appendChild(n1);
                        }else{ //index不可及，放入第二轮
                            secondArr.push(item);
                        }
                    }
                    break;
                case 5: //替换
                    pEl = item.els.p;
                    n2 = item.els.old;
                    n1 = Renderer.renderToHtml(module,item[1],null,true);
                    if(pEl && n2){
                        pEl.replaceChild(n1,n2);
                    }
            }
        }

        //处理剩余的move节点
        for(let i=0;i<secondArr.length;i++){
            const item = secondArr[i];
            const pEl = <HTMLElement>module.getElement(item[3].key);    
            const n1 = module.getElement(item[1].key);
            if(n1 && n1 !== pEl.children[item[4]]){
                if(pEl.children.length>item[4]){
                    pEl.insertBefore(n1,pEl.children[item[4]]);
                }else{
                    pEl.appendChild(n1);
                }
            }
        }
    }
}