import { DirectiveManager } from './directivemanager';
import { Util } from './util';
/**
 * 虚拟dom
 */
export class VirtualDom {
    /**
     * @param tag       标签名
     * @param key       key
     * @param module 	模块
     */
    constructor(tag, key, module) {
        this.key = key || (module ? module.getDomKeyId() : Util.genId());
        this.staticNum = 1;
        if (tag) {
            this.tagName = tag;
        }
    }
    /**
     * 移除多个指令
     * @param directives 	待删除的指令类型数组或指令类型
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    removeDirectives(directives) {
        if (!this.directives) {
            return;
        }
        //数组
        directives.forEach((d) => {
            this.removeDirective(d);
        });
    }
    /**
     * 移除指令
     * @param directive 	待删除的指令类型名
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    removeDirective(directive) {
        if (!this.directives) {
            return;
        }
        let ind;
        if ((ind = this.directives.findIndex((item) => item.type.name === directive)) !== -1) {
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
     * @returns             如果虚拟dom上的指令集不为空，且指令集中已经存在传入的指令对象，则返回void
     */
    addDirective(directive, sort) {
        if (!this.directives) {
            this.directives = [directive];
            return;
        }
        else if (this.directives.find((item) => item.type.name === directive.type.name)) {
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
     * @returns           如果虚拟dom上指令集为空，则返回void
     */
    sortDirective() {
        if (!this.directives) {
            return;
        }
        if (this.directives.length > 1) {
            this.directives.sort((a, b) => {
                return DirectiveManager.getType(a.type.name).prio <
                    DirectiveManager.getType(b.type.name).prio
                    ? -1
                    : 1;
            });
        }
    }
    /**
     * 是否有某个类型的指令
     * @param typeName 	    指令类型名
     * @returns             如果指令集不为空，且含有传入的指令类型名则返回true，否则返回false
     */
    hasDirective(typeName) {
        return this.directives && this.directives.find(item => item.type.name === typeName) !== undefined;
    }
    /**
     * 获取某个类型的指令
     * @param module            模块
     * @param directiveType 	指令类型名
     * @returns                 如果指令集为空，则返回void；否则返回指令类型名等于传入参数的指令对象
     */
    getDirective(directiveType) {
        if (!this.directives) {
            return;
        }
        return this.directives.find((item) => item.type.name === directiveType);
    }
    /**
     * 添加子节点
     * @param dom       子节点
     * @param index     指定位置，如果不传此参数，则添加到最后
     */
    add(dom, index) {
        if (!this.children) {
            this.children = [];
        }
        if (index) {
            this.children.splice(index, 0, dom);
        }
        else {
            this.children.push(dom);
        }
        dom.parent = this;
    }
    /**
     * 移除子节点
     * @param dom   子节点
     */
    remove(dom) {
        let index = this.children.indexOf(dom);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }
    /**
     * 添加css class
     * @param cls class名或表达式,可以多个，以“空格”分割
     */
    addClass(cls) {
        this.addProp('class', cls);
        //需要从remove class map 移除
        if (this.removedClassMap && this.removedClassMap.size > 0) {
            let arr = cls.trim().split(/\s+/);
            for (let a of arr) {
                if (a === '') {
                    continue;
                }
                this.removedClassMap.delete(a);
            }
        }
    }
    /**
     * 删除css class，因为涉及到表达式，此处只记录删除标识
     * @param cls class名,可以多个，以“空格”分割
     */
    removeClass(cls) {
        let pv = this.getProp('class');
        if (!pv) {
            return;
        }
        if (!this.removedClassMap) {
            this.removedClassMap = new Map();
        }
        let arr = cls.trim().split(/\s+/);
        for (let a of arr) {
            if (a === '') {
                continue;
            }
            this.removedClassMap.set(a, true);
        }
        this.setStaticOnce();
    }
    /**
     * 获取class串
     * @returns class 串
     */
    getClassString(values) {
        let clsArr = [];
        for (let pv of values) {
            let arr = pv.trim().split(/\s+/);
            for (let a of arr) {
                if (!this.removedClassMap || !this.removedClassMap.has(a)) {
                    if (!clsArr.includes(a)) {
                        clsArr.push(a);
                    }
                }
            }
        }
        if (clsArr.length > 0) {
            return clsArr.join(' ');
        }
    }
    /**
     * 添加style
     *  @param style style字符串或表达式
     */
    addStyle(style) {
        if (!style) {
            return;
        }
        this.addProp('style', style);
        if (typeof style === 'string') {
            //需要从remove class map 移除
            if (this.removedStyleMap && this.removedStyleMap.size > 0) {
                let arr = style.trim().split(/\s*;\s*/);
                for (let a of arr) {
                    if (a === '') {
                        continue;
                    }
                    let sa1 = a.split(/\s*:\s*/);
                    let p = sa1[0].trim();
                    if (p !== '') {
                        this.removedClassMap.delete(sa1[0].trim());
                    }
                }
            }
        }
        this.setStaticOnce();
    }
    /**
     * 删除style
     * @param styleStr style字符串，多个style以空格' '分割
     */
    removeStyle(styleStr) {
        if (!this.removedClassMap) {
            this.removedClassMap = new Map();
        }
        let arr = styleStr.trim().split(/\s+/);
        for (let a of arr) {
            if (a === '') {
                continue;
            }
            this.removedClassMap.set(a, true);
        }
        this.setStaticOnce();
    }
    /**
     * 获取style串
     * @returns style 串
     */
    getStyleString(values) {
        let map = new Map();
        for (let pv of values) {
            if (!pv) {
                continue;
            }
            let sa = pv.trim().split(/\s*;\s*/);
            for (let s of sa) {
                if (s === '') {
                    continue;
                }
                let sa1 = s.split(/\s*:\s*/);
                //不在移除style map才能加入
                if (!this.removedStyleMap || !this.removedStyleMap.has(sa1[0])) {
                    map.set(sa1[0], sa1[1]);
                }
            }
        }
        if (map.size > 0) {
            return [...map].map((item) => item.join(':')).join(';');
        }
    }
    /**
     * 是否拥有属性
     * @param propName  属性名
     * @param isExpr    是否只检查表达式属性
     * @returns         如果属性集含有传入的属性名返回true，否则返回false
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
     * @returns         传入属性名的value
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
        if (propName === 'style') {
            if (this.removedStyleMap) {
                //清空removedStyleMap
                this.removedStyleMap.clear();
            }
        }
        else if (propName === 'class') {
            if (this.removedClassMap) {
                //清空removedClassMap
                this.removedClassMap.clear();
            }
        }
        this.props.set(propName, v);
        this.setStaticOnce();
    }
    /**
     * 添加属性，如果原来的值存在，则属性值变成数组
     * @param pName     属性名
     * @param pValue    属性值
     */
    addProp(pName, pValue) {
        let pv = this.getProp(pName);
        if (!pv) {
            this.setProp(pName, pValue);
        }
        else if (Array.isArray(pv)) {
            if (pv.includes(pValue)) {
                return false;
            }
            pv.push(pValue);
        }
        else if (pv !== pValue) {
            this.setProp(pName, [pv, pValue]);
        }
        else {
            return false;
        }
        return true;
    }
    /**
     * 删除属性
     * @param props     属性名或属性名数组
     * @returns         如果虚拟dom上的属性集为空，则返回void
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
        this.setStaticOnce();
    }
    /**
     * 删除asset
     * @param assetName     asset name
     * @returns             如果虚拟dom上的直接属性集为空，则返回void
     */
    delAsset(assetName) {
        if (!this.assets) {
            return;
        }
        this.assets.delete(assetName);
        this.setStaticOnce();
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
     */
    clone() {
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
            //复制事件
            dst.events = this.events;
            //子节点clone
            if (this.children) {
                for (let c of this.children) {
                    dst.add(c.clone());
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
     * @param event     事件对象
     */
    addEvent(event) {
        if (!this.events) {
            this.events = [event];
        }
        else if (!this.events.includes(event)) {
            this.events.push(event);
        }
    }
}
//# sourceMappingURL=virtualdom.js.map