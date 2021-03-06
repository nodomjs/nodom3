import { Module } from "./module";
/**
 * 模型类
 */
export declare class Model {
    /**
     * model key
     */
    $key: number;
    /**
     * 监听器
     * 存储样式{
     *      $this: [listener1,listener2,...]，对象改变监听器,允许多个监听
     *      keyName: [listener1,listener2,...]，属性名监听器，允许多个监听
     * }
     */
    /**
     * @param data 		数据
     * @param module 	模块对象
     * @returns         模型代理对象
     */
    constructor(data: any, module?: Module);
    /**
     * 重载数组删除元素方法
     * 用于处理从数组中移除的model，从modelmap移除
     * @param data  数组
     */
    private arrayOverload;
    /**
     * 观察某个数据项
     * @param key       数据项名或数组
     * @param operate   数据项变化时执行方法
     * @param module    指定模块，如果指定，则表示该model绑定的所有module都会触发watch事件，在model父(模块)传子(模块)传递的是对象时会导致多个watch出发
     * @param deep      是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
     */
    $watch(key: string | string[], operate: Function, module?: Module, deep?: boolean): Function;
    /**
     * 查询子属性
     * @param key   子属性，可以分级，如 name.firstName
     * @returns     属性对应model proxy
     */
    $get(key: string): any;
    /**
     * 设置值
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     * @param module    需要绑定的新模块
     */
    $set(key: string, value: any, module?: Module): void;
}
