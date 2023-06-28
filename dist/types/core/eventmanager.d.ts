import { NEvent } from "./event";
import { Module } from "./module";
import { IRenderedDom } from "./types";
/**
 * 事件管理器
 */
export declare class EventManager {
    /**
     * 外部事件集
     */
    private static extendEventMap;
    /**
     * 处理外部事件
     * @param dom       dom节点
     * @param event     事件对象
     * @returns         如果有是外部事件，则返回true，否则返回false
     */
    static handleExtendEvent(module: Module, dom: IRenderedDom, event: NEvent): boolean;
    /**
     * 注册扩展事件
     * @param eventName    事件名
     * @param handleObj    事件处理集
     */
    static regist(eventName: string, handleObj: any): void;
    /**
     * 取消注册扩展事件
     * @param eventName     事件名
     */
    static unregist(eventName: string): boolean;
    /**
     * 获取扩展事件
     * @param eventName     事件名
     * @returns             事件处理集
     */
    static get(eventName: string): any;
}
