import { Model } from "./model";
import { Module } from "./module";
/**
 * 表达式类
 * 表达式中的特殊符号
 *  this:指向渲染的module
 *  $model:指向当前dom的model
 */
export declare class Expression {
    /**
      * 表达式id
      */
    id: number;
    /**
     * 执行函数
     */
    execFunc: Function;
    /**
     * 源表达式串
     */
    exprStr: string;
    /**
     * 值
     */
    value: any;
    /**
     * @param exprStr	表达式串
     */
    constructor(exprStr: string, module?: Module);
    /**
     * 编译表达式串，替换字段和方法
     * @param exprStr   表达式串
     * @returns         编译后的表达式串
     */
    private compile;
    /**
     * 表达式计算
     * @param module    模块
     * @param model 	模型
     * @returns 		计算结果
     */
    val(module: Module, model: Model): any;
}
