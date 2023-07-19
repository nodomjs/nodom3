import { Module } from "./module";
import { Route } from "./route";
/**
 * 路由管理类
 * @since 	1.0
 */
export declare class Router {
    /**
     * 根路由
     */
    private root;
    /**
     * 基础路径，实际显示路径为 basePath+routePath
     */
    private basePath;
    /**
     * 当前路径
     */
    currentPath: string;
    /**
     * path等待链表
     */
    private waitList;
    /**
     * 默认路由进入事件方法
     */
    private onDefaultEnter;
    /**
     * 默认路由离开事件
     */
    private onDefaultLeave;
    /**
     * 启动方式 0:直接启动 1:popstate 启动
     */
    private startType;
    /**
     * 激活Dom map
     * key: path
     * value:{moduleId:dom所属模板模块id，model:对应model,field:激活字段名}
     */
    private activeModelMap;
    /**
     * 绑定到module的router指令对应的key，即router容器对应的key，格式为
     *  {
     *      moduleId:{
     *          mid:router所在模块id,
     *          key:routerKey(路由key),
     *          paths:active路径数组
     *          wait:{mid:待渲染的模块id,path:route.path}
     *      }
     *      ,...
     *  }
     *  moduleId: router所属模块id（如果为slot且slot不是innerRender，则为模板对应模块id，否则为当前模块id）
     */
    private routerMap;
    /**
     * 构造器
     * @param basePath          路由基础路径，显示的完整路径为 basePath + route.path
     * @param defaultEnter      默认进入时事件函数，传递参数： module,离开前路径
     * @param defaultLeave      默认离开时事件函数，传递参数： module,进入时路径
     */
    constructor(basePath?: string, defaultEnter?: Function, defaultLeave?: Function);
    /**
     * 把路径加入跳转列表(准备跳往该路由)
     * @param path 	路径
     * @param type  启动路由类型，参考startType，默认0
     */
    go(path: string): void;
    /**
     * 启动加载
     */
    private load;
    /**
     * 切换路由
     * @param path 	路径
     */
    private start;
    /**
     * 获取module
     * @param route 路由对象
     * @returns     路由对应模块
     */
    private getModule;
    /**
     * 比较两个路径对应的路由链
     * @param path1 	第一个路径
     * @param path2 	第二个路径
     * @returns 		数组 [父路由或不同参数的路由，需要销毁的路由数组，需要增加的路由数组，不同参数路由的父路由]
     */
    private compare;
    /**
     * 添加激活对象
     * @param moduleId  模块id
     * @param path      路由路径
     * @param model     激活字段所在model
     * @param field     字段名
     */
    addActiveModel(moduleId: number, path: string, model: any, field: string): void;
    /**
     * 依赖模块相关处理
     * @param module 	模块
     * @param pm        依赖模块
     * @param path 		view对应的route路径
     */
    private dependHandle;
    /**
     * 设置路由元素激活属性
     * @param module    模块
     * @param path      路径
     * @returns
     */
    private setDomActive;
    /**
     * 获取路由数组
     * @param path 	要解析的路径
     * @param clone 是否clone，如果为false，则返回路由树的路由对象，否则返回克隆对象
     * @returns     路由对象数组
     */
    private getRouteList;
    /**
     * 获取根路由
     * @returns     根路由对象
     */
    getRoot(): Route;
    /**
     * 登记路由容器到管理器中
     * @param moduleId      模块id
     * @param module        路由实际所在模块（当使用slot时，与moduleId对应模块不同）
     * @param key           路由容器key
     */
    registRouter(moduleId: number, module: Module, dom: any): void;
    /**
     * 尝试激活路径
     * @param path  待激活的路径
     */
    activePath(path: string): void;
}
