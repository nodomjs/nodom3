import { DefineElement } from "./defineelement";
import { NEvent } from "./event";
import { Model } from "./model";
import { Module } from "./module";
import { Route } from "./route";
import { VirtualDom } from "./virtualdom";
/**
 * 路由配置
 */
export declare type RouteCfg = {
    /**
     * 路由路径，可以带通配符*，可以带参数 /:
     */
    path?: string;
    /**
     * 路由对应模块对象或类或模块类名
     */
    module?: Module;
    /**
     * 模块路径，当module为类名时需要，默认执行延迟加载
     */
    modulePath?: string;
    /**
     * 子路由数组
     */
    routes?: Array<RouteCfg>;
    /**
     * 进入路由事件方法
     */
    onEnter?: (module: any, url: any) => void;
    /**
     * 离开路由方法
     */
    onLeave?: (module: any, url: any) => void;
    /**
     * 父路由
     */
    parent?: Route;
};
/**
 * 模块状态类型
 */
export declare enum EModuleState {
    /**
     * 已初始化
     */
    INIT = 1,
    /**
     * 未挂载到html dom
     */
    UNMOUNTED = 2,
    /**
     * 已挂载到dom树
     */
    MOUNTED = 3,
    /**
     * 准备渲染
     */
    READY = 4
}
/**
 * 渲染后的节点接口
 */
export declare type RenderedDom = {
    /**
     * 元素名，如div
     */
    tagName?: string;
    /**
     * key:节点key，整棵渲染树唯一
     */
    key: string | number;
    /**
      * 绑定模型
     */
    model?: Model;
    /**
     * 直接属性 不是来自于attribute，而是直接作用于html element，如el.checked,el.value等
     */
    assets?: object;
    /**
     * 静态属性(attribute)集合
     */
    props?: object;
    /**
     * 事件集合
     */
    events?: NEvent[];
    /**
     * element为textnode时有效
     */
    textContent?: string;
    /**
     * 子节点数组
     */
    children?: Array<RenderedDom>;
    /**
     * 父虚拟dom
     */
    parent?: RenderedDom;
    /**
     * staticNum 静态标识数
     *  0 表示静态，不进行比较
     *  1 每次比较后-1
     *  -1 每次渲染
     */
    staticNum?: number;
    /**
     * 子模块id，模块容器时有效
     */
    moduleId?: number;
    /**
     * 源虚拟dom(vdomTree中的对应节点)
     */
    vdom?: VirtualDom;
    /**
     * 是否为svg节点
     */
    isSvg?: boolean;
    /**
     * 所属模块id
     */
    mid?: number;
    /**
     * 渲染到的模块id，当作为slot时有效
     */
    rmid?: number;
};
/**
 * 未知类
 */
export declare type UnknownClass = () => void;
/**
 * 自定义element 类
 */
export declare type DefineElementClass = (dom: VirtualDom, module: Module) => DefineElement;
/**
 * 未知方法
 */
export declare type UnknownMethod = () => void;
/**
 * 事件方法
 */
export declare type EventMethod = (model: any, dom: any, evobj: any, event: any) => void;
/**
 * 指令方法
 */
export declare type DirectiveMethod = (module: Module, dom: RenderedDom) => boolean;
/**
 * 表达式方法
 */
export declare type ExpressionMethod = (model: Model) => unknown;
/**
 * 新旧dom树比较后更改的节点
 *
 * @remarks
 * 元素依次为：
 * ```js
 * 0：修改类型，可选值 1: add（添加）, 2: upd（更新）,3: del（删除）, 4: move（移动） ,5: rep（替换）
 * 1：目标节点
 * 2：相对节点（rep时有效）
 * 3：目标节点的父节点
 * 4：目标节点在父节点中的index
 * 5：被移动前位置(move时有效)
 * ```
 */
export declare type ChangedDom = [number, RenderedDom, RenderedDom?, RenderedDom?, number?, number?];
