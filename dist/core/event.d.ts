import { Module } from "./module";
import { IRenderedDom } from "./types";
/**
 * 事件类
 * @remarks
 * 事件分为自有事件和代理事件
 * @author      yanglei
 * @since       1.0
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
     * 事件处理函数名(需要在模块中定义)
     */
    handler: string | Function;
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
     * @param eventName     事件名
     * @param eventStr      事件串或事件处理函数,以“:”分割,中间不能有空格,结构为: 方法名[:delg(代理到父对象):nopopo(禁止冒泡):once(只执行一次):capture(useCapture)]
     *                      如果为函数，则替代第三个参数
     * @param handler       事件执行函数，如果方法不在module methods中定义，则可以直接申明，eventStr第一个参数失效，即eventStr可以是":delg:nopopo..."
     */
    constructor(module: Module, eventName: string, eventStr?: string | Function, handler?: Function);
    /**
     * 设置附加参数值
     * @param module    模块
     * @param dom       虚拟dom
     * @param name      参数名
     * @param value     参数值
     */
    setParam(module: Module, dom: IRenderedDom, name: string, value: any): void;
    /**
     * 获取附加参数值
     * @param module    模块
     * @param dom       虚拟dom
     * @param name      参数名
     * @returns         附加参数值
     */
    getParam(module: Module, dom: IRenderedDom, name: string): any;
    /**
     * 移除参数
     * @param module    模块
     * @param dom       虚拟dom
     * @param name      参数名
     */
    removeParam(module: Module, dom: IRenderedDom, name: string): void;
    /**
     * 清参数cache
     * @param module    模块
     * @param dom       虚拟dom
     */
    clearParam(module: Module, dom: IRenderedDom): void;
}
