import { Model } from "./model";
import { ObjectManager } from "./objectmanager";
import { EModuleState, IRenderedDom } from "./types";
import { EventFactory } from "./eventfactory";
import { DomManager } from "./dommanager";
import { ModelManager } from "./modelmanager";
import { NEvent } from "./event";
/**
 * 模块类
 * 模块方法说明：模板内使用的方法，包括事件，都直接在模块内定义
 *      方法this：指向module实例
 *      事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *      表达式方法：参数按照表达式方式给定即可
 * 模块事件
 *      onBeforeFirstRender 首次渲染前
 *      onFirstRender       首次渲染后
 *      onBeforeRender      增量渲染前
 *      onRender            增量渲染后
 *      onCompile           编译后
 *      onBeforeMount       挂载到html dom树前（onFirstRender渲染后）
 *      onMount             挂载到html dom树后(首次渲染到html树后)
 *      onBeforeUnMount     从html dom树解挂前
 *      onUnmount           从html dom树解挂后
 *      onBeforeUpdate      更新到html dom树前（onRender后，针对增量渲染）
 *      onUpdate            更新到html dom树后（针对增量渲染）
 */
export declare class Module {
    /**
     * 模块id(全局唯一)
     */
    id: number;
    /**
     * 模型，代理过的data
     */
    model: Model;
    /**
     * 子模块类集合，模板中引用的模块类需要声明
     * 如果类已经通过registModule注册过，这里不再需要定义，只需import即可
     */
    modules: any;
    /**
     * 父模块通过dom节点传递的属性
     */
    props: any;
    /**
     * 编译后的根结点props
     */
    private originProps;
    /**
     * 更改后的props
     */
    private changedProps;
    /**
     * dom 管理器，管理虚拟dom、渲染dom和html node
     */
    domManager: DomManager;
    /**
     * 不渲染的属性（这些属性用于生产模板，不作为属性渲染到模块根节点）
     */
    private excludedProps;
    /**
     * 父模块 id
     */
    parentId: number;
    /**
     * 子模块id数组
     */
    children: Array<number>;
    /**
     * 模块状态
     */
    state: EModuleState;
    /**
     * 放置模块的容器
     */
    private container;
    /**
     * 模型管理器
     */
    modelManager: ModelManager;
    /**
     * 对象管理器，用于管理虚拟dom节点、指令、表达式、事件对象及其运行时参数
     */
    objectManager: ObjectManager;
    /**
     * 事件工厂
     */
    eventFactory: EventFactory;
    /**
     * 来源dom，子模块对应dom
     */
    srcDom: IRenderedDom;
    /**
     * 源element
     */
    srcElement: Node;
    /**
     * 源节点传递的事件，需要追加到模块根节点上
     */
    events: NEvent[];
    /**
     * 生成dom时的keyid，每次编译置0
     */
    private domKeyId;
    /**
     * 旧模板串
     */
    private oldTemplate;
    /**
     * 编译来源模块id
     */
    compileMid: number;
    /**
     * 是否已渲染过
     */
    private hasRendered;
    /**
     * 构造器
     */
    constructor();
    /**
     * 模板串方法，使用时重载
     * @param props     props对象，在模板容器dom中进行配置，从父模块传入
     * @returns         模板串
     */
    template(props?: any): string;
    /**
     * 数据方法，使用时重载
     * @returns      model数据
     */
    data(): any;
    /**
     * 模型渲染
     */
    render(): boolean;
    /**
     * 添加子模块
     * @param module    模块id或模块
     */
    addChild(module: number | Module): void;
    /**
     * 移除子模块
     * @param module    子模块
     */
    removeChild(module: Module): void;
    /**
     * 激活模块(准备渲染)
     * @param type  0 手动， 1父节点setProps激活，默认0
     */
    active(): void;
    /**
     * 挂载到html dom
     */
    mount(): void;
    /**
     * 解挂，从htmldom 移除
     */
    unmount(): void;
    /**
     * 获取父模块
     * @returns     父模块
     */
    getParent(): Module;
    /**
     * 执行模块事件
     * @param eventName 	事件名
     * @returns             执行结果，各事件返回值如下：
     *                          onBeforeRender：如果为true，表示不进行渲染
     */
    private doModuleEvent;
    /**
     * 获取模块方法
     * @param name  方法名
     * @returns     方法
     */
    getMethod(name: string): Function;
    /**
     * 设置渲染容器
     * @param el        容器
     */
    setContainer(el: HTMLElement): void;
    /**
     * 调用方法
     * @param methodName    方法名
     */
    invokeMethod(methodName: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any): any;
    /**
     * 设置props
     * @param props     属性值
     * @param dom       子模块对应渲染后节点
     */
    setProps(props: any, dom: IRenderedDom): void;
    /**
     * 编译
     */
    compile(): void;
    /**
     * 设置不渲染到根dom的属性集合
     * @param props     待移除的属性名属组
     */
    setExcludeProps(props: string[]): void;
    /**
    * 合并根节点属性
    * @param dom       dom节点
    * @param props     属性集合
    * @returns         是否改变
    */
    private mergeProps;
    /**
     * 获取html node
     * @param key   dom key
     * @returns     html node
     */
    getElement(key: number): Node;
    /**
     * save html node
     * @param key   dom key
     * @param node  html node
     */
    saveElement(key: number, node: Node): void;
    /**
     * 获取模块类名对应的第一个子模块(如果设置deep，则深度优先)
     * @param name          子模块类名或别名
     * @param deep          是否深度获取
     * @param attrs         属性集合
     */
    getModule(name: string, deep?: boolean, attrs?: any): Module;
    /**
     * 获取模块类名对应的所有子模块
     * @param className     子模块类名
     * @param deep          深度查询
     */
    getModules(className: string, deep?: boolean): Module[];
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
    watch(model: Model | string | string[], key: string | string[] | Function, operate?: Function | boolean, deep?: boolean): Function;
    /**
     * 设置模型属性值
     * 如果第一个参数为属性名，则第二个参数为属性值，默认model为根模型
     * 否则按照以下说明
     * @param model     模型
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     */
    set(model: Model | string, key: any, value?: any): void;
    /**
     * 获取模型属性值
     * 如果第一个参数为属性名，默认model为根模型
     * 否则按照以下说明
     * @param model     模型
     * @param key       属性名，可以分级，如 name.firstName，如果为null，则返回自己
     * @returns         属性值
     */
    get(model: Model | string, key?: any): any;
    /**
     * 获取dom key id
     * @returns     key id
     */
    getDomKeyId(): number;
}
