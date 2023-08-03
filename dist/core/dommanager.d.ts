import { Module } from "./module";
import { RenderedDom } from "./types";
import { VirtualDom } from "./virtualdom";
/**
 * dom管理器
 * @remarks
 * 用于管理module的虚拟dom树，渲染树，html节点
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
     * 渲染后的dom树
     */
    renderedTree: RenderedDom;
    /**
     * html节点map
     * @remarks
     * 用于存放dom key对应的html节点
     */
    private elementMap;
    /**
     * 构造方法
     * @param module -  所属模块
     */
    constructor(module: Module);
    /**
     * 从virtual dom 树获取虚拟dom节点
     * @param key - dom key 或 props键值对
     * @returns     编译后虚拟节点
     */
    getVirtualDom(key: string | number | object): VirtualDom;
    /**
     * 从渲染树获取key对应的渲染节点
     * @param key - dom key 或 props键值对
     * @returns     渲染后虚拟节点
     */
    getRenderedDom(key: object | string | number): RenderedDom;
    /**
     * 清除html element map 节点
     * @param dom -   dom节点，如果为空，则清空map
     */
    clearElementMap(dom?: RenderedDom): void;
    /**
     * 获取html节点
     * @remarks
     * 当key为数字或字符串时，表示dom key，当key为对象时，表示根据dom属性进行查找
     *
     * @param key - dom key 或 props键值对
     * @returns     html节点
     */
    getElement(key: number | string | object): Node;
    /**
     * 保存html节点
     * @param key -   dom key
     * @param node -  html node
     */
    saveElement(key: number | string, node: Node): void;
    /**
     * 释放节点
     * @remarks
     * 释放操作包括：如果被释放节点包含子模块，则子模块需要unmount；释放对应节点资源
     * @param dom - 虚拟dom
     */
    freeNode(dom: RenderedDom): void;
    /**
     * 重置节点相关信息
     */
    reset(): void;
}
