import { Module } from "./module";
/**
 * 模型类
 * 
 * @remarks
 * 模型就是对数据做代理
 * 
 * 注意：数据对象中，以下5个属性名（保留字）不能用，可以通过如：`model.__source`的方式获取保留属性
 * 
 *      __source:源数据对象
 * 
 *      __key:模型的key
 * 
 *      __module:所属模块
 * 
 *      __parent:父模型
 * 
 *      __name:在父模型中的属性名
 * 
 */
export class Model {
    /**
     * @param data -    数据
     * @param module - 	模块对象
     * @param parent -  父模型
     * @param name -    模型在父对象中的prop name
     * @returns         模型
     */
    constructor(data: object, module: Module, parent?:Model, name?:string) {
        //数据不存在或已经代理，无需再创建
        if(!data || data['__source']){
            return data;
        }
        // 创建模型
        const proxy = new Proxy(data, {
            set(src: object, key: string, value: unknown, receiver: Model){
                const value1 = preHandle(value,module,receiver,key,false);
                //值未变,proxy 不处理
                if (src[key] === value1) {
                    return true;
                }
                const ov = src[key];
                const r = Reflect.set(src, key, value1, receiver);
                module.modelManager.update(receiver, key, ov, value1);
                return r;
            },
            get(src: object, key: string, receiver){
                //如果为代理，则返回源数据
                if(key === '__source'){
                    return receiver?src:undefined;
                }
                //如果为代理，则返回module
                if(key === '__module'){
                    return receiver?module:undefined;
                }
                //如果为代理，则返回key
                if(key === '__key'){
                    return receiver?module.modelManager.getModelKey(src):undefined;
                }
                //父模型
                if(key === '__parent'){
                    return parent;
                }

                if(key === '__name'){
                    return name;
                }

                let res = Reflect.get(src, key, receiver);
                return preHandle(res,module,receiver,key,true);
            },
            deleteProperty(src: object, key: string){
                const oldValue = src[key];
                delete src[key];
                module.modelManager.update(proxy,key,oldValue,undefined);
                return true;
            }
        });
        module.modelManager.add(data,proxy);
        return proxy;

        /**
         * 预处理
         * 当data为model且源module与当前module不一致时，需要绑定到新module
         * @param data -    数据对象或model
         * @param module-   新模块
         * @param parent -  父对象
         * @param key-      父对象中的名字
         * @param force-    如果data不为model，是否转为model
         * @returns         数据对象
         */
        function preHandle(data,module:Module,parent,key,force?:boolean){
            if(!data || (data.constructor !== Object && data.constructor !== Array)){
                return data;
            }
            const oldMdl = data['__module'];
            //未代理
            if(!oldMdl){
                if(!force){
                    return data;
                }
                return new Model(data,module,parent,key);
            }
            if(oldMdl !== module){  //目标模块不一致，需要处理绑定和model.__name
                module.modelManager.add(data['__source'],data);
                oldMdl.modelManager.bindModel(data,module);
                //名字不一致，需要在module中保存
                if(key && key !== data['__name']){
                    module.modelManager.setModelName(data,key);
                }
            }
            return data;
        }
    }
}