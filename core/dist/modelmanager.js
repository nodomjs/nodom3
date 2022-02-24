"use strict";
exports.__esModule = true;
exports.ModelManager = void 0;
var modulefactory_1 = require("./modulefactory");
var renderer_1 = require("./renderer");
/**
 * 模型工厂
 */
var ModelManager = /** @class */ (function () {
    function ModelManager() {
    }
    /**
     * 添加到 dataNModelMap
     * @param data      数据对象
     * @param model     模型
     */
    ModelManager.addToMap = function (data, model) {
        this.modelMap.set(model.$key, { data: data, model: model });
    };
    /**
     * 删除从 dataNModelMap
     * @param key       model key
     */
    ModelManager.delFromMap = function (key) {
        if (!this.modelMap.has(key)) {
            return;
        }
        var o = this.modelMap.get(key);
        this.modelMap["delete"](key);
    };
    /**
     * 从dataNModelMap获取model
     * @param data      数据对象
     * @returns         model
     */
    ModelManager.getModel = function (key) {
        if (this.modelMap.has(key)) {
            return this.modelMap.get(key)['model'];
        }
    };
    /**
     * 获取数据对象
     * @param key   model key
     * @returns     data
     */
    ModelManager.getData = function (key) {
        if (this.modelMap.has(key)) {
            return this.modelMap.get(key)['data'];
        }
    };
    /**
     * 绑定model到module
     * @param model     模型
     * @param module    模块
     * @returns
     */
    ModelManager.bindToModule = function (model, module) {
        if (!model || !this.modelMap.has(model.$key)) {
            return;
        }
        var obj = this.modelMap.get(model.$key);
        var mid = typeof module === 'number' ? module : module.id;
        if (!obj.modules) {
            obj.modules = [mid];
        }
        else {
            var arr = obj.modules;
            if (arr.indexOf(mid) === -1) {
                arr.push(mid);
            }
        }
        //级联设置
        Object.getOwnPropertyNames(model).forEach(function (item) {
            if (model[item] && typeof model[item] === 'object' && model[item].$key) {
                ModelManager.bindToModule(model[item], module);
            }
        });
    };
    /**
     * 绑定model到多个module
     * @param model     模型
     * @param ids       模块id数组
     * @returns
     */
    ModelManager.bindToModules = function (model, ids) {
        if (!this.modelMap.has(model.$key)) {
            return;
        }
        var obj = this.modelMap.get(model.$key);
        if (!obj.modules) {
            obj.modules = ids;
        }
        else {
            var arr = obj.modules;
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var mid = ids_1[_i];
                if (arr.indexOf(mid) === -1) {
                    arr.push(mid);
                }
            }
        }
        //级联设置
        Object.getOwnPropertyNames(model).forEach(function (item) {
            if (typeof model[item] === 'object' && model[item].$key) {
                ModelManager.bindToModules(model[item], ids);
            }
        });
    };
    /**
     * model从module解绑
     * @param model     模型
     * @param module    模块
     * @returns
     */
    ModelManager.unbindFromModule = function (model, module) {
        if (!this.modelMap.has(model.$key)) {
            return;
        }
        var obj = this.modelMap.get(model.$key);
        if (!obj.modules) {
            return;
        }
        var mid = typeof module === 'number' ? module : module.id;
        var arr = obj.modules;
        var ind;
        if ((ind = arr.indexOf(mid)) === -1) {
            arr.splice(ind);
        }
        //级联解绑
        Object.getOwnPropertyNames(model).forEach(function (item) {
            if (typeof model[item] === 'object' && model[item].$key) {
                ModelManager.unbindFromModule(model[item], module);
            }
        });
    };
    /**
     * 获取model绑定的moduleId
     * @param model     模型
     * @returns model绑定的模块id数组
     */
    ModelManager.getModuleIds = function (model) {
        if (!this.modelMap.has(model.$key)) {
            return;
        }
        return this.modelMap.get(model.$key).modules;
    };
    /**
     * 更新导致渲染
     * 如果不设置oldValue和newValue，则直接强制渲染
     * @param model     model
     * @param key       属性
     * @param oldValue  旧值
     * @param newValue  新值
     * @param force     强制渲染
     */
    ModelManager.update = function (model, key, oldValue, newValue, force) {
        var modules = this.getModuleIds(model);
        if (!modules) {
            return;
        }
        //第一个module为watcher对应module
        for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
            var mid = modules_1[_i];
            var m = modulefactory_1.ModuleFactory.get(mid);
            if (m) {
                renderer_1.Renderer.add(m);
            }
        }
        //监听器
        if (model.$watchers) {
            //对象监听器
            if (model.$watchers.$this) {
                for (var _a = 0, _b = model.$watchers.$this; _a < _b.length; _a++) {
                    var cfg = _b[_a];
                    for (var _c = 0, _d = cfg.modules; _c < _d.length; _c++) {
                        var mid = _d[_c];
                        var m = modulefactory_1.ModuleFactory.get(mid);
                        if (m) {
                            cfg.f.call(m, model, oldValue, newValue);
                        }
                    }
                }
            }
            //属性监听器
            if (model.$watchers[key]) {
                for (var _e = 0, _f = model.$watchers[key]; _e < _f.length; _e++) {
                    var cfg = _f[_e];
                    for (var _g = 0, _h = cfg.modules; _g < _h.length; _g++) {
                        var mid = _h[_g];
                        var m = modulefactory_1.ModuleFactory.get(mid);
                        if (m) {
                            cfg.f.call(m, model, oldValue, newValue);
                        }
                    }
                }
            }
        }
    };
    /**
     * 模型map
     * 样式为 {modelKey:{data:data,model:model,modules:[]}，
     * 其中：
     *      modelkey表示model对应key，
     *      data为原始数据，
     *      model为代理对象,
     *      modules为该数据对象绑定的模块id数组
     */
    ModelManager.modelMap = new Map();
    return ModelManager;
}());
exports.ModelManager = ModelManager;
