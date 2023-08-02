import { Module } from "./module";
import { UnknownMethod } from "./types";

/**
 * NCache模块-存储在内存中
 */
export class NCache{
    /**
     * 缓存数据容器
     */
    private cacheData:object;

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
    private subscribeMap = new Map();
    
    constructor(){
        this.cacheData = {};
    }

    /**
     * 通过提供的键名从内存中拿到对应的值
     * @param key -   键，支持"."（多级数据分割）
     * @returns     值或undefined
     */
    public get(key:string){
        let p = this.cacheData;
        if(key.indexOf('.') !== -1){
            const arr = key.split('.');
            if(arr.length>1){
                for(let i=0;i<arr.length-1 && p;i++){
                    p = p[arr[i]];
                }
                if(p){
                    key = arr[arr.length-1];
                }
            }
        }
        if(p){
            return p[key];
        }
    }

    /**
     * 通过提供的键名和值将其存储在内存中
     * @param key -       键 
     * @param value -     值
     */
    public set(key:string,value:unknown){
        let p = this.cacheData;
        const key1 = key;
        if(key.indexOf('.') !== -1){
            const arr = key.split('.');
            if(arr.length>1){
                for(let i=0;i<arr.length-1;i++){
                    if(!p[arr[i]] || typeof p[arr[i]] !== 'object'){
                        p[arr[i]] = {};
                    }
                    p = p[arr[i]];        
                }
                key = arr[arr.length-1];
            }
        }
        
        if(p){
            p[key] = value;
        }

        //处理订阅
        if(this.subscribeMap.has(key1)){
            const arr = this.subscribeMap.get(key1);
            for(const a of arr){
                this.invokeSubscribe(a.module,a.handler,value);
            }
        }
    }

    /**
     * 通过提供的键名将其移除
     * @param key -   键 
     */
    public remove(key:string){
        let p = this.cacheData;
        if(key.indexOf('.') !== -1){
            const arr = key.split('.');
            if(arr.length>1){
                for(let i=0;i<arr.length-1 && p;i++){
                    p = p[arr[i]];
                }
                if(p){
                    key = arr[arr.length-1];
                }
            }
        }
        
        if(p){
            delete p[key];
        }       
    }
    /**
     * 订阅
     * @param module -    订阅的模块
     * @param key -       字段key
     * @param handler -   回调函数 参数为key对应value 
     */
    public subscribe(module:Module,key:string,handler:string|UnknownMethod){
        if(!this.subscribeMap.has(key)){
            this.subscribeMap.set(key,[{module:module,handler:handler}]);
        }else{
            const arr = this.subscribeMap.get(key);
            if(!arr.find(item=>item.module === module && item.handler === handler)){
                arr.push({module:module,handler:handler});
            }
        }
        //如果存在值，则执行订阅回调
        const v = this.get(key);
        if(v){
            this.invokeSubscribe(module,handler,v);
        }
    }

    /**
     * 调用订阅方法
     * @param module -    模块
     * @param foo -       方法或方法名
     * @param v -         值
     * 
     * @internal
     */
    private invokeSubscribe(module:Module,foo:string|UnknownMethod,v:unknown){
        if(typeof foo === 'string'){
            module.invokeMethod(<string>foo,v);
        }else{
            foo.call(module,v);
        }
    }
}