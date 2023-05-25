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
     * 产生dom key
     * @returns   dom key
     */
    private genKey;
    /**
     * 编译模板
     * @param srcStr 	源串
     */
    private compileTemplate;
    /**
     * 处理开始节点
     * @param srcStr 待编译字符串
     * @returns 编译处理后的字符串
     */
    private compileStartTag;
    /**
     * 处理标签属性
     * @param srcStr 待编译字符串
     * @returns 编译后字符串
     */
    private compileAttributes;
    /**
     * 处理结束标签
     * @param srcStr 待编译字符串
     * @returns 编译后字符串
     */
    private compileEndTag;
    /**
     * 编译text
     * @param srcStr 	源串
     * @returns
     */
    private compileText;
    /**
     * 预处理html保留字符 如 &nbsp;,&lt;等
     * @param str   待处理的字符串
     * @returns     解析之后的串
     */
    private preHandleText;
    /**
     * 处理当前节点是模块或者自定义节点
     */
    private postHandleNode;
    /**
     * 处理插槽
     */
    private handleSlot;
    /**
     * 处理闭合节点
     */
    private handleCloseTag;
    /**
     * 处理自闭合节点
     */
    private handleSelfClosingTag;
    /**
     * 如有闭合标签没有匹配到任何开始标签 给用户警告
     * @param name 标签名
     * @param srcStr 剩余模板字符串
     */
    private warnEndTagNotMatch;
    /**
     * 当前节点没有闭合给用户输出警告
     * @param dom 节点
     */
    private warnStartTagNotClose;
    /**
     * 判断节点是都是空节点
     * @param dom
     * @returns
     */
    private isVoidTag;
}
