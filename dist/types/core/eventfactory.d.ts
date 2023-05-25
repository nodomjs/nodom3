import { NEvent } from "./event";
import { Module } from "./module";
import { IRenderedDom } from "./types";
/**
 * 事件工厂
 * 每个模块一个事件工厂，用于管理模块内虚拟dom对应的事件对象
 */
export declare class EventFactory {
    /**
     * 所属模块
     */
    private module;
    /**
     * 事件map
     * key:虚拟domkey，
     * value: {
     *          eventName1:
     *            {
     *              own:[event对象,...],
     *              delg:[{key:被代理key,event:event对象},...],
     *              toDelg:[event对象],
     *              capture:useCapture
     *           },
     *           eventName2:...
     *           bindMap:{},
     *        }
     *    eventName:事件名，如click等
     *    配置项:
     *        own:自己的事件数组,
     *        delg:代理事件数组（代理子对象）,
     *        bindMap:已绑定事件map，其中键为事件名，值为capture，解绑时需要
     *        capture:在own和delg都存在时，如果capture为true，则先执行own，再执行delg，为false时则相反。
     *                如果只有own，则和html event的cature事件处理机制相同
     */
    private eventMap;
    /**
     * domkey对应event对象数组
     * key: dom key
     * value: NEvent数组
     */
    private addedEvents;
    /**
     * 构造器
     * @param module 模块
     */
    constructor(module: Module);
    /**
     * 保存事件
     * @param key       dom key
     * @param event     事件对象
     */
    addEvent(dom: IRenderedDom, event: NEvent): void;
    /**
     * 添加到dom的own或delg事件队列
     * @param key       dom key
     * @param event     事件对象
     * @param key1      被代理dom key，仅对代理事件有效
     */
    private addToArr;
    /**
     * 获取事件对象
     * @param key   dom key
     * @returns     事件对象
     */
    getEvent(key: number): any;
    /**
     * 删除事件
     * @param event     事件对象
     * @param key       对应dom keys
     */
    removeEvent(dom: IRenderedDom, event: NEvent): void;
    /**
     * 绑定dom事件
     * @param dom   渲染dom节点
     */
    bind(dom: IRenderedDom): void;
    /**
     * 从eventfactory解绑所有事件
     * @param key           dom key
     * @param eventName     事件名
     */
    unbind(key: number, eventName: string): void;
    /**
     * 解绑html element事件
     * @param key   dom key
     */
    unbindAll(key: number): void;
    /**
     * 是否拥有key对应的事件对象
     * @param key   dom key
     * @returns     如果key对应事件存在，返回true，否则返回false
     */
    hasEvent(key: number): boolean;
    /**
     * 清除工厂所有事件
     */
    clear(): void;
    /**
     * 事件handler
     * @param module    模块
     * @param e         HTML Event
     */
    private handler;
}
