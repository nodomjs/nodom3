import { NEvent } from "./event";
import { Module } from "./module";

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
     * 键 虚拟domkey，值 {eventName1:{own:[event对象,...],delg:[{key:被代理key,event:event对象},...],toDelg:[event对象],capture:useCapture,bindMap:{}}
     * own表示自己的事件，delg表示代理事件（代理子对象），capture表示是否使用capture，toDelg 表示需要被代理的对象
     * 其中 eventName为事件名，如click等，event对象为NEvent对象，
     * bindMap为已绑定事件map，其中键为 事件名，值为{handler:handler}，解绑时需要
     * 在own和delg都存在时，如果capture为true，则先执行own，在执行delg，为false时则相反。如果只有own，则和传统的cature事件处理机制相同
     */
    private eventMap:Map<string,any>;

    /**
     * 构造器
     * @param module 模块
     */
    constructor(module:Module){
        this.module = module;
        this.eventMap = new Map();
    }

    /**
     * 保存事件
     * @param key       dom key 
     * @param event     事件对象
     * @param key1      当key1存在时，表示代理子dom事件
     */
    public addEvent(key:string,event: NEvent,key1?:string){
        let eobj;
        if(!this.eventMap.has(key)){
            this.eventMap.set(key,new Map());
        }
        eobj = this.eventMap.get(key);
        if(!eobj.has(event.name)){
            eobj.set(event.name,{});
        }
        let obj = eobj.get(event.name);
        if(key1){ //代理事件
            if(!obj.delg){
                obj.delg = [{key:key1,event:event}];
            }else{
                let arr = obj.delg;
                
                //事件不重复添加
                if(!arr.find(item=>item.key===key1 && item.event===event)){
                    arr.push({key:key1,event:event});
                }
            }
        }else{
            if(event.delg){ //需要被代理的对象
                if(!obj.toDelg){
                    obj.toDelg = [event];
                }else{
                    let arr = obj.toDelg;
                    //事件不重复添加
                    if(arr.findIndex(item=>item === event) === -1){
                        arr.push(event);
                    }
                }
            }else{
                if(!obj.own){
                    obj.own = [event];
                }else{
                    let arr = obj.own;
                    //事件不重复添加
                    if(arr.findIndex(item=>item === event) === -1){
                        arr.push(event);
                    }
                }
            }
            // 设置事件capture
            obj.capture = event.capture;
        }
    }

    /**
     * 获取事件对象
     * @param key   dom key
     * @returns     事件对象
     */
    public getEvent(key:string):any{
        return this.eventMap.get(key);
    }

    /**
     * 删除事件
     * @param event     事件对象
     * @param key       对应dom keys
     * @param key1      被代理的dom key
     * @param toDelg    从待代理的数组移除（针对虚拟dom自己）
     */
    public removeEvent(key:string,event: NEvent,key1?:string,toDelg?:boolean) {
        if(!this.eventMap.has(key)){
            return;
        }
        let eobj = this.eventMap.get(key);
        if(!eobj.has(event.name)){
            return;
        }
        let obj = eobj.get(event.name);
        if(key1){ //代理事件
            if(!obj.delg){
                return;
            }else{
                let index = obj.delg.findIndex(item=>item.key===key1 && item.event===event);
                if(index !== -1){
                    obj.delg.splice(index,1);
                    if(obj.delg.length===0){
                        delete obj.delg;
                    }
                }
            }
        }else if(toDelg && obj.toDelg){
            let index = obj.toDelg.findIndex(item=>item===event);
            if(index !== -1){
                obj.toDelg.splice(index,1);
                if(obj.toDelg.length === 0){
                    delete obj.toDelg;
                }
            }
        }else if(obj.own){
            let index = obj.own.findIndex(item=>item===event);
            if(index !== -1){
                obj.own.splice(index,1);
                if(obj.own.length === 0){
                    delete obj.own;
                }
            }
        }
    }

    /**
     * 绑定事件记录
     * 当绑定到html element时，需要记录
     * @param key           dom key
     * @param eventName     事件名
     * @param handler       事件处理器
     * @param capture       useCapture
     * @returns             是否绑定成功，如果已绑定或不存在，则返回false，否则返回true
     */
    bind(key:string,eventName:string,handler:any,capture:boolean):boolean{
        if(!this.eventMap.has(key)){
            return false;
        }
        const eobj = this.eventMap.get(key);
        
        if(!eobj.has(eventName)){
            return false;
        }
        
        if(!eobj.bindMap){
            eobj.bindMap = new Map();
        }else if(eobj.bindMap.has(eventName)){   //已绑定，不再绑
            return false;
        }
        const el = this.module.getNode(key);
        
        if(el){
            el.addEventListener(eventName,handler,capture);
        }
        eobj.bindMap.set(eventName,{
            handler:handler,
            capture:capture
        });
        return true;
    }

    /**
     * 从eventfactory解绑所有事件
     * @param key           dom key
     * @param eventName     事件名
     */
     unbind(key:string,eventName:string){
        if(!this.eventMap.has(key)){
            return;
        }
        const eobj = this.eventMap.get(key);
        if(!eobj.bindMap || !eobj.has(eventName)){
            return;
        }
        const el = this.module.getNode(key);
        const cfg = eobj.bindMap.get(eventName);
        //从html element解绑
        if(el && cfg){
            el.removeEventListener(eventName,cfg.handler,cfg.capture);
        }
        eobj.bindMap.delete(eventName);
    }

    /**
     * 从eventfactory解绑事件
     * @param key           dom key
     */
    unbindAll(key:string){
        if(!this.eventMap.has(key)){
            return;
        }
        const eobj = this.eventMap.get(key);
        if(!eobj.bindMap){
            return;
        }
        const el = this.module.getNode(key);
        if(el){
            for(let evt of eobj.bindMap){
                el.removeEventListener(evt[0],evt[1].handler,evt[1].capture);
            }
        }
        eobj.bindMap.clear();
    }

    /**
     * 是否拥有key对应的事件对象
     * @param key   dom key
     * @returns     如果key对应事件存在，返回true，否则返回false
     */
    hasEvent(key:string):boolean{
        return this.eventMap.has(key);
    }

    /**
     * 克隆事件对象
     * @param srcKey    源dom key 
     * @param dstKey    目标dom key
     */
    cloneEvent(srcKey:string,dstKey:string){
        if(srcKey === dstKey){
            return;
        }
        let eObj = this.eventMap.get(srcKey);
        if(!eObj){
            return;
        }
        let map = new Map();
        for(let evt of eObj){
            if(evt[0] === 'bindMap'){ //bindMap不复制
                continue;
            }
            let obj = {capture:evt[1].capture};
            if(evt[1].own){
                obj['own'] = evt[1].own.slice(0);    
            }
            if(evt[1].delg){
                obj['delg'] = evt[1].delg.slice(0);
            }
            if(evt[1].toDelg){
                obj['toDelg'] = evt[1].toDelg.slice(0);
            }
            map.set(evt[0],obj);
        }
        this.eventMap.set(dstKey,map);
    }
}