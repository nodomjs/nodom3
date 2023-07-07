import { Module } from "./module";
import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { IRenderedDom } from "./types";
/**
 * 渲染器
 */
export declare class Renderer {
    /**
     * 等待渲染列表（模块名）
     */
    static waitList: Array<number>;
    /**
     * 当前module
     */
    static currentModule: Module;
    /**
     * 当前模块根dom
     */
    private static currentRootDom;
    /**
     * 添加到渲染列表
     * @param module 模块
     */
    static add(module: Module): void;
    /**
     * 从渲染队列移除
     * @param moduleId
     */
    static remove(moduleId: number): void;
    /**
     * 队列渲染
     */
    static render(): void;
    /**
     * 渲染dom
     * @param module            模块
     * @param src               源dom
     * @param model             模型，如果src已经带有model，则此参数无效，一般为指令产生的model（如slot）
     * @param parent            父dom
     * @param key               key 附加key，放在domkey的后面
     * @returns
     */
    static renderDom(module: Module, src: VirtualDom, model: Model, parent?: IRenderedDom, key?: any): IRenderedDom;
    /**
     * 处理指令
     * @param module    模块
     * @param src       编译节点
     * @param dst       渲染节点
     * @returns         true继续执行，false不执行后续渲染代码，也不加入渲染树
    */
    private static handleDirectives;
    /**
     * 处理属性
     * @param module    模块
     * @param src       编译节点
     * @param dst       渲染节点
     */
    private static handleProps;
    /**
     * 更新到html树
     * @param module    模块
     * @param src       渲染节点
     * @returns         渲染后的节点
     */
    static updateToHtml(module: Module, src: IRenderedDom): Node;
    /**
     * 渲染到html树
     * @param module 	        模块
     * @param src               渲染节点
     * @param parentEl 	        父html
     * @param isRenderChild     是否渲染子节点
     */
    static renderToHtml(module: Module, src: IRenderedDom, parentEl: Node, isRenderChild?: boolean): Node;
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
    static handleChangedDoms(module: Module, changeDoms: any[]): void;
}