import { Model } from "./model";
import { Module } from "./module";
/**
 * 模型工厂
 * @remarks
 * 管理模块的model
 */
export declare class ModelManager {
    /**
     * 所属模块
     */
    module: Module;
    /**
     * model与module绑定map
     * @remarks
     * slot引用外部数据或模块传值时有效会导致model被不同模块引用，`bindMap`用来存放对应的模块数组
     *
     * key:    model
     *
     * value:  model绑定的module id 数组
     */
    bindMap: WeakMap<object, number[]>;
    /**
     * 数据map
     * ```js
     * {
     *      data1:{
     *          model:model,
     *          key:key
     *      },
     *      data2:,
     *      datan
     * }
     * ```
     * 其中：
     *   datan: 初始数据对象
     *   model: model对象
     *   key:   model key
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
     * key:model
     * value:object
     * ```js
     * {
     *      key1:{
     *          f:foo1,
     *          deep:true/false
     *      },
     *      key2:,
     *      kn:
     * }
     * ```
     *        其中：prop为被监听属性，foo为监听器方法，deep为是否深度监听
     */
    private watchMap;
    /**
     * 是否存在深度watcher
     */
    private hasDeepWatch;
    /**
     * 构造器
     * @param module -    模块
     */
    constructor(module: Module);
    /**
     * 获取model，不存在则新建
     * @param data -    数据
     * @returns         model
     */
    getModel(data: object): Model;
    /**
     * 获取model key
     * @remarks
     * 每个model都有一个唯一 key
     * @param model -   model对象
     * @returns         model对应key
     */
    getModelKey(data: object): number;
    /**
     * 设置model名
     * @param model - 模型
     * @param name -  名
     */
    setModelName(model: Model, name: string): void;
    /**
     * 获取模型名
     * @param model - 模型
     * @returns     模型名
     */
    getModelName(model: Model): string;
    /**
     * 添加数据到map
     * @param data -      原始数据
     * @param model -     模型
     */
    add(data: any, model: any): void;
    /**
     * 添加绑定
     * @remarks
     * 当一个model被多个module引用时，需要添加绑定，以便修改时触发多个模块渲染。
     * @param model -   模型
     * @param module -  模块
     */
    bindModel(model: Model, module: Module): void;
    /**
     * 更新导致渲染
     * @remarks
     * 如果不设置oldValue和newValue，则直接强制渲染
     *
     * @param model -     model
     * @param key -       属性
     * @param oldValue -  旧值
     * @param newValue -  新值
     */
    update(model: Model, key: string, oldValue?: unknown, newValue?: unknown): void;
    /**
     * 监听数据项
     *
     * @param model -   被监听model
     * @param key -     监听数据项名
     * @param operate - 数据项变化时执行方法
     * @param deep -    是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
     *
     * @returns         unwatch函数，执行此函数，可取消监听
     */
    watch(model: Model, key: string | string[], operate: (m: any, k: any, ov: any, nv: any) => void, deep?: boolean): () => void;
    /**
     * 获取model属性值
     * @param key -     属性名，可以分级，如 name.firstName
     * @param model -   模型
     * @returns         属性值
     */
    get(model: Model, key?: string): unknown;
    /**
     * 设置model属性值
     * @param model -   模型
     * @param key -     属性名，可以分级，如 name.firstName
     * @param value -   属性值
     */
    set(model: Model, key: string, value: unknown): void;
}
