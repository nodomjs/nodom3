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
     * 绑定事件
     * @param module 
     * @param dom 
     */
    public static bind(module:Module,dom:IRenderedDom){
        const eobj = module.eventFactory.getEvent(dom.key);
        if(!eobj){
            return;
        }
        
        //判断并设置事件绑定标志
        const parent = dom.parent;
        for (let evt of eobj) {
            if(evt[0] === 'bindMap'){
                continue;
            }
            
            //代理事件
            if(evt[1].toDelg){
                for(let i=0;i<evt[1].toDelg.length;i++){
                    let ev = evt[1].toDelg[i];
                    //事件添加到父dom
                    module.eventFactory.addEvent(parent.key,ev,dom.key);
                    module.eventFactory.bind(parent.key,evt[0],handler,ev.capture);
                }
            }
            //自己的事件
            if(evt[1].own){
                // 保存handler
                module.eventFactory.bind(dom.key,evt[0],handler,evt[1].capture);
            }
        }
        
        /**
         * 事件handler
         * @param e  Event
         */
        function handler(e) {
            //从事件element获取事件
            let el = e.currentTarget;
            const dom = module.getVirtualDom(el['vdom']);
            const eobj = module.eventFactory.getEvent(dom.key);
            if(!dom || !eobj || !eobj.has(e.type)){
                return;
            }
            const evts = eobj.get(e.type);
            
            if(evts.capture){ //先执行自己的事件
                doOwn(evts.own);
                doDelg(evts.delg);
            }else{
                if(!doDelg(evts.delg)){
                    doOwn(evts.own);
                }
            }

            if(evts.own && evts.own.length === 0){
                delete evts.own;
            }
            if(evts.delg && evts.delg.length === 0){
                delete evts.delg;
            }
            // if(!evts.own && !evts.delg){
            //     module.eventFactory.unbind(dom.key,e.type);
            // }

            /**
             * 处理自有事件
             * @param events 
             * @returns 
             */
            function doOwn(events){
                if(!events){
                    return;
                }
                let nopopo = false;
                for(let i=0;i<events.length;i++){
                    const ev = events[i];
                    if(typeof ev.handler === 'string'){
                        ev.handler = ev.module.getMethod(ev.handler);
                    }
                    if(!ev.handler){
                        return;
                    }
                    ev.handler.apply((ev.module||module),[dom.model, dom,ev, e]);
                    if(ev.once){  //移除事件
                        events.splice(i--,1);
                    }
                    nopopo = ev.nopopo;
                }
                if(nopopo){
                    e.stopPropagation();
                }
            }

            /**
             * 处理代理事件
             * @param events 
             * @returns         是否禁止冒泡
             */
            function doDelg(events):boolean{
                if(!events){
                    return false;
                }
                let nopopo = false;
                for(let i=0;i<events.length;i++){
                    const evo = events[i];
                    const ev = evo.event;
                    if(typeof ev.handler === 'string'){
                        ev.handler = ev.module.getMethod(ev.handler);
                    }
                    if(!ev.handler){
                        return;
                    }

                    for(let j=0;j<e.path.length&&e.path[j]!==el;j++){
                        if(e.path[j]['vdom'] === evo.key){
                            let dom1 = module.getVirtualDom(evo.key);
                            ev.handler.apply((ev.module||module),[dom1.model, dom1,ev, e]);
                            nopopo = ev.nopopo;
                            if(ev.once){  //移除代理事件，需要从被代理元素删除
                                //从当前dom删除
                                events.splice(i--,1);
                                //从被代理dom删除
                                module.eventFactory.removeEvent(dom1.key,ev,null,true);
                            }
                            break;
                        }
                    }
                }
                return nopopo;
            }
        }
    }

    
    /**
     * 处理外部事件
     * @param dom       dom节点
     * @param event     事件对象
     * @returns         如果有是外部事件，则返回true，否则返回false
     */
    private static handleExtendEvent(module:Module,dom:IRenderedDom,event:NEvent):boolean{
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
            module.eventFactory.addEvent(dom.key,ev);
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
