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
 * 模块方法说明：模版内使用的方法，包括事件，都直接在模块内定义
 *      方法this：指向module实例
 *      事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *      表达式方法：参数按照表达式方式给定即可
 * 模块事件
 *      onBeforeFirstRender 首次渲染前
 *      onFirstRender       首次渲染后
 *      onBeforeRender      每次渲染前
 *      onRender            每次渲染后
 *      onCompile           编译后
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
     * 子模块类集合，模版中引用的模块类需要声明
     * 如果类已经通过registModule注册过，这里不再需要定义，只需import即可
     */
    public modules: any;

    /**
     * 父模块通过dom节点传递的属性
     */
    public props:any;

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
     * 更改model的map，用于记录增量渲染时更改的model
     */
    public changedModelMap:Map<number,boolean>;

    /**
     * 用于保存每个key对应的html node
     */
    private keyNodeMap:Map<string,Node> = new Map();

    /**
     * 用户自定义key htmlelement映射
     */
    private keyElementMap:Map<string,HTMLElement> = new Map();

    /**
     * key virtualdom map 
     */
    private keyVDomMap:Map<string,IRenderedDom> = new Map();

    /**
     * 来源dom，子模块对应dom
     */
    public srcDom:IRenderedDom;

    /**
     * 生成dom时的keyid，每次编译置0
     */
    private domKeyId:number;

    /**
     * 旧模版串
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
        this.changedModelMap = new Map();
        this.eventFactory = new EventFactory(this);
        //加入模块工厂
        ModuleFactory.add(this);
    }

    /**
     * 初始化
     */
    public init() {
        // 设置状态为初始化
        this.state = EModuleState.INITED;
        //初始化model
        this.model = new Model(this.data()||{} , this);
        //注册子模块
        if(this.modules && Array.isArray(this.modules)){
            for (let cls of this.modules) {
                ModuleFactory.addClass(cls);
            }
            delete this.modules;
        }
    }

    /**
     * 模版串方法，使用时重载
     * @param props     props对象，在模版容器dom中进行配置，从父模块传入
     * @returns         模版串
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
        if(this.state === EModuleState.UNACTIVE){
            return;
        }
        //检测模版并编译
        let templateStr = this.template(this.props);
        
        if(templateStr !== this.oldTemplate){
            this.oldTemplate = templateStr;
            this.compile();
        }
        //不存在，不渲染
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
        
        if(this.state === EModuleState.UNMOUNTED){ //未挂载
            //渲染到html dom
            Renderer.renderToHtml(this,this.renderTree,null,true);
            this.mount();
        }else if(oldTree && this.model) {
            let changeDoms = [];
            // 比较节点
            DiffTool.compare(this.renderTree,oldTree, changeDoms);
            //执行更改
            if(changeDoms.length>0){
                Renderer.handleChangedDoms(this,changeDoms);
            }
        }

        if(!this.hasRendered) {    //首次渲染
            this.doModuleEvent('onFirstRender');
            this.hasRendered = true;
        }
        
        //设置已渲染状态
        this.state = EModuleState.RENDERED;
        //执行每次渲染后事件
        this.doModuleEvent('onRender');
        this.changedModelMap.clear();
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
            module.unactive();
            this.children.splice(ind,1);
        }
    }

    /**
     * 激活模块(添加到渲染器)
     * @param type  0 手动， 1父节点setProps激活，默认0
     */
    public active(type?:number) {
        //如果为手动active，srcdom存在且不在renderTree中，则不active
        if(!type && this.srcDom){
            const pm = this.getParent();
            if(pm && !pm.getRenderedDom(this.srcDom.key)){
                return;
            }
        }
        //设置unmount状态
        if(this.state === EModuleState.UNACTIVE || this.state === EModuleState.INITED){
            this.state = EModuleState.UNMOUNTED;
        }
        Renderer.add(this);
    }

    /**
     * 取消激活
     */
    public unactive() {
        if (ModuleFactory.getMain() === this) {
            return;
        }
        //从render列表移除
        Renderer.remove(this.id);
        //清空event factory
        this.eventFactory = new EventFactory(this);
        //删除渲染树
        delete this.renderTree;

        //module根与源el切换
        const el = this.getNode('1');
        if (el) {
            if (this.container) { //带容器(路由方法加载)
                this.container.removeChild(el);
            }
            else if (this.srcDom) {
                const pm = this.getParent();
                if (!pm) {
                    return;
                }
                const srcElement = document.createTextNode("");
                if (el.parentElement) {
                    el.parentElement.replaceChild(srcElement, el);
                }
                pm.saveNode(this.srcDom.key, srcElement);
            }    
        }
        //清理dom map
        this.clearMap();
        
        //设置状态
        this.state = EModuleState.UNACTIVE;
        //处理子模块
        if (this.children) {
            //处理子模块
            for (let id of this.children) {
                let m = ModuleFactory.get(id);
                if (m) {
                    m.unactive();
                }
            }
        }
    }

    /**
     * 挂载到html dom
     */
     private mount(){
        const el = this.getNode('1');
        if(!el){
            return;
        }
        if(this.container){ //带容器(路由方法加载)
            this.container.appendChild(el);
        }else if(this.srcDom){
            const pm = this.getParent();
            if(!pm){
                return;
            }
            const srcElement = pm.getNode(this.srcDom.key);
            if(srcElement){
                srcElement.parentElement.replaceChild(el,srcElement);
            }
            pm.saveNode(this.srcDom.key,el);
        }
        //执行挂载事件
        this.doModuleEvent('onMount');
    }

    /**
     * 解挂
     */
    private unmount(){
        this.unactive();
        //执行解挂事件
        this.doModuleEvent('onUnmount');
        this.state = EModuleState.UNMOUNTED;
    }
    
    /**
     * 清除dom map
     * @param key   dom key，如果为空，则清空map
     */
    private clearMap(key?:string){
        if(key){
            this.keyElementMap.delete(key);
            this.keyNodeMap.delete(key);
            this.keyVDomMap.delete(key);
        }else{
            this.keyElementMap.clear();
            this.keyNodeMap.clear();
            this.keyVDomMap.clear();
        }
    }
    /**
     * 获取父模块
     * @returns     父模块   
     */
    public getParent(): Module {
        if (!this.parentId) {
            return;
        }
        return ModuleFactory.get(this.parentId);
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
        delete props.$data;
        //props数据复制到模块model
        if(dataObj){
            for(let d of Object.keys(dataObj)){
                let o = dataObj[d];
                //如果为对象，需要绑定到模块
                if(typeof o === 'object' && this.model[d] !== o){
                    ModelManager.bindToModule(o,this);
                }
                this.model[d] = o;
            }
        }
        this.srcDom = dom;
        if(this.state !== EModuleState.RENDERED){
            this.active(1);
        }else {  //计算template，如果导致模版改变，需要激活
            let change = false;
            if(!this.props){
                change = true;
            }else{
                const keys = Object.getOwnPropertyNames(props);
                let len1 = keys.length;
                const keys1 = this.props?Object.getOwnPropertyNames(this.props):[];
                let len2 = keys1.length;
                if(len1 !== len2){
                    change = true;
                }else{
                    for(let k of keys){
                        // object 默认改变
                        if(props[k] !== this.props[k]){
                            change = true;
                            break;
                        }
                    }
                }
            }
            if(change){  //props 发生改变，计算模版，如果模版改变，激活模块
                this.active(1);
            }
        }
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
        if(this.props){
            this.mergeProps(this.originTree,this.props);
        }
        
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
    * 合并属性
    * @param dom       dom节点 
    * @param props     属性集合
    * @returns         是否改变
    */
    private mergeProps(dom:VirtualDom,props:any):boolean{
        let change = false;
        for(let k of Object.keys(props)){
            //如果dom自己有k属性，则处理为数组
            if(dom.hasProp(k)){ 
                let pv = dom.getProp(k);
                if(Array.isArray(pv)){  //是数组，表示已传值，此次进行修改
                    if(pv[1] !== props[k]){
                        dom.setProp(k,[pv[0],props[k]]);    
                        change = true;
                    }
                }else{  //首次传值
                    dom.setProp(k,[pv,props[k]]);
                    change = true;
                }
            }else{  //dom自己无此属性
                dom.setProp(k,props[k]);
                change = true;
            }
        }
        //修改staticNum
        if(change){
            dom.staticNum = 1;
        }
        return change;
    }

    /**
     * 获取node
     * @param key   dom key 
     * @returns     html node
     */
    public getNode(key:string):Node{
        return this.keyNodeMap.get(key);
    }

    /**
     * save node
     * @param key   dom key
     * @param node  html node
     */
    public saveNode(key:string,node:Node){
        this.keyNodeMap.set(key,node);
    }

    /**
     * 获取用户key定义的html
     * @param key   用户自定义key
     * @returns     html element
     */
    public getElement(key:string):HTMLElement{
        return this.keyElementMap.get(key);
    }

    /**
     * 保存用户key对应的htmlelement
     * @param key   自定义key
     * @param node  htmlelement
     */
    public saveElement(key:string,node:HTMLElement){
        this.keyElementMap.set(key,node);
    }

    /**
     * 获取key对应的virtual dom
     * @param key   vdom key
     * @returns     virtual dom
     */
    public getVirtualDom(key:string):IRenderedDom{
        return this.keyVDomMap.get(key);
    }

    /**
     * 保存key对应的virtual dom
     * @param dom   virtual dom
     * @param key   vdom key
     */
    public saveVirtualDom(dom:IRenderedDom,key?:string){
        this.keyVDomMap.set(key || dom.key,dom);
    }

    /**
     * 释放node
     * 包括从dom树解挂，释放对应结点资源
     * @param dom       虚拟dom
     */
    public freeNode(dom:IRenderedDom){
        if(dom.subModuleId){  //子模块
            //从渲染队列移除
            Renderer.remove(dom.subModuleId);
            let m = ModuleFactory.get(dom.subModuleId);
            if(m){
                m.unactive();
            }
        }else{  //非子模块
            let el = this.getNode(dom.key);
            if(el && el.parentElement){
                el.parentElement.removeChild(el);
            }
            //从map移除
            this.clearMap(dom.key);
            //解绑所有事件
            this.eventFactory.unbindAll(dom.key);
            
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
    public getOrginDom(key:string):VirtualDom{
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
     */
    public getModule(className:string,deep?:boolean):Module{
        if(!this.children){
            return;
        }
        for(let id of this.children){
            let m:Module = ModuleFactory.get(id);
            if(m && m.constructor){
                if(m.constructor.name === className){
                    return m;
                }
                if(deep){
                    let r = m.getModule(className,true);
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
