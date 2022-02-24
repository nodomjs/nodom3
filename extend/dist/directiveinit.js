"use strict";
exports.__esModule = true;
var event_1 = require("../core/event");
var globalcache_1 = require("../core/globalcache");
var modelmanager_1 = require("../core/modelmanager");
var modulefactory_1 = require("../core/modulefactory");
var nodom_1 = require("../core/nodom");
var renderer_1 = require("../core/renderer");
var router_1 = require("../core/router");
var util_1 = require("../core/util");
exports["default"] = (function () {
    /**
     * 指令类型初始化
     * 每个指令类型都有一个名字、处理函数和优先级，处理函数不能用箭头函数
     * 处理函数在渲染时执行，包含两个参数 module(模块)、dom(目标虚拟dom)、src(源虚拟dom)
     * 处理函数的this指向指令
     * 处理函数的返回值 true 表示继续，false 表示后续指令不再执行
     */
    /**
     * module 指令
     * 用于指定该元素为模块容器，表示子模块
     * 用法 x-module='模块类名'
     */
    nodom_1.createDirective('module', function (module, dom, src) {
        var m;
        //存在moduleId，表示已经渲染过，不渲染
        var mid = module.objectManager.getDomParam(dom.key, 'moduleId');
        var handle = true;
        if (mid) {
            m = modulefactory_1.ModuleFactory.get(mid);
            handle = !dom.props['renderOnce'];
        }
        else {
            m = modulefactory_1.ModuleFactory.get(this.value);
            if (!m) {
                return true;
            }
            mid = m.id;
            //保留modelId
            module.objectManager.setDomParam(dom.key, 'moduleId', mid);
            module.addChild(m);
            //共享当前dom的model给子模块
            if (src.hasProp('useDomModel')) {
                m.model = dom.model;
                //绑定model到子模块，共享update,watch方法
                modelmanager_1.ModelManager.bindToModule(m.model, m);
                delete dom.props['useDomModel'];
            }
        }
        //保存到dom上，提升渲染性能
        dom.subModuleId = mid;
        //变成文本节点，作为子模块占位符，子模块渲染后插入到占位符前面
        dom.tagName = '';
        if (handle) { //需要处理
            //设置props，如果改变了props，启动渲染
            var o = {};
            if (dom.props) {
                for (var _i = 0, _a = Object.keys(dom.props); _i < _a.length; _i++) {
                    var p = _a[_i];
                    var v = dom.props[p];
                    if (p[0] === '$') { //数据
                        if (!o.$data) {
                            o.$data = {};
                        }
                        o.$data[p.substr(1)] = v;
                        //删除属性
                        delete dom.props[p];
                    }
                    else {
                        o[p] = v;
                    }
                }
            }
            //传递给模块
            m.setProps(o, dom);
        }
        return true;
    }, 8);
    /**
     *  model指令
     */
    nodom_1.createDirective('model', function (module, dom, src) {
        var model = dom.model.$get(this.value);
        if (model) {
            dom.model = model;
        }
        return true;
    }, 1);
    /**
     * 指令名 repeat
     * 描述：重复指令
     */
    nodom_1.createDirective('repeat', function (module, dom, src) {
        var rows = this.value;
        // 无数据，不渲染
        if (!util_1.Util.isArray(rows) || rows.length === 0) {
            return false;
        }
        //索引名
        var idxName = src.getProp('$index');
        var parent = dom.parent;
        //禁用该指令
        this.disabled = true;
        //避免在渲染时对src设置了model，此处需要删除
        delete src.model;
        for (var i = 0; i < rows.length; i++) {
            if (idxName) {
                rows[i][idxName] = i;
            }
            //渲染一次-1，所以需要+1
            src.staticNum++;
            var d = renderer_1.Renderer.renderDom(module, src, rows[i], parent, rows[i].$key + '');
            //删除$index属性
            if (idxName) {
                delete d.props['$index'];
            }
        }
        //启用该指令
        this.disabled = false;
        return false;
    }, 2);
    /**
     * 递归指令
     * 作用：在dom内部递归，用于具有相同数据结构的节点递归生成
     * 递归指令不允许嵌套
     * name表示递归名字，必须与内部的recur标签的ref保持一致，名字默认为default
     * 典型模版
     * ```
     * <recur name='r1'>
     *      <div>...</div>
     *      <p>...</p>
     *      <recur ref='r1' />
     * </recur>
     * ```
     */
    nodom_1.createDirective('recur', function (module, dom, src) {
        //递归节点存放容器
        if (dom.props.hasOwnProperty('ref')) {
            //如果出现在repeat中，src为单例，需要在使用前清空子节点，避免沿用上次的子节点
            src.children = [];
            //递归存储名
            var name = '$recurs.' + (dom.props['ref'] || 'default');
            var node = module.objectManager.get(name);
            if (!node) {
                return true;
            }
            var model = dom.model;
            var cond = node.getDirective('recur');
            var m = model[cond.value];
            //不存在子层数组，不再递归
            if (!m) {
                return true;
            }
            //克隆，后续可以继续用
            var node1 = node.clone();
            var key = void 0;
            //recur子节点不为数组，依赖子层数据，否则以来repeat数据
            if (!Array.isArray(m)) {
                node1.model = m;
                util_1.Util.setNodeKey(node1, m.$key, true);
            }
            src.children = [node1];
        }
        else { //递归节点
            var data = dom.model[this.value];
            if (!data) {
                return true;
            }
            //递归名，默认default
            var name = '$recurs.' + (dom.props['name'] || 'default');
            if (!module.objectManager.get(name)) {
                module.objectManager.set(name, src);
            }
        }
        return true;
    }, 2);
    /**
     * 指令名 if
     * 描述：条件指令
     */
    nodom_1.createDirective('if', function (module, dom, src) {
        module.objectManager.setDomParam(dom.parent.key, '$if', this.value);
        return this.value;
    }, 5);
    /**
     * 指令名 else
     * 描述：else指令
     */
    nodom_1.createDirective('else', function (module, dom, src) {
        return module.objectManager.getDomParam(dom.parent.key, '$if') === false;
    }, 5);
    /**
     * elseif 指令
     */
    nodom_1.createDirective('elseif', function (module, dom, src) {
        var v = module.objectManager.getDomParam(dom.parent.key, '$if');
        if (v === true) {
            return false;
        }
        else {
            if (!this.value) {
                return false;
            }
            else {
                module.objectManager.setDomParam(dom.parent.key, '$if', true);
            }
        }
        return true;
    }, 5);
    /**
     * elseif 指令
     */
    nodom_1.createDirective('endif', function (module, dom, src) {
        module.objectManager.removeDomParam(dom.parent.key, '$if');
        return true;
    }, 5);
    /**
     * 指令名 show
     * 描述：显示指令
     */
    nodom_1.createDirective('show', function (module, dom, src) {
        if (this.value) {
            return true;
        }
        return false;
    }, 5);
    /**
     * 指令名 field
     * 描述：字段指令
     */
    nodom_1.createDirective('field', function (module, dom, src) {
        var type = dom.props['type'] || 'text';
        var tgname = dom.tagName.toLowerCase();
        var model = dom.model;
        if (!model) {
            return true;
        }
        var dataValue = model.$get(this.value);
        if (type === 'radio') {
            var value = dom.props['value'];
            if (dataValue == value) {
                dom.props['checked'] = 'checked';
                util_1.Util.setDomAsset(dom, 'checked', true);
            }
            else {
                delete dom.props['checked'];
                util_1.Util.setDomAsset(dom, 'checked', false);
            }
        }
        else if (type === 'checkbox') {
            //设置状态和value
            var yv = dom.props['yes-value'];
            //当前值为yes-value
            if (dataValue == yv) {
                dom.props['value'] = yv;
                util_1.Util.setDomAsset(dom, 'checked', true);
            }
            else { //当前值为no-value
                dom.props['value'] = dom.props['no-value'];
                util_1.Util.setDomAsset(dom, 'checked', false);
            }
        }
        else if (tgname === 'select') { //下拉框
            dom.props['value'] = dataValue;
            util_1.Util.setDomAsset(dom, 'value', dataValue);
        }
        else {
            var v = (dataValue !== undefined && dataValue !== null) ? dataValue : '';
            dom.props['value'] = v;
            util_1.Util.setDomAsset(dom, 'value', v);
        }
        var event = globalcache_1.GlobalCache.get('$fieldChangeEvent');
        if (!event) {
            event = new event_1.NEvent(null, 'change', function (model, dom) {
                var el = this.getNode(dom.key);
                if (!el) {
                    return;
                }
                var directive = this.originTree.query(dom.key).getDirective('field');
                var type = dom.props['type'];
                var field = directive.value;
                var v = el.value;
                //根据选中状态设置checkbox的value
                if (type === 'checkbox') {
                    if (dom.props['yes-value'] == v) {
                        v = dom.props['no-value'];
                    }
                    else {
                        v = dom.props['yes-value'];
                    }
                }
                else if (type === 'radio') {
                    if (!el.checked) {
                        v = undefined;
                    }
                }
                //修改字段值,需要处理.运算符
                var arr = field.split('.');
                if (arr.length === 1) {
                    model[field] = v;
                }
                else {
                    var temp = model;
                    field = arr.pop();
                    for (var i = 0; i < arr.length && temp; i++) {
                        temp = temp[arr[i]];
                    }
                    if (temp) {
                        temp[field] = v;
                    }
                }
            });
            globalcache_1.GlobalCache.set('$fieldChangeEvent', event);
        }
        src.addEvent(event);
        return true;
    }, 10);
    /**
     * route指令
     */
    nodom_1.createDirective('route', function (module, dom, src) {
        //a标签需要设置href
        if (dom.tagName.toLowerCase() === 'a') {
            dom.props['href'] = 'javascript:void(0)';
        }
        dom.props['path'] = this.value;
        //有激活属性
        if (dom.props['active']) {
            var acName = dom.props['active'];
            delete dom.props['active'];
            //active 转expression
            router_1.Router.addActiveField(module, this.value, dom.model, acName);
            if (this.value.startsWith(router_1.Router.currentPath) && dom.model[acName]) {
                router_1.Router.go(this.value);
            }
        }
        //添加click事件,避免重复创建事件对象，创建后缓存
        var event = globalcache_1.GlobalCache.get('$routeClickEvent');
        if (!event) {
            event = new event_1.NEvent(null, 'click', function (model, dom, evObj, e) {
                var path = dom.props['path'];
                if (util_1.Util.isEmpty(path)) {
                    return;
                }
                router_1.Router.go(path);
            });
            globalcache_1.GlobalCache.set('$routeClickEvent', event);
        }
        src.addEvent(event);
        return true;
    });
    /**
     * 增加router指令
     */
    nodom_1.createDirective('router', function (module, dom, src) {
        router_1.Router.routerKeyMap.set(module.id, dom.key);
        return true;
    });
    /**
     * 插头指令
     * 用于模块中，可实现同名替换
     */
    nodom_1.createDirective('slot', function (module, dom, src) {
        this.value = this.value || 'default';
        var mid = dom.parent.subModuleId;
        //父dom有module指令，表示为替代节点，替换子模块中的对应的slot节点；否则为子模块定义slot节点
        if (mid) {
            var m = modulefactory_1.ModuleFactory.get(mid);
            if (m) {
                //缓存当前替换节点
                m.objectManager.set('$slots.' + this.value, { dom: src, model: dom.model });
            }
            //此次不继续渲染，子节点在实际模块中渲染
            return false;
        }
        else { //源slot节点
            //获取替换节点进行替换
            var cfg = module.objectManager.get('$slots.' + this.value);
            if (cfg) {
                var chds = [];
                var rdom = cfg.dom;
                //避免key重复，更新key
                for (var _i = 0, _a = rdom.children; _i < _a.length; _i++) {
                    var d = _a[_i];
                    var d1 = d.clone();
                    util_1.Util.setNodeKey(d1, dom.key, true);
                    chds.push(d1);
                }
                //更改渲染子节点
                src.children = chds;
                //非内部渲染,更改model
                if (!src.hasProp('innerRender')) {
                    for (var _b = 0, _c = src.children; _b < _c.length; _b++) {
                        var c = _c[_b];
                        c.model = cfg.model;
                        //对象绑定到当前模块
                        modelmanager_1.ModelManager.bindToModule(cfg.model, module);
                    }
                }
            }
        }
        return true;
    }, 5);
    /**
     * 指令名
     * 描述：动画指令
     */
    nodom_1.createDirective('animation', function (module, dom, src) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        var confObj = this.value;
        if (!util_1.Util.isObject(confObj)) {
            return new Error('未找到animation配置对象');
        }
        // 获得tigger
        var tigger = confObj.tigger == false ? false : true;
        // 用于判断是动画还是过渡
        var type = confObj.type || "transition";
        // 用于判断是否是 进入/离开动画 
        var isAppear = confObj.isAppear == false ? false : true;
        // 提取 动画/过渡 名
        var nameEnter = ((_a = confObj.name) === null || _a === void 0 ? void 0 : _a.enter) || confObj.name;
        var nameLeave = ((_b = confObj.name) === null || _b === void 0 ? void 0 : _b.leave) || confObj.name;
        // 提取 动画/过渡 持续时间
        var durationEnter = ((_c = confObj.duration) === null || _c === void 0 ? void 0 : _c.enter) || confObj.duration || '';
        var durationLeave = ((_d = confObj.duration) === null || _d === void 0 ? void 0 : _d.leavr) || confObj.duration || '';
        // 提取 动画/过渡 延迟时间
        var delayEnter = ((_e = confObj.delay) === null || _e === void 0 ? void 0 : _e.enter) || confObj.delay || '0s';
        var delayLeave = ((_f = confObj.delay) === null || _f === void 0 ? void 0 : _f.leave) || confObj.delay || '0s';
        // 提取 动画/过渡 时间函数
        var timingFunctionEnter = ((_g = confObj.timingFunction) === null || _g === void 0 ? void 0 : _g.enter) || confObj.timingFunction || 'ease';
        var timingFunctionLeave = ((_h = confObj.timingFunction) === null || _h === void 0 ? void 0 : _h.leave) || confObj.timingFunction || 'ease';
        // 提取动画/过渡 钩子函数
        var beforeEnter = ((_k = (_j = confObj.hooks) === null || _j === void 0 ? void 0 : _j.enter) === null || _k === void 0 ? void 0 : _k.before) ? confObj.hooks.enter.before : ((_l = confObj.hooks) === null || _l === void 0 ? void 0 : _l.before) || undefined;
        var afterEnter = ((_o = (_m = confObj.hooks) === null || _m === void 0 ? void 0 : _m.enter) === null || _o === void 0 ? void 0 : _o.after) ? confObj.hooks.enter.after : ((_p = confObj.hooks) === null || _p === void 0 ? void 0 : _p.after) || undefined;
        var beforeLeave = ((_r = (_q = confObj.hooks) === null || _q === void 0 ? void 0 : _q.leave) === null || _r === void 0 ? void 0 : _r.before) ? confObj.hooks.leave.before : ((_s = confObj.hooks) === null || _s === void 0 ? void 0 : _s.before) || undefined;
        var afterLeave = ((_u = (_t = confObj.hooks) === null || _t === void 0 ? void 0 : _t.leave) === null || _u === void 0 ? void 0 : _u.after) ? confObj.hooks.leave.after : ((_v = confObj.hooks) === null || _v === void 0 ? void 0 : _v.after) || undefined;
        // 定义动画或者过渡结束回调。
        var handler = function () {
            var _a;
            var el = module.getNode(dom.key);
            // 离开动画结束之后隐藏元素
            if (!tigger) {
                if (isAppear) {
                    // 离开动画结束之后 把元素隐藏
                    el.style.display = 'none';
                }
                if (afterLeave) {
                    afterLeave.apply(module.model, [module]);
                }
                // 这里如果style里面写了width和height 那么给他恢复成他写的，不然
                _a = getOriginalWidthAndHeight(dom), el.style.width = _a[0], el.style.height = _a[1];
                // 结束之后删除掉离开动画相关的类
                el.classList.remove(nameLeave + '-leave-active');
                if (type == 'animation') {
                    el.classList.add(nameLeave + '-leave-to');
                }
            }
            else {
                if (afterEnter) {
                    afterEnter.apply(module.model, [module]);
                }
                // 进入动画结束之后删除掉相关的类
                el.classList.remove(nameEnter + '-enter-active');
                if (type == 'animation') {
                    el.classList.add(nameEnter + '-enter-to');
                }
            }
            // 清除事件监听
            el.removeEventListener('animationend', handler);
            el.removeEventListener('transitionend', handler);
        };
        // 获得真实dom
        var el = module.getNode(dom.key);
        if (!tigger) {
            // tigger为false 播放Leave动画
            if (el) {
                if (el.getAttribute('class').indexOf(nameLeave + "-leave-to") != -1) {
                    // 当前已经处于leave动画播放完成之后，若是进入离开动画，这时候需要他保持隐藏状态。
                    dom.props['class'] += " " + nameLeave + "-leave-to";
                    if (isAppear) {
                        dom.props["style"]
                            ? (dom.props["style"] += ";display:none;")
                            : (dom.props["style"] = "display:none;");
                    }
                    return true;
                }
                // // 确保在触发动画之前还是隐藏状态
                // 调用函数触发 Leave动画/过渡
                changeStateFromShowToHide(el);
                return true;
            }
            else {
                // el不存在，第一次渲染
                if (isAppear) {
                    // 是进入离开动画，管理初次渲染的状态，让他隐藏
                    dom.props["style"]
                        ? (dom.props["style"] += ";display:none;")
                        : (dom.props["style"] = "display:none;");
                }
                // 下一帧
                setTimeout(function () {
                    // el已经渲染出来，取得el 根据动画/过渡的类型来做不同的事
                    var el = module.getNode(dom.key);
                    if (isAppear) {
                        // 动画/过渡 是进入离开动画/过渡，并且当前是需要让他隐藏所以我们不播放动画，直接隐藏。
                        el.classList.add(nameLeave + "-leave-to");
                        // 这里必须将这个属性加入到dom中,否则该模块其他数据变化触发增量渲染时,diff会将这个节点重新渲染,导致显示异常
                        // 这里添加添加属性是为了避免diff算法重新渲染该节点
                        dom.props['class'] += " " + nameLeave + "-leave-to";
                        el.style.display = 'none';
                    }
                    else {
                        //  动画/过渡 是 **非进入离开动画/过渡** 我们不管理元素的隐藏，所以我们让他播放一次Leave动画。
                        changeStateFromShowToHide(el);
                    }
                }, 0);
            }
            // 通过虚拟dom将元素渲染出来
            return true;
        }
        else {
            // tigger为true 播放Enter动画
            if (el) {
                if (el.getAttribute('class').indexOf(nameEnter + "-enter-to") != -1) {
                    // 这里不需要像tigger=false时那样处理，这时候他已经处于进入动画播放完毕状态，
                    // 模块内其他数据变化引起该指令重新执行，这时候需要他保持现在显示的状态，直接返回true
                    dom.props['class'] += " " + nameEnter + "-enter-to";
                    return true;
                }
                if (isAppear) {
                    // 如果是进入离开动画，在播放enter动画之前确保该元素是隐藏状态
                    // 确保就算diff更新了该dom还是有隐藏属性
                    dom.props["style"]
                        ? (dom.props["style"] += ";display:none;")
                        : (dom.props["style"] = "display:none;");
                }
                // 调用函数触发Enter动画/过渡
                changeStateFromHideToShow(el);
            }
            else {
                // el不存在，是初次渲染
                if (isAppear) {
                    // 管理初次渲染元素的隐藏显示状态
                    dom.props["style"]
                        ? (dom.props["style"] += ";display:none;")
                        : (dom.props["style"] = "display:none;");
                }
                // 下一帧
                setTimeout(function () {
                    // 等虚拟dom把元素更新上去了之后，取得元素
                    var el = module.getNode(dom.key);
                    if (isAppear) {
                        // 这里必须将这个属性加入到dom中,否则该模块其他数据变化触发增量渲染时,diff会将这个节点重新渲染,导致显示异常
                        // 这里添加添加属性是为了避免diff算法重新渲染该节点
                        dom.props['class'] += " " + nameEnter + "-enter-to";
                        el.style.display = 'none';
                    }
                    // Enter动画与Leave动画不同，
                    // 不管动画是不是进入离开动画，在初次渲染的时候都要执行一遍动画
                    // Leave动画不一样，如果是开始离开动画，并且初次渲染的时候需要隐藏，那么我们没有必要播放一遍离开动画
                    changeStateFromHideToShow(el);
                }, 0);
            }
            // 通过虚拟dom将元素渲染出来
            return true;
        }
        /**
         * 播放Leave动画
         * @param el 真实dom
         */
        function changeStateFromShowToHide(el) {
            // 动画类型是transitiojn
            if (type == 'transition') {
                // 前面已经对transition的初始状态进行了设置，我们需要在下一帧设置结束状态才能触发过渡
                // 获得宽高的值 因为 宽高的auto 百分比 calc计算值都无法拿来触发动画或者过渡。
                var _a = getElRealSzie(el), width_1 = _a[0], height_1 = _a[1];
                // setTimeout(() => {
                requestAnimationFrame(function () {
                    // 移除掉上一次过渡的最终状态
                    el.classList.remove(nameEnter + '-enter-to');
                    // 设置过渡的类名
                    el.classList.add(nameLeave + '-leave-active');
                    // 设置离开过渡的开始类
                    el.classList.add(nameLeave + '-leave-from');
                    // fold过渡的开始状态
                    if (nameLeave == 'fold-height') {
                        el.style.height = height_1;
                    }
                    else if (nameLeave == 'fold-width') {
                        el.style.width = width_1;
                    }
                    // 处理离开过渡的延时
                    el.style.transitionDelay = delayEnter;
                    // 处理过渡的持续时间
                    if (durationEnter != '') {
                        el.style.transitionDuration = durationEnter;
                    }
                    // 处理过渡的时间函数
                    if (timingFunctionEnter != 'ease') {
                        el.style.transitionTimingFunction = timingFunctionEnter;
                    }
                    // 在触发过渡之前执行hook
                    if (beforeLeave) {
                        beforeLeave.apply(module.model, [module]);
                    }
                    requestAnimationFrame(function () {
                        // 添加结束状态
                        el.classList.add(nameLeave + '-leave-to');
                        // 在动画或者过渡开始之前移除掉初始状态
                        el.classList.remove(nameLeave + '-leave-from');
                        if (nameLeave == 'fold-height') {
                            el.style.height = '0px';
                        }
                        else if (nameLeave == 'fold-width') {
                            el.style.width = '0px';
                        }
                        // 添加过渡结束事件监听
                        el.addEventListener('transitionend', handler);
                    });
                });
            }
            else {
                requestAnimationFrame(function () {
                    // 动画类型是aniamtion
                    el.classList.remove(nameEnter + '-enter-to');
                    // 动画延时时间
                    el.style.animationDelay = delayLeave;
                    // 动画持续时间
                    if (durationLeave != '') {
                        el.style.animationDuration = durationLeave;
                    }
                    if (timingFunctionLeave != 'ease') {
                        el.style.animationTimingFunction = timingFunctionLeave;
                    }
                    // 在触发动画之前执行hook
                    if (beforeLeave) {
                        beforeLeave.apply(module.model, [module]);
                    }
                    // 触发一次回流reflow
                    void el.offsetWidth;
                    // 添加动画类名
                    el.classList.add(nameLeave + '-leave-active');
                    //添加动画结束时间监听
                    el.addEventListener('animationend', handler);
                    // })
                });
            }
        }
        /**
         * 播放Enter动画
         * @param el 真实dom
         */
        function changeStateFromHideToShow(el) {
            // 动画类型是transition
            if (type == 'transition') {
                // 对于进入/离开动画
                // Enter过渡的延迟时间与Leave过渡的延迟时间处理不一样
                // 我们这里把延迟统一设置成0s，然后通过定时器来设置延时，
                // 这样可以避免先渲染一片空白区域占位，然后再延时一段时间执行过渡效果。
                el.style.transitionDelay = '0s';
                var delay = parseFloat(delayEnter) * 1000;
                setTimeout(function () {
                    var _a = getElRealSzie(el), width = _a[0], height = _a[1];
                    // 在第一帧设置初始状态
                    // 移除掉上一次过渡的最终状态
                    el.classList.remove(nameLeave + '-leave-to');
                    // 添加过渡的类名
                    el.classList.add(nameEnter + '-enter-active');
                    // 给进入过渡设置开始类名
                    el.classList.add(nameEnter + '-enter-from');
                    // 获得元素的真实尺寸
                    if (nameEnter == 'fold-height') {
                        el.style.height = '0px';
                    }
                    else if (nameEnter == 'fold-width') {
                        el.style.width = '0px';
                    }
                    // 设置过渡持续时间
                    if (durationEnter != '') {
                        el.style.transitionDuration = durationEnter;
                    }
                    // 设置过渡时间函数
                    if (timingFunctionEnter != 'ease') {
                        el.style.transitionTimingFunction = timingFunctionEnter;
                    }
                    // 第二帧将带有初始状态的元素显示出来,如果不开这一帧那么fade的进入过渡在初次渲染的时候会被当作离开过渡触发。
                    requestAnimationFrame(function () {
                        // 下一帧请求过渡效果
                        // 过渡开始之前先将元素显示
                        if (isAppear) {
                            el.style.display = '';
                        }
                        // 第三帧触发过渡
                        requestAnimationFrame(function () {
                            if (beforeEnter) {
                                beforeEnter.apply(module.model, [module]);
                            }
                            // 增加 过渡 结束类名
                            el.classList.add(nameEnter + '-enter-to');
                            // 移除过渡的开始类名
                            el.classList.remove(nameEnter + '-enter-from');
                            if (nameEnter == 'fold-height') {
                                el.style.height = height;
                            }
                            else if (nameEnter == 'fold-width') {
                                el.style.width = width;
                            }
                            el.addEventListener('transitionend', handler);
                        });
                    });
                }, delay);
            }
            else {
                // 动画类型是aniamtion
                // 这里动画的延迟时间也与过渡类似的处理方式。
                el.style.animationDelay = "0s";
                var delay = parseFloat(delayEnter) * 1000;
                setTimeout(function () {
                    // 动画开始之前先将元素显示
                    requestAnimationFrame(function () {
                        el.classList.remove(nameLeave + '-leave-to');
                        // 设置动画的持续时间
                        if (durationEnter != '') {
                            el.style.animationDuration = durationEnter;
                        }
                        // 设置动画的时间函数
                        if (timingFunctionEnter != 'ease') {
                            el.style.animationTimingFunction = durationEnter;
                        }
                        if (isAppear) {
                            el.style.display = '';
                        }
                        // 在触发过渡之前执行hook 
                        if (beforeEnter) {
                            beforeEnter.apply(module.model, [module]);
                        }
                        // 触发一次回流reflow
                        void el.offsetWidth;
                        // 重新添加类名
                        el.classList.add(nameEnter + '-enter-active');
                        el.addEventListener('animationend', handler);
                    });
                }, delay);
            }
        }
        /**
         * 获取真实dom绘制出来之后的宽高
         * @param el 真实dom
         * @returns 真实dom绘制出来之后的宽高
         */
        function getElRealSzie(el) {
            if (el.style.display == 'none') {
                // 获取原先的
                var position = window.getComputedStyle(el).getPropertyValue("position");
                var vis = window.getComputedStyle(el).getPropertyValue("visibility");
                // 先脱流
                el.style.position = 'absolute';
                // 然后将元素变为
                el.style.visibility = 'hidden';
                el.style.display = '';
                var width = window.getComputedStyle(el).getPropertyValue("width");
                var height = window.getComputedStyle(el).getPropertyValue("height");
                // 还原样式
                el.style.position = position;
                el.style.visibility = vis;
                el.style.display = 'none';
                return [width, height];
            }
            else {
                var width = window.getComputedStyle(el).getPropertyValue("width");
                var height = window.getComputedStyle(el).getPropertyValue("height");
                return [width, height];
            }
        }
        /**
         * 如果dom上得style里面有width/height
         * @param dom 虚拟dom
         * @returns 获得模板上的width/height 如果没有则返回空字符串
         */
        function getOriginalWidthAndHeight(dom) {
            var oStyle = dom.vdom.getProp('style');
            var width;
            var height;
            if (oStyle) {
                var arr = oStyle.trim().split(/;\s*/);
                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                    var a = arr_1[_i];
                    if (a.startsWith('width')) {
                        width = a.split(":")[1];
                    }
                    if (a.startsWith('height')) {
                        height = a.split(':')[1];
                    }
                }
            }
            width = width || '';
            height = height || '';
            return [width, height];
        }
    }, 9);
}());
