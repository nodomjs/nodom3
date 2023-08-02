import { Module } from "./module";
import { EventMethod, RenderedDom } from "./types";
import { Expression } from "./expression";
/**
 * 事件类
 * @remarks
 * 事件分为自有事件和代理事件，事件默认传递参数为 model(事件对应数据模型),dom(事件target对应的虚拟dom节点),evObj(NEvent对象),e(html event对象)
 */
export declare class NEvent {
    /**
     * 事件id
     */
    id: number;
    /**
     * 事件所属模块
     */
    module: Module;
    /**
     * 事件名
     */
    name: string;
    /**
     * 事件处理方法名(需要在模块中定义)、方法函数或表达式
     */
    handler: string | EventMethod;
    /**
     * 表达式，当传递事件串为表达式时有效
     */
    private expr;
    /**
     * 代理模式，事件代理到父对象
     */
    delg: boolean;
    /**
     * 禁止冒泡，代理模式下无效
     */
    nopopo: boolean;
    /**
     * 只执行一次
     */
    once: boolean;
    /**
     * 使用 capture，代理模式下无效
     */
    capture: boolean;
    /**
     * 依赖事件，用于扩展事件存储原始事件
     */
    dependEvent: NEvent;
    /**
     * @param eventName -     事件名
     * @param eventStr -      事件串或事件处理函数,以“:”分割,中间不能有空格,结构为: 方法名[:delg(代理到父对象):nopopo(禁止冒泡):once(只执行一次):capture(useCapture)]
     *                      如果为函数，则替代第三个参数
     * @param handler -       事件执行函数，如果方法不在module methods中定义，则可以直接申明，eventStr第一个参数失效，即eventStr可以是":delg:nopopo..."
     */
    constructor(module: Module, eventName: string, eventStr?: string | Expression | EventMethod, handler?: EventMethod);
    /**
     * 事件串初始化
     * @param eventStr -  事件串
     * @param handler -   事件钩子函数
     */
    private init;
    /**
     * 表达式处理，当handler为expression时有效
     * @param module -    模块
     * @param model -     对应model
     */
    handleExpr(module: any, model: any): this;
    /**
     * 解析事件字符串
     * @param eventStr -  待解析的字符串
     */
    private parseEvent;
    /**
     * 触屏转换
     */
    private touchOrNot;
    /**
     * 设置附加参数值
     * @param module -    模块
     * @param dom -       虚拟dom
     * @param name -      参数名
     * @param value -     参数值
     */
    setParam(module: Module, dom: RenderedDom, name: string, value: unknown): void;
    /**
     * 获取附加参数值
     * @param module -    模块
     * @param dom -       虚拟dom
     * @param name -      参数名
     * @returns         附加参数值
     */
    getParam(module: Module, dom: RenderedDom, name: string): any;
    /**
     * 移除参数
     * @param module -    模块
     * @param dom -       虚拟dom
     * @param name -      参数名
     */
    removeParam(module: Module, dom: RenderedDom, name: string): void;
    /**
     * 清参数cache
     * @param module -    模块
     * @param dom -       虚拟dom
     */
    clearParam(module: Module, dom: RenderedDom): void;
}
