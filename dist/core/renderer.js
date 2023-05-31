import { ModuleFactory } from "./modulefactory";
import { Expression } from "./expression";
import { CssManager } from "./cssmanager";
import { Util } from "./util";
/**
 * 渲染器
 */
export class Renderer {
    /**
     * 添加到渲染列表
     * @param module 模块
     */
    static add(module) {
        //如果已经在列表中，不再添加
        if (!this.waitList.includes(module.id)) {
            //计算优先级
            this.waitList.push(module.id);
        }
    }
    /**
     * 从渲染队列移除
     * @param moduleId
     */
    static remove(moduleId) {
        let index;
        if ((index = this.waitList.indexOf(moduleId)) !== -1) {
            //不能破坏watiList顺序，用null替换
            this.waitList.splice(index, 1, null);
        }
    }
    /**
     * 队列渲染
     */
    static render() {
        for (; this.waitList.length > 0;) {
            let id = this.waitList[0];
            if (id) { //存在id为null情况，remove方法造成
                const m = ModuleFactory.get(id);
                m.render();
            }
            //渲染后移除
            this.waitList.shift();
        }
    }
    /**
     * 渲染dom
     * @param module            模块
     * @param src               源dom
     * @param model             模型，如果src已经带有model，则此参数无效，一般为指令产生的model（如slot）
     * @param parent            父dom
     * @param key               key 附加key，放在domkey的后面
     * @returns
     */
    static renderDom(module, src, model, parent, key) {
        //构建key，如果带key，则需要重新构建唯一key
        const key1 = key ? Util.genUniqueKey(src.key, key) : src.key;
        //设置model
        model = src.model || model;
        let dst = {
            key: key1,
            vdom: src
        };
        if (src.tagName) {
            dst.tagName = src.tagName;
            //添加key属性
            dst.props = {};
        }
        else {
            dst.textContent = src.textContent;
        }
        //设置当前根root
        if (!parent) {
            this.currentModuleRoot = dst;
            //设置根model
            if (!model) {
                model = module.model;
            }
        }
        else {
            if (!model) {
                model = parent.model;
            }
            // 设置父对象
            dst.parent = parent;
        }
        dst.model = model;
        dst.staticNum = src.staticNum;
        //先处理model指令
        if (src.directives && src.directives.length > 0 && src.directives[0].type.name === 'model') {
            src.directives[0].exec(module, dst);
        }
        if (dst.tagName) { //标签节点
            handleProps();
            //处理style，如果为style，则不处理assets和events
            if (!CssManager.handleStyleDom(module, src, Renderer.currentModuleRoot, src.getProp('scope') === 'this')) {
                //assets
                if (src.assets && src.assets.size > 0) {
                    for (let p of src.assets) {
                        dst[p[0]] = p[1];
                    }
                }
            }
            //处理directive时，导致禁止后续渲染，则不再渲染，如show指令
            if (!handleDirectives()) {
                return null;
            }
            //添加dst事件到事件工厂
            if (src.events) {
                for (let evt of src.events) {
                    module.eventFactory.addEvent(dst, evt);
                }
            }
            // 子节点渲染
            if (src.children && src.children.length > 0) {
                dst.children = [];
                for (let c of src.children) {
                    Renderer.renderDom(module, c, dst.model, dst, key ? key : null);
                }
            }
        }
        else { //文本节点
            if (src.expressions) { //文本节点
                let value = '';
                for (let expr of src.expressions) {
                    if (expr instanceof Expression) { //处理表达式
                        let v1 = expr.val(module, dst.model);
                        value += v1 !== undefined ? v1 : '';
                    }
                    else {
                        value += expr;
                    }
                }
                dst.textContent = value;
            }
            else {
                dst.textContent = src.textContent;
            }
        }
        if (src.staticNum === 1) {
            src.staticNum = 0;
        }
        //添加到dom tree，必须放在handleDirectives后，因为有可能directive执行后返回false
        if (parent) {
            dst.parent.children.push(dst);
        }
        return dst;
        /**
         * 处理指令
         * @returns     true继续执行，false不执行后续渲染代码
         */
        function handleDirectives() {
            if (!src.directives || src.directives.length === 0) {
                return true;
            }
            // dst.staticNum = -1;
            for (let d of src.directives) {
                //model指令不执行
                if (d.type.name === 'model') {
                    continue;
                }
                if (!d.exec(module, dst)) {
                    return false;
                }
            }
            return true;
        }
        /**
         * 处理属性（带表达式）
         */
        function handleProps() {
            if (!src.props || src.props.size === 0) {
                return;
            }
            //因为存在大小写，所以用正则式进行匹配
            const styleReg = /^style$/i;
            const classReg = /^class$/i;
            let value;
            for (let k of src.props) {
                if (Array.isArray(k[1])) { //数组，需要合并
                    value = [];
                    for (let i = 0; i < k[1].length; i++) {
                        let a = k[1][i];
                        if (a instanceof Expression) {
                            value.push(a.val(module, dst.model));
                            // dst.staticNum = -1;
                        }
                        else {
                            value.push(a);
                        }
                    }
                    if (styleReg.test(k[0])) {
                        value = src.getStyleString(value);
                    }
                    else if (classReg.test(k[0])) {
                        value = src.getClassString(value);
                    }
                }
                else if (k[1] instanceof Expression) {
                    value = k[1].val(module, dst.model);
                    // dst.staticNum = -1;
                }
                else {
                    value = k[1];
                }
                dst.props[k[0]] = value;
            }
        }
    }
    /**
     * 更新到html树
     * @param module    模块
     * @param src       渲染节点
     * @returns         渲染后的节点
     */
    static updateToHtml(module, src) {
        let el = module.getElement(src.key);
        if (!el) {
            return this.renderToHtml(module, src, null);
        }
        else if (src.tagName) { //html dom节点已存在
            //设置element key属性
            el.key = src.key;
            let attrs = el.attributes;
            let arr = [];
            for (let i = 0; i < attrs.length; i++) {
                arr.push(attrs[i].name);
            }
            //设置属性
            for (let p of Object.keys(src.props)) {
                el.setAttribute(p, src.props[p] === undefined ? '' : src.props[p]);
                let ind;
                if ((ind = arr.indexOf(p)) !== -1) {
                    arr.splice(ind, 1);
                }
            }
            //清理多余attribute
            if (arr.length > 0) {
                for (let a of arr) {
                    el.removeAttribute(a);
                }
            }
            //处理asset
            if (src.assets) {
                for (let k of Object.keys(src.assets)) {
                    el[k] = src.assets[k];
                }
            }
        }
        else { //文本节点
            el.textContent = src.textContent;
        }
        return el;
    }
    /**
     * 渲染到html树
     * @param module 	        模块
     * @param src               渲染节点
     * @param parentEl 	        父html
     * @param isRenderChild     是否渲染子节点
     */
    static renderToHtml(module, src, parentEl, isRenderChild) {
        let el;
        if (src.tagName) {
            el = newEl(src);
        }
        else {
            el = newText(src);
        }
        //先创建子节点，再添加到html dom树，避免频繁添加
        if (el && src.tagName && isRenderChild) {
            genSub(el, src);
        }
        if (el && parentEl) {
            parentEl.appendChild(el);
        }
        return el;
        /**
         * 新建element节点
         * @param dom 		虚拟dom
         * @returns 		新的html element
         */
        function newEl(dom, isSvg) {
            //style不处理
            if (dom.tagName === 'style') {
                return;
            }
            let el = document.createElement(dom.tagName);
            //把el引用与key关系存放到cache中
            module.saveElement(dom.key, el);
            //设置element key属性
            el.key = dom.key;
            //设置属性
            for (let p of Object.keys(dom.props)) {
                el.setAttribute(p, dom.props[p] === undefined ? '' : dom.props[p]);
            }
            //asset
            if (dom.assets) {
                for (let p of Object.keys(dom.assets)) {
                    el[p] = dom.assets[p];
                }
            }
            //解绑之前绑定事件
            module.eventFactory.unbindAll(dom.key);
            //绑定事件
            module.eventFactory.bind(dom.key);
            return el;
        }
        /**
         * 新建文本节点
         */
        function newText(dom) {
            //样式表处理，如果是样式表文本，则不添加到dom树
            if (CssManager.handleStyleTextDom(module, dom)) {
                return;
            }
            let node = document.createTextNode(dom.textContent || '');
            module.saveElement(dom.key, node);
            return node;
        }
        /**
         * 生成子节点
         * @param pEl 	父节点
         * @param vdom  虚拟dom节点
         */
        function genSub(pEl, vdom) {
            if (vdom.children && vdom.children.length > 0) {
                vdom.children.forEach(item => {
                    let el1;
                    if (item.tagName) {
                        el1 = newEl(item);
                        genSub(el1, item);
                    }
                    else {
                        el1 = newText(item);
                    }
                    if (el1) {
                        pEl.appendChild(el1);
                    }
                });
            }
        }
    }
    /**
     * 处理更改的dom节点
     * @param module        待处理模块
     * @param changeDoms    更改的dom参数数组 [type(add 1, upd 2,del 3,move 4 ,rep 5),dom(操作节点),dom1(被替换或修改节点),parent(父节点),loc(位置)]
     */
    static handleChangedDoms(module, changeDoms) {
        //替换数组
        const repArr = [];
        //添加和移动数组
        const arr = [];
        //保留原有html节点
        for (let item of changeDoms) {
            if (item[0] === 2) { //修改
                Renderer.updateToHtml(module, item[1]);
            }
            else if (item[0] === 3) { //删除
                const pEl = module.getElement(item[3].key);
                const n1 = module.getElement(item[1].key);
                if (pEl && n1 && n1.parentElement === pEl) {
                    pEl.removeChild(n1);
                }
                module.domManager.freeNode(item[1]);
            }
            else if (item[0] === 5) { //替换
                repArr.push(item);
            }
            else { //仅对添加和移动的节点进行二次操作
                arr.push(item);
            }
        }
        //替换
        if (repArr.length > 0) {
            for (let item of repArr) {
                const pEl = module.getElement(item[3].key);
                let n2;
                if (item[2].moduleId) { //子模块先free再获取，先还原为空文本，再实现新的子模块mount
                    module.domManager.freeNode(item[2]);
                    n2 = module.getElement(item[2].key);
                }
                else { //先获取，再free，避免getElement为null
                    n2 = module.getElement(item[2].key);
                    module.domManager.freeNode(item[2]);
                }
                //替换n2在element map中的值
                const n1 = Renderer.renderToHtml(module, item[1], null, true);
                if (pEl && n2) {
                    pEl.replaceChild(n1, n2);
                }
            }
        }
        //按index排序
        if (arr.length > 0) {
            arr.sort((a, b) => a[4] > b[4] ? 1 : -1);
        }
        for (let item of arr) {
            const pEl = module.getElement(item[3].key);
            if (item[0] === 1) { //添加
                const n1 = Renderer.renderToHtml(module, item[1], null, true);
                if (pEl.childNodes && pEl.childNodes.length - 1 > item[4]) {
                    pEl.insertBefore(n1, pEl.childNodes[item[4]]);
                }
                else {
                    pEl.appendChild(n1);
                }
            }
            else { //移动
                const n1 = module.getElement(item[1].key);
                if (n1 && n1 !== pEl.childNodes[item[4]]) {
                    if (pEl.childNodes.length - 1 > item[4]) {
                        pEl.insertBefore(n1, pEl.childNodes[item[4]]);
                    }
                    else if (n1 !== pEl.childNodes[pEl.childNodes.length - 1]) { //最后一个与当前节点不相同，则放在最后
                        pEl.appendChild(n1);
                    }
                }
            }
        }
    }
}
/**
 * 等待渲染列表（模块名）
 */
Renderer.waitList = [];
//# sourceMappingURL=renderer.js.map