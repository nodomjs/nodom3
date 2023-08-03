import { DirectiveManager } from "./directivemanager";
import { DirectiveType } from "./directivetype";
import { Module } from "./module";
import { Util } from "./util";
import { Expression } from "./expression";
import { NError } from "./error";
import { NodomMessage } from "./nodom";
import { RenderedDom } from "./types";

/**
 * 指令类
 */
export  class Directive {
    /**
     * 指令id
     */
    public id:number;

    /**
     * 指令类型
     */
    public type:DirectiveType;
    
    /**
     * 指令值
     */
    public value:unknown;
    
    /**
     * 表达式
     */
    public expression:Expression;

    /**
     * 禁用指令
     */
    public disabled:boolean;

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
    public templateModuleId:number;

    /**
     * 构造方法
     * @param type -  	    类型名
     * @param value - 	    指令值
     * @param templateMid - 模板所属的module id
     */
    constructor(type?:string,value?:string|Expression,templateMid?:number) {
        this.id = Util.genId();
        if(type){
            this.type = DirectiveManager.getType(type);
            if(!this.type){
                throw new NError('notexist1',[NodomMessage.TipWords['directive'],type]);
            }
        }
        if (typeof value === 'string') {
            this.value = (<string>value).trim();
        }else if(value instanceof Expression){
            this.expression = value;
        }else{
            this.value = value;
        }
        this.templateModuleId = templateMid;
    }

    /**
     * 执行指令
     * @param module -  模块
     * @param dom -     渲染目标节点对象
     * @returns         是否继续渲染
     */
    public exec(module:Module,dom:RenderedDom):boolean {
        //禁用，不执行
        if(this.disabled){
            return true;
        }
        if(this.expression){
            this.value = this.expression.val(module,dom.model);
        }
        return this.type.handler.apply(this,[module,dom]);
    }

    /**
     * 克隆
     * @returns     新克隆的指令
     */
    public clone():Directive{
        const d = new Directive();
        d.type = this.type;
        d.expression = this.expression;
        d.value = this.value;
        d.templateModuleId = this.templateModuleId;
        return d;
    }
}
