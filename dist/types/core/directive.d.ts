import { DirectiveType } from "./directivetype";
import { VirtualDom } from "./virtualdom";
import { Module } from "./module";
import { Expression } from "./expression";
import { IRenderedDom } from "./types";
/**
 * 指令类
 */
export declare class Directive {
    /**
     * 指令id
     */
    id: number;
    /**
     * 指令类型，指令管理器中定义
     */
    type: DirectiveType;
    /**
     * 指令值
     */
    value: any;
    /**
     * 表达式id
     */
    expression: Expression;
    /**
     * 禁用
     */
    disabled: boolean;
    /**
     * 构造方法
     * @param type  	类型名
     * @param value 	指令值
     */
    constructor(type?: string, value?: string | Expression);
    /**
     * 执行指令
     * @param module    模块
     * @param dom       渲染目标节点对象
     * @param src       源节点
     * @returns         true/false
     */
    exec(module: Module, dom: IRenderedDom, src: VirtualDom): boolean;
    /**
     * 克隆
     */
    clone(): Directive;
}
