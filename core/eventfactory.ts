import { NEvent } from "./event";
import { Module } from "./module";
import { RenderedDom } from "./types";

/**
 * 事件工厂
 * 每个模块一个事件工厂，用于管理模块内虚拟dom对应的事件对象
 */
export class EventFactory{
    /**
     * 所属模块
     */
    private module:Module;
    /**
     * 事件map
     * key:虚拟domkey，
     * value: object
     * ```js
     * {
     *      bindMap:{},
     *      eventName1:{
     *          own:[event对象,...],
     *          delg:[{key:被代理key,event:event对象,...],
     *          toDelg:[event对象],
     *          capture:useCapture
     *      },
     *      eventName2:,
     *      eventNamen:
     * }
     * ```
     * 其中：
     *    eventName:事件名，如click等
     *    配置项说明:
     *      bindMap:已绑定事件map，其中键为事件名，值为capture，解绑时需要
     *      own:自己的事件数组
     *      delg:代理事件数组（代理子对象）
     *      capture:在own和delg都存在时，如果capture为true，则先执行own，再执行delg，为false时则相反。如果只有own，则和html event的cature事件处理机制相同。
     */
    private eventMap:Map<number|string,object>;

    /**
     * domkey对应event对象数组
     * key: dom key
     * value: NEvent数组
     */
    private addedEvents:Map<number|string,NEvent[]>;

    /**
     * 构造器
     * @param module - 模块
     */
    constructor(module:Module){
        this.module = module;
        this.eventMap = new Map();
        this.addedEvents = new Map();
    }

    /**
     * 保存事件
     * @param key -       dom key 
     * @param event -     事件对象
     */
    public addEvent(dom:RenderedDom,event: NEvent):boolean{
        const key = dom.key;
        //判断是否已添加，避免重复添加
        if(this.addedEvents.has(key) && this.addedEvents.get(key).includes(event)){
            return false;
        }
        //代理事件，如果无父节点，则直接处理为自有事件
        if(event.delg){
            if(dom.parent){
                this.addToArr(dom.parent.key,event,dom.key);
            }else{ //不存在父对象，设置delg为false
                event.delg = false;
            }
        }
        // 自有事件
        if(!event.delg){
            this.addToArr(dom.key,event);
        }
        //添加到addedEvents
        if(!this.addedEvents.has(key)){
            this.addedEvents.set(key,[event]);
        }else{
            this.addedEvents.get(key).push(event);
        }
        return true;
    }

    /**
     * 添加到dom的own或delg事件队列
     * @param key -       dom key 
     * @param event -     事件对象
     * @param key1 -      被代理dom key，仅对代理事件有效
     */
    private addToArr(key:number|string,event:NEvent,key1?:number|string){
        let cfg;
        if(!this.eventMap.has(key)){
            cfg = {bindMap:{}};
            this.eventMap.set(key,cfg);
        }else{
            cfg = this.eventMap.get(key);
        }
        if(!cfg[event.name]){
            cfg[event.name] = { //eventname对应配置不存在
                delg:[],
                own:[]
            }
        }
        //类型：delg或own
        let type;
        let value;
        //代理事件
        if(key1){
            type = 'delg';
            value = {key:key1,event:event};
        }else{ //非代理事件
            type = 'own';
            value = event;
            cfg[event.name].capture = event.capture||false;
        }
        cfg[event.name][type].push(value);
    }

    /**
     * 获取事件对象
     * @param key -   dom key
     * @returns     事件对象
     */
    public getEvent(key:number):object{
        return this.eventMap.get(key);
    }

    /**
     * 移除所有事件
     * @param dom - 
     */
    public removeAllEvents(dom:RenderedDom){
        if(!this.addedEvents.has(dom.key)){
            return;
        }
        for(const ev of this.addedEvents.get(dom.key)){
            this.removeEvent(dom,ev);
        }
        this.addedEvents.delete(dom.key);
    }   
    /**
     * 删除事件
     * @param event -     事件对象
     * @param key -       对应dom keys
     */
    public removeEvent(dom:RenderedDom,event: NEvent) {
        if(!this.addedEvents.has(dom.key) || !this.addedEvents.get(dom.key).includes(event)){
            return;
        }
        //从dom event数组移除
        const arr = this.addedEvents.get(dom.key);
        arr.splice(arr.indexOf(event),1);
        //处理delg和own数组
        if(event.delg){ //代理事件
            //找到父对象
            if(!dom.parent || !this.eventMap.has(dom.parent.key)){
                return;
            }
            const cfg = this.eventMap.get(dom.parent.key);
            if(!cfg[event.name]){
                return;
            }
            const obj = cfg[event.name];
            const index = obj.delg.findIndex(item=>item.key===dom.key && item.event===event);
            if(index !== -1){
                obj.delg.splice(index,1);
            }
        }else{ //own
            const cfg = this.eventMap.get(dom.key);
            if(!cfg[event.name]){
                return;
            }
            const obj = cfg[event.name];
            const index = obj.own.findIndex(item=>item===event);
            if(index !== -1){
                obj.own.splice(index,1);
            }
        }
    }

    /**
     * 绑定dom事件
     * @param key -   dom key
     */
    public bind(key:string|number){
        if(!this.eventMap.has(key)){
            return;
        }
        const el = this.module.getElement(key);
        const cfg = this.eventMap.get(key);
        for(const key of Object.keys(cfg)){
            // bindMap 不是事件名
            if(key === 'bindMap'){
                continue;
            }
            el.addEventListener(key,handler,cfg[key].capture);
            cfg['bindMap'][key] = {handler:handler,capture:cfg[key].capture};
        }
        const me = this;
        function handler(e){
            me.handler.apply(me,[me.module,e]);
        }
    }

    /**
     * 从eventfactory解绑所有事件
     * @param key -           dom key
     * @param eventName -     事件名
     */
    public unbind(key:number,eventName:string){
        if(!this.eventMap.has(key)){
            return;
        }
        const eobj = this.eventMap.get(key);
        if(!eobj['bindMap'] || !eobj[eventName]){
            return;
        }
        const el = this.module.getElement(key);
        const cfg = eobj['bindMap'][eventName];
        //从html element解绑
        if(el && cfg){
            el.removeEventListener(eventName,cfg.handler,cfg.capture);
        }
        delete eobj['bindMap'][eventName];
    }

    /**
     * 解绑html element事件
     * @param key -   dom key
     */
    public unbindAll(key:number|string){
        if(!this.eventMap.has(key)){
            return;
        }
        const eobj = this.eventMap.get(key);
        if(!eobj['bindMap']){
            return;
        }
        const el = this.module.getElement(key);
        if(el){
            for(const key of Object.keys(eobj['bindMap'])){
                const v = eobj['bindMap'][key];
                el.removeEventListener(key,v.handler,v.capture);
            }
        }
        eobj['bindMap'] = {};
    }

    /**
     * 是否拥有key对应的事件对象
     * @param key -   dom key
     * @returns     如果key对应事件存在，返回true，否则返回false
     */
    public hasEvent(key:number):boolean{
        return this.eventMap.has(key);
    }

    /**
     * 清除工厂所有事件
     */
    public clear(){
        //解绑事件
        for(const key of this.addedEvents.keys()){
            this.unbindAll(key);
        }
        this.addedEvents.clear();
        this.eventMap.clear();
    }

    /**
     * 事件handler
     * @param module - 模块
     * @param e - HTML Event
     */
    private handler(module,e){
        //从事件element获取事件
        const el = e.currentTarget;
        const key = el.key;
        const dom = module.domManager.getRenderedDom(key);
        if(!dom){
            return;
        }
        const eobj = this.eventMap.get(key);
        if(!eobj || !eobj[e.type]){
            return;
        }
        const evts = eobj[e.type];
        if(evts.capture){ //先执行自己的事件
            doOwn(evts.own);
            doDelg(evts.delg);
        }else{
            if(!doDelg(evts.delg)){
                doOwn(evts.own);
            }
        }
    
        /**
         * 处理自有事件
         * @param events - 
         * @returns 
         */
        function doOwn(events){
            if(!events){
                return;
            }
            // 禁止冒泡为false，如果绑定的多个事件中存在1个nopopo，则全部nopopo
            let nopopo = false;
            for(let i=0;i<events.length;i++){
                const ev = events[i];
                if(!ev.handler){
                    continue;
                }
                //外部事件且为根dom，表示为父模块外部传递事件，则model为模块srcDom对应model，否则使用dom对应model
                const model = ev.module!==module&&dom.key===1?module.srcDom.model:dom.model;
                //判断为方法名还是函数
                if(typeof ev.handler === 'string'){
                    ev.module.invokeMethod(ev.handler,model,dom,ev,e);
                }else if(typeof ev.handler === 'function'){
                    ev.handler.apply(ev.module,[model,dom,ev,e]);
                }
                // 只执行1次，则handler置空
                if(ev.once){
                    ev.handler = undefined;
                }
                if(!nopopo){
                    nopopo = ev.nopopo;
                }
            }
            if(nopopo){
                e.stopPropagation();
            }
        }

        /**
         * 处理代理事件
         * @param events - 
         * @returns         是否禁止冒泡
         */
        function doDelg(events):boolean{
            if(!events){
                return false;
            }
            const elArr = e.path || (e.composedPath?e.composedPath():[]);
            let nopopo = false;
            for(let i=0;i<events.length;i++){
                const evo = events[i];
                const ev = evo.event;
                for(let j=0;j<elArr.length && elArr[j]!==el;j++){
                    const k = elArr[j].key;
                    if(k === evo.key){
                        const dom1 = dom.children.find(item=>item.key===k);
                        if(!dom1){
                            continue;
                        }
                        //外部事件且为根dom，表示为父模块外部传递事件，则model为模块srcDom对应model，否则使用dom对应model
                        const model = ev.module!==module&&dom1.key===1?module.srcDom.model:dom1.model;
                        if(typeof ev.handler === 'string'){
                            ev.module.invokeMethod(ev.handler,model,dom1,ev, e);
                        }else if(typeof ev.handler === 'function'){
                            ev.handler.apply(ev.module,model,dom1,ev,e);
                        }
                        // 保留nopopo
                        nopopo = ev.nopopo;
                        // 只执行1次,移除代理事件
                        if(ev.once){  
                            //从当前dom删除
                            events.splice(i--,1);
                        }
                        break;
                    }
                }
            }
            return nopopo;
        }
    }
}