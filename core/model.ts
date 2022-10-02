import { ModelManager } from "./modelmanager";
import { Module } from "./module";
import { Util } from "./util";
/**
 * 模型类
 * 对数据做代理
 * 警告：___source属性为保留属性，用户不要使用
 * 通过___source属性可以获取代理对象源数据对象
 */
export class Model {
    /**
     * @param data 		数据
     * @param module 	模块对象
     * @returns         模型代理对象
     */
    constructor(data: any, module?: Module) {
        if(!data){
            return;
        }
        let proxy;
        if(data.___source){
            proxy = data;
        }else {
            //模型管理器
            proxy = new Proxy(data, {
                set(src: any, key: string, value: any, receiver: any){
                    //proxy转换为源对象
                    if(value !== null && typeof value === 'object'){
                        value = value.___source || value;
                    }
                    //值未变,proxy 不处理
                    if (src[key] === value) {
                        return true;
                    }
                    let ov = src[key];
                    let r = Reflect.set(src, key, value, receiver);
                    ModelManager.update(receiver, key, ov, value);
                    return r;
                },
                get(src: any, key: string | symbol, receiver){
                    if(key === '___source'){
                        return src;
                    }
                    let res = Reflect.get(src, key, receiver);
                    if(res && (res.constructor === Object || res.constructor === Array)){
                        let m = ModelManager.getModel(res,receiver);
                        if(!m){
                            m = new Model(res,receiver);
                            ModelManager.add(res,m,receiver);
                        }
                        res = m;
                    }
                    return res;
                },
                deleteProperty(src: any, key: any){
                    let oldValue = src[key];
                    delete src[key];
                    ModelManager.update(ModelManager.getModel(src),key,oldValue,undefined);
                    return true;
                }
            });
            ModelManager.add(data,proxy);
        }
        
        if(module){
            ModelManager.bindToModule(proxy,module,data.___source!==undefined);
        }
        return proxy;
    }
}