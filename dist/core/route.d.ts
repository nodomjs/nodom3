import { Module } from "./module";
import { RouteCfg, UnknownClass } from "./types";
/**
 * 路由类
 */
export declare class Route {
    /**
     * 路由id
     */
    id: number;
    /**
     * 路由参数名数组
     */
    params: Array<string>;
    /**
     * 路由参数数据
     */
    data: object;
    /**
     * 子路由
     */
    children: Array<Route>;
    /**
     * 进入路由事件方法
     */
    onEnter: (module: Module, path: string) => void;
    /**
     * 离开路由方法
     */
    onLeave: (module: Module, path: string) => void;
    /**
     * 路由路径
     */
    path: string;
    /**
     * 完整路径
     */
    fullPath: string;
    /**
     * 路由对应模块对象或类或模块类名
     */
    module: string | UnknownClass | Module;
    /**
     * 父路由
     */
    parent: Route;
    /**
     * 构造器
     * @param config - 路由配置项
     */
    constructor(config?: RouteCfg, parent?: Route);
    /**
     * 添加子路由
     * @param child - 字路由
     */
    addChild(child: Route): void;
    /**
     * 通过路径解析路由对象
     */
    private parse;
    /**
     * 克隆
     * @returns 克隆对象
     */
    clone(): Route;
}
