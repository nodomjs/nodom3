import { Module } from "./module";
/**
 * 模型类
 * 对数据做代理
 * 注意:以下5个属性名不能用
 *      __source:源数据对象
 *      __key:模型的key
 *      __module:所属模块
 *      __parent:父模型
 *      __name:在父对象中的属性名
 */
export declare class Model {
    /**
     * @param data 		数据
     * @param module 	模块对象
     * @param parent    父模型
     * @param name      模型在父对象中的prop name
     * @returns         模型代理对象
     */
    constructor(data: any, module: Module, parent?: any, name?: any);
}
