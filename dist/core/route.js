import { Router } from "./router";
import { Util } from "./util";
/**
 * 路由类
 */
export class Route {
    /**
     *
     * @param config 路由配置项
     */
    constructor(config) {
        /**
         * 路由参数名数组
         */
        this.params = [];
        /**
         * 路由参数数据
         */
        this.data = {};
        /**
         * 子路由
         */
        this.children = [];
        if (!config || Util.isEmpty(config.path)) {
            return;
        }
        //参数赋值
        for (let o in config) {
            this[o] = config[o];
        }
        this.id = Util.genId();
        Router.addRoute(this, config.parent);
        //子路由
        if (config.routes && Array.isArray(config.routes)) {
            config.routes.forEach((item) => {
                item.parent = this;
                new Route(item);
            });
        }
    }
    /**
     * 添加子路由
     * @param child
     */
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    /**
     * 克隆
     * @returns 克隆对象
     */
    clone() {
        let r = new Route();
        Object.getOwnPropertyNames(this).forEach(item => {
            if (item === 'data') {
                return;
            }
            r[item] = this[item];
        });
        if (this.data) {
            r.data = Util.clone(this.data);
        }
        return r;
    }
}
//# sourceMappingURL=route.js.map