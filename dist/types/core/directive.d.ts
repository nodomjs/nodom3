import { DirectiveType } from "./directivetype";
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
     * 指令类型
     */
    type: DirectiveType;
    /**
     * 指令值
     */
    value: any;
    /**
     * 表达式
     */
    expression: Expression;
    /**
     * 禁用指令
     */
    disabled: boolean;
    /**
     * 指令参数
     */
    params: any;
    /**
     * 模板所属的module id，指令用于哪个模板，则该属性指向模板对应的模块id
     */
    templateModuleId: number;
    /**
     * 构造方法
     * @param type  	    类型名
     * @param value 	    指令值
     * @param templateMid   模板所属的module id，即指令用于哪个模板，则该参数指向模板对应的模块id
     */
    constructor(type?: string, value?: string | Expression, templateMid?: number);
    /**
     * 执行指令
     * @param module    模块
     * @param dom       渲染目标节点对象
     * @returns         true/false
     */
    exec(module: Module, dom: IRenderedDom): boolean;
    /**
     * 克隆
     */
    clone(): Directive;
}
