import { NEvent } from "./event";
import { Module } from "./module";
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
     * 键 虚拟domkey，值 {eventName1:{own:[event对象,...],delg:[{key:被代理key,event:event对象},...],toDelg:[event对象],capture:useCapture,bindMap:{}}
     * own表示自己的事件，delg表示代理事件（代理子对象），capture表示是否使用capture，toDelg 表示需要被代理的对象
     * 其中 eventName为事件名，如click等，event对象为NEvent对象，
     * bindMap为已绑定事件map，其中键为 事件名，值为{handler:handler}，解绑时需要
     * 在own和delg都存在时，如果capture为true，则先执行own，在执行delg，为false时则相反。如果只有own，则和传统的cature事件处理机制相同
     */
    private eventMap;
    /**
     * 构造器
     * @param module 模块
     */
    constructor(module: Module);
    /**
     * 保存事件
     * @param key       dom key
     * @param event     事件对象
     * @param key1      当key1存在时，表示代理子dom事件
     */
    addEvent(key: string, event: NEvent, key1?: string): void;
    /**
     * 获取事件对象
     * @param key   dom key
     * @returns     事件对象
     */
    getEvent(key: string): any;
    /**
     * 删除事件
     * @param event     事件对象
     * @param key       对应dom keys
     * @param key1      被代理的dom key
     * @param toDelg    从待代理的数组移除（针对虚拟dom自己）
     */
    removeEvent(key: string, event: NEvent, key1?: string, toDelg?: boolean): void;
    /**
     * 绑定事件记录
     * 当绑定到html element时，需要记录
     * @param key           dom key
     * @param eventName     事件名
     * @param handler       事件处理器
     * @param capture       useCapture
     * @returns             是否绑定成功，如果已绑定或不存在，则返回false，否则返回true
     */
    bind(key: string, eventName: string, handler: any, capture: boolean): boolean;
    /**
     * 从eventfactory解绑所有事件
     * @param key           dom key
     * @param eventName     事件名
     */
    unbind(key: string, eventName: string): void;
    /**
     * 从eventfactory解绑事件
     * @param key           dom key
     */
    unbindAll(key: string): void;
    /**
     * 是否拥有key对应的事件对象
     * @param key   dom key
     * @returns     如果key对应事件存在，返回true，否则返回false
     */
    hasEvent(key: string): boolean;
    /**
     * 克隆事件对象
     * @param srcKey    源dom key
     * @param dstKey    目标dom key
     */
    cloneEvent(srcKey: string, dstKey: string): void;
}
