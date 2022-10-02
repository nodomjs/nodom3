import { Module } from "./module";
import { Route } from "./route";
/**
 * 路由管理类
 * @since 	1.0
 */
export declare class Router {
    /**
     * 当前路径
     */
    static currentPath: string;
    /**
     * path等待链表
     */
    private static waitList;
    /**
     * 默认路由进入事件方法
     */
    private static onDefaultEnter;
    /**
     * 默认路由离开事件
     */
    private static onDefaultLeave;
    /**
     * 启动方式 0:直接启动 1:popstate 启动
     */
    static startStyle: number;
    /**
     * 激活Dom map，格式为{moduleId:[]}
     */
    private static activeFieldMap;
    /**
     * 绑定到module的router指令对应的key，即router容器对应的key，格式为 {moduleId:routerKey,...}
     */
    static routerKeyMap: Map<number, string>;
    /**
     * 根路由
     */
    static root: Route;
    /**
     * 基础路径，实际显示路径为 basePath+routePath
     */
    static basePath: string;
    /**
     * 把路径加入跳转列表(准备跳往该路由)
     * @param path 	路径
     */
    static go(path: string): void;
    /**
     * 启动加载
     */
    private static load;
    /**
     * 切换路由
     * @param path 	路径
     */
    private static start;
    static redirect(path: string): void;
    /**
     * 获取module
     * @param route 路由对象
     * @returns     路由对应模块
     */
    private static getModule;
    /**
     * 比较两个路径对应的路由链
     * @param path1 	第一个路径
     * @param path2 	第二个路径
     * @returns 		数组 [父路由或不同参数的路由，第一个需要销毁的路由数组，第二个需要增加的路由数组，不同参数路由的父路由]
     */
    private static compare;
    /**
     * 添加激活字段
     * @param module    模块
     * @param path      路由路径
     * @param model     激活字段所在model
     * @param field     字段名
     */
    static addActiveField(module: Module, path: string, model: any, field: string): void;
    /**
     * 依赖模块相关处理
     * @param module 	模块
     * @param pm        依赖模块
     * @param path 		view对应的route路径
     */
    private static dependHandle;
    /**
     * 设置路由元素激活属性
     * @param module    模块
     * @param path      路径
     * @returns
     */
    private static setDomActive;
    /**
     * 获取路由数组
     * @param path 	要解析的路径
     * @param clone 是否clone，如果为false，则返回路由树的路由对象，否则返回克隆对象
     * @returns     路由对象数组
     */
    static getRouteList(path: string, clone?: boolean): Array<Route>;
}
