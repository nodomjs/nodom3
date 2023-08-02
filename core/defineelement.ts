import { Module } from "./module";
import { VirtualDom } from "./virtualdom";
/**
 * 自定义元素
 * 用于扩充定义，主要对ast obj进行前置处理
 */
export class DefineElement {
    public module:Module;
    /**
     * 构造器，在dom编译后执行
     * @param node -    虚拟dom节点
     * @param module -  所属模块
     */
    constructor(node:VirtualDom,module:Module){
        if (node.hasProp('tag')) {
            node.tagName = <string>node.getProp('tag');
            node.delProp('tag');
        } else {
            node.tagName = 'div';
        }
        this.module = module;
    }
}
