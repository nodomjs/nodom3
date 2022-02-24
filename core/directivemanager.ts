import { DirectiveType } from "./directivetype";
/**
 * 指令管理器
 */
export  class DirectiveManager {
    /**
     * 指令映射
     */
    private static directiveTypes:Map<string,DirectiveType> = new Map();
    
    /**
     * 增加指令映射
     * @param name      指令类型名
     * @param handle    渲染处理函数
     * @param prio      类型优先级
     */
    public static addType(name:string,handle:Function,prio?:number) {
        this.directiveTypes.set(name, new DirectiveType(name,handle,prio));
    }

    /**
     * 移除指令映射
     * @param name  指令类型名
     */
    public static removeType(name:string) {
        this.directiveTypes.delete(name);
    }

    /**
     * 获取指令
     * @param name  指令类型名
     * @returns     指令类型或undefined
     */
    public static getType(name:string) {
        return this.directiveTypes.get(name);
    }

    /**
     * 是否含有某个指令
     * @param name  指令类型名
     * @returns     true/false
     */
    public static hasType(name:string) {
        return this.directiveTypes.has(name);
    }
}
