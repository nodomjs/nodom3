import { DirectiveMethod } from "./types";

/**
 * 指令类型
 */
export  class DirectiveType {
    /**
     * 指令类型名
     */
    public name:string;
    
    /**
     * 优先级，越小优先级越高
     */
    public prio:number;

    /**
     * 渲染时执行函数
     */
    public handler:DirectiveMethod;
    
    /**
     * 构造方法
     * @param name -    指令类型名       
     * @param handle -  渲染时执行方法
     * @param prio -    类型优先级
     */ 
    constructor(name:string,handler:DirectiveMethod, prio?:number) {
        this.name = name;
        this.prio = prio>=0?prio:10;
        this.handler = handler;
    }
}
