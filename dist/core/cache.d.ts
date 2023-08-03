import { Module } from "./module";
/**
 * 缓存模块
 */
export declare class NCache {
    /**
     * 缓存数据容器
     */
    private cacheData;
    /**
     * 订阅map，格式为
     * ```js
     * {
     *  key:[{
     *      module:订阅模块,
     *      handler:回调钩子
     * },...]}
     * ```
     */
    private subscribeMap;
    /**
     * 通过提供的键名从内存中拿到对应的值
     * @param key - 键，支持"."（多级数据分割）
     * @returns     值或undefined
     */
    get(key: string): any;
    /**
     * 通过提供的键名和值将其存储在内存中
     * @param key -     键
     * @param value -   值
     */
    set(key: string, value: unknown): void;
    /**
     * 通过提供的键名将其移除
     * @param key -   键
     */
    remove(key: string): void;
    /**
     * 订阅
     * @param module -    订阅的模块
     * @param key -       订阅的属性名
     * @param handler -   回调函数或方法名（方法属于module），方法传递参数为订阅属性名对应的值
     */
    subscribe(module: Module, key: string, handler: string | ((value: any) => void)): void;
    /**
     * 调用订阅方法
     * @param module -  模块
     * @param foo -     方法或方法名
     * @param v -       值
     */
    private invokeSubscribe;
}
