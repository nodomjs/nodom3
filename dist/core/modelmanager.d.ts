import { Model } from "./model";
import { Module } from "./module";
/**
 * 模型工厂
 */
export declare class ModelManager {
    /**
     * 所属模块
     */
    module: Module;
    /**
     * 绑定module map，slot引用外部数据时有效
     * {model:[moduleid1,moduleid2,...]}
     */
    bindMap: WeakMap<object, number[]>;
    /**
     * 数据map
     * {data:{model:model,key:key}
     * 其中：
     *      data:       初始数据对象
     *      model:      model对象
     */
    private dataMap;
    /**
     * 存储模型对应属性名，如果为父传子，则需要保存属于该模型的属性名
     * key: model
     * value: model名字
     */
    private nameMap;
    /**
     * model对应监听器map
     *  key:model
     *  value:{key1:{f:foo1,deep:true/false},key2:,...}
     *        其中：prop为被监听属性，foo为监听器方法，deep为是否深度监听
     */
    private watchMap;
    /**
     * 是否存在深度watcher
     */
    private hasDeepWatch;
    /**
     * 构造器
     * @param module    模块
     */
    constructor(module: Module);
    /**
     * 获取model，不存在则新建
     * @param data      数据
     * @returns         model
     */
    getModel(data: any): Model;
    /**
     * 获取model key
     * @param model     model对象
     * @returns         model对应key
     */
    getModelKey(data: any): number;
    /**
     * 设置模型名
     * @param model 模型
     * @param name  名
     */
    setModelName(model: any, name: string): void;
    /**
     * 获取模型名
     * @param model 模型
     * @returns     模型名
     */
    getModelName(model: any): string;
    /**
     * 添加数据到map
     * @param data      原始数据
     * @param model     模型
     */
    add(data: any, model: any): void;
    /**
     * 添加绑定
     * @param model     模型
     * @param moduleId  模块id
     */
    bindModel(model: any, module: Module): void;
    /**
     * 更新导致渲染
     * 如果不设置oldValue和newValue，则直接强制渲染
     * @param model     model
     * @param key       属性
     * @param oldValue  旧值
     * @param newValue  新值
     */
    update(model: Model, key: string, oldValue?: any, newValue?: any): void;
    /**
     * 监听某个数据项
     * 注意：执行此操作时，该数据项必须已经存在，否则监听失败
     * @param model     带watch的model
     * @param key       数据项名或数组
     * @param operate   数据项变化时执行方法
     * @param module    指定模块，如果指定，则表示该model绑定的所有module都会触发watch事件，在model父(模块)传子(模块)传递的是对象时会导致多个watch出发
     * @param deep      是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
     *
     * @returns         unwatch函数
     */
    watch(model: Model, key: string | string[], operate: Function, deep?: boolean): Function;
    /**
     * 查询model子属性
     * @param key       属性名，可以分级，如 name.firstName
     * @param model     模型
     * @returns         属性对应model proxy
     */
    get(model: Model, key?: string): any;
    /**
     * 设置值
     * @param model     模型
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     */
    set(model: Model, key: string, value: any): void;
}
