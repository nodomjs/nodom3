import { Module } from "./module";
/**
 * 过滤器工厂，存储模块过滤器
 */
export declare class ModuleFactory {
    /**
     * 模块对象集合 {moduleId:模块对象}}
     */
    private static modules;
    /**
     * 模块类集合 {className:模块类}
     */
    static classes: Map<string, Module>;
    /**
     * 别名map
     * key:     别名
     * value:   类名
     */
    static aliasMap: Map<string, string>;
    /**
     * 主模块
     */
    private static mainModule;
    /**
     * 添加模块到工厂
     * @param item  模块对象
     */
    static add(item: Module): void;
    /**
     * 获得模块
     * @param name  类或实例id
     */
    static get(name: any): Module;
    /**
     * 是否存在模块类
     * @param clazzName     模块类名
     * @returns     true/false
     */
    static hasClass(clazzName: string): boolean;
    /**
     * 添加模块类
     * @param clazz     模块类
     * @param alias     注册别名
     */
    static addClass(clazz: any, alias?: string): void;
    /**
     * 获取模块类
     * @param name  类名或别名
     * @returns     模块类
     */
    static getClass(name: string): any;
    /**
     * 装载module
     * @param modulePath    模块类路径
     * @return              模块类
     */
    static load(modulePath: string): Promise<any>;
    /**
     * 从工厂移除模块
     * @param id    模块id
     */
    static remove(id: number): void;
    /**
     * 设置主模块
     * @param m 	模块
     */
    static setMain(m: Module): void;
    /**
     * 获取主模块
     * @returns 	应用的主模块
     */
    static getMain(): Module;
}