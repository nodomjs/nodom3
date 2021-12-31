import { DirectiveManager } from "./directivemanager";
import { Util } from "./util";
/**
 * 虚拟dom
 */
export class VirtualDom {
    /**
     * @param tag       标签名
     * @param key       key
     */
    constructor(tag, key, module) {
        /**
         * staticNum 静态标识数
         *  0 表示静态，不进行比较
         *  > 0 每次比较后-1
         *  < 0 不处理
         */
        this.staticNum = 0;
        /**
         * 对应的所有表达式的字段都属于dom model内
         */
        this.allModelField = true;
        this.key = key || ((module ? module.getDomKeyId() : Util.genId()) + '');
        if (tag) {
            this.tagName = tag;
        }
    }
    /**
     * 移除多个指令
     * @param directives 	待删除的指令类型数组或指令类型
     */
    removeDirectives(directives) {
        if (!this.directives) {
            return;
        }
        //数组
        directives.forEach(d => {
            this.removeDirective(d);
        });
    }
    /**
     * 移除指令
     * @param directive 	待删除的指令类型名
     */
    removeDirective(directive) {
        if (!this.directives) {
            return;
        }
        let ind;
        if ((ind = this.directives.findIndex(item => item.type.name === directive)) !== -1) {
            this.directives.splice(ind, 1);
        }
        if (this.directives.length === 0) {
            delete this.directives;
        }
    }
    /**
     * 添加指令
     * @param directive     指令对象
     * @param sort          是否排序
     */
    addDirective(directive, sort) {
        if (!this.directives) {
            this.directives = [];
        }
        else if (this.directives.find(item => item.type.name === directive.type.name)) {
            return;
        }
        this.directives.push(directive);
        //指令按优先级排序
        if (sort) {
            this.sortDirective();
        }
    }
    /**
     * 指令排序
     */
    sortDirective() {
        if (!this.directives) {
            return;
        }
        if (this.directives.length > 1) {
            this.directives.sort((a, b) => {
                return DirectiveManager.getType(a.type.name).prio < DirectiveManager.getType(b.type.name).prio ? -1 : 1;
            });
        }
    }
    /**
     * 是否有某个类型的指令
     * @param typeName 	    指令类型名
     * @returns             true/false
     */
    hasDirective(typeName) {
        return this.directives && this.directives.findIndex(item => item.type.name === typeName) !== -1;
    }
    /**
     * 获取某个类型的指令
     * @param module            模块
     * @param directiveType 	指令类型名
     * @returns                 指令对象
     */
    getDirective(directiveType) {
        if (!this.directives) {
            return;
        }
        return this.directives.find(item => item.type.name === directiveType);
    }
    /**
     * 添加子节点
     */
    add(dom) {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(dom);
    }
    /**
     * 是否存在某个class
     * @param cls   class name
     * @return      true/false
     */
    hasClass(module, cls) {
        let classes = this.getParam(module, '$classes');
        if (!classes) {
            return false;
        }
        return classes.includes(cls);
    }
    /**
     * 初始化class数组
     */
    initClassArr() {
        let classes = this.classArr;
        if (classes) {
            return;
        }
        this.classArr = [];
        let clazz = this.getProp('class');
        if (clazz) {
            this.classArr = clazz.trim().split(/\s+/);
            this.setProp('class', this.classArr.join(' '));
        }
    }
    /**
     * 添加css class
     * @param cls class名,可以多个，以“空格”分割
     */
    addClass(cls) {
        this.initClassArr();
        let classes = this.classArr;
        let arr = cls.trim().split(/\s+/);
        let change = false;
        for (let a of arr) {
            if (!classes.includes(a)) {
                change = true;
                classes.push(a);
            }
        }
        if (change) {
            this.setProp('class', classes.join(' '));
            this.setStaticOnce();
        }
    }
    /**
     * 删除css class
     * @param cls class名,可以多个，以“空格”分割
     */
    removeClass(cls) {
        let classes = this.classArr;
        if (!classes) {
            return;
        }
        let arr = cls.trim().split(/\s+/);
        let change = false;
        for (let a of arr) {
            let ind;
            if ((ind = classes.indexOf(a)) !== -1) {
                change = true;
                classes.splice(ind, 1);
            }
        }
        if (change) {
            if (classes.length === 0) {
                this.delProp('class');
            }
            else {
                this.setProp('class', classes.join(' '));
            }
            this.setStaticOnce();
        }
    }
    /**
     * 初始化style map
     */
    initStyleMap() {
        if (this.styleMap) {
            return;
        }
        this.styleMap = new Map();
        let styles = this.styleMap;
        let oriStyle = this.getProp('style');
        if (oriStyle) {
            let sa = oriStyle.trim().split(/\s*;\s*/);
            for (let s of sa) {
                let sa1 = s.split(/\s*:\s*/);
                styles.set(sa1[0], sa[1]);
            }
        }
    }
    /**
     * 添加style
     *  @param styleStr style字符串
     */
    addStyle(styleStr) {
        this.initStyleMap();
        let change = false;
        let sa = styleStr.trim().split(/\s*;\s*/);
        let styles = this.styleMap;
        for (let s of sa) {
            if (s === '') {
                continue;
            }
            let sa1 = s.split(/\s*:\s*/);
            if (!styles.has(sa1[0]) || styles.get(sa1[0]) !== sa1[1]) {
                change = true;
                styles.set(sa1[0], sa1[1]);
            }
        }
        if (change) {
            this.setProp('style', [...styles].map(item => item.join(':')).join(';'));
            this.setStaticOnce();
        }
    }
    /**
     * 删除style
     * @param styleStr style字符串，可以是stylename:stylevalue[;...]或stylename1;stylename2
     */
    removeStyle(styleStr) {
        let styles = this.styleMap;
        if (!styles) {
            return;
        }
        let change = false;
        let sa = styleStr.trim().split(/\s*;\s*/);
        for (let s of sa) {
            let sa1 = s.split(/\s*:\s*/);
            if (!sa1[1] && styles.has(sa1[0]) || styles.get(sa1[0]) === sa1[1]) {
                change = true;
                styles.delete(sa1[0]);
            }
        }
        if (change) {
            if (styles.size === 0) {
                this.delProp('style');
            }
            else {
                this.setProp('style', [...styles].map(item => item.join(':')).join(';'));
            }
            this.setStaticOnce();
        }
    }
    /**
     * 是否拥有属性
     * @param propName  属性名
     * @param isExpr    是否只检查表达式属性
     */
    hasProp(propName) {
        if (this.props) {
            return this.props.has(propName);
        }
    }
    /**
     * 获取属性值
     * @param propName  属性名
     * @param isExpr    是否只获取表达式属性
     */
    getProp(propName, isExpr) {
        if (this.props) {
            return this.props.get(propName);
        }
    }
    /**
     * 设置属性值
     * @param propName  属性名
     * @param v         属性值
     */
    setProp(propName, v) {
        if (!this.props) {
            this.props = new Map();
        }
        this.props.set(propName, v);
    }
    /**
     * 删除属性
     * @param props     属性名或属性名数组
     */
    delProp(props) {
        if (!this.props) {
            return;
        }
        if (Util.isArray(props)) {
            for (let p of props) {
                this.props.delete(p);
            }
        }
        else {
            this.props.delete(props);
        }
        //设置静态标志，至少要比较一次
        this.setStaticOnce();
    }
    /**
     * 设置asset
     * @param assetName     asset name
     * @param value         asset value
     */
    setAsset(assetName, value) {
        if (!this.assets) {
            this.assets = new Map();
        }
        this.assets.set(assetName, value);
    }
    /**
     * 删除asset
     * @param assetName     asset name
     */
    delAsset(assetName) {
        if (!this.assets) {
            return;
        }
        this.assets.delete(assetName);
    }
    /**
     * 获取html dom
     * @param module    模块
     * @returns         对应的html dom
     */
    getEl(module) {
        return module.getNode(this.key);
    }
    /**
     * 查找子孙节点
     * @param key 	element key
     * @returns		虚拟dom/undefined
     */
    query(key) {
        if (this.key === key) {
            return this;
        }
        if (this.children) {
            for (let i = 0; i < this.children.length; i++) {
                let dom = this.children[i].query(key);
                if (dom) {
                    return dom;
                }
            }
        }
    }
    /**
     * 设置cache参数
     * @param module    模块
     * @param name      参数名
     * @param value     参数值
     */
    setParam(module, name, value) {
        module.objectManager.setDomParam(this.key, name, value);
    }
    /**
     * 获取参数值
     * @param module    模块
     * @param name      参数名
     * @returns         参数值
     */
    getParam(module, name) {
        return module.objectManager.getDomParam(this.key, name);
    }
    /**
     * 移除参数
     * @param module    模块
     * @param name      参数名
     */
    removeParam(module, name) {
        module.objectManager.removeDomParam(this.key, name);
    }
    /**
     * 设置单次静态标志
     */
    setStaticOnce() {
        if (this.staticNum !== -1) {
            this.staticNum = 1;
        }
    }
    /**
     * 克隆
     * @param changeKey     是否更改key，如果为true，则生成的节点用新的key
     */
    clone(module) {
        let dst = new VirtualDom(this.tagName, this.key);
        if (this.tagName) {
            //属性
            if (this.props && this.props.size > 0) {
                for (let p of this.props) {
                    dst.setProp(p[0], p[1]);
                }
            }
            if (this.assets && this.assets.size > 0) {
                for (let p of this.assets) {
                    dst.setAsset(p[0], p[1]);
                }
            }
            if (this.directives && this.directives.length > 0) {
                dst.directives = [];
                for (let d of this.directives) {
                    dst.directives.push(d.clone());
                }
            }
            //子节点clone
            if (this.children) {
                for (let c of this.children) {
                    dst.add(c.clone(module));
                }
            }
        }
        else {
            dst.expressions = this.expressions;
            dst.textContent = this.textContent;
        }
        dst.staticNum = this.staticNum;
        return dst;
    }
    /**
     * 保存事件
     * @param key       dom key
     * @param event     事件对象
     */
    addEvent(event) {
        if (!this.events) {
            this.events = [];
        }
        this.events.push(event);
    }
}
//# sourceMappingURL=virtualdom.js.map