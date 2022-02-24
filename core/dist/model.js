"use strict";
exports.__esModule = true;
exports.Model = void 0;
var modelmanager_1 = require("./modelmanager");
var util_1 = require("./util");
/**
 * 模型类
 */
var Model = /** @class */ (function () {
    /**
     * @param data 		数据
     * @param module 	模块对象
     * @returns         模型代理对象
     */
    function Model(data, module) {
        //模型管理器
        var proxy = new Proxy(data, {
            set: function (src, key, value, receiver) {
                //值未变,proxy 不处理
                if (src[key] === value) {
                    return true;
                }
                //不处理原型属性
                if (['__proto__'].includes(key)) {
                    return true;
                }
                var ov = src[key];
                var r = Reflect.set(src, key, value, receiver);
                //非对象，null，非model更新渲染
                if (value && !value.$key && typeof value === 'object') {
                    value = new Model(value, module);
                }
                modelmanager_1.ModelManager.update(proxy, key, ov, value);
                return r;
            },
            get: function (src, key, receiver) {
                var res = Reflect.get(src, key, receiver);
                if (res) {
                    if (res.$key) {
                        return modelmanager_1.ModelManager.getModel(res.$key);
                    }
                    else if (typeof res === 'object' && src.hasOwnProperty(key)) { //未代理对象，需要创建模型
                        return new Model(res, module);
                    }
                }
                return res;
            },
            deleteProperty: function (src, key) {
                //如果删除对象，从modelmanager中同步删除
                if (src[key] !== null && typeof src[key] === 'object') {
                    modelmanager_1.ModelManager.delFromMap(src[key].$key);
                }
                delete src[key];
                modelmanager_1.ModelManager.update(src, key, null, null, true);
                return true;
            }
        });
        for (var _i = 0, _a = ['$watch', '$unwatch', '$get', '$set']; _i < _a.length; _i++) {
            var k = _a[_i];
            proxy[k] = this[k];
        }
        proxy.$key = util_1.Util.genId();
        modelmanager_1.ModelManager.addToMap(data, proxy);
        //绑定到模块
        if (module) {
            modelmanager_1.ModelManager.bindToModule(proxy, module);
        }
        return proxy;
    }
    /**
     * 观察(取消观察)某个数据项
     * @param key       数据项名或数组
     * @param operate   数据项变化时执行方法名(在module的methods中定义)
     */
    Model.prototype.$watch = function (key, operate) {
        var mids = modelmanager_1.ModelManager.getModuleIds(this);
        var arr = [];
        if (Array.isArray(key)) {
            for (var _i = 0, key_1 = key; _i < key_1.length; _i++) {
                var k = key_1[_i];
                watchOne(this, k, operate);
            }
        }
        else {
            watchOne(this, key, operate);
        }
        //返回取消watch函数
        return function () {
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var f = arr_1[_i];
                var foos = f.m.$watchers[f.k];
                if (foos) {
                    for (var i = 0; i < foos.length; i++) {
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
            var index = -1;
            //如果带'.'，则只取最里面那个对象
            if ((index = key.lastIndexOf('.')) !== -1) {
                model = this.$get(key.substr(0, index));
                key = key.substr(index + 1);
            }
            if (!model) {
                return;
            }
            var listener = { modules: mids, f: operate };
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
    };
    /**
     * 查询子属性
     * @param key   子属性，可以分级，如 name.firstName
     * @returns     属性对应model proxy
     */
    Model.prototype.$get = function (key) {
        var model = this;
        if (key.indexOf('.') !== -1) { //层级字段
            var arr = key.split('.');
            for (var i = 0; i < arr.length - 1; i++) {
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
    };
    /**
     * 设置值
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     * @param module    需要绑定的新模块
     */
    Model.prototype.$set = function (key, value, module) {
        var model = this;
        var mids = modelmanager_1.ModelManager.getModuleIds(this);
        if (key.indexOf('.') !== -1) { //层级字段
            var arr = key.split('.');
            for (var i = 0; i < arr.length - 1; i++) {
                //不存在，则创建新的model
                if (!model[arr[i]]) {
                    var m = new Model({});
                    modelmanager_1.ModelManager.bindToModules(m, mids);
                    model[arr[i]] = m;
                }
                model = model[arr[i]];
            }
            key = arr[arr.length - 1];
        }
        //绑定model到模块
        if (typeof value === 'object' && module) {
            modelmanager_1.ModelManager.bindToModule(value, module);
        }
        model[key] = value;
    };
    return Model;
}());
exports.Model = Model;
