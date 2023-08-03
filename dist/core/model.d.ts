import { Module } from "./module";
/**
 * 模型类
 *
 * @remarks
 * 模型就是对数据做代理
 *
 * 注意：数据对象中，以下5个属性名（保留字）不能用，可以通过如：`model.__source`的方式获取保留属性
 *
 *      __source:源数据对象
 *
 *      __key:模型的key
 *
 *      __module:所属模块
 *
 *      __parent:父模型
 *
 *      __name:在父模型中的属性名
 *
 */
export declare class Model {
    /**
     * @param data -    数据
     * @param module - 	模块对象
     * @param parent -  父模型
     * @param name -    模型在父对象中的prop name
     * @returns         模型
     */
    constructor(data: object, module: Module, parent?: Model, name?: string);
}
