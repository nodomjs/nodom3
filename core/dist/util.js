"use strict";
exports.__esModule = true;
exports.Util = void 0;
var error_1 = require("./error");
var msg_en_1 = require("./locales/msg_en");
/**
 * 基础服务库
 * @since       1.0.0
 */
var Util = /** @class */ (function () {
    function Util() {
    }
    /**
     * 唯一主键
     */
    Util.genId = function () {
        return this.generatedId++;
    };
    /**
     * 初始化保留字map
     */
    Util.initKeyMap = function () {
        this.keyWordMap.set('arguments', true);
        this.keyWordMap.set('boolean', true);
        this.keyWordMap.set('break', true);
        this.keyWordMap.set('byte', true);
        this.keyWordMap.set('catch', true);
        this.keyWordMap.set('char', true);
        this.keyWordMap.set('const', true);
        this.keyWordMap.set('default', true);
        this.keyWordMap.set('delete', true);
        this.keyWordMap.set('do', true);
        this.keyWordMap.set('double', true);
        this.keyWordMap.set('else', true);
        this.keyWordMap.set('enum', true);
        this.keyWordMap.set('eval', true);
        this.keyWordMap.set('false', true);
        this.keyWordMap.set('float', true);
        this.keyWordMap.set('for', true);
        this.keyWordMap.set('function', true);
        this.keyWordMap.set('goto', true);
        this.keyWordMap.set('if', true);
        this.keyWordMap.set('in', true);
        this.keyWordMap.set('instanceof', true);
        this.keyWordMap.set('int', true);
        this.keyWordMap.set('let', true);
        this.keyWordMap.set('long', true);
        this.keyWordMap.set('new', true);
        this.keyWordMap.set('null', true);
        this.keyWordMap.set('return', true);
        this.keyWordMap.set('short', true);
        this.keyWordMap.set('switch', true);
        this.keyWordMap.set('this', true);
        this.keyWordMap.set('throw', true);
        this.keyWordMap.set('true', true);
        this.keyWordMap.set('try', true);
        this.keyWordMap.set('this', true);
        this.keyWordMap.set('throw', true);
        this.keyWordMap.set('typeof', true);
        this.keyWordMap.set('var', true);
        this.keyWordMap.set('while', true);
        this.keyWordMap.set('with', true);
        this.keyWordMap.set('Array', true);
        this.keyWordMap.set('Date', true);
        this.keyWordMap.set('JSON', true);
        this.keyWordMap.set('Set', true);
        this.keyWordMap.set('Map', true);
        this.keyWordMap.set('eval', true);
        this.keyWordMap.set('function', true);
        this.keyWordMap.set('Infinity', true);
        this.keyWordMap.set('isFinite', true);
        this.keyWordMap.set('isNaN', true);
        this.keyWordMap.set('isPrototypeOf', true);
        this.keyWordMap.set('Math', true);
        this.keyWordMap.set('NaN', true);
        this.keyWordMap.set('Number', true);
        this.keyWordMap.set('Object', true);
        this.keyWordMap.set('prototype', true);
        this.keyWordMap.set('String', true);
        this.keyWordMap.set('isPrototypeOf', true);
        this.keyWordMap.set('undefined', true);
        this.keyWordMap.set('valueOf', true);
    };
    /**
     * 是否为 js 保留关键字
     * @param name  名字
     * @returns     如果为保留字，则返回true，否则返回false
     */
    Util.isKeyWord = function (name) {
        return this.keyWordMap.has(name);
    };
    /******对象相关******/
    /**
     * 对象复制
     * @param srcObj    源对象
     * @param expKey    不复制的键正则表达式或名
     * @param extra     clone附加参数
     * @returns         复制的对象
     */
    Util.clone = function (srcObj, expKey, extra) {
        var me = this;
        var map = new WeakMap();
        return clone(srcObj, expKey, extra);
        /**
         * clone对象
         * @param src      待clone对象
         * @param expKey   不克隆的键
         * @param extra    clone附加参数
         * @returns        克隆后的对象
         */
        function clone(src, expKey, extra) {
            //非对象或函数，直接返回            
            if (!src || typeof src !== 'object' || Util.isFunction(src)) {
                return src;
            }
            var dst;
            //带有clone方法，则直接返回clone值
            if (src.clone && Util.isFunction(src.clone)) {
                return src.clone(extra);
            }
            else if (me.isObject(src)) {
                dst = new Object();
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                map.set(src, dst);
                Object.getOwnPropertyNames(src).forEach(function (prop) {
                    //不克隆的键
                    if (expKey) {
                        if (expKey.constructor === RegExp && expKey.test(prop) //正则表达式匹配的键不复制
                            || Util.isArray(expKey) && expKey.includes(prop) //被排除的键不复制
                        ) {
                            return;
                        }
                    }
                    dst[prop] = getCloneObj(src[prop], expKey, extra);
                });
            }
            else if (me.isMap(src)) {
                dst = new Map();
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                src.forEach(function (value, key) {
                    //不克隆的键
                    if (expKey) {
                        if (expKey.constructor === RegExp && expKey.test(key) //正则表达式匹配的键不复制
                            || expKey.includes(key)) { //被排除的键不复制
                            return;
                        }
                    }
                    dst.set(key, getCloneObj(value, expKey, extra));
                });
            }
            else if (me.isArray(src)) {
                dst = new Array();
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                src.forEach(function (item, i) {
                    dst[i] = getCloneObj(item, expKey, extra);
                });
            }
            return dst;
        }
        /**
         * 获取clone对象
         * @param value     待clone值
         * @param expKey    排除键
         * @param extra     附加参数
         */
        function getCloneObj(value, expKey, extra) {
            if (typeof value === 'object' && !Util.isFunction(value)) {
                var co = null;
                if (!map.has(value)) { //clone新对象
                    co = clone(value, expKey, extra);
                }
                else { //从map中获取对象
                    co = map.get(value);
                }
                return co;
            }
            return value;
        }
    };
    /**
     * 合并多个对象并返回
     * @param   参数数组
     * @returns 返回对象
     */
    Util.merge = function (o1, o2, o3, o4, o5, o6) {
        var me = this;
        for (var i = 0; i < arguments.length; i++) {
            if (!this.isObject(arguments[i])) {
                throw new error_1.NError('invoke', 'Util.merge', i + '', 'object');
            }
        }
        var retObj = Object.assign.apply(null, arguments);
        subObj(retObj);
        return retObj;
        //处理子对象
        function subObj(obj) {
            for (var o in obj) {
                if (me.isObject(obj[o]) || me.isArray(obj[o])) { //对象或数组
                    retObj[o] = me.clone(retObj[o]);
                }
            }
        }
    };
    /**
     * 把obj2对象所有属性赋值给obj1
     * @returns 返回对象obj1
     */
    Util.assign = function (obj1, obj2) {
        if (Object.assign) {
            Object.assign(obj1, obj2);
        }
        else {
            this.getOwnProps(obj2).forEach(function (p) {
                obj1[p] = obj2[p];
            });
        }
        return obj1;
    };
    /**
     * 比较两个对象值是否相同(只比较object和array)
     * @param src   源对象
     * @param dst   目标对象
     * @returns     值相同则返回true，否则返回false
     */
    Util.compare = function (src, dst, deep) {
        if (!src && !dst) {
            return true;
        }
        if (typeof src !== 'object' || typeof dst !== 'object') {
            return false;
        }
        var keys = Object.getOwnPropertyNames(src);
        if (keys.length !== Object.getOwnPropertyNames(dst).length) {
            return false;
        }
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var k = keys_1[_i];
            if (src[k] !== dst[k]) {
                return false;
            }
        }
        //深度比较
        if (deep) {
            for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
                var k = keys_2[_a];
                var r = this.compare(src[k], dst[k]);
                if (!r) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * 获取对象自有属性
     * @param obj   需要获取属性的对象
     * @returns     返回属性数组
     */
    Util.getOwnProps = function (obj) {
        if (!obj) {
            return [];
        }
        return Object.getOwnPropertyNames(obj);
    };
    /**************对象判断相关************/
    /**
     * 判断是否为函数
     * @param foo   检查的对象
     * @returns     true/false
     */
    Util.isFunction = function (foo) {
        return foo !== undefined && foo !== null && foo.constructor === Function;
    };
    /**
     * 判断是否为数组
     * @param obj   检查的对象
     * @returns     true/false
     */
    Util.isArray = function (obj) {
        return Array.isArray(obj);
    };
    /**
     * 判断是否为map
     * @param obj   检查的对象
     */
    Util.isMap = function (obj) {
        return obj !== null && obj !== undefined && obj.constructor === Map;
    };
    /**
     * 判断是否为对象
     * @param obj   检查的对象
     * @returns     true/false
     */
    Util.isObject = function (obj) {
        return obj !== null && obj !== undefined && obj.constructor === Object;
    };
    /**
     * 判断是否为整数
     * @param v     检查的值
     * @returns     true/false
     */
    Util.isInt = function (v) {
        return Number.isInteger(v);
    };
    /**
     * 判断是否为number
     * @param v     检查的值
     * @returns     true/false
     */
    Util.isNumber = function (v) {
        return typeof v === 'number';
    };
    /**
     * 判断是否为boolean
     * @param v     检查的值
     * @returns     true/false
     */
    Util.isBoolean = function (v) {
        return typeof v === 'boolean';
    };
    /**
     * 判断是否为字符串
     * @param v     检查的值
     * @returns     true/false
     */
    Util.isString = function (v) {
        return typeof v === 'string';
    };
    /**
     * 判断是否为数字串
     * @param v     检查的值
     * @returns     true/false
     */
    Util.isNumberString = function (v) {
        return /^\d+\.?\d*$/.test(v);
    };
    /**
     * 判断对象/字符串是否为空
     * @param obj   检查的对象
     * @returns     true/false
     */
    Util.isEmpty = function (obj) {
        if (obj === null || obj === undefined)
            return true;
        var tp = typeof obj;
        if (this.isObject(obj)) {
            var keys = Object.keys(obj);
            if (keys !== undefined) {
                return keys.length === 0;
            }
        }
        else if (tp === 'string') {
            return obj === '';
        }
        return false;
    };
    /**
     * 把srcNode替换为nodes
     * @param srcNode       源dom
     * @param nodes         替换的dom或dom数组
     */
    Util.replaceNode = function (srcNode, nodes) {
        // if (!this.isNode(srcNode)) {
        //     throw new NError('invoke', 'this.replaceNode', '0', 'Node');
        // }
        // if (!this.isNode(nodes) && !this.isArray(nodes)) {
        //     throw new NError('invoke1', 'this.replaceNode', '1', 'Node', 'Node Array');
        // }
        var pnode = srcNode.parentNode;
        var bnode = srcNode.nextSibling;
        if (pnode === null) {
            return;
        }
        pnode.removeChild(srcNode);
        var nodeArr = this.isArray(nodes) ? nodes : [nodes];
        nodeArr.forEach(function (node) {
            if (bnode === undefined || bnode === null) {
                pnode.appendChild(node);
            }
            else {
                pnode.insertBefore(node, bnode);
            }
        });
    };
    /**
     * 清空子节点
     * @param el   需要清空的节点
     */
    Util.empty = function (el) {
        var me = this;
        var nodes = el.childNodes;
        for (var i = nodes.length - 1; i >= 0; i--) {
            el.removeChild(nodes[i]);
        }
    };
    /******日期相关******/
    /**
     * 日期格式化
     * @param srcDate    时间戳串
     * @param format     日期格式
     * @returns          日期串
     */
    Util.formatDate = function (srcDate, format) {
        //时间戳
        var timeStamp;
        if (this.isString(srcDate)) {
            //排除日期格式串,只处理时间戳
            var reg = /^\d+$/;
            if (reg.test(srcDate) === true) {
                timeStamp = parseInt(srcDate);
            }
        }
        else if (this.isNumber(srcDate)) {
            timeStamp = srcDate;
        }
        else {
            throw new error_1.NError('invoke', 'this.formatDate', '0', 'date string', 'date');
        }
        //得到日期
        var date = new Date(timeStamp);
        // invalid date
        if (isNaN(date.getDay())) {
            return '';
        }
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
            "H+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds() //毫秒
        };
        //年
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        //月日
        this.getOwnProps(o).forEach(function (k) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        });
        //星期
        if (/(E+)/.test(format)) {
            format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + msg_en_1.NodomMessage_en.WeekDays[date.getDay() + ""]);
        }
        return format;
    };
    /******字符串相关*****/
    /**
     * 编译字符串，把{n}替换成带入值
     * @param src   待编译的字符串
     * @returns     转换后的消息
     */
    Util.compileStr = function (src, p1, p2, p3, p4, p5) {
        var reg;
        var args = arguments;
        var index = 0;
        for (;;) {
            if (src.indexOf('\{' + index + '\}') !== -1) {
                reg = new RegExp('\\{' + index + '\\}', 'g');
                src = src.replace(reg, args[index + 1]);
                index++;
            }
            else {
                break;
            }
        }
        return src;
    };
    /**
     * 函数调用
     * @param foo   函数
     * @param obj   this指向
     * @param args  参数数组
     */
    Util.apply = function (foo, obj, args) {
        if (!foo) {
            return;
        }
        return Reflect.apply(foo, obj || null, args);
    };
    /**
     * 合并并修正路径，即路径中出现'//','///','\/'的情况，统一置换为'/'
     * @param paths     待合并路径数组
     * @returns         返回路径
     */
    Util.mergePath = function (paths) {
        return paths.join('/').replace(/(\/{2,})|\\\//g, '\/');
    };
    /**
     * eval
     * @param evalStr   eval串
     * @returns         eval值
     */
    Util.eval = function (evalStr) {
        return new Function("return(" + evalStr + ")")();
    };
    /**
     * 改造 dom key，避免克隆时重复，格式为：key_id
     * @param node    节点
     * @param id      附加id
     * @param deep    是否深度处理
     */
    Util.setNodeKey = function (node, id, deep) {
        node.key += '_' + (id || Util.genId());
        if (deep && node.children) {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var c = _a[_i];
                Util.setNodeKey(c, id, deep);
            }
        }
    };
    /**
     * 设置dom asset
     * @param dom       渲染后的dom节点
     * @param name      asset name
     * @param value     asset value
     */
    Util.setDomAsset = function (dom, name, value) {
        if (!dom.assets) {
            dom.assets = {};
        }
        dom.assets[name] = value;
    };
    /**
     * 删除dom asset
     * @param dom   渲染后的dom节点
     * @param name  asset name
     * @returns
     */
    Util.delDomAsset = function (dom, name) {
        if (!dom.assets) {
            return;
        }
        delete dom.assets[name];
    };
    /**
     * 全局id
     */
    Util.generatedId = 1;
    /**
     * js 保留字 map
     */
    Util.keyWordMap = new Map();
    return Util;
}());
exports.Util = Util;
//初始化keymap
Util.initKeyMap();