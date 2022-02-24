"use strict";
exports.__esModule = true;
exports.Expression = void 0;
var util_1 = require("./util");
/**
 * 表达式类
 */
var Expression = /** @class */ (function () {
    /**
     * @param module    模块
     * @param exprStr	表达式串
     */
    function Expression(module, exprStr) {
        this.id = util_1.Util.genId();
        this.allModelField = true;
        if (!module || !exprStr) {
            return;
        }
        var funStr = this.compile(exprStr);
        this.execFunc = new Function('$model', "return " + funStr);
    }
    /**
     * 编译表达式串，替换字段和方法
     * @param exprStr   表达式串
     * @returns         编译后的表达式串
     */
    Expression.prototype.compile = function (exprStr) {
        //字符串，object key，有效命名(函数或字段)
        var reg = /('[\s\S]*?')|("[\s\S]*?")|(`[\s\S]*?`)|([a-zA-Z$_][\w$]*\s*?:)|((\.{3}|\.)?[a-zA-Z$_][\w$]*(\.[a-zA-Z$_][\w$]*)*(\s*[\[\(](\s*\))?)?)/g;
        var r;
        var retS = '';
        var index = 0; //当前位置
        while ((r = reg.exec(exprStr)) !== null) {
            var s = r[0];
            if (index < r.index) {
                retS += exprStr.substring(index, r.index);
            }
            if (s[0] === "'" || s[0] === '"' || s[0] === '`') { //字符串
                retS += s;
            }
            else {
                var lch = s[s.length - 1];
                if (lch === ':') { //object key
                    retS += s;
                }
                else if (lch === '(' || lch === ')') { //函数，非内部函数
                    retS += handleFunc(s);
                }
                else { //字段 this $model .field等不做处理
                    if (s.startsWith('this.') || s === '$model' || s.startsWith('$model.') || util_1.Util.isKeyWord(s) || (s[0] === '.' && s[1] !== '.')) { //非model属性
                        retS += s;
                    }
                    else { //model属性
                        var s1 = '';
                        if (s.startsWith('...')) { // ...属性名
                            s1 = '...';
                            s = s.substr(3);
                        }
                        retS += s1 + '$model.' + s;
                        //存在‘.’，则变量不全在在当前模型中
                        if (s.indexOf('.') !== -1) {
                            this.allModelField = false;
                        }
                    }
                }
            }
            index = reg.lastIndex;
        }
        if (index < exprStr.length) {
            retS += exprStr.substr(index);
        }
        return retS;
        /**
         * 处理函数串
         * @param str   源串
         * @returns     处理后的串
         */
        function handleFunc(str) {
            var ind = str.indexOf('.');
            //中间无'.'
            if (ind === -1) {
                var ind1 = str.lastIndexOf('(');
                var fn = str.substr(0, ind1);
                //末尾字符
                if (!util_1.Util.isKeyWord(fn)) {
                    var lch = str[str.length - 1];
                    if (lch !== ')') { //有参数
                        return 'this.invokeMethod("' + fn + '",';
                    }
                    else { //无参数
                        return 'this.invokeMethod("' + fn + '")';
                    }
                }
            }
            else if (str[0] !== '.') { //第一个为点不处理
                var fn = str.substr(0, ind);
                if (!util_1.Util.isKeyWord(fn)) { //首字段非关键词，则为属性
                    return '$model.' + str;
                }
            }
            return str;
        }
    };
    /**
     * 表达式计算
     * @param module    模块
     * @param model 	模型
     * @returns 		计算结果
     */
    Expression.prototype.val = function (module, model) {
        var v;
        try {
            v = this.execFunc.apply(module, [model]);
        }
        catch (e) {
            // console.error(e);
        }
        this.value = v;
        return v;
    };
    /**
     * 克隆
     */
    Expression.prototype.clone = function () {
        return this;
    };
    return Expression;
}());
exports.Expression = Expression;
