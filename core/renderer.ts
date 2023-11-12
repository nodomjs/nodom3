import { Module } from "./module";
import { ModuleFactory } from "./modulefactory";
import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { Expression } from "./expression";
import { CssManager } from "./cssmanager";
import { ChangedDom, EModuleState, RenderedDom } from "./types";

/**
 * 渲染器
 * @remarks
 * nodom渲染操作在渲染器中实现
 */
export class Renderer {
    /**
     * 应用根El
     */
    private static rootEl:HTMLElement;

    /**
     * 等待渲染列表
     */
    private static waitList: Array < number > = [];

    /**
     * 当前渲染模块
     * @remarks
     * slot渲染时，如果未使用`innerRender`，则渲染过程中指令、表达式依赖的模块会切换成templateModuleId对应模块，但currentModule不变。
     */
    public static currentModule:Module;

    /**
     * 当前模块根dom
     */
    private static currentRootDom:RenderedDom;

    /**
     * 设置根容器
     * @param rootEl - 根html element
     */
    public static setRootEl(rootEl){
        this.rootEl = rootEl;
    }

    /**
     * 获取根容器
     * @returns 根 html element
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
     * @param module - 模块
     */
    public static add(module:Module) {
        if(!module){
            return;
        }
        //如果已经在列表中，不再添加
        if ((module.state === EModuleState.READY || module.state === EModuleState.MOUNTED) && !this.waitList.includes(module.id)) {
            //计算优先级
            this.waitList.push(module.id);
        }
    }
    
    /**
     * 从渲染队列移除
     * @param moduleId - 模块id
     */
    public static remove(module:Module){
        let index;
        if((index = this.waitList.indexOf(module.id)) !== -1){
            //不能破坏watiList顺序，用null替换
            this.waitList.splice(index,1,null);
        }
    }

    /**
     * 渲染
     * @remarks
     * 如果存在渲染队列，则从队列中取出并依次渲染
     */
    public static render() {
        for(;this.waitList.length>0;){
            const id = this.waitList[0];
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
     * @remarks
     * 此过程将VirtualDom转换为RenderedDom
     * 
     * @param module -      模块 
     * @param src -         源dom
     * @param model -       模型
     * @param parent -      父dom
     * @param key -         key 附加key，放在domkey的后面
     * @returns             渲染后节点
     */
    public static renderDom(module:Module,src:VirtualDom,model:Model,parent?:RenderedDom,key?:number|string):RenderedDom{
        //初始化渲染节点
        const dst:RenderedDom = {
            key:key?src.key+'_'+key:src.key,
            model:model,
            vdom:src,
            staticNum:src.staticNum
        }
        // 从父继承附加key和rmid
        if(parent){
            if(parent.rmid){
                dst.rmid = parent.rmid;
                dst.key += '_' + dst.rmid + 's';
            }
        }

        //静态节点只渲染1次
        if(src.staticNum>0){
            src.staticNum--;
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
                for(const p of src.assets){
                    dst.assets[p[0]] = p[1];
                }
            }
            //处理directive时，导致禁止后续渲染，则不再渲染，如show指令
            if(!this.handleDirectives(module,src,dst)){
                return null;
            }
            //非module dom，添加dst事件到事件工厂
            if(src.events && !src.hasDirective('module')){
                if(!dst.events){
                    dst.events = [];
                }
                // 可能存在事件变化，需要先移除
                // TODO 全部移除性能较低，需优化
                module.eventFactory.removeAllEvents(dst);
                for(const ev of src.events){
                    //当事件串为表达式时，需要处理
                    ev.handleExpr(module,model);
                    //如果不是根节点，设置事件module为渲染module
                    if(src.key !== 1){
                        ev.module = module;
                    }
                    // 保存event以便比较
                    dst.events.push(ev);
                    //添加到当前模块eventfactory
                    this.currentModule.eventFactory.addEvent(dst,ev);
                }
            }
            //子节点渲染
            if(src.children && src.children.length>0){
                dst.children = [];
                for(const c of src.children){
                    this.renderDom(module,c,dst.model,dst,key);
                }
            }
        }else{ //文本节点
            if(src.expressions){ //文本节点
                let value = '';
                for(const expr of src.expressions){
                    if (expr instanceof Expression) { //处理表达式
                        const v1 = expr.val(module,dst.model);
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
            if(!parent.children){
                parent.children = [];
            }
            parent.children.push(dst);
        }
        return dst;
    }

    /**
     * 处理指令
     * @param module -  模块
     * @param src -     编译节点
     * @param dst -     渲染节点
     * @returns         true继续执行，false不执行后续渲染代码，也不加入渲染树
    */
    private static handleDirectives(module,src,dst):boolean {
        if(!src.directives || src.directives.length===0){
            return true;
        }
        for(const d of src.directives){
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
     * @param module -  模块
     * @param src -     编译节点
     * @param dst -     渲染节点
     */
    private static handleProps(module:Module,src:VirtualDom,dst:RenderedDom){
        if(dst === this.currentRootDom){
            module.handleRootProps(src,dst);
            return;
        }
        if(!src.props || src.props.size === 0){
            return;
        }
        for(const k of src.props){
            let v = <unknown>k[1];
            if(v instanceof Expression){
                src.staticNum = -1;
                v = v.val(module,dst.model);
                dst.staticNum = -1;
            }
            dst.props[k[0]] = v;
        }
    }

    /**
     * 更新到html树
     * @param module -  模块
     * @param src -     渲染节点
     * @returns         渲染后的节点    
     */
    public static updateToHtml(module: Module,dom:RenderedDom,pEl?):Node {
        const el = module.getElement(dom.key);
        if(!el){
            return this.renderToHtml(module,dom,pEl,true);
        }else if(dom.tagName){   //html dom节点已存在
            //设置element key属性
            (<object>el)['key'] = dom.key;
            const attrs = (<HTMLElement>el).attributes;
            const arr = [];
            if(attrs){
                for(let i=0;i<attrs.length;i++){
                    arr.push(attrs[i].name);
                }
            }
            //设置属性
            for(const p of Object.keys(dom.props)){
                (<HTMLElement>el).setAttribute(p,dom.props[p]===undefined?'':dom.props[p]);
                let ind;
                if((ind=arr.indexOf(p)) !== -1){
                    arr.splice(ind,1);
                }
            }
            //清理多余attribute
            if(arr.length>0){
                for(const a of arr){
                    (<HTMLElement>el).removeAttribute(a);
                }
            }
            //处理asset
            if (dom.assets) {
                for (const k of Object.keys(dom.assets)) {
                    el[k] = dom.assets[k];
                }    
            }
            //解绑之前绑定事件
            module.eventFactory.unbindAll(dom.key);
            //绑定事件
            module.eventFactory.bind(dom.key);
        }else{  //文本节点
            (<object>el)['textContent'] = dom.textContent;
        }
        return el;
    }

    /**
     * 渲染到html树
     * @param module - 	        模块
     * @param src -             渲染节点
     * @param parentEl - 	    父html
     * @param isRenderChild -   是否渲染子节点
     * @returns                 渲染后的html节点
     */
    public static renderToHtml(module: Module,src:RenderedDom, parentEl:Node,isRenderChild?:boolean):Node {
        let el;
        if(src.tagName){
            el = newEl(src);
        }else{
            el = newText(src);
        }
        // element、渲染子节点且不为子模块，处理子节点
        if(el && src.tagName && isRenderChild && !src.moduleId){
            genSub(el, src);
        }
        if(el && parentEl){
            parentEl.appendChild(el);
        }
        return el;
        
        /**
         * 新建element节点
         * @param dom - 	虚拟dom
         * @returns 		新的html element
         */
        function newEl(dom:RenderedDom): HTMLElement {
            let el; 
            //rmid !== moduleid，则不渲染
            if(dom.rmid && dom.rmid !== module.id){
                return;
            }
            
            // 子模块不渲染
            if(dom.moduleId){
                const m = ModuleFactory.get(dom.moduleId);
                //创建替代节点
                if(m){
                    el = document.createTextNode('');
                    m.srcDom = dom;
                    m.srcElement = el;
                    module.addChild(m);
                    module.saveElement(dom,el);
                    
                    m.active();
                    return el;
                }
                return;
            }
            //style，只处理文本节点
            if(dom.tagName === 'style'){
                genSub(el,dom);
                return;
            }
            
            if(dom.isSvg){   //是svg节点
                el = document.createElementNS("http://www.w3.org/2000/svg",dom.tagName);
                if(dom.tagName === 'svg'){
                    el.setAttribute('xmlns','http://www.w3.org/2000/svg');
                }
            }else{      //普通节点
                el = document.createElement(dom.tagName);
            }
            //把el引用与key关系存放到cache中
            module.saveElement(dom,el);
            //设置element key属性
            (<object>el)['key'] = dom.key;
            // el.setAttribute('key',dom.key)
            
            //设置属性
            for(const p of Object.keys(dom.props)){
                if(dom.props[p] !== undefined && dom.props[p] !== null && dom.props[p] !== ''){
                    el.setAttribute(p,dom.props[p]);
                }
            }
            //asset
            if(dom.assets){
                for (const p of Object.keys(dom.assets)) {
                    el[p] = dom.assets[p];
                }
            }
            //绑定事件
            module.eventFactory.bind(dom.key);
            return el;
        }

        /**
         * 新建文本节点
         */
        function newText(dom:RenderedDom): Node {
            //样式表处理，如果是样式表文本，则不添加到dom树
            if(CssManager.handleStyleTextDom(module,dom)){
                return;
            }
            const node = document.createTextNode(<string>dom.textContent || '');
            module.saveElement(dom,node);
            return node;
        }

        /**
         * 生成子节点
         * @param pEl -     父节点
         * @param dom -     dom节点	
         */
        function genSub(pEl: Node, dom: RenderedDom) {
            if (dom.children && dom.children.length > 0) {
                dom.children.forEach(item => {
                    let el1;
                    if (item.tagName) {
                        el1 = newEl(item);
                        //element节点，产生子节点
                        if(el1 instanceof Element){
                            genSub(el1, item);
                        }
                        
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
     * @param module -        待处理模块
     * @param changeDoms -    修改后的dom节点数组
     */
    public static handleChangedDoms(module:Module,changeDoms:ChangedDom[]){
        let slotDoms = {};
        //替换数组
        const repArr =[];
        //添加数组
        const addArr = [];
        //移动数组
        const moveArr = [];
        //保留原有html节点
        for (const item of changeDoms) {
            //如果为slot节点，则记录，单独处理
            if(item[1].rmid && item[1].rmid !== module.id){
                if(slotDoms[item[1].rmid]){
                    slotDoms[item[1].rmid].push(item);
                }else{
                    slotDoms[item[1].rmid]=[item];
                }
                continue;
            }
            let pEl;
            switch(item[0]){
                case 1:  //添加
                    addArr.push(item);
                    break;
                case 2: //修改
                    //子模块不处理，由setProps处理
                    if(item[1].moduleId){
                        Renderer.add(ModuleFactory.get(item[1].moduleId));
                        continue;
                    }
                    if(item[1].parent){
                         pEl = module.getElement(item[1].parent.key);
                    }
                    Renderer.updateToHtml(module, item[1],pEl);
                    break;
                case 3: //删除
                    module.domManager.freeNode(item[1]);
                    // const n1 = module.getElement(item[1].key);
                    // pEl = module.getElement(item[3].key);
                    // if (pEl && n1 && n1.parentElement === pEl) {
                    //     pEl.removeChild(n1);
                    // }
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
            for(const item of repArr){
                this.replace(module,item[1],item[2]);
            }
        }
        //addArr 按index排序
        if(addArr.length > 1){
            addArr.sort((a,b)=>a[4]>b[4]?1:-1);
        }
        //操作map，用于存放添加或移动过的位置
        const opMap = moveArr.length>0?{}:undefined;
        //处理添加元素
        for(const item of addArr){
            const pEl = <HTMLElement>module.getElement(item[3].key);
            if(!pEl){
                continue;
            }
            const n1 = Renderer.renderToHtml(module, item[1], null, true);
            if(n1){
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
        }
        //处理move元素
        for(const item of moveArr){
            const pEl = <HTMLElement>module.getElement(item[3].key);
            if(!pEl){
                continue;
            }
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

        //处理改变的子模块
        const keys = Object.keys(slotDoms);
        if(keys && keys.length > 0){
            for(let k of keys){
                const m = ModuleFactory.get(parseInt(k));
                if(m){
                    Renderer.add(m);
                }
            }
        }
    }

    /**
     * 替换解ID那
     * @param module -  模块
     * @param src -     待替换节点
     * @param dst -     被替换节点    
     */
    private static replace(module,src,dst){
        if(!dst.parent){
            return;
        }
        const pEl = <HTMLElement>module.getElement(dst.parent.key);
        if(!pEl){
            return;
        }
        const el = Renderer.renderToHtml(module,src,null);
        let oldEl;
        if(dst.moduleId){
            const m1 = ModuleFactory.get(dst.moduleId);
            oldEl = m1.getElement(1);
        }else{
            oldEl = module.getElement(dst.key);
        }
        
        if(pEl && oldEl && oldEl.parentElement === pEl){
            pEl.replaceChild(el,oldEl);
        }
        module.domManager.freeNode(dst);
    }
}