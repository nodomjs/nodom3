import { ModelManager } from "./modelmanager";
import { Util } from "./util";
/**
 * 模型类
 */
export class Model {
    /**
     * @param data 		数据
     * @param module 	模块对象
     * @returns         模型代理对象
     */
    constructor(data, module) {
        //模型管理器
        let proxy = new Proxy(data, {
            set(src, key, value, receiver) {
                //值未变,proxy 不处理
                if (src[key] === value) {
                    return true;
                }
                //不处理原型属性
                if (['__proto__'].includes(key)) {
                    return true;
                }
                let ov = src[key];
                let r = Reflect.set(src, key, value, receiver);
                //非对象，null，非model更新渲染
                if (value && typeof value === 'object' && !value.$key) {
                    value = new Model(value, module);
                }
                ModelManager.update(receiver, key, ov, value);
                return r;
            },
            get(src, key, receiver) {
                let res = Reflect.get(src, key, receiver);
                if (res && typeof res === 'object') {
                    if (res.$key) {
                        return ModelManager.getModel(res.$key);
                    }
                    else { //未代理对象，需要创建模型
                        return new Model(res, module);
                    }
                }
                return res;
            },
            deleteProperty(src, key) {
                //如果删除对象且不为数组元素，从modelmanager中同步删除
                if (src[key] && src[key].$key && !(Array.isArray(src) && typeof key === 'number')) {
                    ModelManager.delFromMap(src[key].$key);
                }
                delete src[key];
                ModelManager.update(src, key, null, null, true);
                return true;
            }
        });
        for (let k of ['$watch', '$unwatch', '$get', '$set']) {
            proxy[k] = this[k];
        }
        proxy.$key = Util.genId();
        ModelManager.addToMap(data, proxy);
        //绑定到模块
        if (module) {
            ModelManager.bindToModule(proxy, module);
        }
        if (Array.isArray(data)) {
            this.arrayOverload(proxy);
        }
        return proxy;
    }
    /**
     * 重载数组删除元素方法
     * @param data  数组
     */
    arrayOverload(data) {
        data.splice = function () {
            const index = arguments[0];
            const count = arguments[1];
            if (count > 0) {
                for (let i = index, len = index + count; i < len; i++) {
                    if (data[i] && data[i].$key) {
                        ModelManager.delFromMap(data[i].$key);
                    }
                }
            }
            Array.prototype['splice'].apply(data, arguments);
        };
        data.shift = function () {
            if (data[0] && data[0].$key) {
                ModelManager.delFromMap(data[0].$key);
            }
            Array.prototype['unshift'].apply(data, arguments);
        };
        data.pop = function () {
            const d = data[data.length - 1];
            if (d && d.$key) {
                ModelManager.delFromMap(d.$key);
            }
            Array.prototype['pop'].apply(data, arguments);
        };
    }
    /**
     * 观察(取消观察)某个数据项
     * @param key       数据项名或数组
     * @param operate   数据项变化时执行方法名(在module的methods中定义)
     */
    $watch(key, operate) {
        let mids = ModelManager.getModuleIds(this);
        let arr = [];
        if (Array.isArray(key)) {
            for (let k of key) {
                watchOne(this, k, operate);
            }
        }
        else {
            watchOne(this, key, operate);
        }
        //返回取消watch函数
        return () => {
            for (let f of arr) {
                const foos = f.m.$watchers[f.k];
                if (foos) {
                    for (let i = 0; i < foos.length; i++) {
                        //方法相同则撤销watch
                        if (foos[i].f === f.f) {
                            foos.splice(i, 1);
                            if (foos.length === 0) {
                                delete f.m.$watchers[f.k];
                            }
                        }
                    }
                }
            }
            //释放arr
            arr = null;
        };
        function watchOne(model, key, operate) {
            let index = -1;
            //如果带'.'，则只取最里面那个对象
            if ((index = key.lastIndexOf('.')) !== -1) {
                model = this.$get(key.substr(0, index));
                key = key.substr(index + 1);
            }
            if (!model) {
                return;
            }
            const listener = { modules: mids, f: operate };
            //对象，监听整个对象
            if (typeof model[key] === 'object') {
                model = model[key];
                if (!model.$watchers) {
                    model.$watchers = {};
                }
                if (!model.$watchers.$this) {
                    model.$watchers.$this = [listener];
                }
                else {
                    model.$watchers.$this.push(listener);
                }
                //保存用于撤销watch
                arr.push({ m: model, k: '$this', f: operate });
            }
            else { //否则监听属性
                if (!model.$watchers) {
                    model.$watchers = {};
                }
                if (!model.$watchers[key]) {
                    model.$watchers[key] = [listener];
                }
                else {
                    model.$watchers[key].push(listener);
                }
                //保存用于撤销watch
                arr.push({ m: model, k: key, f: operate });
            }
        }
    }
    /**
     * 查询子属性
     * @param key   子属性，可以分级，如 name.firstName
     * @returns     属性对应model proxy
     */
    $get(key) {
        let model = this;
        if (key.indexOf('.') !== -1) { //层级字段
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
    $set(key, value, module) {
        let model = this;
        let mids = ModelManager.getModuleIds(this);
        if (key.indexOf('.') !== -1) { //层级字段
            let arr = key.split('.');
            for (let i = 0; i < arr.length - 1; i++) {
                //不存在，则创建新的model
                if (!model[arr[i]]) {
                    let m = new Model({});
                    ModelManager.bindToModules(m, mids);
                    model[arr[i]] = m;
                }
                model = model[arr[i]];
            }
            key = arr[arr.length - 1];
        }
        //绑定model到模块
        if (typeof value === 'object' && module) {
            ModelManager.bindToModule(value, module);
        }
        model[key] = value;
    }
}
//# sourceMappingURL=model.js.map