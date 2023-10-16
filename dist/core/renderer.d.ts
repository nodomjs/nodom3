import { Module } from "./module";
import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { ChangedDom, RenderedDom } from "./types";
/**
 * 渲染器
 * @remarks
 * nodom渲染操作在渲染器中实现
 */
export declare class Renderer {
    /**
     * 应用根El
     */
    private static rootEl;
    /**
     * 等待渲染列表
     */
    private static waitList;
    /**
     * 当前渲染模块
     * @remarks
     * slot渲染时，如果未使用`innerRender`，则渲染过程中指令、表达式依赖的模块会切换成templateModuleId对应模块，但currentModule不变。
     */
    static currentModule: Module;
    /**
     * 当前模块根dom
     */
    private static currentRootDom;
    /**
     * 设置根容器
     * @param rootEl - 根html element
     */
    static setRootEl(rootEl: any): void;
    /**
     * 获取根容器
     * @returns 根 html element
     */
    static getRootEl(): HTMLElement;
    /**
     * 获取当前渲染模块
     * @returns     当前渲染模块
     */
    static getCurrentModule(): Module;
    /**
     * 添加到渲染列表
     * @param module - 模块
     */
    static add(module: Module): void;
    /**
     * 从渲染队列移除
     * @param moduleId - 模块id
     */
    static remove(module: Module): void;
    /**
     * 渲染
     * @remarks
     * 如果存在渲染队列，则从队列中取出并依次渲染
     */
    static render(): void;
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
    static renderDom(module: Module, src: VirtualDom, model: Model, parent?: RenderedDom, key?: number | string): RenderedDom;
    /**
     * 处理指令
     * @param module -  模块
     * @param src -     编译节点
     * @param dst -     渲染节点
     * @returns         true继续执行，false不执行后续渲染代码，也不加入渲染树
    */
    private static handleDirectives;
    /**
     * 处理属性
     * @param module -  模块
     * @param src -     编译节点
     * @param dst -     渲染节点
     */
    private static handleProps;
    /**
     * 更新到html树
     * @param module -  模块
     * @param src -     渲染节点
     * @returns         渲染后的节点
     */
    static updateToHtml(module: Module, dom: RenderedDom, pEl?: any): Node;
    /**
     * 渲染到html树
     * @param module - 	        模块
     * @param src -             渲染节点
     * @param parentEl - 	    父html
     * @param isRenderChild -   是否渲染子节点
     * @returns                 渲染后的html节点
     */
    static renderToHtml(module: Module, src: RenderedDom, parentEl: Node, isRenderChild?: boolean): Node;
    /**
     * 处理更改的dom节点
     * @param module -        待处理模块
     * @param changeDoms -    修改后的dom节点数组
     */
    static handleChangedDoms(module: Module, changeDoms: ChangedDom[]): void;
    /**
     * 替换解ID那
     * @param module -  模块
     * @param src -     待替换节点
     * @param dst -     被替换节点
     */
    private static replace;
}
