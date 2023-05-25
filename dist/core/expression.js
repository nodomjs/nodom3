import { NError } from "./error";
import { Util } from "./util";
/**
 * 表达式类
 */
export class Expression {
    /**
     * @param exprStr	表达式串
     */
    constructor(exprStr) {
        this.id = Util.genId();
        this.allModelField = true;
        if (!exprStr) {
            return;
        }
        this.exprStr = exprStr;
        const funStr = this.compile(exprStr);
        this.execFunc = new Function('$model', `return ` + funStr);
    }
    /**
     * 编译表达式串，替换字段和方法
     * @param exprStr   表达式串
     * @returns         编译后的表达式串
     */
    compile(exprStr) {
        //字符串，object key，有效命名(函数或字段)
        const reg = /('[\s\S]*?')|("[\s\S]*?")|(`[\s\S]*?`)|([a-zA-Z$_][\w$]*\s*?:)|((\.{3}|\.)?[a-zA-Z$_][\w$]*(\.[a-zA-Z$_][\w$]*)*(\s*[\[\(](\s*\))?)?)/g;
        let r;
        let retS = '';
        let index = 0; //当前位置
        while ((r = reg.exec(exprStr)) !== null) {
            let s = r[0];
            if (index < r.index) {
                retS += exprStr.substring(index, r.index);
            }
            if (s[0] === "'" || s[0] === '"' || s[0] === '`') { //字符串
                retS += s;
            }
            else {
                let lch = s[s.length - 1];
                if (lch === ':') { //object key
                    retS += s;
                }
                else if (lch === '(' || lch === ')') { //函数，非内部函数
                    retS += handleFunc(s);
                }
                else { //字段 this $model .field等不做处理
                    if (s.startsWith('this.')
                        || Util.isKeyWord(s)
                        || (s[0] === '.' && s[1] !== '.')) { //非model属性
                        retS += s;
                    }
                    else { //model属性
                        let s1 = '';
                        if (s.startsWith('...')) { // ...属性名
                            s1 = '...';
                            s = s.substring(3);
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
            retS += exprStr.substring(index);
        }
        return retS;
        /**
         * 处理函数串
         * @param str   源串
         * @returns     处理后的串
         */
        function handleFunc(str) {
            const ind1 = str.lastIndexOf('(');
            const ind2 = str.indexOf('.');
            //第一段
            const fn1 = (ind2 !== -1 ? str.substring(0, ind2) : str.substring(0, ind1)).trim();
            //保留字或第一个为.
            if (Util.isKeyWord(fn1) || str[0] === '.') {
                return str;
            }
            //中间无'.'，模块方法
            if (ind2 === -1) {
                return 'this.' + fn1 + str.substring(fn1.length);
            }
            else { //变量原型方法
                return '$model.' + str;
            }
        }
    }
    /**
     * 表达式计算
     * @param module    模块
     * @param model 	模型
     * @returns 		计算结果
     */
    val(module, model) {
        let v;
        try {
            v = this.execFunc.call(module, model);
        }
        catch (e) {
            console.error(new NError("wrongExpression", this.exprStr).message);
            console.error(e);
        }
        this.value = v;
        return v;
    }
}
//# sourceMappingURL=expression.js.map