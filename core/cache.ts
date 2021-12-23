import { Module } from "./module";

/**
 * 存储
 */
export class NCache{
    private cacheData:any;
    /**
     * 订阅map，格式为 {key:[{module:订阅模块,handler:},...]}
     */
    private subscribeMap = new Map();
    
    constructor(){
        this.cacheData = {};
    }

    /**
     * 从cache
     * @param key   键，支持"."
     * @reutrns     值或undefined
     */
    public get(key:string){
        let p = this.cacheData;
        if(key.indexOf('.') !== -1){
            let arr = key.split('.');
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
     * 保存值
     * @param key       键 
     * @param value     值
     */
    public set(key:string,value:any){
        let p = this.cacheData;
        let key1 = key;
        if(key.indexOf('.') !== -1){
            let arr = key.split('.');
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
            let arr = this.subscribeMap.get(key1);
            for(let a of arr){
                this.invokeSubscribe(a.module,a.handler,value);
            }
        }
    }

    /**
     * 移除键
     * @param key   键 
     */
    public remove(key:string){
        let p = this.cacheData;
        if(key.indexOf('.') !== -1){
            let arr = key.split('.');
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
     * @param module    订阅的模块
     * @param key       字段key
     * @param handler   回调函数 参数为key对应value 
     */
    public subscribe(module:Module,key:string,handler:Function|string){
        if(!this.subscribeMap.has(key)){
            this.subscribeMap.set(key,[{module:module,handler:handler}]);
        }else{
            let arr = this.subscribeMap.get(key);
            if(!arr.find(item=>item.module === module && item.handler === handler)){
                arr.push({module:module,handler:handler});
            }
        }
        //如果存在值，则执行订阅回调
        let v = this.get(key);
        if(v){
            this.invokeSubscribe(module,handler,v);
        }
    }

    /**
     * 调用订阅方法
     * @param module    模块
     * @param foo       方法或方法名
     * @param v         值
     */
    private invokeSubscribe(module:Module,foo:Function|string,v:any){
        if(typeof foo === 'string'){
            module.invokeMethod(<string>foo,v);
        }else{
            foo.call(module,v);
        }
    }
}