import { Module } from "./module";
import { ModuleFactory } from "./modulefactory";
import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { Expression } from "./expression";
import { CssManager } from "./cssmanager";
import { IRenderedDom } from "./types";

/**
 * 渲染器
 */
export class Renderer {
    /**
     * 根rootEl
     */
    private static rootEl:HTMLElement;

    /**
     * 等待渲染列表（模块名）
     */
    private static waitList: Array < number > = [];

    /**
     * 当前module
     */
    private static currentModule:Module;

    /**
     * 当前模块根dom
     */
    private static currentRootDom:IRenderedDom;

    /**
     * 设置根
     * @param rootEl 
     */
    public static setRootEl(rootEl){
        this.rootEl = rootEl;
    }

    /**
     * 获取根element
     * @returns 根element
     */
    public static getRootEl():HTMLElement{
        return this.rootEl;
    }

    /**
     * 获取当前渲染模块
     * @returns     当前渲染模块
     */
    public static getCurrentModule():Module{
        return this.currentModule;
    }

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
                const m = ModuleFactory.get(id);
                this.currentModule = m;
                m.render();
                this.currentModule = null;
            }
            //渲染后移除
            this.waitList.shift();
        }
    }

    /**
     * 渲染dom
     * @param module            模块 
     * @param src               源dom
     * @param model             模型，如果src已经带有model，则此参数无效，一般为指令产生的model（如slot）
     * @param parent            父dom
     * @param key               key 附加key，放在domkey的后面
     * @returns 
     */
    public static renderDom(module:Module,src:VirtualDom,model:Model,parent?:IRenderedDom,key?:any):IRenderedDom{
        //构建key，如果带key，则需要重新构建唯一key
        const key1 = key?src.key + '_' + key:src.key;
        
        //静态节点只渲染1次
        if(src.staticNum>0){
            src.staticNum--;
        }

        //初始化渲染节点
        let dst:IRenderedDom = {
            key:key1,
            model:model,
            vdom:src,
            staticNum:src.staticNum
        }

        if(src.tagName){ //标签
            dst.tagName = src.tagName;
            //添加key属性
            dst.props = {};
            //设置svg标志
            if(src.isSvg){
                dst.isSvg = src.isSvg
            }
        }
        //设置当前根root
        if(!parent){
            this.currentRootDom = dst;
        }else{
            // 设置父对象
            dst.parent = parent;
        }
        
        //处理model指令
        const mdlDir = src.getDirective('model');
        if(mdlDir){
            mdlDir.exec(module,dst);
        }
        
        if(dst.tagName){  //标签节点
            this.handleProps(module,src,dst);
            //处理style标签，如果为style，则不处理assets
            if(src.tagName === 'style'){
                CssManager.handleStyleDom(module,dst,Renderer.currentRootDom);
            }else if(src.assets && src.assets.size>0){
                dst.assets ||= {};
                for(let p of src.assets){
                    dst.assets[p[0]] = p[1];
                }
            }
            //处理directive时，导致禁止后续渲染，则不再渲染，如show指令
            if(!this.handleDirectives(module,src,dst)){
                return null;
            }
            //非module dom，添加dst事件到事件工厂
            if(src.events && !src.hasDirective('module')){
                module.eventFactory.removeAllEvents(dst);
                for(let evt of src.events){
                    //当事件串为表达式时，需要处理
                    this.currentModule.eventFactory.addEvent(dst,evt.handleExpr(module,model));
                }
            }
            //子节点渲染
            if(src.children && src.children.length>0){
                dst.children = [];
                for(let c of src.children){
                    this.renderDom(module,c,dst.model,dst,key?key:null);
                }
            }
        }else{ //文本节点
            if(src.expressions){ //文本节点
                let value = '';
                for(let expr of src.expressions){
                    if (expr instanceof Expression) { //处理表达式
                        let v1 = expr.val(module,dst.model);
                        value += v1 !== undefined ? v1 : '';
                    } else {
                        value += expr;
                    }
                }
                dst.textContent = value;
            }else{
                dst.textContent = src.textContent;
            }
        }
        //添加到dom tree，必须放在handleDirectives后，因为有可能directive执行后返回false
        if(parent){
            parent.children.push(dst);
        }
        return dst;
    }

    /**
     * 处理指令
     * @param module    模块
     * @param src       编译节点
     * @param dst       渲染节点
     * @returns         true继续执行，false不执行后续渲染代码，也不加入渲染树
    */
    private static handleDirectives(module,src,dst):boolean {
        if(!src.directives || src.directives.length===0){
            return true;
        }
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
     * 处理属性
     * @param module    模块
     * @param src       编译节点
     * @param dst       渲染节点
     */
    private static handleProps(module:Module,src:VirtualDom,dst:IRenderedDom):void{
        if(dst === this.currentRootDom){
            module.handleRootProps(src,dst);
            return;
        }
        if(!src.props || src.props.size === 0){
            return;
        }
        for(let k of src.props){
            dst.props[k[0]] = k[1] instanceof Expression?k[1].val(module,dst.model):k[1];
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
            //设置element key属性
            (<any>el).key = src.key;
            let attrs = (<HTMLElement>el).attributes;
            let arr = [];
            if(attrs){
                for(let i=0;i<attrs.length;i++){
                    arr.push(attrs[i].name);
                }
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
    public static renderToHtml(module: Module,src:IRenderedDom, parentEl:Node,isRenderChild?:boolean):Node {
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
            if(dom.tagName === 'style'){
                return;
            }
            let el; 
            if(dom.isSvg){   //是svg节点
                el = document.createElementNS("http://www.w3.org/2000/svg",dom.tagName);
                if(dom.tagName === 'svg'){
                    el.setAttribute('xmlns','http://www.w3.org/2000/svg');
                }
            }else{      //普通节点
                el = document.createElement(dom.tagName);
            }
            //把el引用与key关系存放到cache中
            module.saveElement(dom.key,el);
            //设置element key属性
            (<any>el).key = dom.key;
            //设置属性
            for(let p of Object.keys(dom.props)){
                if(dom.props[p] !== undefined && dom.props[p] !== null && dom.props[p] !== ''){
                    el.setAttribute(p,dom.props[p]);
                }
            }
            //asset
            if(dom.assets){
                for (let p of Object.keys(dom.assets)) {
                    el[p] = dom.assets[p];
                }
            }
            //解绑之前绑定事件
            module.eventFactory.unbindAll(dom.key);
            //绑定事件
            module.eventFactory.bind(dom.key);
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
     * @param changeDoms    更改的dom参数数组，数组元素说明如下：
     *                      0:type(操作类型) add 1, upd 2,del 3,move 4 ,rep 5
     *                      1:dom           待处理节点
     *                      2:dom1          被替换或修改节点，rep时有效    
     *                      3:parent        父节点
     *                      4:loc           位置,add和move时有效
     */
    public static handleChangedDoms(module:Module,changeDoms:any[]){
        //替换数组
        const repArr =[];
        //添加数组
        const addArr = [];
        //移动数组
        const moveArr = [];
        //保留原有html节点
        for (let item of changeDoms) {
            switch(item[0]){
                case 1:  //添加
                    addArr.push(item);
                    break;
                case 2: //修改
                    Renderer.updateToHtml(module, item[1]);
                    break;
                case 3: //删除
                    const pEl = module.getElement(item[3].key);
                    const n1 = module.getElement(item[1].key);
                    if (pEl && n1 && n1.parentElement === pEl) {
                        pEl.removeChild(n1);
                    }
                    module.domManager.freeNode(item[1]);
                    break;
                case 4: //移动
                    moveArr.push(item);
                    break;
                default: //替换
                    repArr.push(item);
            }
        }
        //替换
        if(repArr.length>0){
            for(let item of repArr){
                const pEl = module.getElement(item[3].key);
                let n2;
                if(item[2].moduleId){ //子模块先free再获取，先还原为空文本，再实现新的子模块mount
                    module.domManager.freeNode(item[2]);
                    n2 = module.getElement(item[2].key);
                }else{  //先获取，再free，避免getElement为null
                    n2 = module.getElement(item[2].key);
                    module.domManager.freeNode(item[2]);
                }
                //替换n2在element map中的值
                const n1 = Renderer.renderToHtml(module, item[1], null, true);
                if (pEl && n2) {
                    pEl.replaceChild(n1, n2);
                }
            }
        }
        //addArr 按index排序
        if(addArr.length > 1){
            addArr.sort((a,b)=>a[4]>b[4]?1:-1);
        }
        //操作map，用于存放添加或移动过的位置
        const opMap = moveArr.length>0?{}:undefined;
        //处理添加元素
        for(let item of addArr){
            const pEl = <HTMLElement>module.getElement(item[3].key);
            const n1 = Renderer.renderToHtml(module, item[1], null, true);
            if (pEl.childNodes && pEl.childNodes.length > item[4]) {
                pEl.insertBefore(n1, pEl.childNodes[item[4]]);
            }
            else {
                pEl.appendChild(n1);
            }
            //记录操作位置
            if(opMap){
                opMap[item[3].key + '_' + item[4]] = true;
            }
        }
        //处理move元素
        for(let item of moveArr){
            const pEl = <HTMLElement>module.getElement(item[3].key);
            const n1 = module.getElement(item[1].key);
            if(!n1 || n1 === pEl.childNodes[item[4]]){
                continue;
            }
            //判断是否需要用空节点填充移走后的位置
            if(!opMap[item[3].key + '_' + item[5]]){
                const emptyDom = document.createTextNode('');
                //新放到指定位置
                if (pEl.childNodes.length > item[5]) {
                    pEl.insertBefore(emptyDom, pEl.childNodes[item[5]]);
                }else { //最后一个与当前节点不相同，则放在最后
                    pEl.appendChild(emptyDom);
                }
            }
            //替换到指定位置
            pEl.replaceChild(n1,pEl.childNodes[item[4]]);
            //记录操作的位置
            opMap[item[3].key + '_' + item[4]] = true;
        }
    }
}