import { IRouteCfg } from "./types";
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
    data: any;
    /**
     * 子路由
     */
    children: Array<Route>;
    /**
     * 进入路由事件方法
     */
    onEnter: Function;
    /**
     * 离开路由方法
     */
    onLeave: Function;
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
    module: any;
    /**
     * 模块路径，当module为类名时需要，默认执行延迟加载
     */
    modulePath: string;
    /**
     * 父路由
     */
    parent: Route;
    /**
     *
     * @param config 路由配置项
     */
    constructor(config?: IRouteCfg, parent?: Route);
    /**
     * 添加子路由
     * @param child
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
