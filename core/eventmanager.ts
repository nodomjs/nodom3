import { NEvent } from "./event";
import { Module } from "./module";
import { IRenderedDom } from "./types";
/**
 * 事件管理器
 */
export class EventManager {
    /**
     * 外部事件集
     */
    private static extendEventMap = new Map();

    
    
    /**
     * 处理外部事件
     * @param dom       dom节点
     * @param event     事件对象
     * @returns         如果有是外部事件，则返回true，否则返回false
     */
    public static handleExtendEvent(module:Module,dom:IRenderedDom,event:NEvent):boolean{
        let evts = this.get(event.name);
        if (!evts) {
            return false;
        }
        for(let key of Object.keys(evts)){
            let ev = new NEvent(module,key,evts[key]);
            ev.capture = event.capture;
            ev.nopopo = event.nopopo;
            ev.delg = event.delg;
            ev.once = event.once;
            //设置依赖事件
            ev.dependEvent = event;
            module.eventFactory.addEvent(dom,ev);
        }
        return true;
    }

    /**
      * 注册扩展事件
      * @param eventName    事件名
      * @param handleObj    事件处理集
      */
    public static regist(eventName:string,handleObj:any) {
        this.extendEventMap.set(eventName,handleObj);
    }
 
    /**
     * 取消注册扩展事件
     * @param eventName     事件名
     */
    static unregist(eventName:string) {
        return this.extendEventMap.delete(eventName);
    }

    /**
     * 获取扩展事件
     * @param eventName     事件名
     * @returns             事件处理集
     */
    public static get(eventName:string):any{
        return this.extendEventMap.get(eventName);
    }
}
