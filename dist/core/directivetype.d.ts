import { DirectiveMethod } from "./types";
/**
 * 指令类型
 */
export declare class DirectiveType {
    /**
     * 指令类型名
     */
    name: string;
    /**
     * 优先级，越小优先级越高
     */
    prio: number;
    /**
     * 渲染时执行函数
     */
    handler: DirectiveMethod;
    /**
     * 构造方法
     * @param name -    指令类型名
     * @param handle -  渲染时执行方法
     * @param prio -    类型优先级
     */
    constructor(name: string, handler: DirectiveMethod, prio?: number);
}
