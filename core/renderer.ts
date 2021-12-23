import { Module } from "./module";
import { ModuleFactory } from "./modulefactory";
import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { Expression } from "./expression";
import { CssManager } from "./cssmanager";
import { EventManager } from "./eventmanager";
import { IRenderedDom } from "./types";
import { domainToASCII } from "url";

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
    private static currentModuleRoot:VirtualDom;
    /**
     * 添加到渲染列表
     * @param module 模块
     */
    public static add(module:Module) {
        //如果已经在列表中，不再添加
        if (!module.dontAddToRender && !this.waitList.includes(module.id)) {
            //计算优先级
            this.waitList.push(module.id);
        }
    }
    
    /**
     * 队列渲染
     */
    public static render() {
        for(;this.waitList.length>0;){
            ModuleFactory.get(this.waitList.shift()).render();
        }
    }

    /**
     * 渲染dom
     * @param module            模块 
     * @param src               源dom
     * @param model             模型，如果src已经带有model，则此参数无效
     * @param parent            父dom
     * @param key               key
     * @returns 
     */
    public static renderDom(module:Module,src:VirtualDom,model:Model,parent?:IRenderedDom,key?:string):IRenderedDom{
        let dst:IRenderedDom = {
            key:key?src.key+'_'+key:src.key,
            vdom:src
        }
        module.saveVirtualDom(dst);
        
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
            this.currentModuleRoot = src;
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
        if(src.staticNum>0){
            src.staticNum--;
        }
        
        //先处理model指令
        if(src.directives && src.directives.length>0 && src.directives[0].type.name === 'model'){
            src.directives[0].exec(module,dst,src);
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
                    return dst;
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
        if(parent && !dst.dontAddToTree){
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
                if(!d.exec(module,dst,src)){
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
            for(let k of src.props){
                if(k[1] instanceof Expression){
                    dst.props[k[0]] = k[1].val(module,dst.model);
                    dst.staticNum = -1;
                }else{
                    dst.props[k[0]] = k[1];
                }
            }
        }
    }


    /**
     * 渲染为html element
     * @param module 	        模块
     * @param src               渲染节点
     * @param parentEl 	        父html
     * @param isRenderChild     是否渲染子节点
     */
    public static renderToHtml(module: Module,src:IRenderedDom, parentEl:HTMLElement,isRenderChild?:boolean):Node {
        let el = module.getNode(src.key);
        if(el){   //html dom节点已存在
            if(src.tagName){
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
                handleAssets(src,<HTMLElement>el);
            }else{  //文本节点
                (<any>el).textContent = src.textContent;
            }
        }else{
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
            el['vdom'] = dom.key;
            
            //把el引用与key关系存放到cache中
            module.saveNode(dom.key,el);
            //保存自定义key对应element
            if(dom.props['key']){
                module.saveElement(dom['key'],el);
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
            module.saveNode(dom.key,node);
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

        /**
         * 处理assets
         */
        function handleAssets(dom:IRenderedDom,el:HTMLElement){
            //处理asset
            if (dom.assets) {
                for (let k of Object.keys(dom.assets)) {
                    el[k] = dom.assets[k];
                }    
            }
        }
    }

    /**
     * 处理更改的dom节点
     * @param module        待处理模块
     * @param changeDoms    更改的dom参数数组
     */
    public static handleChangedDoms(module:Module,changeDoms:any[]){
        for(let item of changeDoms){
            let[n1,n2,pEl] = [
                item[1]?module.getNode(item[1].key):null,
                item[2]&&typeof item[2]==='object'?module.getNode(item[2].key):null,
                item[3]?module.getNode(item[3].key):null
            ];
            switch(item[0]){
                case 1: //添加
                    //把新dom缓存添加到旧dom缓存
                    Renderer.renderToHtml(module,item[1],<HTMLElement>pEl,true);
                    n1 = module.getNode(item[1].key);
                    if(!n2){ //不存在添加节点或为索引号
                        if(typeof item[2] === 'number' && pEl.childNodes.length-1>item[2]){
                            pEl.insertBefore(n1,pEl.childNodes[item[2]]);
                        }else{
                            pEl.appendChild(n1);
                        }
                    }else{
                        pEl.insertBefore(n1,n2);
                    }
                    break;
                case 2: //修改
                    Renderer.renderToHtml(module,item[1],null,false);
                    break;
                case 3: //删除
                    //从html dom树移除
                    if(pEl && n1){
                        pEl.removeChild(n1);
                    }
                    //移除
                    module.removeNode(item[1],true);
                    break;
                case 4: //移动
                    if(item[4] ){  //相对节点后
                        if(n2&&n2.nextSibling){
                            pEl.insertBefore(n1,n2.nextSibling);
                        }else{
                            pEl.appendChild(n1);
                        }
                    }else{
                        pEl.insertBefore(n1,n2);
                    }
                    break;
                default: //替换
                    Renderer.renderToHtml(module,item[1],<HTMLElement>pEl,true);
                    n1 = module.getNode(item[1].key);
                    pEl.replaceChild(n1,n2);
            }
        }
    }
}