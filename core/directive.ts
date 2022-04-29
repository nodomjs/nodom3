import { DirectiveManager } from "./directivemanager";
import { DirectiveType } from "./directivetype";
import { Module } from "./module";
import { Util } from "./util";
import { Expression } from "./expression";
import { NError } from "./error";
import { NodomMessage } from "./nodom";
import { IRenderedDom } from "./types";

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
    public value:any;
    
    /**
     * 表达式
     */
    public expression:Expression;

    /**
     * 禁用指令
     */
    public disabled:boolean;

    /**
     * 指令参数
     */
    public params:any;
    /**
     * 构造方法
     * @param type  	类型名
     * @param value 	指令值
     */
    constructor(type?:string,value?:string|Expression) {
        this.id = Util.genId();
        if(type){
            this.type = DirectiveManager.getType(type);
            if(!this.type){
                throw new NError('notexist1',NodomMessage.TipWords['directive'],type);
            }
        }
        
        if (Util.isString(value)) {
            this.value = (<string>value).trim();
        }else if(value instanceof Expression){
            this.expression = value;
        }else{
            this.value = value;
        }
    }

    /**
     * 执行指令
     * @param module    模块
     * @param dom       渲染目标节点对象
     * @returns         true/false
     */
    public exec(module:Module,dom:IRenderedDom):boolean {
        //禁用，不执行
        if(this.disabled){
            return true;
        }
        if(this.expression){
            this.value = this.expression.val(module,dom.model);
        }
        return this.type.handle.apply(this,[module,dom]);
    }

    /**
     * 克隆
     */
    public clone():Directive{
        let d = new Directive();
        d.type = this.type;
        d.expression = this.expression;
        d.value = this.value;
        return d;
    }
}
