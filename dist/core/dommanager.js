import { ModuleFactory } from "./modulefactory";
/**
 * dom 管理器，用于管理模块的虚拟dom，旧渲染树
 */
export class DomManager {
    constructor(module) {
        /**
         *  key:html node映射
         */
        this.elementMap = new Map();
        this.module = module;
    }
    /**
     * 从origin tree 获取虚拟dom节点
     * @param key   dom key
     */
    getOriginDom(key) {
        if (!this.vdomTree) {
            return null;
        }
        return find(this.vdomTree);
        function find(dom) {
            if (dom.key === key) {
                return dom;
            }
            if (dom.children) {
                for (let d of dom.children) {
                    let d1 = find(d);
                    if (d1) {
                        return d1;
                    }
                }
            }
        }
    }
    /**
     * 从渲染树中获取key对应的渲染节点
     * @param key   dom key
     */
    getRenderedDom(key) {
        if (!this.renderedTree) {
            return;
        }
        return find(this.renderedTree, key);
        /**
         * 递归查找
         * @param dom   渲染dom
         * @param key   待查找key
         * @returns     key对应renderdom 或 undefined
         */
        function find(dom, key) {
            if (dom.key === key) {
                return dom;
            }
            if (dom.children) {
                for (let d of dom.children) {
                    if (!d) {
                        continue;
                    }
                    let d1 = find(d, key);
                    if (d1) {
                        return d1;
                    }
                }
            }
        }
    }
    /**
     * 克隆渲染后的dom节点
     * @param key   dom key或dom节点
     * @param deep  是否深度复制（复制子节点）
     */
    cloneRenderedDom(key, deep) {
        let src;
        if (typeof key === 'string') {
            src = this.getRenderedDom(key);
        }
        else {
            src = key;
        }
        if (!src) {
            return null;
        }
        let dst = {
            key: key,
            vdom: src.vdom,
            tagName: src.tagName,
            staticNum: src.staticNum,
            textContent: src.textContent,
            moduleId: src.moduleId
        };
        if (src.props) {
            dst.props = {};
            for (let k of Object.keys(src.props)) {
                dst.props[k] = src.props[k];
            }
        }
        if (src.assets) {
            dst.assets = {};
            for (let k of Object.keys(src.assets)) {
                dst.assets[k] = src.assets[k];
            }
        }
        if (deep && src.children) {
            dst.children = [];
            for (let c of src.children) {
                dst.children.push(this.cloneRenderedDom(c));
            }
        }
        return dst;
    }
    /**
     * 清除html element map 节点
     * @param dom   dom节点，如果为空，则清空map
     */
    clearElementMap(dom) {
        if (dom) {
            this.elementMap.delete(dom.key);
            //带自定义key的移除
            if (dom.props && dom.props['key']) {
                this.elementMap.delete(dom.props['key']);
            }
        }
        else {
            this.elementMap.clear();
        }
    }
    /**
     * 获取html node
     * @param key   dom key
     * @returns     html node
     */
    getElement(key) {
        return this.elementMap.get(key);
    }
    /**
     * save html node
     * @param key   dom key
     * @param node  html node
     */
    saveElement(key, node) {
        this.elementMap.set(key, node);
    }
    /**
     * 释放node
     * 包括从dom树解挂，释放对应结点资源
     * @param dom       虚拟dom
     */
    freeNode(dom) {
        if (dom.moduleId) { //子模块
            let m = ModuleFactory.get(dom.moduleId);
            if (m) {
                m.unmount();
            }
        }
        else { //普通节点
            //从map移除
            this.clearElementMap(dom);
            //解绑所有事件
            this.module.eventFactory.unbindAll(dom.key);
            //子节点递归操作
            if (dom.children) {
                for (let d of dom.children) {
                    this.freeNode(d);
                }
            }
        }
    }
    /**
     * 重置
     */
    reset() {
        this.renderedTree = null;
        this.elementMap.clear();
    }
}
//# sourceMappingURL=dommanager.js.map