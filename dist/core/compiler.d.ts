import { VirtualDom } from "./virtualdom";
import { Module } from "./module";
export declare class Compiler {
    /**
     * 模块
     */
    private module;
    /**
     * 根结点
     */
    private root;
    /**
     * 构造器
     * @param module
     */
    constructor(module: Module);
    /**
    * 编译
    * @param elementStr     待编译html串
    * @returns              虚拟dom
    */
    compile(elementStr: string): VirtualDom;
    /**
     * 编译模版串
     * @param srcStr    源串
     * @returns
     */
    private compileTemplate;
    /**
     * 处理模块子节点为slot节点
     * @param dom   dom节点
     */
    private handleSlot;
    /**
     * 后置处理
     * 包括：模块类元素、自定义元素
     * @param node  虚拟dom节点
     */
    private postHandleNode;
    /**
     * 预处理html保留字符 如 &nbsp;,&lt;等
     * @param str   待处理的字符串
     * @returns     解析之后的串
     */
    private preHandleText;
    /**
     * 产生dom key
     * @returns   dom key
     */
    private genKey;
}
