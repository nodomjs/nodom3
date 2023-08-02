import { Module } from "./module";
/**
 * 模型类
 * 对数据做代理
 * 注意:数据对象中，以下5个属性名（保留字）不能用，可以通过data.__source的方式获取保留属性
 *      __source:源数据对象
 *      __key:模型的key
 *      __module:所属模块
 *      __parent:父模型
 *      __name:在父模型中的属性名
 */
export class Model {
    /**
     * @param data - 		数据
     * @param module - 	模块对象
     * @param parent -    父模型
     * @param name -      模型在父对象中的prop name
     * @returns         模型代理对象
     */
    constructor(data: object, module: Module, parent?:Model, name?:string) {
        //数据不存在或已经代理，无需再创建
        if(!data || data['__source']){
            return;
        }
        
        // 创建模型
        const proxy = new Proxy(data, {
            set(src: object, key: string, value: unknown, receiver: Model){
                let value1 = value;
                //proxy转换为源对象，否则比较会出错
                if(value && value['__source']){
                    const source = value['__source'];
                    // 已经被代理，但是可能没添加当前module
                    if(source){
                        //可能父传子，需要添加引用
                        if(value['__module'] !== module){
                            module.modelManager.add(source,value);
                            value['__module'].modelManager.bindModel(value,module);
                            //保存value在本模块中的属性名
                            module.modelManager.setModelName(value,key);
                        }
                        value1 = source;
                    }
                }
                //值未变,proxy 不处理
                if (src[key] === value1) {
                    return true;
                }
                const ov = src[key];
                const r = Reflect.set(src, key, value1, receiver);
                module.modelManager.update(receiver, key, ov, value);
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
                //只处理object和array
                if(res && (res.constructor === Object || res.constructor === Array)){
                    let m = module.modelManager.getModel(res);
                    if(!m){
                        m = new Model(res,module,receiver,key);
                    }
                    res = m;
                }
                return res;
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
    }
}