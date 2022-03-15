import { Util } from "./util";
/**
 * 路由类
 */
export class Route {
    /**
     *
     * @param config 路由配置项
     */
    constructor(config, parent) {
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
        this.id = Util.genId();
        //参数赋值
        for (let o in config) {
            this[o] = config[o];
        }
        this.parent = parent;
        //解析路径
        if (this.path) {
            this.parse();
        }
        if (parent) {
            parent.addChild(this);
        }
        //子路由
        if (config.routes && Array.isArray(config.routes)) {
            config.routes.forEach((item) => {
                new Route(item, this);
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
     * 通过路径解析路由对象
     */
    parse() {
        let pathArr = this.path.split('/');
        let node = this.parent;
        let param = [];
        let paramIndex = -1; //最后一个参数开始
        let prePath = ''; //前置路径
        for (let i = 0; i < pathArr.length; i++) {
            let v = pathArr[i].trim();
            if (v === '') {
                pathArr.splice(i--, 1);
                continue;
            }
            if (v.startsWith(':')) { //参数
                if (param.length === 0) {
                    paramIndex = i;
                }
                param.push(v.substring(1));
            }
            else {
                paramIndex = -1;
                param = []; //上级路由的参数清空
                this.path = v; //暂存path
                let j = 0;
                for (; j < node.children.length; j++) {
                    let r = node.children[j];
                    if (r.path === v) {
                        node = r;
                        break;
                    }
                }
                //没找到，创建新节点
                if (j === node.children.length) {
                    if (prePath !== '') {
                        new Route({ path: prePath }, node);
                        node = node.children[node.children.length - 1];
                    }
                    prePath = v;
                }
            }
            //不存在参数
            this.params = paramIndex === -1 ? [] : param;
        }
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