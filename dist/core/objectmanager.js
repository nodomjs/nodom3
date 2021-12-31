import { NCache } from "./cache";
/**
 * 指令管理器
 * $directives  指令集
 * $expressions 表达式集
 * $events      事件集
 * $savedoms    dom相关缓存 包括 html dom 和 参数
 * $doms        渲染树
 */
export class ObjectManager {
    /**
     * module   模块
     * @param module
     */
    constructor(module) {
        this.module = module;
        this.cache = new NCache();
    }
    /**
     * 保存到cache
     * @param key       键，支持"."
     * @param value     值
     */
    set(key, value) {
        this.cache.set(key, value);
    }
    /**
     * 从cache读取
     * @param key   键，支持"."
     * @returns     缓存的值或undefined
     */
    get(key) {
        return this.cache.get(key);
    }
    /**
     * 从cache移除
     * @param key   键，支持"."
     */
    remove(key) {
        this.cache.remove(key);
    }
    /**
     * 设置事件参数
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     * @param value     参数值
     */
    setEventParam(id, key, name, value) {
        this.cache.set('$events.' + id + '.$params.' + key + '.' + name, value);
    }
    /**
     * 获取事件参数值
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     * @returns         参数值
     */
    getEventParam(id, key, name) {
        return this.get('$events.' + id + '.$params.' + key + '.' + name);
    }
    /**
     * 移除事件参数
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     */
    removeEventParam(id, key, name) {
        this.remove('$events.' + id + '.$params.' + key + '.' + name);
    }
    /**
     * 清空事件参数
     * @param id        事件id
     * @param key       dom key
     */
    clearEventParam(id, key) {
        if (key) { //删除对应dom的事件参数
            this.remove('$events.' + id + '.$params.' + key);
        }
        else { //删除所有事件参数
            this.remove('$events.' + id + '.$params');
        }
    }
    /**
     * 设置dom参数值
     * @param key       dom key
     * @param name       参数名
     * @param value     参数值
     */
    setDomParam(key, name, value) {
        this.set('$domparam.' + key + '.' + name, value);
    }
    /**
     * 获取dom参数值
     * @param key       dom key
     * @param name      参数名
     * @returns         参数值
     */
    getDomParam(key, name) {
        return this.get('$domparam.' + key + '.' + name);
    }
    /**
     * 移除dom参数
     * @param key       dom key
     * @param name      参数名
     */
    removeDomParam(key, name) {
        this.remove('$domparam.' + key + '.' + name);
    }
    /**
     * 清除element 参数集
     * @param key   dom key
     */
    clearDomParams(key) {
        this.remove('$domparam.' + key);
    }
    /**
     * 清除缓存dom对象
     */
    clearAllDomParams() {
        this.remove('$domparam');
    }
}
//# sourceMappingURL=objectmanager.js.map