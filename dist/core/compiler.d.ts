import { Module } from './module';
import { VirtualDom } from './virtualdom';
/**
 * - 模板标签必须闭合
 */
/**
 * - 模板标签必须闭合
 */
export declare class Compiler {
    /**
     * 模块
     */
    private module;
    /**
     * 当前节点
     */
    private current;
    /**
     * 虚拟dom树
     */
    private domArr;
    /**
     * 文本节点
     */
    private textArr;
    /**
     * 是否是表达式文本节点
     */
    private isExprText;
    /**
     * 当前编译的模板 主要用于报错的时候定位
     */
    private template;
    /**
     * 根节点
     */
    private root;
    /**
     * 当前是否在svg区域
     */
    private isSvg;
    /**
     * 构造器
     * @param module -
     */
    constructor(module: Module);
    /**
     * 编译
     * @param elementStr -     待编译html串
     * @returns              虚拟dom
     */
    compile(elementStr: string): VirtualDom;
    /**
     * 产生dom key
     * @returns   dom key
     */
    private genKey;
    /**
     * 编译模板
     * @param srcStr - 	源串
     */
    private compileTemplate;
    /**
     * 处理开始标签
     * @param srcStr - 待编译字符串
     * @returns 编译处理后的字符串
     */
    private compileStartTag;
    /**
     * 处理标签属性
     * @param srcStr - 待编译字符串
     * @returns 编译后字符串
     */
    private compileAttributes;
    /**
     * 编译结束标签
     * @param srcStr - 	源串
     * @returns 		剩余的串
     */
    private compileEndTag;
    /**
     * 强制闭合
     * @param index - 在domArr中的索引号
     * @returns
     */
    private forceClose;
    /**
     * 编译text
     * @param srcStr - 	源串
     * @returns
     */
    private compileText;
    /**
     * 预处理html保留字符 如 &nbsp;,&lt;等
     * @param str -   待处理的字符串
     * @returns     解析之后的串
     */
    private preHandleText;
    /**
     * 处理当前节点是模块或者自定义节点
     * @param dom - 	虚拟dom节点
     */
    private postHandleNode;
    /**
     * 处理插槽
     * @param dom - 	虚拟dom节点
     */
    private handleSlot;
    /**
     * 标签闭合
     */
    private handleCloseTag;
    /**
     * 判断节点是否为空节点
     * @param dom -	带检测节点
     * @returns
     */
    private isVoidTab;
}
