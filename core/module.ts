import { Compiler } from "./compiler";
import { CssManager } from "./cssmanager";
import { Model } from "./model";
import { ModuleFactory } from "./modulefactory";
import { ObjectManager } from "./objectmanager";
import { Renderer } from "./renderer";
import { Util } from "./util";
import { DiffTool } from "./difftool";
import { EModuleState, RenderedDom, UnknownMethod } from "./types";
import { EventFactory } from "./eventfactory";
import { DomManager } from "./dommanager";
import { ModelManager } from "./modelmanager";
import { NEvent } from "./event";
import { Expression } from "./expression";

/**
 * 模块类
 * 
 * @remarks
 * 模块方法说明：模板内使用的方法，包括事件方法，都在模块内定义
 *
 *  方法this：指向module实例
 * 
 *  事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)  
 * 
 *  表达式方法：参数按照表达式方式给定即可，如：
 * ```html
 *  <div>
 *      <div class={{getCls(st)}} e-click='click'>Hello Nodom</div>
 *  </div>
 * ```
 * ```js
 *  //事件方法
 *  click(model,dom,eventObj,e){
 *      //do something
 *  }
 *  //表达式方法
 *  //state 由表达式中给定，state由表达式传递，为当前dom model的一个属性
 *  getCls(state){
 *      //do something
 *  } 
 * ```
 * 
 * 模块事件，在模块不同阶段执行
 * 
 * onInit              初始化后（constructor后，已经有model对象，但是尚未编译，只执行1次）
 * 
 * onBeforeFirstRender 首次渲染前（只执行1次）
 * 
 * onFirstRender       首次渲染后（只执行1次）
 * 
 * onBeforeRender      渲染前
 * 
 * onRender            渲染后
 * 
 * onCompile           编译后
 * 
 * onBeforeMount       挂载到document前
 * 
 * onMount             挂载到document后
 * 
 * onBeforeUnMount     从document脱离前
 * 
 * onUnmount           从document脱离后
 * 
 * onBeforeUpdate      更新到document前
 * 
 * onUpdate            更新到document后
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
    public srcDom:RenderedDom;

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
    public props:object;

    /**
     * 子模块类集合，模板中引用的模块类需要声明
     * 如果类已经通过registModule注册过，这里不再需要定义，只需import即可
     */
    public modules: unknown[];

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
     * 模板串方法，使用时需重载
     * @param props -   props对象，在模板中进行配置，从父模块传入
     * @returns         模板串
     * @virtual
     */
    public template(props?:object):string{
        return null;
    }

    /**
     * 数据方法，使用时需重载
     * @returns  数据对象
     */
    public data():object{
        return {};
    }
    
    /**
     * 模型渲染
     * @remarks
     * 渲染流程：
     * 
     * 1. 获取首次渲染标志
     * 
     * 2. 执行template方法获得模板串
     * 
     * 3. 与旧模板串比较，如果不同，则进行编译
     * 
     * 4. 判断是否存在虚拟dom树（编译时可能导致模板串为空），没有则结束
     * 
     * 5. 如果为首次渲染，执行onBeforeFirstRender事件 
     * 
     * 6. 执行onBeforeRender事件
     * 
     * 7. 保留旧渲染树，进行新渲染
     * 
     * 8. 执行onRender事件
     * 
     * 9. 如果为首次渲染，执行onFirstRender事件 
     * 
     * 10. 渲染树为空，从document解除挂载
     * 
     * 11. 如果未挂载，执行12，否则执行13
     * 
     * 12. 执行挂载，结束
     * 
     * 13. 新旧渲染树比较，比较结果为空，结束，否则执行14
     * 
     * 14. 执行onBeforeUpdate事件
     * 
     * 15. 更新到document
     * 
     * 16. 执行onUpdate事件，结束
     */
    public render(): boolean {
        if(this.state === EModuleState.UNMOUNTED){
            return;
        }
        //获取首次渲染标志
        const firstRender = this.oldTemplate===undefined;
        //检测模板并编译
        const templateStr = this.template(this.props);
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
     * @param module -    模块id或模块
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
     * @param module -    子模块
     */
    public removeChild(module: Module) {
        const ind=this.children.indexOf(module.id);
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
        const rootEl = new DocumentFragment();
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
     * 从document移除
     */
    public unmount(){
        // 主模块或状态为unmounted的模块不用处理
        if (this.state === EModuleState.UNMOUNTED || ModuleFactory.getMain() === this) {
            return;
        }
        //从render列表移除
        Renderer.remove(this);
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
            for (const id of this.children) {
                const m = ModuleFactory.get(id);
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
     * @param eventName -   事件名
     * @returns             执行结果
     */
    private doModuleEvent(eventName: string):boolean{
        const foo = this[eventName];
        if(foo && typeof foo==='function'){
            return foo.apply(this,[this.model]);
        }
    }

    /**
     * 获取模块方法
     * @param name -    方法名
     * @returns         方法
     */
    public getMethod(name: string): UnknownMethod {
        return this[name];
    }

    /**
     * 设置props
     * @param props -   属性值
     * @param dom -     子模块对应渲染后节点
     */
    public setProps(props:object,dom:RenderedDom){
        const dataObj = props['$data'];
        delete props['$data'];
        //props数据复制到模块model
        if(dataObj){
            for(const d of Object.keys(dataObj)){
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
            for(const k of Object.keys(props)){
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
            for (const cls of this.modules) {
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
            for(const ev of this.events){
                this.domManager.vdomTree.addEvent(ev);
            }
        }
        //增加编译后事件
        this.doModuleEvent('onCompile');
    }

    /**
     * 设置不渲染到根dom的属性集合
     * @param props -   待移除的属性名属组
     */
    public setExcludeProps(props:string[]){
        this.excludedProps = props;
    }

    /**
     * 处理根节点属性
     * @param src -     编译节点
     * @param dst -     dom节点
     */
    public handleRootProps(src,dst){
        //已合并属性集合
        const added = {};
        if(src.props && src.props.size>0){
            for(const k of src.props){
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
            for(const p of Object.keys(this.props)){
                if(added[p] || this.excludedProps && this.excludedProps.includes(p)){
                    continue;
                }
                dst.props[p] = this.props[p];
            }
        }
    }

    /**
     * 获取html节点
     * @remarks
     * 当key为数字或字符串时，表示dom key，当key为对象时，表示根据dom属性进行查找
     * 
     * @param key - dom key 或 props键值对
     * @returns     html节点
     */
    public getElement(key:object|string|number):Node{
        return this.domManager.getElement(key);
    }

    /**
     * 保存html节点
     * @param key -   dom key
     * @param node -  html节点
     */
    public saveElement(key:number|string,node:Node){
        this.domManager.saveElement(key,node);
    }

    /**
     * 按模块类名获取子模块
     * @remarks
     * 找到第一个满足条件的子模块，如果deep=true，则深度优先
     * 
     * 如果attrs不为空，则同时需要匹配子模块属性
     * 
     * @example
     * ```html
     *  <div>
     *      <Module1 />
     *      //other code
     *      <Module1 v1='a' v2='b' />
     *  </div>
     * ```
     * ```js
     *  const m = getModule('Module1',true, {v1:'a'});
     *  //m 为模板中的第二个Module1
     * ```
     * @param name -    子模块类名或别名
     * @param deep -    是否深度获取
     * @param attrs -   属性集合
     * 
     * @returns         符合条件的子模块或undefined
     */
    public getModule(name:string,deep?:boolean,attrs?:object):Module{
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
         * @param mdl -   模块
         * @returns     符合条件的子模块
         */
        function find(mdl){
            for(const id of mdl.children){
                const m:Module = ModuleFactory.get(id);
                if(m){
                    if(m.constructor === cls){
                        if(attrs){  //属性集合不为空
                            //全匹配标识
                            let matched:boolean = true;
                            for(const k of Object.keys(attrs)){
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
                        const r = find(m);
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
     * @param className -   子模块类名
     * @param deep -        深度查询
     */
     public getModules(className:string,deep?:boolean):Module[]{
        if(!this.children){
            return;
        }
        const arr = [];
        find(this);
        return arr;

        /**
         * 查询
         * @param module - 
         */
        function find(module:Module){
            if(!module.children){
                return;
            }
            for(const id of module.children){
                const m:Module = ModuleFactory.get(id);
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
     * 监听model
     * @remarks
     * 参数个数可变，如果第一个参数为属性名，则第二个参数为钩子函数，第三个参数为deep，默认model为根模型
     * 
     * 否则按照参数说明
     * @param model -     模型或属性
     * @param key -       属性/属性数组，支持多级属性
     * @param operate -   钩子函数
     * @param deep -      是否深度监听
     * @returns           回收监听器函数，执行后取消监听
     */
    public watch(model:Model|string|string[],key:string|string[]|((m,k,ov,nv)=>void),operate?:boolean| ((m,k,ov,nv)=>void),deep?:boolean){
        if(model['__key']){
            return this.modelManager.watch(model,<string>key,<()=>void>operate,deep);
        }else{
            return this.modelManager.watch(this.model,<string>model,<()=>void>key,<boolean>operate);
        }
    }

    /**
     * 设置模型属性值
     * @remarks
     * 参数个数可变，如果第一个参数为属性名，则第二个参数为属性值，默认model为根模型
     * 
     * 否则按照参数说明
     * 
     * @param model -     模型
     * @param key -       子属性，可以分级，如 name.firstName
     * @param value -     属性值
     */
    public set(model:Model|string,key:unknown,value?:unknown){
        if(model['__key']){
            this.modelManager.set(model,<string>key,value);
        }else{
            this.modelManager.set(this.model,<string>model,key);
        }
    }

    /**
     * 获取模型属性值
     * @remarks
     * 参数个数可变，如果第一个参数为属性名，默认model为根模型
     * 
     * 否则按照参数说明
     * 
     * @param model -   模型
     * @param key -     属性名，可以分级，如 name.firstName，如果为null，则返回自己
     * @returns         属性值
     */
    public get(model:Model|string, key?:string):unknown {
        if(model['__key']){
            return this.modelManager.get(model,key);
        }else{
            return this.modelManager.get(this.model,<string>model);
        }
    }

    /**
     * 调用模块内方法
     * @remarks
     * 参数个数可变，参数个数最多10个
     * 
     * @param methodName -  方法名
     * @param pn -          参数
     */
    public invokeMethod(methodName:string,p1?,p2?,p3?,p4?,p5?,p6?,p7?,p8?,p9?,p10?){
        if(typeof this[methodName] === 'function'){
            return this[methodName].call(this,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10);
        }
    }

    /**
     * 调用模块外方法
     * @remarks
     * 当该模块作为子模块使用时，调用方法属于使用此模块的模板对应的模块
     * 
     * 对于下面的例子，模块`Module1`需要调用模块`Main`的`outerFoo方法`，则采用`invokeOuterMethod`进行调用。
     * @example
     * ```js
     *  //Module1
     *  class Module1 extends Module{
     *      //your code
     *  }
     * 
     *  //Main
     *  class Main extends Module{
     *      modules=[Module1];
     *      template(){
     *          return `
     *              <div>
     *                  <Module1 />
     *              </div>
     *          `
     *      }
     *      outerFoo(){
     * 
     *      }    
     *  }
     *  
     * ```
     * @param methodName -  方法名
     * @param pn -          参数，最多10个参数
     * @returns             方法返回值
     */
    public invokeOuterMethod(methodName:string,p1?,p2?,p3?,p4?,p5?,p6?,p7?,p8?,p9?,p10?):unknown{
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
     * 获取模块当前dom key编号
     * @remarks
     * 主要在手动增加节点时需要，避免key重复
     * @returns   key编号
     */
    public getDomKeyId():number{
        return ++this.domKeyId;
    }
}