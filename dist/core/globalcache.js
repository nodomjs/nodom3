import { NCache } from "./cache";
/**
 * 全局缓存
 */
export class GlobalCache {
    /**
         * 保存到cache
         * @param key       键，支持"."
         * @param value     值
         */
    static set(key, value) {
        this.cache.set(key, value);
    }
    /**
     * 从cache读取
     * @param key   键，支持"."
     * @returns     缓存的值或undefined
     */
    static get(key) {
        return this.cache.get(key);
    }
    /**
     * 订阅
     * @param module    订阅的模块
     * @param key       字段key
     * @param handler   回调函数 参数为key对应value
     */
    static subscribe(module, key, handler) {
        this.cache.subscribe(module, key, handler);
    }
    /**
     * 从cache移除
     * @param key   键，支持"."
     */
    static remove(key) {
        this.cache.remove(key);
    }
}
GlobalCache.cache = new NCache();
//# sourceMappingURL=globalcache.js.map