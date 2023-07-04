import { Module } from "./module";
import { IRenderedDom } from "./types";
import { VirtualDom } from "./virtualdom";
/**
 * dom 管理器，用于管理模块的虚拟dom，旧渲染树
 */
export declare class DomManager {
    /**
     * 所属模块
     */
    private module;
    /**
     * 编译后的虚拟dom树
     */
    vdomTree: VirtualDom;
    /**
     * 渲染过的树
     */
    renderedTree: IRenderedDom;
    /**
     *  key:html node映射
     */
    elementMap: Map<number | string, Node>;
    /**
     * 构造方法
     * @param module    所属模块
     */
    constructor(module: Module);
    /**
     * 从origin tree 获取虚拟dom节点
     * @param key   dom key 或 props 键值对
     * @returns     编译后虚拟节点
     */
    getOriginDom(key: any): VirtualDom;
    /**
     * 从渲染树中获取key对应的渲染节点
     * @param key   dom key或props键值对
     * @returns     渲染后虚拟节点
     */
    getRenderedDom(key: any): IRenderedDom;
    /**
     * 清除html element map 节点
     * @param dom   dom节点，如果为空，则清空map
     */
    clearElementMap(dom?: IRenderedDom): void;
    /**
     * 获取html node
     * @param key   dom key 或 props 键值对
     * @returns     html node
     */
    getElement(key: any): Node;
    /**
     * save html node
     * @param key   dom key
     * @param node  html node
     */
    saveElement(key: number | string, node: Node): void;
    /**
     * 释放node
     * 包括从dom树解挂，释放对应结点资源
     * @param dom       虚拟dom
     */
    freeNode(dom: IRenderedDom): void;
    /**
     * 重置
     */
    reset(): void;
}
