import { Module } from "./module";
/**
 * NCache模块-存储在内存中
 */
export declare class NCache {
    private cacheData;
    /**
     * 订阅map，格式为 {key:[{module:订阅模块,handler:},...]}
     */
    private subscribeMap;
    constructor();
    /**
     * 通过提供的键名从内存中拿到对应的值
     * @param key   键，支持"."（多级数据分割）
     * @reutrns     值或undefined
     */
    get(key: string): any;
    /**
     * 通过提供的键名和值将其存储在内存中
     * @param key       键
     * @param value     值
     */
    set(key: string, value: any): void;
    /**
     * 通过提供的键名将其移除
     * @param key   键
     */
    remove(key: string): void;
    /**
     * 订阅
     * @param module    订阅的模块
     * @param key       字段key
     * @param handler   回调函数 参数为key对应value
     */
    subscribe(module: Module, key: string, handler: Function | string): void;
    /**
     * 调用订阅方法
     * @param module    模块
     * @param foo       方法或方法名
     * @param v         值
     */
    private invokeSubscribe;
}
