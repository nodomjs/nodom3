import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { ObjectManager } from "./objectmanager";
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
     * 不渲染的属性（这些属性用于生产模板，不作为属性渲染到模块根节点）
     */
    private excludedProps;
    /**
     * 编译后的dom树
     */
    originTree: VirtualDom;
    /**
     * 渲染树
     */
    renderTree: IRenderedDom;
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
     * 对象管理器，用于管理虚拟dom节点、指令、表达式、事件对象及其运行时参数
     */
    objectManager: ObjectManager;
    /**
     * 事件工厂
     */
    eventFactory: EventFactory;
    /**
     *  key:html node映射
     */
    private elementMap;
    /**
     * 来源dom，子模块对应dom
     */
    srcDom: IRenderedDom;
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
     * 初始化
     */
    init(): void;
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
    private mount;
    /**
     * 解挂，从htmldom 移除
     */
    unmount(): void;
    /**
     * 清除html element map 节点
     * @param key   dom key，如果为空，则清空map
     */
    private clearElementMap;
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
     * @param dom       子模块对应节点
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
    getElement(key: string): Node;
    /**
     * save html node
     * @param key   dom key
     * @param node  html node
     */
    saveElement(key: string, node: Node): void;
    /**
     * 释放node
     * 包括从dom树解挂，释放对应结点资源
     * @param dom       虚拟dom
     */
    freeNode(dom: IRenderedDom): void;
    /**
     * 从origin tree 获取虚拟dom节点
     * @param key   dom key
     */
    getOriginDom(key: string): VirtualDom;
    /**
     * 从渲染树中获取key对应的渲染节点
     * @param key   dom key
     */
    getRenderedDom(key: string): IRenderedDom;
    /**
     * 获取模块类名对应的第一个子模块(如果设置deep，则深度优先)
     * @param className     子模块类名
     * @param deep          是否深度获取
     * @param attrs         属性集合
     */
    getModule(className: string, deep?: boolean, attrs?: any): Module;
    /**
     * 获取模块类名对应的所有子模块
     * @param className     子模块类名
     * @param deep          深度查询
     */
    getModules(className: string, deep?: boolean): Module[];
    /**
     * 获取dom key id
     * @returns     key id
     */
    getDomKeyId(): number;
}
