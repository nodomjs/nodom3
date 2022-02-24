import { Compiler } from "./compiler";
import { CssManager } from "./cssmanager";
import { Model } from "./model";
import { ModuleFactory } from "./modulefactory";
import { ObjectManager } from "./objectmanager";
import { Renderer } from "./renderer";
import { Util } from "./util";
import { DiffTool } from "./difftool";
import { ModelManager } from "./modelmanager";
import { EModuleState } from "./types";
import { EventFactory } from "./eventfactory";
/**
 * 模块类
 * 模块方法说明：模版内使用的方法，包括事件，都直接在模块内定义
 *      方法this：指向module实例
 *      事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *      表达式方法：参数按照表达式方式给定即可
 */
export class Module {
    /**
     * 构造器
     */
    constructor() {
        /**
         * 子模块id数组
         */
        this.children = [];
        /**
         * 后置渲染序列
         */
        this.preRenderOps = [];
        /**
         * 后置渲染序列
         */
        this.postRenderOps = [];
        /**
         * 用于保存每个key对应的html node
         */
        this.keyNodeMap = new Map();
        /**
         * 用户自定义key htmlelement映射
         */
        this.keyElementMap = new Map();
        /**
         * key virtualdom map
         */
        this.keyVDomMap = new Map();
        this.id = Util.genId();
        this.objectManager = new ObjectManager(this);
        this.changedModelMap = new Map();
        this.eventFactory = new EventFactory(this);
        //加入模块工厂
        ModuleFactory.add(this);
    }
    /**
     * 初始化
     */
    init() {
        // 设置状态为初始化
        this.state = EModuleState.INITED;
        //初始化model
        this.model = new Model(this.data() || {}, this);
        //注册子模块
        if (this.modules && Array.isArray(this.modules)) {
            for (let cls of this.modules) {
                ModuleFactory.addClass(cls);
            }
            delete this.modules;
        }
    }
    /**
     * 模版串方法，使用时重载
     * @param props     props对象，在模版容器dom中进行配置，从父模块传入
     * @returns         模版串
     */
    template(props) {
        return null;
    }
    /**
     * 数据方法，使用时重载
     * @returns      model数据
     */
    data() {
        return {};
    }
    /**
     * 模型渲染
     */
    render() {
        if (this.state === EModuleState.UNACTIVE) {
            return;
        }
        this.dontAddToRender = true;
        //检测模版并编译
        let templateStr = this.template(this.props);
        if (templateStr !== this.oldTemplate) {
            this.oldTemplate = templateStr;
            this.compile();
        }
        //不存在，不渲染
        if (!this.originTree) {
            return;
        }
        //执行前置方法
        this.doRenderOps(0);
        //渲染前事件返回true，则不进行渲染
        if (this.doModuleEvent('onBeforeRender')) {
            this.dontAddToRender = false;
            return;
        }
        if (!this.renderTree) {
            this.doFirstRender();
        }
        else { //增量渲染
            //执行每次渲染前事件
            if (this.model) {
                let oldTree = this.renderTree;
                this.renderTree = Renderer.renderDom(this, this.originTree, this.model);
                this.doModuleEvent('onBeforeRenderToHtml');
                let changeDoms = [];
                // 比较节点
                DiffTool.compare(this.renderTree, oldTree, changeDoms);
                //执行更改
                if (changeDoms.length > 0) {
                    Renderer.handleChangedDoms(this, changeDoms);
                }
            }
        }
        //设置已渲染状态
        this.state = EModuleState.RENDERED;
        //执行后置方法
        this.doRenderOps(1);
        //执行每次渲染后事件
        this.doModuleEvent('onRender');
        this.changedModelMap.clear();
        this.dontAddToRender = false;
    }
    /**
     * 执行首次渲染
     * @param root 	根虚拟dom
     */
    doFirstRender() {
        this.doModuleEvent('onBeforeFirstRender');
        //渲染树
        this.renderTree = Renderer.renderDom(this, this.originTree, this.model);
        this.doModuleEvent('onBeforeFirstRenderToHTML');
        //渲染为html element
        let el = Renderer.renderToHtml(this, this.renderTree, null, true);
        if (this.srcDom) {
            const srcEl = this.getParent().getNode(this.srcDom.key);
            this.container = srcEl.parentElement;
            this.container.insertBefore(el, srcEl);
        }
        else if (this.container) {
            this.container.appendChild(el);
        }
        //执行首次渲染后事件
        this.doModuleEvent('onFirstRender');
    }
    /**
     * 添加子模块
     * @param module    模块id或模块
     */
    addChild(module) {
        let mid;
        if (typeof module === 'number') {
            mid = module;
            module = ModuleFactory.get(mid);
        }
        else {
            mid = module.id;
        }
        if (!this.children.includes(mid)) {
            this.children.push(mid);
            module.parentId = this.id;
            //首次添加，激活
            module.active();
        }
    }
    /**
     * 激活模块(添加到渲染器)
     * @param deep  是否深度active，如果为true，则子模块进行active
     */
    active(deep) {
        this.state = EModuleState.INITED;
        Renderer.add(this);
        if (deep) {
            for (let id of this.children) {
                let m = ModuleFactory.get(id);
                if (m) {
                    m.active(deep);
                }
            }
        }
    }
    /**
     * 取消激活
     * @param deep              是否深度遍历
     * @param notFirstModule    不是第一个模块
     */
    unactive(deep, notFirstModule) {
        if (ModuleFactory.getMain() === this) {
            return;
        }
        delete this.srcDom;
        this.doModuleEvent('beforeUnActive');
        //设置状态
        this.state = EModuleState.UNACTIVE;
        //第一个module 从html dom树移除
        if (this.renderTree && !notFirstModule) {
            let el = this.getNode(this.renderTree.key);
            if (el && this.container) {
                this.container.removeChild(el);
            }
        }
        //删除渲染树
        delete this.renderTree;
        // 清理dom key map
        this.keyNodeMap.clear();
        this.keyElementMap.clear();
        this.keyVDomMap.clear();
        //清空event factory
        this.eventFactory = new EventFactory(this);
        //unactive事件
        this.doModuleEvent('unActive');
        //深度处理子模块
        if (deep && this.children) {
            //处理子模块
            for (let id of this.children) {
                let m = ModuleFactory.get(id);
                if (m) {
                    m.unactive(true, true);
                }
            }
        }
    }
    /**
     * 获取父模块
     * @returns     父模块
     */
    getParent() {
        if (!this.parentId) {
            return;
        }
        return ModuleFactory.get(this.parentId);
    }
    /**
     * 执行模块事件
     * @param eventName 	事件名
     * @returns             执行结果，各事件返回值如下：
     *                          onBeforeRender：如果为true，表示不进行渲染
     */
    doModuleEvent(eventName) {
        return this.invokeMethod(eventName, this.model);
    }
    /**
     * 获取模块方法
     * @param name  方法名
     * @returns     方法
     */
    getMethod(name) {
        return this[name];
    }
    /**
     * 设置渲染容器
     * @param el        容器
     */
    setContainer(el) {
        this.container = el;
    }
    /**
     * 调用方法
     * @param methodName    方法名
     */
    invokeMethod(methodName, arg1, arg2, arg3) {
        let foo = this[methodName];
        if (foo && typeof foo === 'function') {
            let args = [];
            for (let i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            return foo.apply(this, args);
        }
    }
    /**
     * 添加渲染方法
     * @param foo   方法函数
     * @param flag  标志 0:渲染前执行 1:渲染后执行
     * @param args  参数
     * @param once  是否只执行一次，如果为true，则执行后删除
     */
    addRenderOps(foo, flag, args, once) {
        if (typeof foo !== 'function') {
            return;
        }
        let arr = flag === 0 ? this.preRenderOps : this.postRenderOps;
        arr.push({
            foo: foo,
            args: args,
            once: once
        });
    }
    /**
     * 执行渲染方法
     * @param flag 类型 0:前置 1:后置
     */
    doRenderOps(flag) {
        let arr = flag === 0 ? this.preRenderOps : this.postRenderOps;
        if (arr) {
            for (let i = 0; i < arr.length; i++) {
                let o = arr[i];
                o.foo.apply(this, o.args);
                // 执行后删除
                if (o.once) {
                    arr.splice(i--, 1);
                }
            }
        }
    }
    /**
     * 设置props
     * @param props     属性值
     * @param dom       子模块对应节点
     */
    setProps(props, dom) {
        let dataObj = props.$data;
        delete props.$data;
        //props数据复制到模块model
        if (dataObj) {
            for (let d in dataObj) {
                let o = dataObj[d];
                //如果为对象，需要绑定到模块
                if (typeof o === 'object' && this.model[d] !== o) {
                    ModelManager.bindToModule(o, this);
                }
                this.model[d] = o;
            }
        }
        this.srcDom = dom;
        if (this.state === EModuleState.INITED || this.state === EModuleState.UNACTIVE) {
            this.active();
        }
        else { //计算template，如果导致模版改变，需要激活
            let change = false;
            if (!this.props) {
                change = true;
            }
            else {
                const keys = Object.getOwnPropertyNames(props);
                let len1 = keys.length;
                const keys1 = this.props ? Object.getOwnPropertyNames(this.props) : [];
                let len2 = keys1.length;
                if (len1 !== len2) {
                    change = true;
                }
                else {
                    for (let k of keys) {
                        // object 默认改变
                        if (props[k] !== this.props[k]) {
                            change = true;
                            break;
                        }
                    }
                }
            }
            if (change) { //props 发生改变，计算模版，如果模版改变，激活模块
                let propChanged = false;
                if (this.originTree) {
                    propChanged = this.mergeProps(this.originTree, props);
                }
                const tmp = this.template(props);
                if (tmp !== this.oldTemplate || propChanged) {
                    this.active();
                }
            }
        }
        this.props = props;
    }
    /**
     * 编译
     */
    compile() {
        this.domKeyId = 0;
        //清空孩子节点
        this.children = [];
        //清理css url
        CssManager.clearModuleRules(this);
        //清理dom参数
        this.objectManager.clearAllDomParams();
        if (!this.oldTemplate) {
            return;
        }
        this.originTree = new Compiler(this).compile(this.oldTemplate);
        if (this.props) {
            this.mergeProps(this.originTree, this.props);
        }
        //源事件传递到子模块根
        let parentModule = this.getParent();
        if (parentModule) {
            const eobj = parentModule.eventFactory.getEvent(this.srcDom.key);
            if (eobj) {
                for (let evt of eobj) {
                    if (evt[1].own) { //子模块不支持代理事件
                        for (let ev of evt[1].own) {
                            this.originTree.addEvent(ev);
                        }
                    }
                }
            }
        }
    }
    /**
    * 合并属性
    * @param dom       dom节点
    * @param props     属性集合
    * @returns         是否改变
    */
    mergeProps(dom, props) {
        let change = false;
        for (let k of Object.keys(props)) {
            let c = dom.addProp(k, props[k]);
            if (!change) {
                change = c;
            }
        }
        return change;
    }
    /**
     * 获取node
     * @param key   dom key
     * @returns     html node
     */
    getNode(key) {
        return this.keyNodeMap.get(key);
    }
    /**
     * save node
     * @param key   dom key
     * @param node  html node
     */
    saveNode(key, node) {
        this.keyNodeMap.set(key, node);
    }
    /**
     * 获取用户key定义的html
     * @param key   用户自定义key
     * @returns     html element
     */
    getElement(key) {
        return this.keyElementMap.get(key);
    }
    /**
     * 保存用户key对应的htmlelement
     * @param key   自定义key
     * @param node  htmlelement
     */
    saveElement(key, node) {
        this.keyElementMap.set(key, node);
    }
    /**
     * 获取key对应的virtual dom
     * @param key   vdom key
     * @returns     virtual dom
     */
    getVirtualDom(key) {
        return this.keyVDomMap.get(key);
    }
    /**
     * 保存key对应的virtual dom
     * @param dom   virtual dom
     * @param key   vdom key
     */
    saveVirtualDom(dom, key) {
        this.keyVDomMap.set(key || dom.key, dom);
    }
    /**
     * 从keyNodeMap移除
     * @param dom   虚拟dom
     * @param deep  深度清理
     */
    removeNode(dom, deep) {
        if (dom.subModuleId) { //子模块
            let m = ModuleFactory.get(dom.subModuleId);
            if (m) {
                m.unactive(deep);
            }
        }
        else { //非子模块
            //从map移除
            this.keyNodeMap.delete(dom.key);
            this.keyElementMap.delete(dom.key);
            this.keyVDomMap.delete(dom.key);
            //解绑所有事件
            this.eventFactory.unbindAll(dom.key);
            if (deep) {
                if (dom && dom.children) {
                    for (let d of dom.children) {
                        this.removeNode(d, true);
                    }
                }
            }
        }
    }
    /**
     * 移除 dom cache
     * @param key   dom key
     * @param deep  深度清理
     */
    clearDomCache(dom, deep) {
        if (deep) {
            if (dom.children) {
                for (let d of dom.children) {
                    this.clearDomCache(d, true);
                }
            }
        }
        //从缓存移除节点
        this.objectManager.clearDomParams(dom.key);
        //从key node map移除
        this.keyNodeMap.delete(dom.key);
        //从virtual dom map移除
        this.keyVDomMap.delete(dom.key);
    }
    /**
     * 从origin tree 获取虚拟dom节点
     * @param key   dom key
     */
    getOrginDom(key) {
        if (!this.originTree) {
            return null;
        }
        return find(this.originTree);
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
     * 获取dom key id
     * @returns     key id
     */
    getDomKeyId() {
        return ++this.domKeyId;
    }
}
//# sourceMappingURL=module.js.map