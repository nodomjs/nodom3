import { VirtualDom } from "./virtualdom";
/**
 * 自定义元素
 * 用于扩充定义，主要对ast obj进行前置处理
 */
export declare class DefineElement {
    /**
     * 构造器，在dom编译后执行
     * @param node
     * @param module
     */
    constructor(node: VirtualDom);
}
