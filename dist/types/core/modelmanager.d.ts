import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { Module } from "./module";
/**
 * 模型工厂
 */
export declare class ModelManager {
    /**
     * 模型map
     * 样式为 {modelKey:{data:data,model:model,modules:[]}，
     * 其中：
     *      modelkey表示model对应key，
     *      data为原始数据，
     *      model为代理对象,
     *      modules为该数据对象绑定的模块id数组
     */
    private static modelMap;
    /**
     * watcher map
     * 用于存放所有watcher 方法
     * key为model
     * value为{item:{foo:moduleIds}，其中：
     *      item为被watch的属性，
     *      foo为方法
     *      moduleIds为待触发的模块id数组，
     */
    private static watcherMap;
    /**
     * 添加到 dataNModelMap
     * @param data      数据对象
     * @param model     模型
     */
    static addToMap(data: Object, model: Model): void;
    /**
     * 删除从 dataNModelMap
     * @param key       model key
     */
    static delFromMap(key: number): void;
    /**
     * 从dataNModelMap获取model
     * @param data      数据对象
     * @returns         model
     */
    static getModel(key: number): Model;
    /**
     * 获取数据对象
     * @param key   model key
     * @returns     data
     */
    static getData(key: number): any;
    /**
     * 绑定model到module
     * @param model     模型
     * @param module    模块
     * @returns
     */
    static bindToModule(model: Model, module: Module | number): void;
    /**
     * 绑定model到多个module
     * @param model     模型
     * @param ids       模块id数组
     * @returns
     */
    static bindToModules(model: Model, ids: number[]): void;
    /**
     * model从module解绑
     * @param model     模型
     * @param module    模块
     * @returns
     */
    static unbindFromModule(model: Model, module: Module | number): void;
    /**
     * 获取model绑定的moduleId
     * @param model     模型
     * @returns model绑定的模块id数组
     */
    static getModuleIds(model: Model): number[];
    /**
     * 更新导致渲染
     * 如果不设置oldValue和newValue，则直接强制渲染
     * @param model     model
     * @param key       属性
     * @param oldValue  旧值
     * @param newValue  新值
     */
    static update(model: Model, key: string, oldValue?: any, newValue?: VirtualDom): void;
    /**
     * 添加watch
     * @param model 被watch模型
     * @param key   watch键
     * @param foo   触发方法
     */
    static watch(model: Model, key: string, foo: Function, mids: number[]): void;
    /**
     * 移除watch
     * @param model model
     * @param key   watch键
     * @param foo   待移除的watch方法，如果不设置，则表示移除该属性所有watch方法
     */
    static unwatch(model: Model, key: string, foo: Function): void;
}
