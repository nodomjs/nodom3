import { NCache } from "./cache";
import { Directive } from "./directive";
import { VirtualDom } from "./virtualdom";
import { NEvent } from "./event";
import { Expression } from "./expression";
import { GlobalCache } from "./globalcache";
import { Module } from "./module";
import { IRenderedDom } from "./types";

/**
 * 指令管理器
 * $directives  指令集
 * $expressions 表达式集
 * $events      事件集
 * $savedoms    dom相关缓存 包括 html dom 和 参数
 * $doms        渲染树
 */
export  class ObjectManager {
    /**
     * NCache
     */
    public cache:NCache;

    /**
     * 模块
     */
    public module:Module;

    /**
     * module   模块
     * @param module 
     */
    constructor(module:Module){
        this.module = module;
        this.cache = new NCache();
    }

    /**
     * 保存到cache
     * @param key       键，支持"."（多级数据分割）
     * @param value     值
     */
     public set(key:string,value:any){
        this.cache.set(key,value);
    }

    /**
     * 从cache读取
     * @param key   键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    public get(key){
        return this.cache.get(key);
    }

    /**
     * 从cache移除
     * @param key   键，支持"."（多级数据分割）
     */
    public remove(key){
        this.cache.remove(key);
    }

    /**
     * 设置事件参数
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名  
     * @param value     参数值
     */
    public setEventParam(id:number,key:String,name:string,value:any){
        this.cache.set('$events.' + id + '.$params.' + key + '.' + name,value);
    }

    /**
     * 获取事件参数值
     * @param id        事件id
     * @param key       dom key 
     * @param name      参数名
     * @returns         参数值
     */
    public getEventParam(id:number,key:string,name:string){
        return this.get('$events.' + id + '.$params.' + key + '.' + name);
    }

    /**
     * 移除事件参数
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     */
    public removeEventParam(id:number,key:string,name:string){
        this.remove('$events.' + id + '.$params.' + key + '.' + name);
    }

    /**
     * 清空事件参数
     * @param id        事件id
     * @param key       dom key 
     */
    public clearEventParam(id:number,key?:string){
        if(key){    //删除对应dom的事件参数
            this.remove('$events.' + id + '.$params.' + key);    
        }else{      //删除所有事件参数
            this.remove('$events.' + id + '.$params');
        }
    }

    /**
     * 设置dom参数值
     * @param key       dom key 
     * @param name      参数名
     * @param value     参数值
     */
    public setDomParam(key:string,name:string,value:any){
        this.set('$domparam.' + key + '.' + name ,value);
    }

    /**
     * 获取dom参数值
     * @param key       dom key
     * @param name      参数名
     * @returns         参数值
     */
    public getDomParam(key:string,name:string):any{
        return this.get('$domparam.' + key + '.' + name);
    }

    /**
     * 移除dom参数值
     * @param key       dom key
     * @param name      参数名
     */
    public removeDomParam(key:string,name:string){
        this.remove('$domparam.' + key + '.' + name);
    }

    /**
     * 清除element 参数集
     * @param key   dom key
     */
    public clearDomParams(key:string){
        this.remove('$domparam.' + key);
    }
    
    /**
     * 清除缓存dom对象集
     */
    public clearAllDomParams(){
        this.remove('$domparam');
    }
}
