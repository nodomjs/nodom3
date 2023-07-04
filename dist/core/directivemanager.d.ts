import { DirectiveType } from "./directivetype";
/**
 * 指令管理器
 */
export declare class DirectiveManager {
    /**
     * 指令映射
     */
    private static directiveTypes;
    /**
     * 增加指令映射
     * @param name      指令类型名
     * @param handle    渲染处理函数
     * @param prio      类型优先级
     */
    static addType(name: string, handle: Function, prio?: number): void;
    /**
     * 移除指令映射
     * @param name  指令类型名
     */
    static removeType(name: string): void;
    /**
     * 获取指令
     * @param name  指令类型名
     * @returns     指令类型或undefined
     */
    static getType(name: string): DirectiveType;
    /**
     * 是否含有某个指令
     * @param name  指令类型名
     * @returns     true/false
     */
    static hasType(name: string): boolean;
}
