import { Compiler } from "./compiler";
import { CssManager } from "./cssmanager";
import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { ModuleFactory } from "./modulefactory";
import { ObjectManager } from "./objectmanager";
import { Renderer } from "./renderer";
import { Util } from "./util";
import { DiffTool } from "./difftool";
import { ModelManager } from "./modelmanager";
import { EModuleState, IRenderedDom } from "./types";
import { EventFactory } from "./eventfactory";

/**
 * 模块类
 * 模块方法说明：模板内使用的方法，包括事件，都直接在模块内定义
 *      方法this：指向module实例
 *      事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *      表达式方法：参数按照表达式方式给定即可
 * 模块事件
 *      onBeforeFirstRender 首次渲染前
 *      onFirstRender       首次渲染后
 *      onBeforeRender      每次渲染前
 *      onRender            每次渲染后
 *      onCompile           编译后
 *      onMount             挂载到html dom树后(onRender后执行)
 *      onUnmount           从html dom树解挂后
 */
export class Module {
    /**
     * 模块id(全局唯一)
     */
    public id: number;

    /**
     * 模型，代理过的data
     */
    public model:Model;

    /**
     * 子模块类集合，模板中引用的模块类需要声明
     * 如果类已经通过registModule注册过，这里不再需要定义，只需import即可
     */
    public modules: any;

    /**
     * 父模块通过dom节点传递的属性
     */
    public props:any;

    /**
     * 编译后的根结点props
     */
    private originProps:Map<string,any> = new Map<string,any>();

    /**
     * 更改后的props
     */
     private changedProps:any;

    /**
     * 不渲染的属性（这些属性用于生产模板，不作为属性渲染到模块根节点）
     */
    private excludedProps:string[];

    /**
     * 编译后的dom树
     */
    public originTree:VirtualDom;

    /**
     * 渲染树
     */
    public renderTree: IRenderedDom;

    /**
     * 父模块 id
     */
    public parentId: number;

    /**
     * 子模块id数组
     */
    public children: Array<number> = [];

    /**
     * 模块状态
     */
    public state: EModuleState;

    /**
     * 放置模块的容器
     */
    private container: HTMLElement;

    /**
     * 对象管理器，用于管理虚拟dom节点、指令、表达式、事件对象及其运行时参数
     */
    public objectManager:ObjectManager;

    /**
     * 事件工厂
     */
    public eventFactory:EventFactory;

    /**
     *  key:html node映射
     */
    private elementMap:Map<string,Node> = new Map();
    /**
     * 来源dom，子模块对应dom
     */
    public srcDom:IRenderedDom;

    /**
     * 生成dom时的keyid，每次编译置0
     */
    private domKeyId:number;

    /**
     * 旧模板串
     */
    private oldTemplate:string;

    /**
     * 编译来源模块id
     */
    public compileMid:number;

    /**
     * 是否已渲染过
     */
    private hasRendered:boolean;

    /**
     * 构造器
     */
    constructor() {
        this.id = Util.genId();
        this.objectManager = new ObjectManager(this);
        this.eventFactory = new EventFactory(this);
        //加入模块工厂
        ModuleFactory.add(this);
    }

    /**
     * 初始化
     */
    public init() {
        //初始化model
        this.model = new Model(this.data()||{} , this);
        //注册子模块
        if(this.modules && Array.isArray(this.modules)){
            for (let cls of this.modules) {
                ModuleFactory.addClass(cls);
            }
            delete this.modules;
        }
        // 设置状态为准备好
        this.state = EModuleState.READY;
        
    }

    /**
     * 模板串方法，使用时重载
     * @param props     props对象，在模板容器dom中进行配置，从父模块传入
     * @returns         模板串
     */
    public template(props?:any):string{
        return null;
    }

    /**
     * 数据方法，使用时重载
     * @returns      model数据
     */
    public data():any{
        return {};
    }
    
    /**
     * 模型渲染
     */
    public render(): boolean {
        if(this.state === EModuleState.UNMOUNTED){
            return;
        }
        //检测模板并编译
        let templateStr = this.template(this.props);
        
        if(templateStr !== this.oldTemplate){
            this.oldTemplate = templateStr;
            this.compile();
        }
        
        //不存在originTree，不渲染
        if(!this.originTree){
            return;
        }

        //渲染前事件返回true，则不进行渲染
        if(this.doModuleEvent('onBeforeRender')){
            return;
        }
        if (!this.hasRendered) {    //首次渲染
            this.doModuleEvent('onBeforeFirstRender');
        }
        const oldTree = this.renderTree;
        this.renderTree = Renderer.renderDom(this,this.originTree,this.model);
        if(!this.renderTree){
            this.unmount();
            this.hasRendered = true;
            return;
        }
        if(!this.hasRendered) {    //首次渲染
            this.doModuleEvent('onFirstRender');
            this.hasRendered = true;
        }
        //执行渲染后事件
        this.doModuleEvent('onRender');
        //挂载处理
        if(this.state === EModuleState.MOUNTED){ //已经挂载
            if(oldTree && this.model){
                // 比较节点
                let changeDoms = DiffTool.compare(this.renderTree,oldTree);
                //执行更改
                if(changeDoms.length>0){
                    Renderer.handleChangedDoms(this,changeDoms);
                }
            }
        }else { //未挂载
            this.mount();
        }
    }

    /**
     * 添加子模块
     * @param module    模块id或模块
     */
    public addChild(module: number|Module) {
        let mid;
        if(typeof module === 'number'){
            mid = module;
            module = ModuleFactory.get(mid);
        }else{
            mid = module.id;
        }
        if (!this.children.includes(mid)) {
            this.children.push(mid);
            module.parentId = this.id;
            //首次添加，激活
            module.active();
        }
    }

    /**
     * 移除子模块
     * @param module    子模块
     */
    public removeChild(module: Module) {
        let ind=this.children.indexOf(module.id);
        if (ind !== -1) {
            module.unmount();
            this.children.splice(ind,1);
        }
    }

    /**
     * 激活模块(准备渲染)
     * @param type  0 手动， 1父节点setProps激活，默认0
     */
    public active() {
        //如果为unmounted，则设置渲染为准备好状态
        if(this.state === EModuleState.UNMOUNTED){
            this.state = EModuleState.READY;
        }
        Renderer.add(this);
    }

    /**
     * 挂载到html dom
     */
     private mount(){
        //渲染到html dom
        const el = Renderer.renderToHtml(this,this.renderTree,null,true);
        if(this.container){ //自带容器（主模块或路由模块）
            this.container.appendChild(el);
        }else if(this.srcDom){
            const pm = this.getParent();
            if(!pm){
                return;
            }
            //替换占位符
            const srcElement = pm.getElement(this.srcDom.key);
            if(srcElement){
                srcElement.parentElement.replaceChild(el,srcElement);
            }
            pm.saveElement(this.srcDom.key,el);
        }
        this.state = EModuleState.MOUNTED;
        //执行挂载事件
        this.doModuleEvent('onMount');
    }

    /**
     * 解挂，从htmldom 移除
     */
    public unmount(){
        // 主模块或状态为unmounted的模块不用处理
        if (this.state === EModuleState.UNMOUNTED || ModuleFactory.getMain() === this) {
            return;
        }
        //从render列表移除
        Renderer.remove(this.id);
        //清空event factory
        this.eventFactory = new EventFactory(this);
        //删除渲染树
        delete this.renderTree;
        
        //module根与源el切换
        const el = this.getElement('1');
        if (el) {
            if (this.container) { //带容器(路由方法加载)
                this.container.removeChild(el);
            } else if (this.srcDom) {
                const pm = this.getParent();
                if (!pm) {
                    return;
                }
                //设置模块占位符
                const srcElement = document.createTextNode("");
                if (el.parentElement) {
                    el.parentElement.replaceChild(srcElement, el);
                }
                pm.saveElement(this.srcDom.key, srcElement);
            }    
        }
        //清理dom map
        this.clearElementMap();
        
        //设置状态
        this.state = EModuleState.UNMOUNTED;
        //子模块递归卸载
        if (this.children) {
            for (let id of this.children) {
                let m = ModuleFactory.get(id);
                if (m) {
                    m.unmount();
                }
            }
        }
    }
    
    /**
     * 清除html element map 节点
     * @param key   dom key，如果为空，则清空map
     */
    private clearElementMap(key?:string){
        if(key){
            this.elementMap.delete(key);
        }else{
            this.elementMap.clear();
        }
    }
    /**
     * 获取父模块
     * @returns     父模块   
     */
    public getParent(): Module {
        if (this.parentId) {
            return ModuleFactory.get(this.parentId);
        }
    }

    /**
     * 执行模块事件
     * @param eventName 	事件名
     * @returns             执行结果，各事件返回值如下：
     *                          onBeforeRender：如果为true，表示不进行渲染
     */
    private doModuleEvent(eventName: string):boolean{
        let foo = this[eventName];
        if(foo && typeof foo==='function'){
            return foo.apply(this,[this.model]);
        }
    }

    /**
     * 获取模块方法
     * @param name  方法名
     * @returns     方法
     */
    public getMethod(name: string): Function {
        return this[name];
    }

    /**
     * 设置渲染容器
     * @param el        容器
     */
    public setContainer(el:HTMLElement){
        this.container = el;
    }

    /**
     * 调用方法
     * @param methodName    方法名
     */
    public invokeMethod(methodName: string,arg1?:any,arg2?:any,arg3?:any,arg4?:any,arg5?:any,arg6?:any,arg7?:any,arg8?:any) {
        let m:Module = this;
        let foo = m[methodName];
        if(!foo && this.compileMid){
            m = ModuleFactory.get(this.compileMid);
            if(m){
                foo = m[methodName];
            }
        }
        
        if (foo && typeof foo === 'function') {
            let args = [];
            for(let i=1;i<arguments.length;i++){
                args.push(arguments[i]);
            }
            return foo.apply(m, args);
        }
    }

    /**
     * 设置props
     * @param props     属性值
     * @param dom       子模块对应节点
     */
    public setProps(props:any,dom:IRenderedDom){
        let dataObj = props.$data;
        this.changedProps = {};
        delete props.$data;
        //props数据复制到模块model
        if(dataObj){
            for(let d of Object.keys(dataObj)){
                let o = dataObj[d];
                //如果为对象，需要绑定到模块
                if(o && typeof o === 'object' && this.model[d] !== o){
                    o = new Model(o,this);
                }
                this.model[d] = o;
            }
        }

        //保留src dom
        this.srcDom = dom;

        //如果不存在旧的props，则change为true，否则初始化为false
        let change:boolean = false;
        
        if(!this.props){
            this.changedProps = props;
            change = true;
        }else{
            for(let k of Object.keys(props)){
                // object 默认改变
                if(props[k] !== this.props[k]){
                    change = true;
                    //保留更改的属性
                    this.changedProps[k] = props[k];
                }
            }
        }

        //合并根dom属性
        if(change){
            this.mergeProps(this.changedProps);
        }
        
        //props发生改变或unmounted，激活模块
        if(change || this.state === EModuleState.UNMOUNTED){
            this.active();
        }

        //保存props
        this.props = props;
    }

    /**
     * 编译
     */
    public compile(){
        this.domKeyId = 0;
        //清空孩子节点
        this.children = [];
        //清理css url
        CssManager.clearModuleRules(this);
        //清理dom参数
        this.objectManager.clearAllDomParams();

        if(!this.oldTemplate){
            return;
        }
        this.originTree = new Compiler(this).compile(this.oldTemplate);
        
        //保存originProps(由编译后的节点属性确认)
        if(this.originTree.props){
            for(let p of this.originTree.props){
                this.originProps.set(p[0],p[1]);
            }
        }
        
        this.mergeProps(this.props);
        
        //源事件传递到子模块根dom
        let parentModule = this.getParent();
        if(parentModule){
            const eobj = parentModule.eventFactory.getEvent(this.srcDom.key);
            if(eobj){
                for(let evt of eobj){
                    if(evt[1].own){  //子模块不支持代理事件
                        for(let ev of evt[1].own){
                            this.originTree.addEvent(ev);
                        }
                    }
                }
            }
        }
        //增加编译后事件
        this.doModuleEvent('onCompile');
    }

    /**
     * 设置不渲染到根dom的属性集合
     * @param props     待移除的属性名属组
     */
    public setExcludeProps(props:string[]){
        this.excludedProps = props;
    }
    /**
    * 合并根节点属性
    * @param dom       dom节点 
    * @param props     属性集合
    * @returns         是否改变
    */
    private mergeProps(props){
        if(!props || !this.originTree){
            return;
        }
        this.originTree.staticNum = 1;    
        //设置根属性
        for(let k of Object.keys(props)){
            //排除的props不添加到属性
            if(!this.excludedProps || !this.excludedProps.includes(k)){
                //如果dom自己有k属性，则处理为数组
                if(this.originProps.has(k)){ 
                    this.originTree.setProp(k,[props[k],this.originProps.get(k)]);
                }else{  //dom自己无此属性
                    this.originTree.setProp(k,props[k]);
                }
            }
        }
    }

    

    /**
     * 获取html node
     * @param key   dom key 
     * @returns     html node
     */
    public getElement(key:string):Node{
        return this.elementMap.get(key);
    }

    /**
     * save html node
     * @param key   dom key
     * @param node  html node
     */
    public saveElement(key:string,node:Node){
        this.elementMap.set(key,node);
    }

    /**
     * 释放node
     * 包括从dom树解挂，释放对应结点资源
     * @param dom       虚拟dom
     */
    public freeNode(dom:IRenderedDom){
        if(dom.subModuleId){  //子模块
            let m = ModuleFactory.get(dom.subModuleId);
            if(m){
                m.unmount();
            }
        }else{      //普通节点
            //从map移除
            this.clearElementMap(dom.key);
            //解绑所有事件
            this.eventFactory.unbindAll(dom.key);
            //子节点递归操作
            if(dom.children){
                for(let d of dom.children){
                    this.freeNode(d);
                }
            }
        }
    }

    /**
     * 从origin tree 获取虚拟dom节点
     * @param key   dom key
     */
    public getOriginDom(key:string):VirtualDom{
        if(!this.originTree){
            return null;
        }
        return find(this.originTree);
        function find(dom:VirtualDom){
            if(dom.key === key){
                return dom;
            }
            if(dom.children){
                for(let d of dom.children){
                    let d1 = find(d);
                    if(d1){
                        return d1;
                    }
                }
            }
        }
    }

    /**
     * 从渲染树中获取key对应的渲染节点
     * @param key   dom key
     */
     public getRenderedDom(key:string):IRenderedDom{
        if(!this.renderTree){
            return;
        }
        const d = find(this.renderTree,key);
        return d;
        /**
         * 递归查找
         * @param dom   渲染dom  
         * @param key   待查找key
         * @returns     key对应renderdom 或 undefined
         */
        function find(dom:IRenderedDom,key:string):IRenderedDom{
            if(dom.key === key){
                return dom;
            }
            if(dom.children){
                for(let d of dom.children){
                    let d1 = find(d,key);
                    if(d1){
                        return d1;
                    }
                }
            }
        }
    }

    /**
     * 获取模块类名对应的第一个子模块(如果设置deep，则深度优先)
     * @param className     子模块类名
     * @param deep          是否深度获取
     * @param attrs         属性集合
     */
    public getModule(className:string,deep?:boolean,attrs?:any):Module{
        if(!this.children){
            return;
        }
        for(let id of this.children){
            let m:Module = ModuleFactory.get(id);
            if(m && m.constructor){
                if(m.constructor.name === className){
                    if(attrs){  //属性集合不为空
                        //全匹配标识
                        let matched:boolean = true;
                        for(let k of Object.keys(attrs)){
                            if(!m.props || m.props[k] !== attrs[k]){
                                matched = false;
                                break;
                            }
                        }
                        if(matched){
                            return m;
                        }
                    }else{
                        return m;
                    }
                }
                if(deep){
                    let r = m.getModule(className,true,attrs);
                    if(r){
                        return r;
                    }
                }
            }
        }
    }

    /**
     * 获取模块类名对应的所有子模块
     * @param className     子模块类名
     * @param deep          深度查询
     */
     public getModules(className:string,deep?:boolean):Module[]{
        if(!this.children){
            return;
        }
        let arr = [];
        find(this);
        return arr;

        /**
         * 查询
         * @param module 
         */
        function find(module:Module){
            if(!module.children){
                return;
            }
            for(let id of module.children){
                let m:Module = ModuleFactory.get(id);
                if(m && m.constructor){
                    if(m.constructor.name === className){
                        arr.push(m);
                    }
                    if(deep){
                        find(m);
                    }
                }
            }   
        }
    }

    /**
     * 获取dom key id
     * @returns     key id
     */
    public getDomKeyId():number{
        return ++this.domKeyId;
    }
}