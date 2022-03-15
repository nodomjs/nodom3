import { VirtualDom } from "./virtualdom";
import { Module } from "./module";
/**
 * 自定义元素
 * 用于扩充定义，主要对ast obj进行前置处理
 */
export class DefineElement {
    /**
     * 构造器，在dom编译后执行
     * @param node 
     * @param module 
     */
    constructor(node:VirtualDom){
        if (node.hasProp('tag')) {
            node.tagName = node.getProp('tag');
            node.delProp('tag');
        } else {
            node.tagName = 'div';
        }
    }
}
