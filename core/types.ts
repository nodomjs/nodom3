import { Model } from "./model";
import { Module } from "./module";
import { Route } from "./route";
import { VirtualDom } from "./virtualdom";

/**
 * 应用初始化配置类型
 */
/**
 * 路由配置
 */
export interface IRouteCfg {
    /**
     * 路由路径，可以带通配符*，可以带参数 /:
     */
    path?: string;
    
    /**
     * 路由对应模块对象或类或模块类名
     */
    module?:any;

    /**
     * 模块路径，当module为类名时需要，默认执行延迟加载
     */
    modulePath?:string;
    /**
     * 子路由数组
     */
    routes?: Array<IRouteCfg>;

    /**
     * 进入路由事件方法
     */
    onEnter?: Function;
    /**
     * 离开路由方法
     */
    onLeave?: Function;
    
    /**
     * 父路由
     */
    parent?: Route;
}

/**
 * 模块状态类型
 */
export enum EModuleState {
    INITED = 1,
    UNACTIVE=2,
    RENDERED=4
}

/**
 * 渲染后的节点接口
 */
export interface IRenderedDom{
    /**
     * 元素名，如div
     */
    tagName?: string;

    /**
     * key，整颗虚拟dom树唯一
     */
    key: string;
 
    /**
      * 绑定模型
     */
    model?: Model;

    /**
     * 直接属性 不是来自于attribute，而是直接作用于html element，如el.checked,el.value等
     */
    assets?: Object;

    /**
     * 静态属性(attribute)集合
     * {prop1:value1,...}
     */
    props?: Object;
 
    /**
     * element为textnode时有效
     */
    textContent?: string;

    /**
     * 子节点数组[]
     */
    children?: Array<IRenderedDom>;

    /**
     * 父虚拟dom
     */
    parent?: IRenderedDom;

     /**
      * staticNum 静态标识数
      *  0 表示静态，不进行比较
      *  > 0 每次比较后-1
      *  < 0 不处理
      */
    staticNum?: number;
 
    /**
     * 不添加到树
     */
    dontAddToTree?: boolean;

    /**
     * 子模块id，模块容器时有效
     */
    subModuleId?: number;

    /**
     * 未改变标志，本次不渲染
     */
    notChange?: boolean;

    /**
     * 源虚拟dom
     */
    vdom?: VirtualDom;
}

