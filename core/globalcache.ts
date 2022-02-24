import { NCache } from "./cache";
import { Module } from "./module";

/**
 * 全局缓存
 */
export class GlobalCache{
    //NCache实例
    private static cache:NCache = new NCache();

    /**
     * 保存到cache
     * @param key       键，支持"."（多级数据分割）
     * @param value     值
     */
    public static set(key:string,value:any){
        this.cache.set(key,value);
    }

    /**
     * 从cache读取
     * @param key   键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    public static get(key){
        return this.cache.get(key);
    }

    /**
     * 订阅
     * @param module    订阅的模块
     * @param key       字段key
     * @param handler   回调函数 参数为key对应value
     */
    public static subscribe(module:Module,key:string,handler:Function){
        this.cache.subscribe(module,key,handler);
    }

    /**
     * 从cache移除
     * @param key   键，支持"."（多级数据分割）
     */
    public static remove(key){
        this.cache.remove(key);
    }

}