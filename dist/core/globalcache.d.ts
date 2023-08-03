import { Module } from "./module";
/**
 * 全局缓存
 *
 * @remarks
 * 用于所有模块共享数据，实现模块通信
 */
export declare class GlobalCache {
    /**
     * NCache实例，用于存放缓存对象
     */
    private static cache;
    /**
     * 保存到cache
     * @param key -     键，支持"."（多级数据分割）
     * @param value -   值
     */
    static set(key: string, value: unknown): void;
    /**
     * 从cache读取
     * @param key - 键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    static get(key: any): unknown;
    /**
     * 订阅
     *
     * @remarks
     * 如果订阅的数据发生改变，则会触发handler
     *
     * @param module -    订阅的模块
     * @param key -       订阅的属性名
     * @param handler -   回调函数或方法名（方法属于module），方法传递参数为订阅属性名对应的值
     */
    static subscribe(module: Module, key: string, handler: string | ((value: any) => void)): void;
    /**
     * 从cache移除
     * @param key -   键，支持"."（多级数据分割）
     */
    static remove(key: any): void;
}
