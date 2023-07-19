import { Compiler } from "./compiler";
import { CssManager } from "./cssmanager";
import { Model } from "./model";
import { ModuleFactory } from "./modulefactory";
import { ObjectManager } from "./objectmanager";
import { Renderer } from "./renderer";
import { Util } from "./util";
import { DiffTool } from "./difftool";
import { EModuleState, IRenderedDom } from "./types";
import { EventFactory } from "./eventfactory";
import { DomManager } from "./dommanager";
import { ModelManager } from "./modelmanager";
import { NEvent } from "./event";
import { Expression } from "./expression";

/**
 * 模块类
 * 模块方法说明：模板内使用的方法，包括事件，都直接在模块内定义
 *      方法this：指向module实例
 *      事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *      表达式方法：参数按照表达式方式给定即可
 * 模块事件
 *      onInit              初始化后（constructor后，已经有model对象，但是尚未编译，只执行1次）
 *      onBeforeFirstRender 首次渲染前（只执行1次）
 *      onFirstRender       首次渲染后（只执行1次）
 *      onBeforeRender      渲染前
 *      onRender            渲染后
 *      onCompile           编译后
 *      onBeforeMount       挂载到document前
 *      onMount             挂载到document后
 *      onBeforeUnMount     从document脱离前
 *      onUnmount           从document脱离后
 *      onBeforeUpdate      更新到document前
 *      onUpdate            更新到document后
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
     * 子模块id数组
     */
    public children: Array<number> = [];

    /**
     * 模块状态
     */
    public state: EModuleState;

    /**
     * 模型管理器
     */
    public modelManager:ModelManager;
    
    /**
     * 对象管理器，用于管理虚拟dom节点、指令、表达式、事件对象及其运行时参数
     */
    public objectManager:ObjectManager;

    /**
     * dom 管理器，管理虚拟dom、渲染dom和html node
     */
    public domManager:DomManager;

    /**
     * 事件工厂
     */
    public eventFactory:EventFactory;

    /**
     * 来源dom，子模块对应dom
     */
    public srcDom:IRenderedDom;

    /**
     * 源节点传递的事件，需要追加到模块根节点上
     */
    public events:NEvent[];

    /**
     * 模板对应模块id，作为子模块时有效
     */
    public templateModuleId:number;

    /**
     * 父模块通过dom节点传递的属性
     */
    public props:any;

    /**
     * 子模块类集合，模板中引用的模块类需要声明
     * 如果类已经通过registModule注册过，这里不再需要定义，只需import即可
     */
    public modules: any;

    /**
     * 不渲染的属性（这些属性用于生产模板，不作为属性渲染到模块根节点）
     */
    private excludedProps:string[];

    /**
     * 父模块 id
     */
    private parentId: number;

    /**
     * 源element
     */
    private srcElement:Node;

    /**
     * 生成dom时的keyid，每次编译置0
     */
    private domKeyId:number;

    /**
     * 旧模板串
     */
    private oldTemplate:string;

    /**
     * 构造器
     */
    constructor() {
        this.id = Util.genId();
        this.modelManager = new ModelManager(this);
        this.domManager = new DomManager(this);
        this.objectManager = new ObjectManager(this);
        this.eventFactory = new EventFactory(this);
        //加入模块工厂
        ModuleFactory.add(this);
    }

    /**
     * 初始化操作
     */
    public init(){
        this.state = EModuleState.INIT;
        //初始化model
        this.model = new Model(this.data()||{} , this);
        this.doModuleEvent('onInit');
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
     * @returns     数据对象
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
        const templateStr = this.template(this.props);
        const firstRender = this.oldTemplate===undefined;
        //与旧模板不一样，需要重新编译
        if(templateStr !== this.oldTemplate){
            this.oldTemplate = templateStr;
            this.compile();
        }
        //不存在domManager.vdomTree，不渲染
        if(!this.domManager.vdomTree){
            return;
        }
        //首次渲染
        if(firstRender){
            this.doModuleEvent('onBeforeFirstRender');    
        }
        //渲染前事件
        this.doModuleEvent('onBeforeRender');
        //保留旧树
        const oldTree = this.domManager.renderedTree;
        //渲染
        this.domManager.renderedTree = Renderer.renderDom(this,this.domManager.vdomTree,this.model);
        //每次渲染后事件
        this.doModuleEvent('onRender');
        //首次渲染
        if(firstRender){
            this.doModuleEvent('onFirstRender');    
        }
        //渲染树为空，从html卸载
        if(!this.domManager.renderedTree){
            this.unmount();
            return;
        }
        //已经挂载
        if(this.state === EModuleState.MOUNTED){
            if(oldTree && this.model){
                //新旧渲染树节点diff
                const changeDoms = DiffTool.compare(this.domManager.renderedTree,oldTree);
                //执行更改
                if(changeDoms.length>0){
                    //html节点更新前事件
                    this.doModuleEvent('onBeforeUpdate');
                    Renderer.handleChangedDoms(this,changeDoms);
                    //html节点更新后事件
                    this.doModuleEvent('onUpdate');
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
        if(typeof module === 'number'){
            module = ModuleFactory.get(module);
        }
        if(module){
            if (!this.children.includes(module.id)) {
                this.children.push(module.id);
                module.parentId = this.id;
            }
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
     */
    public active() {
        //如果为unmounted，则设置为准备好状态
        if(this.state === EModuleState.UNMOUNTED){
            this.state = EModuleState.INIT;
        }
        Renderer.add(this);
    }

    /**
     * 挂载到document
     */
    public mount(){
        //执行挂载前事件
        this.doModuleEvent('onBeforeMount');
        //渲染到fragment
        let rootEl = new DocumentFragment();
        const el = Renderer.renderToHtml(this,this.domManager.renderedTree,rootEl,true);
        //主模块，直接添加到根模块
        if(this === ModuleFactory.getMain()){
            Renderer.getRootEl().append(el);
        }else if(this.srcDom){ //挂载到父模块中
            const pm = this.getParent();
            if(!pm){
                return;
            }
            //替换占位符
            this.srcElement = pm.getElement(this.srcDom.key);
            if (this.srcElement) {
                this.srcElement.parentElement.replaceChild(el, this.srcElement);
            }
            //保存对应key
            pm.saveElement(this.srcDom.key, el);
        }
        //执行挂载后事件
        this.doModuleEvent('onMount');
        this.state = EModuleState.MOUNTED;
    }

    /**
     * 解挂，从document移除
     */
    public unmount(){
        // 主模块或状态为unmounted的模块不用处理
        if (this.state === EModuleState.UNMOUNTED || ModuleFactory.getMain() === this) {
            return;
        }
        //从render列表移除
        Renderer.remove(this.id);
        //清空event factory
        this.eventFactory.clear();
        //执行卸载前事件
        this.doModuleEvent('onBeforeUnMount');
        //module根与源el切换
        const el = this.getElement(1);
        if (el) {
            if (this.srcDom) {
                const pm = this.getParent();
                if (pm) {
                    //设置模块占位符
                    if (el.parentElement) {
                        el.parentElement.replaceChild(this.srcElement, el);
                    }
                    pm.saveElement(this.srcDom.key, this.srcElement);    
                }
            }    
        }
        this.domManager.reset();
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
        //执行卸载后事件
        this.doModuleEvent('onUnMount');
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
     * 设置props
     * @param props     属性值
     * @param dom       子模块对应渲染后节点
     */
    public setProps(props:any,dom:IRenderedDom){
        let dataObj = props.$data;
        delete props.$data;
        //props数据复制到模块model
        if(dataObj){
            for(let d of Object.keys(dataObj)){
                this.model[d] = dataObj[d];
            }
        }
        //保留src dom
        this.srcDom = dom;
        //如果不存在旧的props，则change为true，否则初始化为false
        let change:boolean = false;
        if(!this.props){
            change = true;
        }else{
            for(let k of Object.keys(props)){
                // object 默认改变
                if(props[k] !== this.props[k]){
                    change = true;
                }
            }
        }
        //保存事件数组
        this.events = dom.vdom.events;
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
        //注册子模块
        if(this.modules && Array.isArray(this.modules)){
            for (let cls of this.modules) {
                ModuleFactory.addClass(cls);
            }
            delete this.modules;
        }
        if(!this.oldTemplate){
            return;
        }
        //重置初始domkey
        this.domKeyId = 0;
        //清空孩子节点
        this.children = [];
        //清理css url
        CssManager.clearModuleRules(this);
        //清除dom参数
        this.objectManager.clearAllDomParams();
        //编译
        this.domManager.vdomTree = new Compiler(this).compile(this.oldTemplate);
        if(!this.domManager.vdomTree){
            return;
        }
        
        //添加从源dom传递的事件
        if(this.events){
            for(let ev of this.events){
                this.domManager.vdomTree.addEvent(ev);
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
     * 处理根节点属性
     * @param src       编译节点
     * @param dst       dom节点
     */
    public handleRootProps(src,dst){
        //已合并属性集合
        const added = {};
        if(src.props && src.props.size>0){
            for(let k of src.props){
                let value;
                if(this.excludedProps && this.excludedProps.includes(k[0])){
                    continue;
                }
                if(k[1] instanceof Expression){
                    value = k[1].val(this,dst.model);
                }else{
                    value = k[1];
                }
                // 合并属性
                if(this.props && this.props.hasOwnProperty(k[0])){
                    let v = this.props[k[0]];
                    if(v){
                        if('style' === k[0]){
                            v = v.trim();
                            if(!value){
                                value = v;
                            }else{
                                value = (value + ';' + v).replace(/;{2,}/g,';');
                            }
                        }else if('class' === k[0]){
                            v = v.trim();
                            if(!value){
                                value = v;
                            }else{
                                value += ' ' + v;
                            }
                        }else{
                            value = v;
                        }
                    }
                    // 设置已处理标志
                    added[k[0]] = true;
                }
                dst.props[k[0]] = value;
            }
        }
        if(this.props){
            //处理未添加的属性
            for(let p of Object.keys(this.props)){
                if(added[p] || this.excludedProps && this.excludedProps.includes(p)){
                    continue;
                }
                dst.props[p] = this.props[p];
            }
        }
    }

    /**
     * 获取html node
     * @param key   dom key 或 props键值对
     * @returns     html node
     */
    public getElement(key:any):Node{
        return this.domManager.getElement(key);
    }

    /**
     * save html node
     * @param key   dom key
     * @param node  html node
     */
    public saveElement(key:number|string,node:Node){
        this.domManager.saveElement(key,node);
    }

    /**
     * 获取模块类名对应的第一个子模块(如果设置deep，则深度优先)
     * @param name          子模块类名或别名
     * @param deep          是否深度获取
     * @param attrs         属性集合
     */
    public getModule(name:string,deep?:boolean,attrs?:any):Module{
        if(!this.children){
            return;
        }
        const cls = ModuleFactory.getClass(name);
        if(!cls){
            return;
        }
        return find(this);
        /**
         * 查询
         * @param mdl   模块
         * @returns     符合条件的子模块
         */
        function find(mdl){
            for(let id of mdl.children){
                let m:Module = ModuleFactory.get(id);
                if(m){
                    if(m.constructor === cls){
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
                    //递归查找
                    if(deep){
                        let r = find(m);
                        if(r){
                            return r;
                        }
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
     * 监听
     * 如果第一个参数为属性名，则第二个参数为钩子函数，第三个参数为deep，默认model为根模型
     * 否则按照以下说明
     * @param model     模型或属性
     * @param key       属性/属性数组，支持多级属性
     * @param operate   钩子函数
     * @param deep      是否深度监听
     * @returns         可回收监听器，执行后取消监听
     */
    public watch(model:Model|string|string[],key:string|string[]|Function,operate?:Function|boolean,deep?:boolean){
        if(model['__key']){
            return this.modelManager.watch(model,<any>key,<Function>operate,deep);
        }else{
            return this.modelManager.watch(this.model,<any>model,<any>key,<boolean>operate);
        }
    }

    /**
     * 设置模型属性值
     * 如果第一个参数为属性名，则第二个参数为属性值，默认model为根模型
     * 否则按照以下说明
     * @param model     模型
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     */
    public set(model:Model|string,key:any,value?:any){
        if(model['__key']){
            this.modelManager.set(model,key,value);
        }else{
            this.modelManager.set(this.model,<string>model,key);
        }
    }

    /**
     * 获取模型属性值
     * 如果第一个参数为属性名，默认model为根模型
     * 否则按照以下说明
     * @param model     模型
     * @param key       属性名，可以分级，如 name.firstName，如果为null，则返回自己
     * @returns         属性值
     */
    public get(model:Model|string, key?:any):any {
        if(model['__key']){
            return this.modelManager.get(model,key);
        }else{
            return this.modelManager.get(this.model,<string>model);
        }
    }

    /**
     * 调用方法
     * @param methodName    方法名
     * @param pn            参数，最多10个参数
     */
    public invokeMethod(methodName:string,p1?,p2?,p3?,p4?,p5?,p6?,p7?,p8?,p9?,p10?){
        if(typeof this[methodName] === 'function'){
            return this[methodName].call(this,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10);
        }
    }

    /**
     * 调用外部方法，当该模块作为子模块使用时，方法属于使用该模块的模板对应的module
     * @param methodName    方法名
     * @param pn            参数，最多10个参数
     */
    public invokeOuterMethod(methodName:string,p1?,p2?,p3?,p4?,p5?,p6?,p7?,p8?,p9?,p10?){
        if(!this.templateModuleId){
            return;
        }
        const m = ModuleFactory.get(this.templateModuleId);
        if(!m){
            return;
        }
        return m.invokeMethod(methodName,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10);
    }
    
    /**
     * 获取dom key id
     * @returns     key id
     */
    public getDomKeyId():number{
        return ++this.domKeyId;
    }
}