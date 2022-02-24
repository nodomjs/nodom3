"use strict";
exports.__esModule = true;
exports.Module = void 0;
var compiler_1 = require("./compiler");
var cssmanager_1 = require("./cssmanager");
var model_1 = require("./model");
var modulefactory_1 = require("./modulefactory");
var objectmanager_1 = require("./objectmanager");
var renderer_1 = require("./renderer");
var util_1 = require("./util");
var difftool_1 = require("./difftool");
var modelmanager_1 = require("./modelmanager");
var types_1 = require("./types");
var eventfactory_1 = require("./eventfactory");
/**
 * 模块类
 * 模块方法说明：模版内使用的方法，包括事件，都直接在模块内定义
 *      方法this：指向module实例
 *      事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *      表达式方法：参数按照表达式方式给定即可
 */
var Module = /** @class */ (function () {
    /**
     * 构造器
     */
    function Module() {
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
        this.id = util_1.Util.genId();
        this.objectManager = new objectmanager_1.ObjectManager(this);
        this.changedModelMap = new Map();
        this.eventFactory = new eventfactory_1.EventFactory(this);
        //加入模块工厂
        modulefactory_1.ModuleFactory.add(this);
    }
    /**
     * 初始化
     */
    Module.prototype.init = function () {
        // 设置状态为初始化
        this.state = types_1.EModuleState.INITED;
        //初始化model
        this.model = new model_1.Model(this.data() || {}, this);
        //注册子模块
        if (this.modules && Array.isArray(this.modules)) {
            for (var _i = 0, _a = this.modules; _i < _a.length; _i++) {
                var cls = _a[_i];
                modulefactory_1.ModuleFactory.addClass(cls);
            }
            delete this.modules;
        }
    };
    /**
     * 模版串方法，使用时重载
     * @param props     props对象，在模版容器dom中进行配置，从父模块传入
     * @returns         模版串
     */
    Module.prototype.template = function (props) {
        return null;
    };
    /**
     * 数据方法，使用时重载
     * @returns      model数据
     */
    Module.prototype.data = function () {
        return {};
    };
    /**
     * 模型渲染
     */
    Module.prototype.render = function () {
        if (this.state === types_1.EModuleState.UNACTIVE) {
            return;
        }
        this.dontAddToRender = true;
        //检测模版并编译
        var templateStr = this.template(this.props);
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
                var oldTree = this.renderTree;
                this.renderTree = renderer_1.Renderer.renderDom(this, this.originTree, this.model);
                this.doModuleEvent('onBeforeRenderToHtml');
                var changeDoms = [];
                // 比较节点
                difftool_1.DiffTool.compare(this.renderTree, oldTree, changeDoms);
                //执行更改
                if (changeDoms.length > 0) {
                    renderer_1.Renderer.handleChangedDoms(this, changeDoms);
                }
            }
        }
        //设置已渲染状态
        this.state = types_1.EModuleState.RENDERED;
        //执行后置方法
        this.doRenderOps(1);
        //执行每次渲染后事件
        this.doModuleEvent('onRender');
        this.changedModelMap.clear();
        this.dontAddToRender = false;
    };
    /**
     * 执行首次渲染
     * @param root 	根虚拟dom
     */
    Module.prototype.doFirstRender = function () {
        this.doModuleEvent('onBeforeFirstRender');
        //渲染树
        this.renderTree = renderer_1.Renderer.renderDom(this, this.originTree, this.model);
        this.doModuleEvent('onBeforeFirstRenderToHTML');
        //渲染为html element
        var el = renderer_1.Renderer.renderToHtml(this, this.renderTree, null, true);
        if (this.srcDom) {
            var srcEl = this.getParent().getNode(this.srcDom.key);
            this.container = srcEl.parentElement;
            this.container.insertBefore(el, srcEl);
        }
        else if (this.container) {
            this.container.appendChild(el);
        }
        //执行首次渲染后事件
        this.doModuleEvent('onFirstRender');
    };
    /**
     * 添加子模块
     * @param module    模块id或模块
     */
    Module.prototype.addChild = function (module) {
        var mid;
        if (typeof module === 'number') {
            mid = module;
            module = modulefactory_1.ModuleFactory.get(mid);
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
    };
    /**
     * 激活模块(添加到渲染器)
     * @param deep  是否深度active，如果为true，则子模块进行active
     */
    Module.prototype.active = function (deep) {
        this.state = types_1.EModuleState.INITED;
        renderer_1.Renderer.add(this);
        if (deep) {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var id = _a[_i];
                var m = modulefactory_1.ModuleFactory.get(id);
                if (m) {
                    m.active(deep);
                }
            }
        }
    };
    /**
     * 取消激活
     * @param deep              是否深度遍历
     * @param notFirstModule    不是第一个模块
     */
    Module.prototype.unactive = function (deep, notFirstModule) {
        if (modulefactory_1.ModuleFactory.getMain() === this) {
            return;
        }
        delete this.srcDom;
        this.doModuleEvent('beforeUnActive');
        //设置状态
        this.state = types_1.EModuleState.UNACTIVE;
        //第一个module 从html dom树移除
        if (this.renderTree && !notFirstModule) {
            var el = this.getNode(this.renderTree.key);
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
        this.eventFactory = new eventfactory_1.EventFactory(this);
        //unactive事件
        this.doModuleEvent('unActive');
        //深度处理子模块
        if (deep && this.children) {
            //处理子模块
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var id = _a[_i];
                var m = modulefactory_1.ModuleFactory.get(id);
                if (m) {
                    m.unactive(true, true);
                }
            }
        }
    };
    /**
     * 获取父模块
     * @returns     父模块
     */
    Module.prototype.getParent = function () {
        if (!this.parentId) {
            return;
        }
        return modulefactory_1.ModuleFactory.get(this.parentId);
    };
    /**
     * 执行模块事件
     * @param eventName 	事件名
     * @returns             执行结果，各事件返回值如下：
     *                          onBeforeRender：如果为true，表示不进行渲染
     */
    Module.prototype.doModuleEvent = function (eventName) {
        return this.invokeMethod(eventName, this.model);
    };
    /**
     * 获取模块方法
     * @param name  方法名
     * @returns     方法
     */
    Module.prototype.getMethod = function (name) {
        return this[name];
    };
    /**
     * 设置渲染容器
     * @param el        容器
     */
    Module.prototype.setContainer = function (el) {
        this.container = el;
    };
    /**
     * 调用方法
     * @param methodName    方法名
     */
    Module.prototype.invokeMethod = function (methodName, arg1, arg2, arg3) {
        var foo = this[methodName];
        if (foo && typeof foo === 'function') {
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            return foo.apply(this, args);
        }
    };
    /**
     * 添加渲染方法
     * @param foo   方法函数
     * @param flag  标志 0:渲染前执行 1:渲染后执行
     * @param args  参数
     * @param once  是否只执行一次，如果为true，则执行后删除
     */
    Module.prototype.addRenderOps = function (foo, flag, args, once) {
        if (typeof foo !== 'function') {
            return;
        }
        var arr = flag === 0 ? this.preRenderOps : this.postRenderOps;
        arr.push({
            foo: foo,
            args: args,
            once: once
        });
    };
    /**
     * 执行渲染方法
     * @param flag 类型 0:前置 1:后置
     */
    Module.prototype.doRenderOps = function (flag) {
        var arr = flag === 0 ? this.preRenderOps : this.postRenderOps;
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                var o = arr[i];
                o.foo.apply(this, o.args);
                // 执行后删除
                if (o.once) {
                    arr.splice(i--, 1);
                }
            }
        }
    };
    /**
     * 设置props
     * @param props     属性值
     * @param dom       子模块对应节点
     */
    Module.prototype.setProps = function (props, dom) {
        var dataObj = props.$data;
        delete props.$data;
        //props数据复制到模块model
        if (dataObj) {
            for (var d in dataObj) {
                var o = dataObj[d];
                //如果为对象，需要绑定到模块
                if (typeof o === 'object' && this.model[d] !== o) {
                    modelmanager_1.ModelManager.bindToModule(o, this);
                }
                this.model[d] = o;
            }
        }
        this.srcDom = dom;
        if (this.state === types_1.EModuleState.INITED || this.state === types_1.EModuleState.UNACTIVE) {
            this.active();
        }
        else { //计算template，如果导致模版改变，需要激活
            var change = false;
            if (!this.props) {
                change = true;
            }
            else {
                var keys = Object.getOwnPropertyNames(props);
                var len1 = keys.length;
                var keys1 = this.props ? Object.getOwnPropertyNames(this.props) : [];
                var len2 = keys1.length;
                if (len1 !== len2) {
                    change = true;
                }
                else {
                    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                        var k = keys_1[_i];
                        // object 默认改变
                        if (props[k] !== this.props[k]) {
                            change = true;
                            break;
                        }
                    }
                }
            }
            if (change) { //props 发生改变，计算模版，如果模版改变，激活模块
                var propChanged = false;
                if (this.originTree) {
                    propChanged = this.mergeProps(this.originTree, props);
                }
                var tmp = this.template(props);
                if (tmp !== this.oldTemplate || propChanged) {
                    this.active();
                }
            }
        }
        this.props = props;
    };
    /**
     * 编译
     */
    Module.prototype.compile = function () {
        this.domKeyId = 0;
        //清空孩子节点
        this.children = [];
        //清理css url
        cssmanager_1.CssManager.clearModuleRules(this);
        //清理dom参数
        this.objectManager.clearAllDomParams();
        if (!this.oldTemplate) {
            return;
        }
        this.originTree = new compiler_1.Compiler(this).compile(this.oldTemplate);
        if (this.props) {
            this.mergeProps(this.originTree, this.props);
        }
        //源事件传递到子模块根
        var parentModule = this.getParent();
        if (parentModule) {
            var eobj = parentModule.eventFactory.getEvent(this.srcDom.key);
            if (eobj) {
                for (var _i = 0, eobj_1 = eobj; _i < eobj_1.length; _i++) {
                    var evt = eobj_1[_i];
                    if (evt[1].own) { //子模块不支持代理事件
                        for (var _a = 0, _b = evt[1].own; _a < _b.length; _a++) {
                            var ev = _b[_a];
                            this.originTree.addEvent(ev);
                        }
                    }
                }
            }
        }
    };
    /**
    * 合并属性
    * @param dom       dom节点
    * @param props     属性集合
    * @returns         是否改变
    */
    Module.prototype.mergeProps = function (dom, props) {
        var change = false;
        for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
            var k = _a[_i];
            var c = dom.addProp(k, props[k]);
            if (!change) {
                change = c;
            }
        }
        return change;
    };
    /**
     * 获取node
     * @param key   dom key
     * @returns     html node
     */
    Module.prototype.getNode = function (key) {
        return this.keyNodeMap.get(key);
    };
    /**
     * save node
     * @param key   dom key
     * @param node  html node
     */
    Module.prototype.saveNode = function (key, node) {
        this.keyNodeMap.set(key, node);
    };
    /**
     * 获取用户key定义的html
     * @param key   用户自定义key
     * @returns     html element
     */
    Module.prototype.getElement = function (key) {
        return this.keyElementMap.get(key);
    };
    /**
     * 保存用户key对应的htmlelement
     * @param key   自定义key
     * @param node  htmlelement
     */
    Module.prototype.saveElement = function (key, node) {
        this.keyElementMap.set(key, node);
    };
    /**
     * 获取key对应的virtual dom
     * @param key   vdom key
     * @returns     virtual dom
     */
    Module.prototype.getVirtualDom = function (key) {
        return this.keyVDomMap.get(key);
    };
    /**
     * 保存key对应的virtual dom
     * @param dom   virtual dom
     * @param key   vdom key
     */
    Module.prototype.saveVirtualDom = function (dom, key) {
        this.keyVDomMap.set(key || dom.key, dom);
    };
    /**
     * 从keyNodeMap移除
     * @param dom   虚拟dom
     * @param deep  深度清理
     */
    Module.prototype.removeNode = function (dom, deep) {
        if (dom.subModuleId) { //子模块
            var m = modulefactory_1.ModuleFactory.get(dom.subModuleId);
            if (m) {
                m.unactive(deep);
            }
        }
        else { //非子模块
            //从map移除
            this.keyNodeMap["delete"](dom.key);
            this.keyElementMap["delete"](dom.key);
            this.keyVDomMap["delete"](dom.key);
            //解绑所有事件
            this.eventFactory.unbindAll(dom.key);
            if (deep) {
                if (dom && dom.children) {
                    for (var _i = 0, _a = dom.children; _i < _a.length; _i++) {
                        var d = _a[_i];
                        this.removeNode(d, true);
                    }
                }
            }
        }
    };
    /**
     * 移除 dom cache
     * @param key   dom key
     * @param deep  深度清理
     */
    Module.prototype.clearDomCache = function (dom, deep) {
        if (deep) {
            if (dom.children) {
                for (var _i = 0, _a = dom.children; _i < _a.length; _i++) {
                    var d = _a[_i];
                    this.clearDomCache(d, true);
                }
            }
        }
        //从缓存移除节点
        this.objectManager.clearDomParams(dom.key);
        //从key node map移除
        this.keyNodeMap["delete"](dom.key);
        //从virtual dom map移除
        this.keyVDomMap["delete"](dom.key);
    };
    /**
     * 从origin tree 获取虚拟dom节点
     * @param key   dom key
     */
    Module.prototype.getOrginDom = function (key) {
        if (!this.originTree) {
            return null;
        }
        return find(this.originTree);
        function find(dom) {
            if (dom.key === key) {
                return dom;
            }
            if (dom.children) {
                for (var _i = 0, _a = dom.children; _i < _a.length; _i++) {
                    var d = _a[_i];
                    var d1 = find(d);
                    if (d1) {
                        return d1;
                    }
                }
            }
        }
    };
    /**
     * 获取dom key id
     * @returns     key id
     */
    Module.prototype.getDomKeyId = function () {
        return ++this.domKeyId;
    };
    return Module;
}());
exports.Module = Module;
