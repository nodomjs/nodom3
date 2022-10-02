import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { Module } from "./module";
/**
 * 模型工厂
 */
export declare class ModelManager {
    /**
     * 数据map
     * {data:model}，
     * 其中：
     *      data:       初始数据对象
     *      model:      model对象
     *
     */
    private static dataMap;
    /**
     * 模型map
     * {model:{key:,modules:,watchers:}}
     * 其中：
     *  key:        model key
     *  modules:    该model对象绑定的模块id数组
     *  watchers:   model对应监听器map {prop:{foo:modules}}
     *               其中：prop为被监听属性，foo为监听器方法，modules为被监听属性所影响的模块数组
     */
    static modelMap: Map<object, any>;
    /**
     * 用于保存bindToModule时的子对象对应mids
     * {data:[mids]}
     * 其中：
     *  data:   data object
     *  mids:   moduleid 数组
     */
    private static tempMap;
    /**
     * 获取model map
     * @returns  model map
     */
    static getMap(): Map<object, any>;
    /**
     * 获取model，不存在则新建
     * @param data      数据
     * @param module    所属模块
     * @returns         model
     */
    static getModel(data: any, receiver?: Model): Model;
    /**
     * 获取model key
     * @param model     model对象
     * @returns         model对应key
     */
    static getModelKey(model: Model): number;
    /**
     * 添加数据到map
     * @param data
     */
    static add(data: any, model: any, receiver?: Model): void;
    /**
     * 绑定model到module
     * @param model     模型
     * @param module    模块
     * @param isSecond  是否为第二次绑定（通常为传递给子模块的数据对象）
     * @returns
     */
    static bindToModule(model: Model, module: Module, isSecond?: boolean): void;
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
     * 观察某个数据项
     * @param model     带watch的model
     * @param key       数据项名或数组
     * @param operate   数据项变化时执行方法
     * @param module    指定模块，如果指定，则表示该model绑定的所有module都会触发watch事件，在model父(模块)传子(模块)传递的是对象时会导致多个watch出发
     * @param deep      是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
     *
     * @returns         unwatch函数
     */
    static watch(model: Model, key: string | string[], operate: Function, module?: Module, deep?: boolean): Function;
    /**
     * 查询model子属性
     * @param key       属性名，可以分级，如 name.firstName
     * @param model     模型
     * @returns         属性对应model proxy
     */
    static get(model: Model, key?: string): any;
    /**
     * 设置值
     * @param model     模型
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     */
    static set(model: Model, key: string, value: any): void;
    /**
     * 判断一个对象是否为model（proxy）
     * @param model     待检测对象
     * @returns         true/false
     */
    static isModel(model: any): boolean;
}
