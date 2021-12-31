/**
 * 指令类
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
     * 渲染时执行方法
     */
    handle: Function;
    /**
     * 构造方法
     * @param name      指令类型名
     * @param handle    渲染时执行方法
     * @param prio      类型优先级
     */
    constructor(name: string, handle: Function, prio?: number);
}
