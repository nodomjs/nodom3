import { Module } from "./module";
/**
 * 模型类
 * 对数据做代理
 * 警告：___source属性为保留属性，用户不要使用
 * 通过___source属性可以获取代理对象源数据对象
 */
export declare class Model {
    /**
     * @param data 		数据
     * @param module 	模块对象
     * @returns         模型代理对象
     */
    constructor(data: any, module?: Module);
}
