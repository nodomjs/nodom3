"use strict";
exports.__esModule = true;
exports.Compiler = void 0;
var defineelementmanager_1 = require("./defineelementmanager");
var directive_1 = require("./directive");
var virtualdom_1 = require("./virtualdom");
var error_1 = require("./error");
var event_1 = require("./event");
var expression_1 = require("./expression");
var modulefactory_1 = require("./modulefactory");
var Compiler = /** @class */ (function () {
    /**
     * 构造器
     * @param module
     */
    function Compiler(module) {
        this.module = module;
    }
    /**
    * 编译
    * @param elementStr     待编译html串
    * @returns              虚拟dom
    */
    Compiler.prototype.compile = function (elementStr) {
        return this.compileTemplate(elementStr);
    };
    /**
     * 编译模版串
     * @param srcStr    源串
     * @returns
     */
    Compiler.prototype.compileTemplate = function (srcStr) {
        var me = this;
        // 清理comment
        srcStr = srcStr.replace(/\<\!\-\-[\s\S]*?\-\-\>/g, '');
        // 正则式分解标签和属性
        // const regWhole = /((?<!\\)'[\s\S]*?(?<!\\)')|((?<!\\)"[\s\S]*?(?<!\\)")|((?<!\\)`[\s\S]*?(?<!\\)`)|({{{*)|(}*}})|([\w$-]+(\s*=)?)|(<\s*[a-zA-Z][a-zA-Z0-9-_]*)|(\/?>)|(<\/\s*[a-zA-Z][a-zA-Z0-9-_]*>)/g;
        var regWhole = /('[\s\S]*?')|("[\s\S]*?")|(`[\s\S]*?`)|({{{*)|(}*}})|([\w$-]+(\s*=)?)|(<\s*[a-zA-Z][a-zA-Z0-9-_]*)|(\/?>)|(<\/\s*[a-zA-Z][a-zA-Z0-9-_]*>)/g;
        //属性名正则式
        var propReg = /^[a-zA-Z_$][$-\w]*?\s*?=?$/;
        //不可见字符正则式
        var regSpace = /^[\s\n\r\t\v]+$/;
        //dom数组
        var domArr = [];
        //已闭合的tag，与domArr对应
        var closedTag = [];
        //文本开始index
        var txtStartIndex = 0;
        //属性值
        var propName;
        //pre标签标志
        var isPreTag = false;
        //template计数器
        var templateCount = 0;
        //模版开始index
        var templateStartIndex = 0;
        //当前标签名
        var tagName;
        //表达式开始index
        var exprStartIndex = 0;
        //表达式计数器
        var exprCount = 0;
        //当前dom节点
        var dom;
        //正则式匹配结果
        var result;
        while ((result = regWhole.exec(srcStr)) !== null) {
            var re = result[0];
            //不在模版中
            if (templateCount === 0) {
                if (re.startsWith('{{')) { //表达式开始符号
                    //整除2个数
                    if (exprCount === 0) { //表达式开始
                        exprStartIndex = result.index;
                    }
                    exprCount += re.length / 2 | 0;
                }
                else if (re.endsWith('}}')) { //表达式结束
                    exprCount -= re.length / 2 | 0;
                    if (exprCount === 0) {
                        handleExpr();
                    }
                }
            }
            //不在表达式中
            if (exprCount === 0) {
                if (templateCount === 0) { //不在模版中
                    if (re[0] === '<') { //标签
                        //处理文本
                        handleText(srcStr.substring(txtStartIndex, result.index));
                        if (re[1] === '/') { //标签结束
                            finishTag(re);
                        }
                        else { //标签开始
                            tagName = re.substr(1).trim().toLowerCase();
                            txtStartIndex = undefined;
                            isPreTag = (tagName === 'pre');
                            //新建dom节点
                            dom = new virtualdom_1.VirtualDom(tagName, this.genKey());
                            domArr.push(dom);
                            closedTag.push(false);
                        }
                    }
                    else if (re === '>') { //标签头结束
                        finishTagHead();
                    }
                    else if (re === '/>') { //标签结束
                        finishTag();
                    }
                    else if (dom && dom.tagName) { //属性
                        if (propReg.test(re)) {
                            if (propName) { //propName=无值 情况，当无值处理
                                handleProp();
                            }
                            if (re.endsWith('=')) { //属性带=，表示后续可能有值
                                propName = re.substring(0, re.length - 1).trim();
                            }
                            else { //只有属性，无属性值
                                propName = re;
                                handleProp();
                            }
                        }
                        else if (propName) { //属性值
                            handleProp(re);
                        }
                    }
                }
                else if (re[0] === '<') { //模版串中的元素开始或结束
                    if (re[1] === '/') {
                        //template 结束且是最外层的template，则处理template
                        if (re.substring(2, re.length - 1).trim().toLowerCase() === 'template' && --templateCount === 0) {
                            domArr[domArr.length - 1].setProp('template', srcStr.substring(templateStartIndex, result.index).trim());
                        }
                    }
                    else {
                        //template开始，计数器+1
                        if (re.substr(1).trim().toLowerCase() === 'template') {
                            templateCount++;
                        }
                    }
                }
            }
        }
        //异常情况
        if (domArr.length > 1 || exprCount !== 0 || templateCount !== 0) {
            throw new error_1.NError('wrongTemplate');
        }
        return domArr[0];
        /**
         * 标签结束
         * @param ftag      结束标签
         */
        function finishTag(ftag) {
            if (ftag) {
                var finded = false;
                var tag = ftag.substring(2, ftag.length - 1).trim().toLowerCase();
                //反向查找
                for (var i = domArr.length - 1; i >= 0; i--) {
                    if (!closedTag[i] && domArr[i].tagName === tag) {
                        domArr[i].children = domArr.slice(i + 1);
                        //删除后续节点
                        domArr.splice(i + 1);
                        //标注该节点已闭合
                        closedTag.splice(i + 1);
                        finded = true;
                        break;
                    }
                }
                if (!finded) {
                    throw new error_1.NError('wrongTemplate');
                }
            }
            //设置标签关闭
            var ele = domArr[domArr.length - 1];
            closedTag[closedTag.length - 1] = true;
            me.postHandleNode(ele);
            ele.sortDirective();
            me.handleSlot(ele);
            dom = undefined;
            propName = undefined;
            txtStartIndex = regWhole.lastIndex;
            exprCount = 0;
            exprStartIndex = 0;
            // ele.allModelField = allModelField;    
        }
        /**
         * 标签头结束
         */
        function finishTagHead() {
            if (tagName === 'template') { //模版标签
                if (templateCount === 0) { //模版最开始，需要记录模版开始位置
                    templateStartIndex = regWhole.lastIndex;
                }
                //嵌套template中的计数
                templateCount++;
            }
            if (dom) {
                txtStartIndex = regWhole.lastIndex;
            }
            dom = undefined;
            propName = undefined;
            exprCount = 0;
            exprStartIndex = 0;
        }
        /**
         * 处理属性
         * @param value     属性值
         */
        function handleProp(value) {
            if (!dom || !propName) {
                return;
            }
            if (value) {
                var r = void 0;
                //去掉字符串两端
                if (['"', "'", '`'].includes(value[0]) && ['"', "'", '`'].includes(value[value.length - 1])) {
                    value = value.substring(1, value.length - 1).trim();
                }
            }
            //指令
            if (propName.startsWith("x-")) {
                //不排序
                dom.addDirective(new directive_1.Directive(propName.substr(2), value));
            }
            else if (propName.startsWith("e-")) { //事件
                dom.addEvent(new event_1.NEvent(me.module, propName.substr(2), value));
            }
            else { //普通属性
                dom.setProp(propName, value);
            }
            propName = undefined;
        }
        /**
         * 处理表达式
         */
        function handleExpr() {
            //处理表达式前的文本
            if (txtStartIndex > 0 && exprStartIndex > txtStartIndex) {
                handleText(srcStr.substring(txtStartIndex, exprStartIndex));
            }
            var s = srcStr.substring(exprStartIndex + 2, regWhole.lastIndex - 2);
            exprCount = 0;
            exprStartIndex = 0;
            //新建表达式
            var expr = new expression_1.Expression(me.module, s);
            if (dom && dom.tagName) { //标签
                handleProp(expr);
            }
            else { //文本节点
                setTxtDom(expr);
                //文本节点，移动txt节点开始位置
                txtStartIndex = regWhole.lastIndex;
            }
            //设置所有字段都在model内标识
            dom.allModelField = expr.allModelField;
        }
        /**
         * 处理txt为文本节点
         * @param txt 文本串
         */
        function handleText(txt) {
            if (txt === '' || !isPreTag && regSpace.test(txt)) { //非pre 标签且全为不可见字符，不处理
                return;
            }
            txt = me.preHandleText(txt);
            setTxtDom(txt);
        }
        /**
         * 新建文本节点
         * @param txt   文本串
         */
        function setTxtDom(txt) {
            if (!dom) {
                dom = new virtualdom_1.VirtualDom(null, me.genKey());
                domArr.push(dom);
                closedTag.push(false);
            }
            if (dom.expressions) {
                dom.expressions.push(txt);
            }
            else {
                if (typeof txt === 'string') { //字符串
                    dom.textContent = txt;
                }
                else { //表达式
                    if (dom.textContent) { //之前的文本进数组
                        dom.expressions = [dom.textContent, txt];
                        delete dom.textContent;
                    }
                    else {
                        dom.expressions = [txt];
                    }
                }
            }
        }
    };
    /**
     * 处理模块子节点为slot节点
     * @param dom   dom节点
     */
    Compiler.prototype.handleSlot = function (dom) {
        if (!dom.children || dom.children.length === 0 || !dom.hasDirective('module')) {
            return;
        }
        var slotCt;
        for (var j = 0; j < dom.children.length; j++) {
            var c = dom.children[j];
            if (c.tagName === 'template') { //模版作为模块的template属性
                dom.setProp('template', c.getProp('template'));
                //template节点不再需要
                dom.children.splice(j--, 1);
                continue;
            }
            if (c.hasDirective('slot')) { //带slot的不处理
                continue;
            }
            if (!slotCt) { //第一个直接被slotCt替换
                slotCt = new virtualdom_1.VirtualDom('div', this.genKey());
                slotCt.addDirective(new directive_1.Directive('slot', null));
                //当前位置，用slot替代
                dom.children.splice(j, 1, slotCt);
            }
            else {
                //直接删除
                dom.children.splice(j--, 1);
            }
            slotCt.add(c);
        }
    };
    /**
     * 后置处理
     * 包括：模块类元素、自定义元素
     * @param node  虚拟dom节点
     */
    Compiler.prototype.postHandleNode = function (node) {
        // 自定义元素判断
        var clazz = defineelementmanager_1.DefineElementManager.get(node.tagName);
        if (clazz) { //自定义元素
            Reflect.construct(clazz, [node, this.module]);
        }
        // 模块类判断
        if (modulefactory_1.ModuleFactory.hasClass(node.tagName)) {
            node.addDirective(new directive_1.Directive('module', node.tagName));
            node.tagName = 'div';
        }
    };
    /**
     * 预处理html保留字符 如 &nbsp;,&lt;等
     * @param str   待处理的字符串
     * @returns     解析之后的串
     */
    Compiler.prototype.preHandleText = function (str) {
        var reg = /&[a-z]+;/;
        if (reg.test(str)) {
            var div = document.createElement('div');
            div.innerHTML = str;
            return div.textContent;
        }
        return str;
    };
    /**
     * 产生dom key
     * @returns   dom key
     */
    Compiler.prototype.genKey = function () {
        return this.module.getDomKeyId() + '';
    };
    return Compiler;
}());
exports.Compiler = Compiler;
