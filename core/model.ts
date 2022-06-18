import { ModelManager } from "./modelmanager";
import { Module } from "./module";
import { Util } from "./util";
/**
 * 模型类
 */
export class Model {
    /**
     * model key
     */
    public $key:number;

    /**
     * 监听器
     * 存储样式{
     *      $this: [listener1,listener2,...]，对象改变监听器,允许多个监听
     *      keyName: [listener1,listener2,...]，属性名监听器，允许多个监听
     * }
     */
    
    /**
     * @param data 		数据
     * @param module 	模块对象
     * @returns         模型代理对象
     */
    constructor(data: any, module?: Module) {
        //模型管理器
        let proxy = new Proxy(data, {
            set(src: any, key: string, value: any, receiver: any){
                //值未变,proxy 不处理
                if (src[key] === value) {
                    return true;
                }
                //不处理原型属性
                if (['__proto__'].includes(<string>key)) {
                    return true;
                }
                let ov = src[key];
                let r = Reflect.set(src, key, value, receiver); 
                //非对象，null，非model设置代理
                if(value && !value.$key && (value.constructor === Object)){
                    value = new Model(value,module);
                }
                ModelManager.update(receiver, key, ov, value);
                return r;
            },
            get(src: any, key: string | symbol, receiver){
                let res = Reflect.get(src, key, receiver);
                if(res && (res.constructor === Object || res.constructor === Array)){
                    if(res.$key){
                        return ModelManager.getModel(res.$key);
                    }else{ //未代理对象，需要创建模型
                        return new Model(res, module);
                    }  
                }
                return res;
            },
            deleteProperty(src: any, key: any){
                //如果删除对象且不为数组元素，从modelmanager中同步删除
                if (src[key]&& src[key].$key && !(Array.isArray(src)&& /^\d+$/.test(key))) {
                    ModelManager.delFromMap(src[key].$key);
                }
                let oldValue = src[key];
                delete src[key];
                ModelManager.update(src,key,oldValue,undefined);
                return true;
            }
        });

        for(let k of ['$watch','$unwatch','$get','$set']){
            proxy[k] = this[k];
        }
        proxy.$key = Util.genId();
        
        ModelManager.addToMap(data, proxy);
        //绑定到模块
        if(module){
            ModelManager.bindToModule(proxy,module);
        }

        if(Array.isArray(data)){
            this.arrayOverload(proxy);   
        }
        return proxy;
    }

    /**
     * 重载数组删除元素方法
     * 用于处理从数组中移除的model，从modelmap移除
     * @param data  数组
     */
    private arrayOverload(data){
        data.splice = function(){
            const count = arguments[1];
            let r = Array.prototype['splice'].apply(data,arguments);
            if(count > 0){
                for(let i=0;i<r.length;i++){
                    if(r[i].$key){
                        ModelManager.delFromMap(r[i].$key);
                        delete r[i].$key;
                    }
                }
            }
            return r;
        }
        data.shift = function(){
            let d = data[0];
            Array.prototype['shift'].apply(data);
            if(d && d.$key){
                ModelManager.delFromMap(d.$key);
                delete d.$key;
            }
            return d;
        }
        
        data.pop = function(){
            let d = data[data.length-1];
            Array.prototype['pop'].apply(data);
            if(d && d.$key){
                ModelManager.delFromMap(d.$key);
                delete d.$key;
            }
            return d;
        }
    }

    /**
     * 观察某个数据项
     * @param key       数据项名或数组
     * @param operate   数据项变化时执行方法
     * @param module    指定模块，如果指定，则表示该model绑定的所有module都会触发watch事件，在model父(模块)传子(模块)传递的是对象时会导致多个watch出发
     * @param deep      是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
     */
    public $watch(key: string|string[], operate: Function,module?:Module,deep?:boolean):Function {
        let mids = module?[module.id]:ModelManager.getModuleIds(this);
        //撤销watch数组，数据项为{m:model,k:监听属性,f:触发方法}
        let arr = [];
        if(Array.isArray(key)){
            for(let k of key){
                watchOne(this,k,operate);
            }
        }else{
            watchOne(this,key,operate);
        }

        //返回取消watch函数
        return ()=>{
            if(arr){
                for(let f of arr){
                    ModelManager.unwatch(f.m,f.k,f.f);
                }
            }
            //释放arr
            arr = null;
        }
        
        /**
         * 监听一个
         * @param model     当前model  
         * @param key       监听键
         * @param operate   操作方法
         * @returns 
         */
        function watchOne(model:Model,key:string,operate:Function){
            let index = -1;
            //如果带'.'，则只取最里面那个对象
            if ((index = key.lastIndexOf('.')) !== -1) {
                model = model.$get(key.substring(0, index));
                key = key.substring(index + 1);
            }
            if (!model) {
                return;
            }
            //添加到modelmanager watch
            ModelManager.watch(model,key,operate,mids);
            //添加到撤销数组
            arr.push({m:model,k:key,f:operate});
            //对象，监听整个对象
            if(deep && typeof model[key] === 'object'){
                for(let k of Object.keys(model[key])){
                    if(k !== '$key' && typeof model[key][k] !== 'function'){
                        watchOne(model[key],k,operate);
                    }
                }
            }
        }
    }

    /**
     * 查询子属性
     * @param key   子属性，可以分级，如 name.firstName
     * @returns     属性对应model proxy
     */
    $get(key: string) {
        let model: Model = this;
        if (key.indexOf('.') !== -1) {    //层级字段
            let arr = key.split('.');
            for (let i = 0; i < arr.length - 1; i++) {
                model = model[arr[i]];
                if (!model) {
                    break;
                }
            }
            if (!model) {
                return;
            }
            key = arr[arr.length - 1];
        }
        return model[key];
    }

    /**
     * 设置值
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     * @param module    需要绑定的新模块
     */
    $set(key:string,value:any,module?:Module){
        let model: Model = this;
        let mids = ModelManager.getModuleIds(this);
        if (key.indexOf('.') !== -1) {    //层级字段
            let arr = key.split('.');
            for (let i = 0; i < arr.length - 1; i++) {
                //不存在，则创建新的model
                if (!model[arr[i]]) {
                    let m = new Model({});
                    ModelManager.bindToModules(m,mids);
                    model[arr[i]] = m;
                }
                model = model[arr[i]];
            }
            key = arr[arr.length - 1];
        }
        //绑定model到模块
        if(typeof value === 'object' && module){
            ModelManager.bindToModule(value,module);
        }
        model[key] = value;
    }
}