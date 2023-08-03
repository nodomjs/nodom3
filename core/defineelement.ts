import { Module } from "./module";
import { VirtualDom } from "./virtualdom";
/**
 * 自定义元素
 * 
 * @remarks
 * 用于扩充标签，主要用于指令简写，参考 ./extend/elementinit.ts。
 * 
 * 如果未指定标签名，默认为`div`，也可以用`tag`属性指定
 * 
 * @example
 * ```html
 *   <!-- 渲染后标签名为div -->
 *   <if cond={{any}}>hello</if>
 *   <!-- 渲染后标签名为p -->
 *   <if cond={{any}} tag='p'>hello</if>
 * ```
 */
export class DefineElement {
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
    }
}
