import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { Module } from "./module";
/**
 * 模型工厂
 */
export declare class ModelManager {
    /**
     * 数据对象与模型映射，key为数据对象，value为model
     */
    private static dataMap;
    /**
     * 模型模块映射
     * key:model proxy, value:{data:data,watchers:{key:[监听器1,监听器2,...]},modules:[id1,id2,...]}
     * 每个数据对象，可有多个监听器
     */
    private static modelMap;
    /**
     * 添加到 dataNModelMap
     * @param data      数据对象
     * @param model     模型
     */
    static addToDataMap(data: Object, model: Model): void;
    /**
     * 删除从 dataNModelMap
     * @param data      数据对象
     * @param model     模型
     */
    static delFromDataMap(data: Object): void;
    /**
     * 从dataNModelMap获取model
     * @param data      数据对象
     * @returns         model
     */
    static getFromDataMap(data: Object): Model;
    /**
     * 是否存在数据模型映射
     * @param data  数据对象
     * @returns     true/false
     */
    static hasDataModel(data: Object): Boolean;
    /**
     * 添加源模型到到模型map
     * @param model     模型代理
     * @param srcNModel  源模型
     */
    static addModel(model: any, srcNModel: Model): void;
    /**
   * 删除源模型到到模型map
   * @param model     模型代理
   * @param srcNModel  源模型
   */
    static delModel(model: any): void;
    /**
     * 从模型Map获取源数据
     * @param model     模型代理
     * @returns         源模型
     */
    static getData(model: any): Model;
    /**
     * 获取model监听器
     * @param model     model
     * @param key       model对应的属性
     * @param foo       监听处理方法
     * @returns         void
     */
    static addWatcher(model: Model, key: string, foo: Function | string): void;
    /**
     * 获取model监听器
     * @param model     model
     * @param key       model对应的属性
     * @param foo       监听处理方法
     * @returns         void
     */
    static removeWatcher(model: Model, key: string, foo: Function | string): void;
    /**
     * 获取model监听器
     * @param model     model
     * @param key       model对应的属性
     * @returns         监听处理函数数组
     */
    static getWatcher(model: Model, key: string): Array<Function>;
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
     * @param force     强制渲染
     */
    static update(model: Model, key: string, oldValue?: any, newValue?: VirtualDom, force?: boolean): void;
}
