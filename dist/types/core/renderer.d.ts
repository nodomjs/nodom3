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
     * 当前模块根dom
     */
    private static currentModuleRoot;
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
     * @param changeDoms    更改的dom参数数组 [type(add 1, upd 2,del 3,move 4 ,rep 5),dom(操作节点),dom1(被替换或修改节点),parent(父节点),loc(位置)]
     */
    static handleChangedDoms(module: Module, changeDoms: any[]): void;
}