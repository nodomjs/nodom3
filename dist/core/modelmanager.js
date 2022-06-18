import { ModuleFactory } from "./modulefactory";
import { Renderer } from "./renderer";
/**
 * 模型工厂
 */
export class ModelManager {
    /**
     * 添加到 dataNModelMap
     * @param data      数据对象
     * @param model     模型
     */
    static addToMap(data, model) {
        this.modelMap.set(model.$key, { data: data, model: model });
    }
    /**
     * 删除从 dataNModelMap
     * @param key       model key
     */
    static delFromMap(key) {
        if (!this.modelMap.has(key)) {
            return;
        }
        let o = this.modelMap.get(key);
        this.modelMap.delete(key);
    }
    /**
     * 从dataNModelMap获取model
     * @param data      数据对象
     * @returns         model
     */
    static getModel(key) {
        if (this.modelMap.has(key)) {
            return this.modelMap.get(key)['model'];
        }
    }
    /**
     * 获取数据对象
     * @param key   model key
     * @returns     data
     */
    static getData(key) {
        if (this.modelMap.has(key)) {
            return this.modelMap.get(key)['data'];
        }
    }
    /**
     * 绑定model到module
     * @param model     模型
     * @param module    模块
     * @returns
     */
    static bindToModule(model, module) {
        if (!model || !this.modelMap.has(model.$key)) {
            return;
        }
        let obj = this.modelMap.get(model.$key);
        let mid = typeof module === 'number' ? module : module.id;
        if (!obj.modules) {
            obj.modules = [mid];
        }
        else {
            let arr = obj.modules;
            if (arr.indexOf(mid) === -1) {
                arr.push(mid);
            }
        }
        //级联设置
        Object.getOwnPropertyNames(model).forEach(item => {
            if (model[item] && typeof model[item] === 'object' && model[item].$key) {
                ModelManager.bindToModule(model[item], module);
            }
        });
    }
    /**
     * 绑定model到多个module
     * @param model     模型
     * @param ids       模块id数组
     * @returns
     */
    static bindToModules(model, ids) {
        if (!this.modelMap.has(model.$key)) {
            return;
        }
        let obj = this.modelMap.get(model.$key);
        if (!obj.modules) {
            obj.modules = ids;
        }
        else {
            let arr = obj.modules;
            for (let mid of ids) {
                if (arr.indexOf(mid) === -1) {
                    arr.push(mid);
                }
            }
        }
        //级联设置
        Object.getOwnPropertyNames(model).forEach(item => {
            if (typeof model[item] === 'object' && model[item].$key) {
                ModelManager.bindToModules(model[item], ids);
            }
        });
    }
    /**
     * model从module解绑
     * @param model     模型
     * @param module    模块
     * @returns
     */
    static unbindFromModule(model, module) {
        if (!this.modelMap.has(model.$key)) {
            return;
        }
        let obj = this.modelMap.get(model.$key);
        if (!obj.modules) {
            return;
        }
        let mid = typeof module === 'number' ? module : module.id;
        let arr = obj.modules;
        let ind;
        if ((ind = arr.indexOf(mid)) === -1) {
            arr.splice(ind);
        }
        //级联解绑
        Object.getOwnPropertyNames(model).forEach(item => {
            if (typeof model[item] === 'object' && model[item].$key) {
                ModelManager.unbindFromModule(model[item], module);
            }
        });
    }
    /**
     * 获取model绑定的moduleId
     * @param model     模型
     * @returns model绑定的模块id数组
     */
    static getModuleIds(model) {
        if (!this.modelMap.has(model.$key)) {
            return;
        }
        return this.modelMap.get(model.$key).modules;
    }
    /**
     * 更新导致渲染
     * 如果不设置oldValue和newValue，则直接强制渲染
     * @param model     model
     * @param key       属性
     * @param oldValue  旧值
     * @param newValue  新值
     */
    static update(model, key, oldValue, newValue) {
        const modules = this.getModuleIds(model);
        if (!modules) {
            return;
        }
        //所有module渲染
        for (let mid of modules) {
            const m = ModuleFactory.get(mid);
            if (m) {
                Renderer.add(m);
            }
        }
        //触发监听器
        if (this.watcherMap.has(model.$key)) {
            if (!this.watcherMap.get(model.$key).has(key)) {
                return;
            }
            let foos = this.watcherMap.get(model.$key).get(key);
            for (let v of foos) {
                for (let mid of v[1]) {
                    const m = ModuleFactory.get(mid);
                    if (m) {
                        v[0].call(m, model, key, oldValue, newValue);
                    }
                }
            }
        }
    }
    /**
     * 添加watch
     * @param model 被watch模型
     * @param key   watch键
     * @param foo   触发方法
     */
    static watch(model, key, foo, mids) {
        if (!this.watcherMap.has(model.$key)) {
            this.watcherMap.set(model.$key, new Map());
        }
        let map = this.watcherMap.get(model.$key);
        if (!map.has(key)) {
            map.set(key, new Map());
        }
        map.get(key).set(foo, mids);
    }
    /**
     * 移除watch
     * @param model model
     * @param key   watch键
     * @param foo   待移除的watch方法，如果不设置，则表示移除该属性所有watch方法
     */
    static unwatch(model, key, foo) {
        if (!this.watcherMap.has(model.$key)) {
            return;
        }
        let map = this.watcherMap.get(model.$key);
        if (!map.has(key)) {
            return;
        }
        if (!foo) {
            map.delete(key);
        }
        else if (map.get(key).has(foo)) {
            map.get(key).delete(foo);
        }
    }
}
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
/**
 * watcher map
 * 用于存放所有watcher 方法
 * key为model
 * value为{item:{foo:moduleIds}，其中：
 *      item为被watch的属性，
 *      foo为方法
 *      moduleIds为待触发的模块id数组，
 */
ModelManager.watcherMap = new Map();
//# sourceMappingURL=modelmanager.js.map