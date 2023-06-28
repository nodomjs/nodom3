/**
 * 事件工厂
 * 每个模块一个事件工厂，用于管理模块内虚拟dom对应的事件对象
 */
export class EventFactory {
    /**
     * 构造器
     * @param module 模块
     */
    constructor(module) {
        this.module = module;
        this.eventMap = new Map();
        this.addedEvents = new Map();
    }
    /**
     * 保存事件
     * @param key       dom key
     * @param event     事件对象
     */
    addEvent(dom, event) {
        const key = dom.key;
        //判断是否已添加，避免重复添加
        if (this.addedEvents.has(key) && this.addedEvents.get(key).includes(event)) {
            return;
        }
        //代理事件，如果无父节点，则直接处理为自有事件
        if (event.delg) {
            if (dom.parent) {
                this.addToArr(dom.parent.key, event, dom.key);
            }
            else { //不存在父对象，设置delg为false
                event.delg = false;
            }
        }
        // 自有事件
        if (!event.delg) {
            this.addToArr(dom.key, event);
        }
        //添加到addedEvents
        if (!this.addedEvents.has(key)) {
            this.addedEvents.set(key, [event]);
        }
        else {
            this.addedEvents.get(key).push(event);
        }
    }
    /**
     * 添加到dom的own或delg事件队列
     * @param key       dom key
     * @param event     事件对象
     * @param key1      被代理dom key，仅对代理事件有效
     */
    addToArr(key, event, key1) {
        let cfg;
        if (!this.eventMap.has(key)) {
            cfg = { bindMap: {} };
            this.eventMap.set(key, cfg);
        }
        else {
            cfg = this.eventMap.get(key);
        }
        if (!cfg[event.name]) {
            cfg[event.name] = {
                delg: [],
                own: []
            };
        }
        //类型：delg或own
        let type;
        let value;
        //代理事件
        if (key1) {
            type = 'delg';
            value = { key: key1, event: event };
        }
        else { //非代理事件
            type = 'own';
            value = event;
            cfg[event.name].capture = event.capture || false;
        }
        cfg[event.name][type].push(value);
    }
    /**
     * 获取事件对象
     * @param key   dom key
     * @returns     事件对象
     */
    getEvent(key) {
        return this.eventMap.get(key);
    }
    /**
     * 移除所有事件
     * @param dom
     */
    removeAllEvents(dom) {
        if (!this.addedEvents.has(dom.key)) {
            return;
        }
        for (let ev of this.addedEvents.get(dom.key)) {
            this.removeEvent(dom, ev);
        }
        this.addedEvents.delete(dom.key);
    }
    /**
     * 删除事件
     * @param event     事件对象
     * @param key       对应dom keys
     */
    removeEvent(dom, event) {
        if (!this.addedEvents.has(dom.key) || !this.addedEvents.get(dom.key).includes(event)) {
            return;
        }
        //从dom event数组移除
        const arr = this.addedEvents.get(dom.key);
        arr.splice(arr.indexOf(event), 1);
        //处理delg和own数组
        if (event.delg) { //代理事件
            //找到父对象
            if (!dom.parent || !this.eventMap.has(dom.parent.key)) {
                return;
            }
            let cfg = this.eventMap.get(dom.parent.key);
            if (!cfg[event.name]) {
                return;
            }
            let obj = cfg[event.name];
            let index = obj.delg.findIndex(item => item.key === dom.key && item.event === event);
            if (index !== -1) {
                obj.delg.splice(index, 1);
                // 解绑事件
                // if(obj.delg.length===0 && obj.own.length===0){
                //     this.unbind(dom.parent.key,event.name);
                // }
            }
        }
        else { //own
            let cfg = this.eventMap.get(dom.key);
            if (!cfg[event.name]) {
                return;
            }
            let obj = cfg[event.name];
            let index = obj.own.findIndex(item => item === event);
            if (index !== -1) {
                obj.own.splice(index, 1);
                // 解绑事件
                // if(obj.delg.length === 0 && obj.own.length===0){
                //     this.unbind(dom.key,event.name);
                // }
            }
        }
    }
    /**
     * 绑定dom事件
     * @param key   dom key
     */
    bind(key) {
        if (!this.eventMap.has(key)) {
            return;
        }
        const el = this.module.getElement(key);
        const cfg = this.eventMap.get(key);
        for (let key of Object.keys(cfg)) {
            // bindMap 不是事件名
            if (key === 'bindMap') {
                continue;
            }
            el.addEventListener(key, handler, cfg[key].capture);
            cfg.bindMap[key] = { handler: handler, capture: cfg[key].capture };
        }
        const me = this;
        function handler(e) {
            me.handler.apply(me, [me.module, e]);
        }
    }
    /**
     * 从eventfactory解绑所有事件
     * @param key           dom key
     * @param eventName     事件名
     */
    unbind(key, eventName) {
        if (!this.eventMap.has(key)) {
            return;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj.bindMap || !eobj[eventName]) {
            return;
        }
        const el = this.module.getElement(key);
        const cfg = eobj.bindMap[eventName];
        //从html element解绑
        if (el && cfg) {
            el.removeEventListener(eventName, cfg.handler, cfg.capture);
        }
        delete eobj.bindMap[eventName];
    }
    /**
     * 解绑html element事件
     * @param key   dom key
     */
    unbindAll(key) {
        if (!this.eventMap.has(key)) {
            return;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj.bindMap) {
            return;
        }
        const el = this.module.getElement(key);
        if (el) {
            for (let key of Object.keys(eobj.bindMap)) {
                const v = eobj.bindMap[key];
                el.removeEventListener(key, v.handler, v.capture);
            }
        }
        eobj.bindMap = {};
    }
    /**
     * 是否拥有key对应的事件对象
     * @param key   dom key
     * @returns     如果key对应事件存在，返回true，否则返回false
     */
    hasEvent(key) {
        return this.eventMap.has(key);
    }
    /**
     * 清除工厂所有事件
     */
    clear() {
        //解绑事件
        for (let key of this.addedEvents.keys()) {
            this.unbindAll(key);
        }
        this.addedEvents.clear();
        this.eventMap.clear();
    }
    /**
     * 事件handler
     * @param module    模块
     * @param e         HTML Event
     */
    handler(module, e) {
        //从事件element获取事件
        let el = e.currentTarget;
        const key = el.key;
        const dom = module.domManager.getRenderedDom(key);
        if (!dom) {
            return;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj || !eobj[e.type]) {
            return;
        }
        const evts = eobj[e.type];
        if (evts.capture) { //先执行自己的事件
            doOwn(evts.own);
            doDelg(evts.delg);
        }
        else {
            if (!doDelg(evts.delg)) {
                doOwn(evts.own);
            }
        }
        /**
         * 处理自有事件
         * @param events
         * @returns
         */
        function doOwn(events) {
            if (!events) {
                return;
            }
            let nopopo = false;
            for (let i = 0; i < events.length; i++) {
                const ev = events[i];
                if (typeof ev.handler === 'string') {
                    ev.module.invokeMethod(ev.handler, dom.model, dom, ev, e);
                }
                else if (typeof ev.handler === 'function') {
                    ev.handler.apply(module, [dom.model, dom, ev, e]);
                }
                if (ev.once) { //移除事件
                    events.splice(i--, 1);
                }
                nopopo = ev.nopopo;
            }
            if (nopopo) {
                e.stopPropagation();
            }
        }
        /**
         * 处理代理事件
         * @param events
         * @returns         是否禁止冒泡
         */
        function doDelg(events) {
            if (!events) {
                return false;
            }
            const elArr = e.path || (e.composedPath ? e.composedPath() : []);
            let nopopo = false;
            for (let i = 0; i < events.length; i++) {
                const evo = events[i];
                const ev = evo.event;
                for (let j = 0; j < elArr.length && elArr[j] !== el; j++) {
                    const k = elArr[j].key;
                    if (k === evo.key) {
                        const dom1 = module.domManager.getRenderedDom(k);
                        if (typeof ev.handler === 'string') {
                            ev.module.invokeMethod(ev.handler, dom1.model, dom1, ev, e);
                        }
                        else if (typeof ev.handler === 'function') {
                            ev.handler.apply(ev.module, dom1.model, dom1, ev, e);
                        }
                        // 保留nopopo
                        nopopo = ev.nopopo;
                        if (ev.once) { //移除代理事件，需要从被代理元素删除
                            //从当前dom删除
                            events.splice(i--, 1);
                            //从被代理dom删除
                            const ind = module.eventFactory.get(k).indexOf(ev);
                            module.eventFactory.get(k).splice(ind, 1);
                        }
                        break;
                    }
                }
            }
            return nopopo;
        }
    }
}
//# sourceMappingURL=eventfactory.js.map