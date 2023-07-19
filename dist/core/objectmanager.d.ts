import { NCache } from "./cache";
import { Module } from "./module";
/**
 * 对象管理器，用于存储模块的内存变量
 * 默认属性集
 *  $events     事件集
 *  $domparam   dom参数
 */
export declare class ObjectManager {
    /**
     * NCache
     */
    cache: NCache;
    /**
     * 模块
     */
    module: Module;
    /**
     * module   模块
     * @param module
     */
    constructor(module: Module);
    /**
     * 保存到cache
     * @param key       键，支持"."（多级数据分割）
     * @param value     值
     */
    set(key: string, value: any): void;
    /**
     * 从cache读取
     * @param key   键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    get(key: string): any;
    /**
     * 从cache移除
     * @param key   键，支持"."（多级数据分割）
     */
    remove(key: string): void;
    /**
     * 设置事件参数
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     * @param value     参数值
     */
    setEventParam(id: number, key: number, name: string, value: any): void;
    /**
     * 获取事件参数值
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     * @returns         参数值
     */
    getEventParam(id: number, key: number, name: string): any;
    /**
     * 移除事件参数
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     */
    removeEventParam(id: number, key: number, name: string): void;
    /**
     * 清空事件参数
     * @param id        事件id
     * @param key       dom key
     */
    clearEventParams(id: number, key?: number): void;
    /**
     * 设置dom参数值
     * @param key       dom key
     * @param name      参数名
     * @param value     参数值
     */
    setDomParam(key: number, name: string, value: any): void;
    /**
     * 获取dom参数值
     * @param key       dom key
     * @param name      参数名
     * @returns         参数值
     */
    getDomParam(key: number, name: string): any;
    /**
     * 移除dom参数值
     * @param key       dom key
     * @param name      参数名
     */
    removeDomParam(key: number, name: string): void;
    /**
     * 清除element 参数集
     * @param key   dom key
     */
    clearDomParams(key: number): void;
    /**
     * 清除缓存dom对象集
     */
    clearAllDomParams(): void;
}
