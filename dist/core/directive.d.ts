import { DirectiveType } from "./directivetype";
import { Module } from "./module";
import { Expression } from "./expression";
import { RenderedDom } from "./types";
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
    value: unknown;
    /**
     * 表达式
     */
    expression: Expression;
    /**
     * 禁用指令
     */
    disabled: boolean;
    /**
     * 模板所属模块id
     * @remarks
     * 使用该指令的模板对应的module id
     *
     * 下例中，`if`指令对应的templateModule 是`Main`模块，即`templateModuleId`是模块`Main`的id。
     * @example
     * ```js
     *  class Main extends Module{
     *      template(props){
     *          return `
     *              <div>
     *                  <Module1>
     *                      <div x-if={{r}}>yes</div>
     *                  </Module1>
     *              </div>
     *          `
     *      }
     *  }
     * ```
     */
    templateModuleId: number;
    /**
     * 构造方法
     * @param type -  	    类型名
     * @param value - 	    指令值
     * @param templateMid - 模板所属的module id
     */
    constructor(type?: string, value?: string | Expression, templateMid?: number);
    /**
     * 执行指令
     * @param module -  模块
     * @param dom -     渲染目标节点对象
     * @returns         是否继续渲染
     */
    exec(module: Module, dom: RenderedDom): boolean;
    /**
     * 克隆
     * @returns     新克隆的指令
     */
    clone(): Directive;
}
