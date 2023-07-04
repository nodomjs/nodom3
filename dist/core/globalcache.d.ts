import { Module } from "./module";
/**
 * 全局缓存
 */
export declare class GlobalCache {
    private static cache;
    /**
     * 保存到cache
     * @param key       键，支持"."（多级数据分割）
     * @param value     值
     */
    static set(key: string, value: any): void;
    /**
     * 从cache读取
     * @param key   键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    static get(key: any): any;
    /**
     * 订阅
     * @param module    订阅的模块
     * @param key       字段key
     * @param handler   回调函数 参数为key对应value
     */
    static subscribe(module: Module, key: string, handler: Function): void;
    /**
     * 从cache移除
     * @param key   键，支持"."（多级数据分割）
     */
    static remove(key: any): void;
}
