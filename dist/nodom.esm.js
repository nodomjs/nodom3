/**
 * 自定义元素管理器
 *
 * @remarks
 * 所有自定义元素需要添加到管理器才能使用
 */
class DefineElementManager {
    /**
     * 添加自定义元素
     * @param clazz -   自定义元素类或类数组
     */
    static add(clazz) {
        if (Array.isArray(clazz)) {
            for (const c of clazz) {
                this.elements.set(c.name.toUpperCase(), c);
            }
        }
        else {
            this.elements.set(clazz.name.toUpperCase(), clazz);
        }
    }
    /**
     * 获取自定义元素类
     * @param tagName - 元素名
     * @returns         自定义元素类
     */
    static get(tagName) {
        return this.elements.get(tagName.toUpperCase());
    }
    /**
     * 是否存在自定义元素
     * @param tagName - 元素名
     * @returns         存在或不存在
     */
    static has(tagName) {
        return this.elements.has(tagName.toUpperCase());
    }
}
/**
 * 自定义元素集合
 */
DefineElementManager.elements = new Map();

/**
 * 指令类型
 */
class DirectiveType {
    /**
     * 构造方法
     * @param name -    指令类型名
     * @param handle -  渲染时执行方法
     * @param prio -    类型优先级
     */
    constructor(name, handler, prio) {
        this.name = name;
        this.prio = prio >= 0 ? prio : 10;
        this.handler = handler;
    }
}

/**
 * 指令管理器
 */
class DirectiveManager {
    /**
     * 增加指令映射
     * @param name -    指令类型名
     * @param handle -  渲染处理函数
     * @param prio -    类型优先级
     */
    static addType(name, handler, prio) {
        this.directiveTypes.set(name, new DirectiveType(name, handler, prio));
    }
    /**
     * 移除指令映射
     * @param name -    指令类型名
     */
    static removeType(name) {
        this.directiveTypes.delete(name);
    }
    /**
     * 获取指令
     * @param name -    指令类型名
     * @returns         指令类型或undefined
     */
    static getType(name) {
        return this.directiveTypes.get(name);
    }
    /**
     * 是否含有某个指令
     * @param name -    指令类型名
     * @returns         true/false
     */
    static hasType(name) {
        return this.directiveTypes.has(name);
    }
}
/**
 * 指令映射
 */
DirectiveManager.directiveTypes = new Map();

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/*
 * 英文消息文件
 */
const NodomMessage_en = {
    /**
     * tip words
     */
    TipWords: {
        application: "Application",
        system: "System",
        module: "Module",
        clazz: "类",
        moduleClass: 'ModuleClass',
        model: "Model",
        directive: "Directive",
        directiveType: "Directive-type",
        expression: "Expression",
        event: "Event",
        method: "Method",
        filter: "Filter",
        filterType: "Filter-type",
        data: "Data",
        dataItem: 'Data-item',
        route: 'Route',
        routeView: 'Route-container',
        plugin: 'Plugin',
        resource: 'Resource',
        root: 'Root',
        element: 'VirtualDom'
    },
    /**
     * error info
     */
    ErrorMsgs: {
        unknown: "unknown error",
        uninit: "{0}未初始化",
        paramException: "{0} '{1}' parameter error，see api",
        invoke: "method {0} parameter {1} must be {2}",
        invoke1: "method {0} parameter {1} must be {2} or {3}",
        invoke2: "method {0} parameter {1} or {2} must be {3}",
        invoke3: "method {0} parameter {1} not allowed empty",
        exist: "{0} is already exist",
        exist1: "{0} '{1}' is already exist",
        notexist: "{0} is not exist",
        notexist1: "{0} '{1}' is not exist",
        notupd: "{0} not allow to change",
        notremove: "{0} not allow to delete",
        notremove1: "{0} {1} not allow to delete",
        namedinvalid: "{0} {1} name error，see name rules",
        initial: "{0} init parameter error",
        jsonparse: "JSON parse error",
        timeout: "request overtime",
        config: "{0} config parameter error",
        config1: "{0} config parameter '{1}' error",
        itemnotempty: "{0} '{1}' config item '{2}' not allow empty",
        itemincorrect: "{0} '{1}' config item '{2}' error",
        needEndTag: "element {0} is not closed",
        needStartTag: "without start tag matchs {0}",
        tagError: "element {0} error",
        wrongTemplate: "wrong template",
        wrongExpression: "expression error: {0} "
    },
    WeekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
};

/*
 * 中文消息文件
 */
const NodomMessage_zh = {
    /**
     * 提示单词
     */
    TipWords: {
        application: "应用",
        system: "系统",
        module: "模块",
        clazz: "类",
        moduleClass: '模块类',
        model: "模型",
        directive: "指令",
        directiveType: "指令类型",
        expression: "表达式",
        event: "事件",
        method: "方法",
        filter: "过滤器",
        filterType: "过滤器类型",
        data: "数据",
        dataItem: '数据项',
        route: '路由',
        routeView: '路由容器',
        plugin: '插件',
        resource: '资源',
        root: '根',
        element: '元素'
    },
    /**
     * 异常信息
     */
    ErrorMsgs: {
        unknown: "未知错误",
        uninit: "{0}未初始化",
        paramException: "{0}'{1}'方法参数错误，请参考api",
        invoke: "{0} 方法参数 {1} 必须为 {2}",
        invoke1: "{0} 方法参数 {1} 必须为 {2} 或 {3}",
        invoke2: "{0} 方法参数 {1} 或 {2} 必须为 {3}",
        invoke3: "{0} 方法参数 {1} 不能为空",
        exist: "{0} 已存在",
        exist1: "{0} '{1}' 已存在",
        notexist: "{0} 不存在",
        notexist1: "{0} '{1}' 不存在",
        notupd: "{0} 不可修改",
        notremove: "{0} 不可删除",
        notremove1: "{0} {1} 不可删除",
        namedinvalid: "{0} {1} 命名错误，请参考用户手册对应命名规范",
        initial: "{0} 初始化参数错误",
        jsonparse: "JSON解析错误",
        timeout: "请求超时",
        config: "{0} 配置参数错误",
        config1: "{0} 配置参数 '{1}' 错误",
        itemnotempty: "{0} '{1}' 配置项 '{2}' 不能为空",
        itemincorrect: "{0} '{1}' 配置项 '{2}' 错误",
        needEndTag: "{0} 标签未闭合",
        needStartTag: "未找到与 {0} 匹配的开始标签",
        tagError: "标签 {0} 错误",
        wrongTemplate: "模版格式错误",
        wrongExpression: "表达式 {0} 错误"
    },
    WeekDays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
};

/**
 * 模块工厂
 * @remarks
 * 管理所有模块类、模块实例
 */
class ModuleFactory {
    /**
     * 添加模块实例到工厂
     * @param item -  模块对象
     */
    static add(item) {
        // 第一个为主模块
        if (this.modules.size === 0) {
            this.mainModule = item;
        }
        this.modules.set(item.id, item);
        //添加模块类
        this.addClass(item.constructor);
    }
    /**
     * 获得模块
     * @remarks
     * 当name为id时，则获取对应id的模块
     *
     * 当name为字符串时，表示模块类名
     *
     * 当name为class时，表示模块类
     *
     * @param name -  类或实例id
     */
    static get(name) {
        const tp = typeof name;
        let mdl;
        if (tp === 'number') { //数字，模块id
            return this.modules.get(name);
        }
        else {
            if (tp === 'string') { //字符串，模块类名
                name = name.toLowerCase();
                if (!this.classes.has(name)) { //为别名
                    name = this.aliasMap.get(name);
                }
                if (this.classes.has(name)) {
                    mdl = Reflect.construct(this.classes.get(name), []);
                }
            }
            else { //模块类
                mdl = Reflect.construct(name, []);
            }
            if (mdl) {
                mdl.init();
                return mdl;
            }
        }
    }
    /**
     * 是否存在模块类
     * @param clazzName -   模块类名
     * @returns     true/false
     */
    static hasClass(clazzName) {
        const name = clazzName.toLowerCase();
        return this.classes.has(name) || this.aliasMap.has(name);
    }
    /**
     * 添加模块类
     * @param clazz -   模块类
     * @param alias -   别名
     */
    static addClass(clazz, alias) {
        //转换成小写
        const name = clazz.name.toLowerCase();
        if (this.classes.has(name)) {
            return;
        }
        this.classes.set(name, clazz);
        //添加别名
        if (alias) {
            this.aliasMap.set(alias.toLowerCase(), name);
        }
    }
    /**
     * 获取模块类
     * @param name -    类名或别名
     * @returns         模块类
     */
    static getClass(name) {
        name = name.toLowerCase();
        return this.classes.has(name) ? this.classes.get(name) : this.classes.get(this.aliasMap.get(name));
    }
    /**
     * 加载模块
     * @remarks
     * 用于实现模块懒加载
     * @param modulePath -   模块类路径
     * @returns              模块类
     */
    static load(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const m = yield import(modulePath);
            if (m) {
                //通过import的模块，查找模块类
                for (const k of Object.keys(m)) {
                    if (m[k].name) {
                        this.addClass(m[k]);
                        return m[k];
                    }
                }
            }
        });
    }
    /**
     * 从工厂移除模块
     * @param id -    模块id
     */
    static remove(id) {
        this.modules.delete(id);
    }
    /**
     * 设置应用主模块
     * @param m - 	模块
     */
    static setMain(m) {
        this.mainModule = m;
    }
    /**
     * 获取应用主模块
     * @returns 	应用的主模块
     */
    static getMain() {
        return this.mainModule;
    }
}
/**
 * 模块对象集合
 * @remarks
 * 格式为map，其中：
 *
 * key: 模块id
 *
 * value: 模块对象
 */
ModuleFactory.modules = new Map();
/**
 * 模块类集合
 * @remarks
 * 格式为map，其中：
 *
 *  key:    模块类名或别名
 *
 *  value:  模块类
 */
ModuleFactory.classes = new Map();
/**
 * 别名map
 * @remarks
 * 格式为map，其中：
 *
 * key:     别名
 *
 * value:   类名
 */
ModuleFactory.aliasMap = new Map();

/**
 * 表达式类
 * @remarks
 * 表达式中的特殊符号
 *
 *  this:指向渲染的module
 *
 *  $model:指向当前dom的model
 */
class Expression {
    /**
     * @param exprStr -	表达式串
     */
    constructor(exprStr) {
        this.id = Util.genId();
        if (!exprStr || (exprStr = exprStr.trim()) === '') {
            return;
        }
        if (Nodom.isDebug) {
            this.exprStr = exprStr;
        }
        const funStr = this.compile(exprStr);
        this.execFunc = new Function('$model', 'return ' + funStr);
    }
    /**
     * 编译表达式串，替换字段和方法
     * @param exprStr -   表达式串
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
                const lch = s[s.length - 1];
                if (lch === ':') { //object key
                    retS += s;
                }
                else if (lch === '(' || lch === ')') { //函数，非内部函数
                    retS += handleFunc(s);
                }
                else { //字段 this $model .field等不做处理
                    if (s.startsWith('this.')
                        || Util.isKeyWord(s)
                        || (s[0] === '.' && s[1] !== '.')
                        || s === '$model') { //非model属性
                        retS += s;
                    }
                    else { //model属性
                        let s1 = '';
                        if (s.startsWith('...')) { // ...属性名
                            s1 = '...';
                            s = s.substring(3);
                        }
                        retS += s1 + '$model.' + s;
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
         * @param str -   源串
         * @returns     处理后的串
         */
        function handleFunc(str) {
            //去除空格
            str = str.replace(/\s+/g, '');
            const ind1 = str.lastIndexOf('(');
            const ind2 = str.indexOf('.');
            //第一段
            const fn1 = (ind2 !== -1 ? str.substring(0, ind2) : str.substring(0, ind1));
            //保留字或第一个为.
            if (Util.isKeyWord(fn1) || str[0] === '.') {
                return str;
            }
            if (ind2 === -1) {
                let s = "this.invokeMethod('" + fn1 + "'";
                s += str[str.length - 1] !== ')' ? ',' : ')';
                return s;
            }
            return '$model.' + str;
        }
    }
    /**
     * 表达式计算
     * @param module -  模块
     * @param model - 	模型
     * @returns 		计算结果
     */
    val(module, model) {
        if (!this.execFunc) {
            return;
        }
        let v;
        try {
            v = this.execFunc.call(module, model);
        }
        catch (e) {
            if (Nodom.isDebug) {
                console.error(new NError("wrongExpression", this.exprStr).message);
                console.error(e);
            }
        }
        return v;
    }
}

/**
 * css 管理器
 * @privateRemarks
 * 针对不同的rule，处理方式不同
 *
 * CssStyleRule 进行保存和替换，同时模块作用域scope有效
 *
 * CssImportRule 路径不重复添加，因为必须加在stylerule前面，所以需要记录最后的import索引号
 */
class CssManager {
    /**
     * 处理style 元素
     * @param module -  模块
     * @param dom -     虚拟dom
     * @param root -    模块root dom
     * @param add -     是否添加根模块类名
     * @returns         如果是styledom，则返回true，否则返回false
     */
    static handleStyleDom(module, dom, root) {
        if (dom.props['scope'] === 'this') {
            const cls = this.cssPreName + module.id;
            if (root.props['class']) {
                root.props['class'] = dom.props['class'] + ' ' + cls;
            }
            else {
                root.props['class'] = cls;
            }
        }
    }
    /**
     * 处理 style 下的文本元素
     * @param module -  模块
     * @param dom -     style text element
     * @returns         如果是styleTextdom返回true，否则返回false
     */
    static handleStyleTextDom(module, dom) {
        if (!dom.parent || dom.parent.tagName !== 'style') {
            return false;
        }
        //scope=this，在模块根节点添加 限定 class
        CssManager.addRules(module, dom.textContent, dom.parent && dom.parent.props['scope'] === 'this' ? '.' + this.cssPreName + module.id : undefined);
        return true;
    }
    /**
     * 添加多个css rule
     * @param cssText -     rule集合
     * @param module -      模块
     * @param scopeName -   作用域名(前置选择器)
     */
    static addRules(module, cssText, scopeName) {
        //sheet 初始化
        if (!this.sheet) {
            //safari不支持 cssstylesheet constructor，用 style代替
            const sheet = document.createElement('style');
            document.head.appendChild(sheet);
            this.sheet = document.styleSheets[0];
        }
        //如果有作用域，则清除作用域下的rule
        if (scopeName) {
            this.clearModuleRules(module);
        }
        //是否限定在模块内
        //cssRule 获取正则式  @import
        const reg = /(@[a-zA-Z]+\s+url\(.+?\))|([.#@a-zA-Z]\S*(\s*\S*\s*?)?{)|\}/g;
        //import support url正则式
        const regImp = /@[a-zA-Z]+\s+url/;
        // keyframe font page support... 开始 位置
        let startIndex = -1;
        // { 个数，遇到 } -1 
        let beginNum = 0;
        let re;
        while ((re = reg.exec(cssText)) !== null) {
            if (regImp.test(re[0])) { //import namespace
                handleImport(re[0]);
            }
            else if (re[0] === '}') { //回收括号，单个样式结束判断
                if (startIndex >= 0 && --beginNum <= 0) { //style @ end
                    const txt = cssText.substring(startIndex, re.index + 1);
                    if (txt[0] === '@') { //@开头
                        this.sheet.insertRule(txt, CssManager.sheet.cssRules ? CssManager.sheet.cssRules.length : 0);
                    }
                    else { //style
                        handleStyle(module, txt, scopeName);
                    }
                    startIndex = -1;
                    beginNum = 0;
                }
            }
            else { //style 或 @内部
                if (startIndex === -1) {
                    startIndex = re.index;
                    beginNum++;
                }
                else {
                    beginNum++;
                }
            }
        }
        /**
         * 处理style rule
         * @param module -      模块
         * @param cssText -     css 文本
         * @param scopeName -   作用域名(前置选择器)
         */
        function handleStyle(module, cssText, scopeName) {
            const reg = /.+(?=\{)/; //匹配字符"{"前出现的所有字符
            const r = reg.exec(cssText);
            if (!r) {
                return;
            }
            // 保存样式名，在模块 object manager 中以数组存储
            if (scopeName) {
                let arr = module.objectManager.get('$cssRules');
                if (!arr) {
                    arr = [];
                    module.objectManager.set('$cssRules', arr);
                }
                arr.push((scopeName + ' ' + r[0]));
                //为样式添加 scope name
                cssText = scopeName + ' ' + cssText;
            }
            //加入到样式表
            CssManager.sheet.insertRule(cssText, CssManager.sheet.cssRules ? CssManager.sheet.cssRules.length : 0);
        }
        /**
         * 处理import rule
         * @param cssText - css文本
         * @returns         如果cssText中"()"内有字符串且importMap中存在键值为"()"内字符串的第一个字符，则返回void
         */
        function handleImport(cssText) {
            const ind = cssText.indexOf('(');
            const ind1 = cssText.lastIndexOf(')');
            if (ind === -1 || ind1 === -1 || ind >= ind1) {
                return;
            }
            const css = cssText.substring(ind, ind1);
            if (CssManager.importMap.has(css)) {
                return;
            }
            //插入import rule
            CssManager.sheet.insertRule(cssText, CssManager.importIndex++);
            CssManager.importMap.set(css, true);
        }
    }
    /**
     * 清除模块css rules
     * @param module -  模块
     */
    static clearModuleRules(module) {
        const rules = module.objectManager.get('$cssRules');
        if (!rules || rules.length === 0) {
            return;
        }
        //从sheet清除
        for (let i = 0; i < this.sheet.cssRules.length; i++) {
            const r = this.sheet.cssRules[i];
            if (r.selectorText && rules.indexOf(r.selectorText) !== -1) {
                this.sheet.deleteRule(i--);
            }
        }
        //置空cache
        module.objectManager.set('$cssRules', []);
    }
}
/**
 * import url map，用于存储import的url路径
 */
CssManager.importMap = new Map();
/**
 * importrule 位置
 */
CssManager.importIndex = 0;
/**
 * css class 前置名
 */
CssManager.cssPreName = '___nodommodule___';

/**
 * 模块状态类型
 */
var EModuleState;
(function (EModuleState) {
    /**
     * 已初始化
     */
    EModuleState[EModuleState["INIT"] = 1] = "INIT";
    /**
     * 未挂载到html dom
     */
    EModuleState[EModuleState["UNMOUNTED"] = 2] = "UNMOUNTED";
    /**
     * 已挂载到dom树
     */
    EModuleState[EModuleState["MOUNTED"] = 3] = "MOUNTED";
    /**
     * 准备渲染
     */
    EModuleState[EModuleState["READY"] = 4] = "READY";
})(EModuleState || (EModuleState = {}));

/**
 * 渲染器
 * @remarks
 * nodom渲染操作在渲染器中实现
 */
class Renderer {
    /**
     * 设置根容器
     * @param rootEl - 根html element
     */
    static setRootEl(rootEl) {
        this.rootEl = rootEl;
    }
    /**
     * 获取根容器
     * @returns 根 html element
     */
    static getRootEl() {
        return this.rootEl;
    }
    /**
     * 获取当前渲染模块
     * @returns     当前渲染模块
     */
    static getCurrentModule() {
        return this.currentModule;
    }
    /**
     * 添加到渲染列表
     * @param module - 模块
     */
    static add(module) {
        if (!module) {
            return;
        }
        //如果已经在列表中，不再添加
        if ((module.state === EModuleState.READY || module.state === EModuleState.MOUNTED) && !this.waitList.includes(module.id)) {
            //计算优先级
            this.waitList.push(module.id);
        }
    }
    /**
     * 从渲染队列移除
     * @param moduleId - 模块id
     */
    static remove(module) {
        let index;
        if ((index = this.waitList.indexOf(module.id)) !== -1) {
            //不能破坏watiList顺序，用null替换
            this.waitList.splice(index, 1, null);
        }
    }
    /**
     * 渲染
     * @remarks
     * 如果存在渲染队列，则从队列中取出并依次渲染
     */
    static render() {
        for (; this.waitList.length > 0;) {
            const id = this.waitList[0];
            if (id) { //存在id为null情况，remove方法造成
                const m = ModuleFactory.get(id);
                this.currentModule = m;
                m.render();
                this.currentModule = null;
            }
            //渲染后移除
            this.waitList.shift();
        }
    }
    /**
     * 渲染dom
     * @remarks
     * 此过程将VirtualDom转换为RenderedDom
     *
     * @param module -      模块
     * @param src -         源dom
     * @param model -       模型
     * @param parent -      父dom
     * @param key -         key 附加key，放在domkey的后面
     * @returns             渲染后节点
     */
    static renderDom(module, src, model, parent, key) {
        //初始化渲染节点
        const dst = {
            key: key ? src.key + '_' + key : src.key,
            model: model,
            vdom: src,
            staticNum: src.staticNum
        };
        // 从父继承附加key和rmid
        if (parent) {
            if (parent.rmid) {
                dst.rmid = parent.rmid;
                dst.key += '_' + dst.rmid + 's';
            }
        }
        //静态节点只渲染1次
        if (src.staticNum > 0) {
            src.staticNum--;
        }
        if (src.tagName) { //标签
            dst.tagName = src.tagName;
            //添加key属性
            dst.props = {};
            //设置svg标志
            if (src.isSvg) {
                dst.isSvg = src.isSvg;
            }
        }
        //设置当前根root
        if (!parent) {
            this.currentRootDom = dst;
        }
        else {
            // 设置父对象
            dst.parent = parent;
        }
        //处理model指令
        const mdlDir = src.getDirective('model');
        if (mdlDir) {
            mdlDir.exec(module, dst);
        }
        if (dst.tagName) { //标签节点
            this.handleProps(module, src, dst);
            //处理style标签，如果为style，则不处理assets
            if (src.tagName === 'style') {
                CssManager.handleStyleDom(module, dst, Renderer.currentRootDom);
            }
            else if (src.assets && src.assets.size > 0) {
                dst.assets || (dst.assets = {});
                for (const p of src.assets) {
                    dst.assets[p[0]] = p[1];
                }
            }
            //处理directive时，导致禁止后续渲染，则不再渲染，如show指令
            if (!this.handleDirectives(module, src, dst)) {
                return null;
            }
            //非module dom，添加dst事件到事件工厂
            if (src.events && !src.hasDirective('module')) {
                if (!dst.events) {
                    dst.events = [];
                }
                // 可能存在事件变化，需要先移除
                // TODO 全部移除性能较低，需优化
                module.eventFactory.removeAllEvents(dst);
                for (const ev of src.events) {
                    //当事件串为表达式时，需要处理
                    ev.handleExpr(module, model);
                    //如果不是根节点，设置事件module为渲染module
                    if (src.key !== 1) {
                        ev.module = module;
                    }
                    // 保存event以便比较
                    dst.events.push(ev);
                    //添加到当前模块eventfactory
                    this.currentModule.eventFactory.addEvent(dst, ev);
                }
            }
            //子节点渲染
            if (src.children && src.children.length > 0) {
                dst.children = [];
                for (const c of src.children) {
                    this.renderDom(module, c, dst.model, dst, key);
                }
            }
        }
        else { //文本节点
            if (src.expressions) { //文本节点
                let value = '';
                for (const expr of src.expressions) {
                    if (expr instanceof Expression) { //处理表达式
                        const v1 = expr.val(module, dst.model);
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
        //添加到dom tree，必须放在handleDirectives后，因为有可能directive执行后返回false
        if (parent) {
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(dst);
        }
        return dst;
    }
    /**
     * 处理指令
     * @param module -  模块
     * @param src -     编译节点
     * @param dst -     渲染节点
     * @returns         true继续执行，false不执行后续渲染代码，也不加入渲染树
    */
    static handleDirectives(module, src, dst) {
        if (!src.directives || src.directives.length === 0) {
            return true;
        }
        for (const d of src.directives) {
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
     * 处理属性
     * @param module -  模块
     * @param src -     编译节点
     * @param dst -     渲染节点
     */
    static handleProps(module, src, dst) {
        if (dst === this.currentRootDom) {
            module.handleRootProps(src, dst);
            return;
        }
        if (!src.props || src.props.size === 0) {
            return;
        }
        for (const k of src.props) {
            let v = k[1];
            if (v instanceof Expression) {
                src.staticNum = -1;
                v = v.val(module, dst.model);
                dst.staticNum = -1;
            }
            dst.props[k[0]] = v;
        }
    }
    /**
     * 更新到html树
     * @param module -  模块
     * @param src -     渲染节点
     * @returns         渲染后的节点
     */
    static updateToHtml(module, dom, pEl) {
        const el = module.getElement(dom.key);
        if (!el) {
            return this.renderToHtml(module, dom, pEl, true);
        }
        else if (dom.tagName) { //html dom节点已存在
            //设置element key属性
            el['key'] = dom.key;
            const attrs = el.attributes;
            const arr = [];
            if (attrs) {
                for (let i = 0; i < attrs.length; i++) {
                    arr.push(attrs[i].name);
                }
            }
            //设置属性
            for (const p of Object.keys(dom.props)) {
                el.setAttribute(p, dom.props[p] === undefined ? '' : dom.props[p]);
                let ind;
                if ((ind = arr.indexOf(p)) !== -1) {
                    arr.splice(ind, 1);
                }
            }
            //清理多余attribute
            if (arr.length > 0) {
                for (const a of arr) {
                    el.removeAttribute(a);
                }
            }
            //处理asset
            if (dom.assets) {
                for (const k of Object.keys(dom.assets)) {
                    el[k] = dom.assets[k];
                }
            }
            //解绑之前绑定事件
            module.eventFactory.unbindAll(dom.key);
            //绑定事件
            module.eventFactory.bind(dom.key);
        }
        else { //文本节点
            el['textContent'] = dom.textContent;
        }
        return el;
    }
    /**
     * 渲染到html树
     * @param module - 	        模块
     * @param src -             渲染节点
     * @param parentEl - 	    父html
     * @param isRenderChild -   是否渲染子节点
     * @returns                 渲染后的html节点
     */
    static renderToHtml(module, src, parentEl, isRenderChild) {
        let el;
        if (src.tagName) {
            el = newEl(src);
        }
        else {
            el = newText(src);
        }
        // element、渲染子节点且不为子模块，处理子节点
        if (el && src.tagName && isRenderChild && !src.moduleId) {
            genSub(el, src);
        }
        if (el && parentEl) {
            parentEl.appendChild(el);
        }
        return el;
        /**
         * 新建element节点
         * @param dom - 	虚拟dom
         * @returns 		新的html element
         */
        function newEl(dom) {
            let el;
            //rmid !== moduleid，则不渲染
            if (dom.rmid && dom.rmid !== module.id) {
                return;
            }
            // 子模块不渲染
            if (dom.moduleId) {
                const m = ModuleFactory.get(dom.moduleId);
                //创建替代节点
                if (m) {
                    el = document.createTextNode('');
                    m.srcDom = dom;
                    m.srcElement = el;
                    module.addChild(m);
                    module.saveElement(dom, el);
                    m.active();
                    return el;
                }
                return;
            }
            //style，只处理文本节点
            if (dom.tagName === 'style') {
                genSub(el, dom);
                return;
            }
            if (dom.isSvg) { //是svg节点
                el = document.createElementNS("http://www.w3.org/2000/svg", dom.tagName);
                if (dom.tagName === 'svg') {
                    el.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                }
            }
            else { //普通节点
                el = document.createElement(dom.tagName);
            }
            //把el引用与key关系存放到cache中
            module.saveElement(dom, el);
            //设置element key属性
            el['key'] = dom.key;
            // el.setAttribute('key',dom.key)
            //设置属性
            for (const p of Object.keys(dom.props)) {
                if (dom.props[p] !== undefined && dom.props[p] !== null && dom.props[p] !== '') {
                    el.setAttribute(p, dom.props[p]);
                }
            }
            //asset
            if (dom.assets) {
                for (const p of Object.keys(dom.assets)) {
                    el[p] = dom.assets[p];
                }
            }
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
            const node = document.createTextNode(dom.textContent || '');
            module.saveElement(dom, node);
            return node;
        }
        /**
         * 生成子节点
         * @param pEl -     父节点
         * @param dom -     dom节点
         */
        function genSub(pEl, dom) {
            if (dom.children && dom.children.length > 0) {
                dom.children.forEach(item => {
                    let el1;
                    if (item.tagName) {
                        el1 = newEl(item);
                        //element节点，产生子节点
                        if (el1 instanceof Element) {
                            genSub(el1, item);
                        }
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
     * @param module -        待处理模块
     * @param changeDoms -    修改后的dom节点数组
     */
    static handleChangedDoms(module, changeDoms) {
        let slotDoms = {};
        //替换数组
        const repArr = [];
        //添加数组
        const addArr = [];
        //移动数组
        const moveArr = [];
        //保留原有html节点
        for (const item of changeDoms) {
            //如果为slot节点，则记录，单独处理
            if (item[1].rmid && item[1].rmid !== module.id) {
                if (slotDoms[item[1].rmid]) {
                    slotDoms[item[1].rmid].push(item);
                }
                else {
                    slotDoms[item[1].rmid] = [item];
                }
                continue;
            }
            let pEl;
            switch (item[0]) {
                case 1: //添加
                    addArr.push(item);
                    break;
                case 2: //修改
                    //子模块不处理，由setProps处理
                    if (item[1].moduleId) {
                        Renderer.add(ModuleFactory.get(item[1].moduleId));
                        continue;
                    }
                    if (item[1].parent) {
                        pEl = module.getElement(item[1].parent.key);
                    }
                    Renderer.updateToHtml(module, item[1], pEl);
                    break;
                case 3: //删除
                    module.domManager.freeNode(item[1]);
                    // const n1 = module.getElement(item[1].key);
                    // pEl = module.getElement(item[3].key);
                    // if (pEl && n1 && n1.parentElement === pEl) {
                    //     pEl.removeChild(n1);
                    // }
                    break;
                case 4: //移动
                    moveArr.push(item);
                    break;
                default: //替换
                    repArr.push(item);
            }
        }
        //替换
        if (repArr.length > 0) {
            for (const item of repArr) {
                this.replace(module, item[1], item[2]);
            }
        }
        //addArr 按index排序
        if (addArr.length > 1) {
            addArr.sort((a, b) => a[4] > b[4] ? 1 : -1);
        }
        //操作map，用于存放添加或移动过的位置
        const opMap = moveArr.length > 0 ? {} : undefined;
        //处理添加元素
        for (const item of addArr) {
            const pEl = module.getElement(item[3].key);
            if (!pEl) {
                continue;
            }
            const n1 = Renderer.renderToHtml(module, item[1], null, true);
            if (n1) {
                if (pEl.childNodes && pEl.childNodes.length > item[4]) {
                    pEl.insertBefore(n1, pEl.childNodes[item[4]]);
                }
                else {
                    pEl.appendChild(n1);
                }
                //记录操作位置
                if (opMap) {
                    opMap[item[3].key + '_' + item[4]] = true;
                }
            }
        }
        //处理move元素
        for (const item of moveArr) {
            const pEl = module.getElement(item[3].key);
            if (!pEl) {
                continue;
            }
            const n1 = module.getElement(item[1].key);
            if (!n1 || n1 === pEl.childNodes[item[4]]) {
                continue;
            }
            //判断是否需要用空节点填充移走后的位置
            if (!opMap[item[3].key + '_' + item[5]]) {
                const emptyDom = document.createTextNode('');
                //新放到指定位置
                if (pEl.childNodes.length > item[5]) {
                    pEl.insertBefore(emptyDom, pEl.childNodes[item[5]]);
                }
                else { //最后一个与当前节点不相同，则放在最后
                    pEl.appendChild(emptyDom);
                }
            }
            //替换到指定位置
            pEl.replaceChild(n1, pEl.childNodes[item[4]]);
            //记录操作的位置
            opMap[item[3].key + '_' + item[4]] = true;
        }
        //处理改变的子模块
        const keys = Object.keys(slotDoms);
        if (keys && keys.length > 0) {
            for (let k of keys) {
                const m = ModuleFactory.get(parseInt(k));
                if (m) {
                    Renderer.add(m);
                }
            }
        }
    }
    /**
     * 替换解ID那
     * @param module -  模块
     * @param src -     待替换节点
     * @param dst -     被替换节点
     */
    static replace(module, src, dst) {
        if (!dst.parent) {
            return;
        }
        const pEl = module.getElement(dst.parent.key);
        if (!pEl) {
            return;
        }
        const el = Renderer.renderToHtml(module, src, null);
        let oldEl;
        if (dst.moduleId) {
            const m1 = ModuleFactory.get(dst.moduleId);
            oldEl = m1.getElement(1);
        }
        else {
            oldEl = module.getElement(dst.key);
        }
        if (pEl && oldEl && oldEl.parentElement === pEl) {
            pEl.replaceChild(el, oldEl);
        }
        module.domManager.freeNode(dst);
    }
}
/**
 * 等待渲染列表
 */
Renderer.waitList = [];

class RequestManager {
    /**
     * 设置相同请求拒绝时间间隔
     * @param time -  时间间隔（ms）
     */
    static setRejectTime(time) {
        this.rejectReqTick = time;
    }
    /**
     * ajax 请求
     *
     * @param config -  object 或 string，如果为string，则表示url，直接以get方式获取资源，如果为 object，配置项如下:
     * ```
     *  参数名|类型|默认值|必填|可选值|描述
     *  -|-|-|-|-|-
     *  url|string|无|是|无|请求url
     *	method|string|GET|否|GET,POST,HEAD|请求类型
     *	params|object/FormData|空object|否|无|参数，json格式
     *	async|bool|true|否|true,false|是否异步
     *  timeout|number|0|否|无|请求超时时间
     *  type|string|text|否|json,text|
     *	withCredentials|bool|false|否|true,false|同源策略，跨域时cookie保存
     *  header|Object|无|否|无|request header 对象
     *  user|string|无|否|无|需要认证的请求对应的用户名
     *  pwd|string|无|否|无|需要认证的请求对应的密码
     *  rand|bool|无|否|无|请求随机数，设置则浏览器缓存失效
     * ```
     */
    static request(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = Date.now();
            //如果设置了rejectReqTick，则需要进行判断
            if (this.rejectReqTick > 0) {
                if (this.requestMap.has(config.url)) {
                    const obj = this.requestMap.get(config.url);
                    if (time - obj['time'] < this.rejectReqTick && Util.compare(obj['params'], config.params)) {
                        return new Promise((resolve) => {
                            resolve(null);
                        });
                    }
                }
                //加入请求集合
                this.requestMap.set(config.url, {
                    time: time,
                    params: config.params
                });
            }
            return new Promise((resolve, reject) => {
                if (typeof config === 'string') {
                    config = {
                        url: config
                    };
                }
                config.params = config.params || {};
                //随机数
                if (config.rand) { //针对数据部分，仅在app中使用
                    config.params.$rand = Math.random();
                }
                let url = config.url;
                const async = config.async === false ? false : true;
                const req = new XMLHttpRequest();
                //设置同源策略
                req.withCredentials = config.withCredentials;
                //类型默认为get
                const method = (config.method || 'GET').toUpperCase();
                //超时，同步时不能设置
                req.timeout = async ? config.timeout : 0;
                req.onload = () => {
                    //正常返回处理
                    if (req.status === 200) {
                        let r = req.responseText;
                        if (config.type === 'json') {
                            try {
                                r = JSON.parse(r);
                            }
                            catch (e) {
                                reject({ type: "jsonparse" });
                            }
                        }
                        resolve(r);
                    }
                    else { //异常返回处理
                        reject({ type: 'error', url: url });
                    }
                };
                //设置timeout和error
                req.ontimeout = () => reject({ type: 'timeout' });
                req.onerror = () => reject({ type: 'error', url: url });
                //上传数据
                let data = null;
                switch (method) {
                    case 'GET':
                        //参数
                        let pa;
                        if (Util.isObject(config.params)) {
                            const ar = [];
                            for (const k of Object.keys(config.params)) {
                                const v = config.params[k];
                                if (v === undefined || v === null) {
                                    continue;
                                }
                                ar.push(k + '=' + v);
                            }
                            pa = ar.join('&');
                        }
                        if (pa !== undefined) {
                            if (url.indexOf('?') !== -1) {
                                url += '&' + pa;
                            }
                            else {
                                url += '?' + pa;
                            }
                        }
                        break;
                    case 'POST':
                        if (config.params instanceof FormData) {
                            data = config.params;
                        }
                        else {
                            const fd = new FormData();
                            for (const k of Object.keys(config.params)) {
                                const v = config.params[k];
                                if (v === undefined || v === null) {
                                    continue;
                                }
                                fd.append(k, v);
                            }
                            data = fd;
                        }
                        break;
                }
                //打开请求
                req.open(method, url, async, config.user, config.pwd);
                //设置request header
                if (config.header) {
                    Util.getOwnProps(config.header).forEach((item) => {
                        req.setRequestHeader(item, config.header[item]);
                    });
                }
                //发送请求
                req.send(data);
            }).catch((re) => {
                switch (re.type) {
                    case "error":
                        throw new NError("notexist1", NodomMessage.TipWords['resource'], re.url);
                    case "timeout":
                        throw new NError("timeout");
                    case "jsonparse":
                        throw new NError("jsonparse");
                }
            });
        });
    }
    /**
     * 清除超时的缓存请求
     */
    static clearCache() {
        const time = Date.now();
        if (this.rejectReqTick > 0) {
            if (this.requestMap) {
                for (const kv of this.requestMap) {
                    if (time - kv[1]['time'] > this.rejectReqTick) {
                        this.requestMap.delete(kv[0]);
                    }
                }
            }
        }
    }
}
/**
 * 拒绝相同请求（url，参数）时间间隔
 */
RequestManager.rejectReqTick = 0;
/**
 * 请求map，用于缓存之前的请求url和参数
 * key:     url
 * value:   请求参数
 */
RequestManager.requestMap = new Map();

/**
 * 路由类
 */
class Route {
    /**
     * 构造器
     * @param config - 路由配置项
     */
    constructor(config, parent) {
        /**
         * 路由参数名数组
         */
        this.params = [];
        /**
         * 路由参数数据
         */
        this.data = {};
        /**
         * 子路由
         */
        this.children = [];
        if (!config || Util.isEmpty(config.path)) {
            return;
        }
        this.id = Util.genId();
        //参数赋值
        for (const o of Object.keys(config)) {
            this[o] = config[o];
        }
        this.parent = parent;
        //解析路径
        if (this.path) {
            this.parse();
        }
        if (parent) {
            parent.addChild(this);
        }
        //子路由
        if (config.routes && Array.isArray(config.routes)) {
            config.routes.forEach((item) => {
                new Route(item, this);
            });
        }
    }
    /**
     * 添加子路由
     * @param child - 字路由
     */
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    /**
     * 通过路径解析路由对象
     */
    parse() {
        const pathArr = this.path.split('/');
        let node = this.parent;
        let param = [];
        let paramIndex = -1; //最后一个参数开始
        let prePath = ''; //前置路径
        for (let i = 0; i < pathArr.length; i++) {
            const v = pathArr[i].trim();
            if (v === '') {
                pathArr.splice(i--, 1);
                continue;
            }
            if (v.startsWith(':')) { //参数
                if (param.length === 0) {
                    paramIndex = i;
                }
                param.push(v.substring(1));
            }
            else {
                paramIndex = -1;
                param = []; //上级路由的参数清空
                this.path = v; //暂存path
                let j = 0;
                for (; j < node.children.length; j++) {
                    const r = node.children[j];
                    if (r.path === v) {
                        node = r;
                        break;
                    }
                }
                //没找到，创建新节点
                if (j === node.children.length) {
                    if (prePath !== '') {
                        new Route({ path: prePath }, node);
                        node = node.children[node.children.length - 1];
                    }
                    prePath = v;
                }
            }
            //不存在参数
            this.params = paramIndex === -1 ? [] : param;
        }
    }
    /**
     * 克隆
     * @returns 克隆对象
     */
    clone() {
        const r = new Route();
        Object.getOwnPropertyNames(this).forEach(item => {
            if (item === 'data') {
                return;
            }
            r[item] = this[item];
        });
        if (this.data) {
            r.data = Util.clone(this.data);
        }
        return r;
    }
}

/**
 * 调度器
 * @remarks
 * 管理所有需调度的任务并进行循环调度，默认采用requestAnimationFrame方式进行循环
 */
class Scheduler {
    /**
     * 执行任务
     */
    static dispatch() {
        Scheduler.tasks.forEach((item) => {
            if (Util.isFunction(item['func'])) {
                if (item['thiser']) {
                    item['func'].call(item['thiser']);
                }
                else {
                    item['func']();
                }
            }
        });
    }
    /**
     * 启动调度器
     * @param scheduleTick - 	渲染间隔（ms），默认50ms
     */
    static start(scheduleTick) {
        Scheduler.dispatch();
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(Scheduler.start);
        }
        else {
            window.setTimeout(Scheduler.start, scheduleTick || 50);
        }
    }
    /**
     * 添加任务
     * @param foo - 	待执行任务函数
     * @param thiser - 	this指向
     */
    static addTask(foo, thiser) {
        if (!Util.isFunction(foo)) {
            throw new NError("invoke", "Scheduler.addTask", "0", "function");
        }
        Scheduler.tasks.push({ func: foo, thiser: thiser });
    }
    /**
     * 移除任务
     * @param foo - 	任务函数
     */
    static removeTask(foo) {
        if (!Util.isFunction(foo)) {
            throw new NError("invoke", "Scheduler.removeTask", "0", "function");
        }
        let ind = -1;
        if ((ind = Scheduler.tasks.indexOf(foo)) !== -1) {
            Scheduler.tasks.splice(ind, 1);
        }
    }
}
/**
 * 待执行任务列表
 */
Scheduler.tasks = [];

/**
 * nodom提示消息
 */
let NodomMessage = NodomMessage_zh;
/**
 * Nodom接口暴露类
 */
class Nodom {
    /**
     * 应用初始化
     * @param clazz -     模块类
     * @param selector -  根模块容器选择器，默认使用document.body
     */
    static app(clazz, selector) {
        //设置渲染器的根 element
        Renderer.setRootEl(document.querySelector(selector) || document.body);
        //渲染器启动渲染任务
        Scheduler.addTask(Renderer.render, Renderer);
        //添加请求清理任务
        Scheduler.addTask(RequestManager.clearCache);
        //启动调度器
        Scheduler.start();
        ModuleFactory.get(clazz).active();
    }
    /**
     * 启用debug模式
     */
    static debug() {
        this.isDebug = true;
    }
    /**
     * 设置语言
     * @param lang -  语言（zh,en），默认zh
     */
    static setLang(lang) {
        //设置nodom语言
        switch (lang || 'zh') {
            case 'zh':
                NodomMessage = NodomMessage_zh;
                break;
            case 'en':
                NodomMessage = NodomMessage_en;
        }
    }
    /**
     * use插件（实例化）
     * @remarks
     * 插件实例化后以单例方式存在，第二次use同一个插件，将不进行任何操作，实例化后可通过Nodom['$类名']方式获取
     * @param clazz -   插件类
     * @param params -  参数
     * @returns         实例化后的插件对象
     */
    static use(clazz, params) {
        if (!clazz['name']) {
            new NError('notexist', NodomMessage.TipWords.plugin);
        }
        if (!this['$' + clazz['name']]) {
            this['$' + clazz['name']] = Reflect.construct(clazz, params || []);
        }
        return this['$' + clazz['name']];
    }
    /**
     * 创建路由
     * @remarks
     * 配置项可以用嵌套方式
     * @example
     * ```js
     * Nodom.createRoute([{
     *   path: '/router',
     *   //直接用模块类，需import
     *   module: MdlRouteDir,
     *   routes: [
     *       {
     *           path: '/route1',
     *           module: MdlPMod1,
     *           routes: [{
     *               path: '/home',
     *               //直接用路径，实现懒加载
     *               module:'/examples/modules/route/mdlmod1.js'
     *           }, ...]
     *       }, {
     *           path: '/route2',
     *           module: MdlPMod2,
     *           //设置进入事件
     *           onEnter: function (module,path) {},
     *           //设置离开事件
     *           onLeave: function (module,path) {},
     *           ...
     *       }
     *   ]
     * }])
     * ```
     * @param config -  路由配置
     * @param parent -  父路由
     */
    static createRoute(config, parent) {
        if (!Nodom['$Router']) {
            throw new NError('uninit', NodomMessage.TipWords.route);
        }
        let route;
        parent = parent || Nodom['$Router'].getRoot();
        if (Util.isArray(config)) {
            for (const item of config) {
                route = new Route(item, parent);
            }
        }
        else {
            route = new Route(config, parent);
        }
        return route;
    }
    /**
     * 创建指令
     * @param name -      指令名
     * @param priority -  优先级（1最小，1-10为框架保留优先级）
     * @param handler -   渲染时方法
     */
    static createDirective(name, handler, priority) {
        return DirectiveManager.addType(name, handler, priority);
    }
    /**
     * 注册模块
     * @param clazz -   模块类
     * @param name -    注册名，如果没有，则为类名
     */
    static registModule(clazz, name) {
        ModuleFactory.addClass(clazz, name);
    }
    /**
     * ajax 请求，如果需要用第三方ajax插件替代，重载该方法
     * @param config -  object 或 string，如果为string，则表示url，直接以get方式获取资源，如果为 object，配置项如下:
     * ```
     *  参数名|类型|默认值|必填|可选值|描述
     *  -|-|-|-|-|-
     *  url|string|无|是|无|请求url
     *	method|string|GET|否|GET,POST,HEAD|请求类型
     *	params|object/FormData|空object|否|无|参数，json格式
     *	async|bool|true|否|true,false|是否异步
     *  timeout|number|0|否|无|请求超时时间
     *  type|string|text|否|json,text|
     *	withCredentials|bool|false|否|true,false|同源策略，跨域时cookie保存
     *  header|Object|无|否|无|request header 对象
     *  user|string|无|否|无|需要认证的请求对应的用户名
     *  pwd|string|无|否|无|需要认证的请求对应的密码
     *  rand|bool|无|否|无|请求随机数，设置则浏览器缓存失效
     * ```
     */
    static request(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RequestManager.request(config);
        });
    }
    /**
     * 重复请求拒绝时间间隔
     * @remarks
     * 如果设置此项，当url一致时且间隔时间小于time，则拒绝请求
     * @param time -  时间间隔（ms）
     */
    static setRejectTime(time) {
        RequestManager.setRejectTime(time);
    }
}

/**
 * 异常处理类
 */
class NError extends Error {
    constructor(errorName, ...params) {
        super(errorName);
        const msg = NodomMessage.ErrorMsgs[errorName];
        if (msg === undefined) {
            this.message = "未知错误";
            return;
        }
        //编译提示信息
        this.message = Util.compileStr(msg, params);
    }
}

/**
 * 基础服务库
 */
class Util {
    /**
     * 唯一主键
     */
    static genId() {
        return this.generatedId++;
    }
    /**
     * 初始化保留字map
     */
    static initKeyMap() {
        [
            'arguments', 'boolean', 'break', 'byte', 'catch',
            'char', 'const', 'default', 'delete', 'do',
            'double', 'else', 'enum', 'eval', 'false',
            'float', 'for', 'function', 'goto', 'if',
            'in', 'instanceof', 'int', 'let', 'long',
            'null', 'return', 'short', 'switch', 'this',
            'throw', 'true', 'try', 'this', 'throw',
            'typeof', 'var', 'while', 'with', 'Array',
            'Date', 'JSON', 'Set', 'Map', 'eval',
            'Infinity', 'isFinite', 'isNaN', 'isPrototypeOf', 'Math',
            'new', 'NaN', 'Number', 'Object', 'prototype', 'String',
            'isPrototypeOf', 'undefined', 'valueOf'
        ].forEach(item => {
            this.keyWordMap.set(item, true);
        });
    }
    /**
     * 是否为 js 保留关键字
     * @param name -    名字
     * @returns         如果为保留字，则返回true，否则返回false
     */
    static isKeyWord(name) {
        return this.keyWordMap.has(name);
    }
    /******对象相关******/
    /**
     * 对象复制
     * @param srcObj -  源对象
     * @param expKey -  不复制的键正则表达式或属性名
     * @param extra -   附加参数
     * @returns         复制的对象
     */
    static clone(srcObj, expKey, extra) {
        const map = new WeakMap();
        return clone(srcObj, expKey, extra);
        /**
         * clone对象
         * @param src -      待clone对象
         * @param expKey -   不克隆的键
         * @param extra -    clone附加参数
         * @returns        克隆后的对象
         */
        function clone(src, expKey, extra) {
            //非对象或函数，直接返回            
            if (!src || typeof src !== 'object' || Util.isFunction(src)) {
                return src;
            }
            let dst;
            //带有clone方法，则直接返回clone值
            if (src.clone && Util.isFunction(src.clone)) {
                return src.clone(extra);
            }
            else if (Util.isObject(src)) {
                dst = new Object();
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                map.set(src, dst);
                Object.getOwnPropertyNames(src).forEach((prop) => {
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
            else if (Util.isMap(src)) {
                dst = new Map();
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                src.forEach((value, key) => {
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
            else if (Util.isArray(src)) {
                dst = [];
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                src.forEach(function (item, i) {
                    dst[i] = getCloneObj(item, expKey, extra);
                });
            }
            return dst;
        }
        /**
         * 获取clone对象
         * @param value -     待clone值
         * @param expKey -    排除键
         * @param extra -     附加参数
         */
        function getCloneObj(value, expKey, extra) {
            if (typeof value === 'object' && !Util.isFunction(value)) {
                let co = null;
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
    }
    /**
     * 比较两个对象值是否相同(只比较object和array)
     * @param src - 源对象
     * @param dst - 目标对象
     * @returns     值相同则返回true，否则返回false
     */
    static compare(src, dst) {
        return cmp(src, dst);
        function cmp(o1, o2) {
            if (o1 === o2) {
                return true;
            }
            const keys1 = Object.keys(o1);
            const keys2 = Object.keys(o2);
            if (keys1.length !== keys2.length) {
                return false;
            }
            for (const k of keys1) {
                if (typeof o1[k] === 'object' && typeof o2[k] === 'object') {
                    if (!cmp(o1[k], o2[k])) {
                        return false;
                    }
                }
                else if (o1[k] !== o2[k]) {
                    return false;
                }
            }
            return true;
        }
    }
    /**
     * 获取对象自有属性
     * @param obj - 需要获取属性的对象
     * @returns     返回属性数组
     */
    static getOwnProps(obj) {
        if (!obj) {
            return [];
        }
        return Object.getOwnPropertyNames(obj);
    }
    /**************对象判断相关************/
    /**
     * 判断是否为函数
     * @param foo - 检查的对象
     * @returns     true/false
     */
    static isFunction(foo) {
        return foo !== undefined && foo !== null && foo.constructor === Function;
    }
    /**
     * 判断是否为数组
     * @param obj -   检查的对象
     * @returns     true/false
     */
    static isArray(obj) {
        return Array.isArray(obj);
    }
    /**
     * 判断是否为map
     * @param obj -   检查的对象
     */
    static isMap(obj) {
        return obj !== null && obj !== undefined && obj.constructor === Map;
    }
    /**
     * 判断是否为对象
     * @param obj -   检查的对象
     * @returns     true/false
     */
    static isObject(obj) {
        return obj !== null && obj !== undefined && obj.constructor === Object;
    }
    /**
     * 判断对象/字符串是否为空
     * @param obj - 检查的对象
     * @returns     true/false
     */
    static isEmpty(obj) {
        if (obj === null || obj === undefined)
            return true;
        if (this.isObject(obj)) {
            const keys = Object.keys(obj);
            return keys.length === 0;
        }
        else if (typeof obj === 'string') {
            return obj === '';
        }
        return false;
    }
    /******日期相关******/
    /**
     * 日期格式化
     * @param timestamp -   时间戳
     * @param format -      日期格式
     * @returns             日期串
     */
    static formatDate(timeStamp, format) {
        if (typeof timeStamp === 'string') {
            //排除日期格式串,只处理时间戳
            if (/^\d+$/.test(timeStamp)) {
                timeStamp = Number(timeStamp);
            }
            else {
                throw new NError('invoke', 'Util.formatDate', '0', 'date string', 'date');
            }
        }
        //得到日期
        const date = new Date(timeStamp);
        // invalid date
        if (isNaN(date.getDay())) {
            throw new NError('invoke', 'Util.formatDate', '0', 'date string', 'date');
        }
        const o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "H+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "S": date.getMilliseconds() //毫秒
        };
        let re;
        //年
        if (re = /(y+)/.exec(format)) {
            format = format.replace(re[0], (date.getFullYear() + "").substring(4 - re[0].length));
        }
        //月日
        this.getOwnProps(o).forEach(function (k) {
            if (re = new RegExp("(" + k + ")").exec(format)) {
                format = format.replace(re[0], re[0].length === 1 ? o[k] : ("00" + o[k]).substring((o[k] + '').length));
            }
        });
        //星期
        format = format.replace(/(E+)/, NodomMessage.WeekDays[date.getDay() + ""]);
        return format;
    }
    /******字符串相关*****/
    /**
     * 编译字符串，把 \{n\}替换成带入值
     * @param src -     待编译的字符串
     * @param params -  参数数组
     * @returns     转换后的消息
     */
    static compileStr(src, ...params) {
        if (!params || params.length === 0) {
            return src;
        }
        let reg;
        for (let i = 0; i < params.length; i++) {
            if (src.indexOf('\{' + i + '\}') !== -1) {
                reg = new RegExp('\\{' + i + '\\}', 'g');
                src = src.replace(reg, params[i]);
            }
            else {
                break;
            }
        }
        return src;
    }
}
/**
 * 全局id
 */
Util.generatedId = 1;
/**
 * js 保留字 map
 */
Util.keyWordMap = new Map();
//初始化keymap
Util.initKeyMap();

/**
 * 指令类
 */
class Directive {
    /**
     * 构造方法
     * @param type -  	    类型名
     * @param value - 	    指令值
     * @param templateMid - 模板所属的module id
     */
    constructor(type, value, templateMid) {
        this.id = Util.genId();
        if (type) {
            this.type = DirectiveManager.getType(type);
            if (!this.type) {
                throw new NError('notexist1', NodomMessage.TipWords['directive'], type);
            }
        }
        if (typeof value === 'string') {
            this.value = value.trim();
        }
        else if (value instanceof Expression) {
            this.expression = value;
        }
        else {
            this.value = value;
        }
        this.templateModuleId = templateMid;
    }
    /**
     * 执行指令
     * @param module -  模块
     * @param dom -     渲染目标节点对象
     * @returns         是否继续渲染
     */
    exec(module, dom) {
        //禁用，不执行
        if (this.disabled) {
            return true;
        }
        if (this.expression) {
            this.value = this.expression.val(module, dom.model);
        }
        return this.type.handler.apply(this, [module, dom]);
    }
    /**
     * 克隆
     * @returns     新克隆的指令
     */
    clone() {
        const d = new Directive();
        d.type = this.type;
        d.expression = this.expression;
        d.value = this.value;
        d.templateModuleId = this.templateModuleId;
        return d;
    }
}

/**
 * 事件类
 * @remarks
 * 事件分为自有事件和代理事件，事件默认传递参数为：
 *
 * 0: model(事件对应数据模型)
 *
 * 1: dom(事件target对应的虚拟dom节点)
 *
 * 2: evObj(Nodom Event对象)
 *
 * 3: e(Html Event对象)
 */
class NEvent {
    /**
     * @param eventName -   事件名
     * @param eventStr -    事件串或事件处理函数,以“:”分割,中间不能有空格,结构为: `方法名:delg:nopopo:once:capture`，`":"`后面的内容选择使用，如果eventStr为函数，则替代第三个参数
     * @param handler -     事件执行函数，如果方法不在module methods中定义，则通过此参数设置事件钩子，此时，eventStr第一个参数失效，即eventStr可以是":delg:nopopo"
     */
    constructor(module, eventName, eventStr, handler) {
        this.id = Util.genId();
        this.module = module;
        this.name = eventName;
        this.init(eventStr, handler);
    }
    /**
     * 事件串初始化
     * @param eventStr -  事件串
     * @param handler -   事件钩子函数
     */
    init(eventStr, handler) {
        //如果事件串不为空，则不需要处理
        if (eventStr) {
            const tp = typeof eventStr;
            if (tp === 'string') {
                this.parseEvent(eventStr.trim());
            }
            else if (tp === 'function') {
                this.handler = eventStr;
            }
            else if (eventStr instanceof Expression) {
                this.expr = eventStr;
            }
        }
        //新增事件方法（不在methods中定义）
        if (handler) {
            this.handler = handler;
        }
        this.touchOrNot();
    }
    /**
     * 表达式处理
     * @remarks
     * 用于动态事件名传递，当handler为expression时有效
     * @param module -    模块
     * @param model -     对应model
     */
    handleExpr(module, model) {
        if (this.expr) {
            const evtStr = this.expr.val(module, model);
            this.init(evtStr);
        }
        return this;
    }
    /**
     * 解析事件字符串
     * @param eventStr -  待解析的字符串
     */
    parseEvent(eventStr) {
        eventStr.split(':').forEach((item, i) => {
            item = item.trim();
            if (i === 0) { //事件方法
                this.handler = item;
            }
            else { //事件附加参数
                switch (item) {
                    case 'delg':
                        this.delg = true;
                        break;
                    case 'nopopo':
                        this.nopopo = true;
                        break;
                    case 'once':
                        this.once = true;
                        break;
                    case 'capture':
                        this.capture = true;
                        break;
                }
            }
        });
    }
    /**
     * 触屏转换
     */
    touchOrNot() {
        if (document.ontouchend) { //触屏设备
            switch (this.name) {
                case 'click':
                    this.name = 'tap';
                    break;
                case 'mousedown':
                    this.name = 'touchstart';
                    break;
                case 'mouseup':
                    this.name = 'touchend';
                    break;
                case 'mousemove':
                    this.name = 'touchmove';
                    break;
            }
        }
        else { //转非触屏
            switch (this.name) {
                case 'tap':
                    this.name = 'click';
                    break;
                case 'touchstart':
                    this.name = 'mousedown';
                    break;
                case 'touchend':
                    this.name = 'mouseup';
                    break;
                case 'touchmove':
                    this.name = 'mousemove';
                    break;
            }
        }
    }
    /**
     * 设置附加参数值
     * @param module -    模块
     * @param dom -       虚拟dom
     * @param name -      参数名
     * @param value -     参数值
     */
    setParam(dom, name, value) {
        this.module.objectManager.setEventParam(this.id, dom.key, name, value);
    }
    /**
     * 获取附加参数值
     * @param dom -       虚拟dom
     * @param name -      参数名
     * @returns         附加参数值
     */
    getParam(dom, name) {
        return this.module.objectManager.getEventParam(this.id, dom.key, name);
    }
    /**
     * 移除参数
     * @param dom -       虚拟dom
     * @param name -      参数名
     */
    removeParam(dom, name) {
        return this.module.objectManager.removeEventParam(this.id, dom.key, name);
    }
    /**
     * 清参数cache
     * @param dom -       虚拟dom
     */
    clearParam(dom) {
        this.module.objectManager.clearEventParams(this.id, dom.key);
    }
}

/**
 * 虚拟dom
 * @remarks
 * 编译后的dom节点，与渲染后的dom节点(RenderedDom)不同
 */
class VirtualDom {
    /**
     * @param tag -     标签名
     * @param key -     key
     * @param module - 	模块
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
     * @param directives - 	待删除的指令类型数组或指令类型
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
     * @param directive - 	待删除的指令类型名
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
     * @param directive -     指令对象
     * @param sort -          是否排序
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
     * @param typeName - 	    指令类型名
     * @returns             如果指令集不为空，且含有传入的指令类型名则返回true，否则返回false
     */
    hasDirective(typeName) {
        return this.directives && this.directives.find(item => item.type.name === typeName) !== undefined;
    }
    /**
     * 获取某个类型的指令
     * @param module -            模块
     * @param directiveType - 	指令类型名
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
     * @param dom -       子节点
     * @param index -     指定位置，如果不传此参数，则添加到最后
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
     * @param dom -   子节点
     */
    remove(dom) {
        const index = this.children.indexOf(dom);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }
    /**
     * 是否拥有属性
     * @param propName -  属性名
     * @param isExpr -    是否只检查表达式属性
     * @returns         如果属性集含有传入的属性名返回true，否则返回false
     */
    hasProp(propName) {
        if (this.props) {
            return this.props.has(propName);
        }
    }
    /**
     * 获取属性值
     * @param propName -  属性名
     * @returns         传入属性名的value
     */
    getProp(propName) {
        if (this.props) {
            return this.props.get(propName);
        }
    }
    /**
     * 设置属性值
     * @param propName -  属性名
     * @param v -         属性值
     */
    setProp(propName, v) {
        if (!this.props) {
            this.props = new Map();
        }
        this.props.set(propName, v);
    }
    /**
     * 删除属性
     * @param props -     属性名或属性名数组
     * @returns         如果虚拟dom上的属性集为空，则返回void
     */
    delProp(props) {
        if (!this.props) {
            return;
        }
        this.props.delete(props);
    }
    /**
     * 设置asset
     * @param assetName -     asset name
     * @param value -         asset value
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
     * @param assetName -     asset name
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
     * @param module -    模块
     * @param name -      参数名
     * @param value -     参数值
     */
    setParam(module, name, value) {
        module.objectManager.setDomParam(this.key, name, value);
    }
    /**
     * 获取参数值
     * @param module -    模块
     * @param name -      参数名
     * @returns         参数值
     */
    getParam(module, name) {
        return module.objectManager.getDomParam(this.key, name);
    }
    /**
     * 移除参数
     * @param module -    模块
     * @param name -      参数名
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
        const dst = new VirtualDom(this.tagName, this.key);
        if (this.tagName) {
            //属性
            if (this.props && this.props.size > 0) {
                for (const p of this.props) {
                    dst.setProp(p[0], p[1]);
                }
            }
            if (this.assets && this.assets.size > 0) {
                for (const p of this.assets) {
                    dst.setAsset(p[0], p[1]);
                }
            }
            if (this.directives && this.directives.length > 0) {
                dst.directives = [];
                for (const d of this.directives) {
                    dst.directives.push(d.clone());
                }
            }
            //复制事件
            dst.events = this.events;
            //子节点clone
            if (this.children) {
                for (const c of this.children) {
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
     * @param event -     事件对象
     * @param index - 	位置
     */
    addEvent(event, index) {
        if (!this.events) {
            this.events = [event];
        }
        else if (!this.events.includes(event)) {
            if (index >= 0) {
                this.events.splice(index, 0, event);
            }
            else {
                this.events.push(event);
            }
        }
    }
}

const voidTagMap = new Set('area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'.split(','));
/**
 * 编译器
 *
 * @remarks
 * 用于编译模板串为虚拟dom(VirtualDom)节点，存放于模块的 domManager.vdomTree
 */
class Compiler {
    /**
     * 构造器
     * @param module - 模块
     */
    constructor(module) {
        /**
         * 虚拟dom数组
         */
        this.domArr = [];
        /**
         * 文本节点
         */
        this.textArr = [];
        /**
         * 是否是表达式文本节点
         */
        this.isExprText = false;
        /**
         * 当前编译的模板，用于报错的时候定位
         */
        this.template = '';
        this.module = module;
    }
    /**
     * 编译
     * @param elementStr - 	待编译html串
     * @returns             虚拟dom树根节点
     */
    compile(elementStr) {
        if (!elementStr) {
            return;
        }
        // 清除注释
        this.template = elementStr.replace(/\<\!\-\-[\s\S]*?\-\-\>/g, '').trim();
        elementStr = this.template;
        // 编译
        this.compileTemplate(elementStr);
        //处理未关闭节点
        if (this.domArr.length > 0) {
            this.forceClose(0);
        }
        return this.root;
    }
    /**
     * 产生dom key
     * @returns   dom key
     */
    genKey() {
        return this.module.getDomKeyId();
    }
    /**
     * 编译模板
     * @param srcStr - 	源串
     */
    compileTemplate(srcStr) {
        while (srcStr.length !== 0) {
            if (srcStr.startsWith('<')) {
                // 标签
                if (srcStr[1] == '/') {
                    // 结束标签
                    srcStr = this.compileEndTag(srcStr);
                }
                else {
                    // 开始标签
                    srcStr = this.compileStartTag(srcStr);
                }
            }
            else {
                // 文本节点
                srcStr = this.compileText(srcStr);
            }
        }
    }
    /**
     * 处理开始标签
     * @param srcStr - 待编译字符串
     * @returns 编译处理后的字符串
     */
    compileStartTag(srcStr) {
        // 抓取<div
        const match = /^<\s*([a-z][^\s\/\>]*)/i.exec(srcStr);
        // 抓取成功
        if (match) {
            // 设置当前正在编译的节点
            const dom = new VirtualDom(match[1].toLowerCase(), this.genKey(), this.module);
            if (dom.tagName === 'svg') {
                this.isSvg = true;
            }
            //设置svg标志
            dom.isSvg = this.isSvg;
            if (!this.root) {
                this.root = dom;
            }
            if (this.current) {
                this.current.add(dom);
            }
            //设置当前节点
            this.current = dom;
            // 当前节点入栈
            this.domArr.push(dom);
            // 截断字符串 准备处理属性
            srcStr = srcStr.substring(match.index + match[0].length).trimStart();
        }
        else {
            // <!-- 或者<后跟符号不是字符
            // 当作text节点
            this.textArr.push(srcStr[0]);
            return srcStr.substring(1);
        }
        // 处理属性
        srcStr = this.compileAttributes(srcStr);
        // 属性处理完成之后 判断是否结束
        if (srcStr.startsWith('>')) {
            if (this.isVoidTab(this.current)) { //属于自闭合，则处理闭合
                this.handleCloseTag(this.current, true);
            }
            return srcStr.substring(1).trimStart();
        }
        return srcStr;
    }
    /**
     * 处理标签属性
     * @param srcStr - 待编译字符串
     * @returns 编译后字符串
     */
    compileAttributes(srcStr) {
        while (srcStr.length !== 0 && srcStr[0] !== '>') {
            // 抓取形如： /> a='b' a={{b}} a="b" a=`b` a $data={{***}} a={{***}}的属性串;
            const match = /^((\/\>)|\$?[a-z_][\w-]*)(?:\s*=\s*((?:'[^']*')|(?:"[^"]*")|(?:`[^`]*`)|(?:{{[^}}]*}})))?/i.exec(srcStr);
            // 抓取成功 处理属性
            if (match) {
                if (match[0] === '/>') { //自闭合标签结束则退出
                    // 是自闭合标签
                    this.handleCloseTag(this.current, true);
                    srcStr = srcStr.substring(match.index + match[0].length).trimStart();
                    break;
                }
                else { //属性
                    const name = match[1][0] !== '$' ? match[1].toLowerCase() : match[1];
                    // 是普通属性
                    let value = !match[3]
                        ? undefined
                        : match[3].startsWith(`"`)
                            ? match[3].substring(1, match[3].length - 1)
                            : match[3].startsWith(`'`)
                                ? match[3].substring(1, match[3].length - 1)
                                : match[3];
                    if (value && value.startsWith('{{')) {
                        value = new Expression(value.substring(2, value.length - 2));
                        //表达式 staticNum为-1
                        this.current.staticNum = -1;
                    }
                    if (name.startsWith('x-')) {
                        // 指令
                        this.current.addDirective(new Directive(name.substring(2), value, this.module.id));
                    }
                    else if (name.startsWith('e-')) {
                        // 事件
                        this.current.addEvent(new NEvent(this.module, name.substring(2), value));
                    }
                    else {
                        //普通属性
                        this.current.setProp(name, value);
                    }
                }
                srcStr = srcStr.substring(match.index + match[0].length).trimStart();
            }
            else {
                if (this.current) {
                    throw new NError('tagError', this.current.tagName);
                }
                throw new NError('wrongTemplate');
            }
        }
        return srcStr;
    }
    /**
     * 编译结束标签
     * @param srcStr - 	源串
     * @returns 		剩余的串
     */
    compileEndTag(srcStr) {
        // 抓取结束标签
        const match = /^<\/\s*([a-z][^\>]*)/i.exec(srcStr);
        if (match) {
            const name = match[1].toLowerCase().trim();
            //如果找不到匹配的标签头则丢弃
            let index;
            for (let i = this.domArr.length - 1; i >= 0; i--) {
                if (this.domArr[i].tagName === name) {
                    index = i;
                    break;
                }
            }
            //关闭
            if (index) {
                this.forceClose(index);
            }
            return srcStr.substring(match.index + match[0].length + 1);
        }
        return srcStr;
    }
    /**
     * 强制闭合
     * @param index - 在domArr中的索引号
     * @returns
     */
    forceClose(index) {
        if (index === -1 || index > this.domArr.length - 1) {
            return;
        }
        for (let i = this.domArr.length - 1; i >= index; i--) {
            this.handleCloseTag(this.domArr[i]);
        }
    }
    /**
     * 编译text
     * @param srcStr - 	源串
     * @returns
     */
    compileText(srcStr) {
        // 字符串最开始变为< 或者字符串消耗完 则退出循环
        while (!srcStr.startsWith('<') && srcStr.length !== 0) {
            if (srcStr.startsWith('{')) {
                // 可能是表达式
                const matchExp = /^{{([\s\S]*?)}}/i.exec(srcStr);
                if (matchExp) {
                    // 抓取成功
                    this.textArr.push(new Expression(matchExp[1]));
                    this.isExprText = true;
                    srcStr = srcStr.substring(matchExp.index + matchExp[0].length);
                }
                else {
                    // 跳过单独的{
                    typeof this.textArr[this.textArr.length] === 'string'
                        ? (this.textArr[this.textArr.length] += '{')
                        : this.textArr.push('{');
                    srcStr = srcStr.substring(1);
                }
            }
            else {
                // 非表达式，处理成普通字符节点
                const match = /([^\<\{]*)/.exec(srcStr);
                if (match) {
                    let txt;
                    if (this.current && this.current.tagName === 'pre') {
                        // 在pre标签里
                        txt = this.preHandleText(srcStr.substring(0, match.index + match[0].length));
                    }
                    else {
                        txt = this.preHandleText(srcStr.substring(0, match.index + match[0].length).trim());
                    }
                    if (txt !== '') {
                        this.textArr.push(txt);
                    }
                }
                srcStr = srcStr.substring(match.index + match[0].length);
            }
        }
        // 最开始是< 或者字符消耗完毕 退出循环
        const text = new VirtualDom(undefined, this.genKey());
        if (this.isExprText) {
            text.expressions = [...this.textArr];
            //动态文本节点，staticNum=-1
            text.staticNum = -1;
        }
        else {
            text.textContent = this.textArr.join('');
        }
        if (this.current && (this.isExprText || text.textContent.length !== 0)) {
            this.current.add(text);
        }
        // 重置状态
        this.isExprText = false;
        this.textArr = [];
        // 返回字符串
        return srcStr;
    }
    /**
     * 预处理html保留字符 如 &nbsp;,&lt;等
     * @param str -   待处理的字符串
     * @returns     解析之后的串
     */
    preHandleText(str) {
        const reg = /&[a-z]+;/;
        if (reg.test(str)) {
            const div = document.createElement('div');
            div.innerHTML = str;
            return div.textContent;
        }
        return str;
    }
    /**
     * 处理当前节点是模块或者自定义节点
     * @param dom - 	虚拟dom节点
     */
    postHandleNode(dom) {
        const clazz = DefineElementManager.get(dom.tagName);
        if (clazz) {
            Reflect.construct(clazz, [dom, this.module]);
        }
        // 是否是模块类
        if (ModuleFactory.hasClass(dom.tagName)) {
            dom.addDirective(new Directive('module', dom.tagName, this.module.id));
            dom.tagName = 'div';
        }
    }
    /**
     * 处理插槽
     * @param dom - 	虚拟dom节点
     */
    handleSlot(dom) {
        if (!dom.children ||
            dom.children.length === 0 ||
            !dom.hasDirective('module')) {
            return;
        }
        let slotCt;
        for (let j = 0; j < dom.children.length; j++) {
            const c = dom.children[j];
            if (c.hasDirective('slot')) {
                //带slot的不处理
                continue;
            }
            if (!slotCt) { //初始化default slot container
                //第一个直接被slotCt替换
                slotCt = new VirtualDom('div', this.genKey());
                slotCt.addDirective(new Directive('slot', 'default', this.module.id));
                //当前位置，用slot替代
                dom.children.splice(j, 1, slotCt);
            }
            else { //添加到default slot container
                //直接删除
                dom.children.splice(j--, 1);
            }
            slotCt.add(c);
        }
    }
    /**
     * 标签闭合
     */
    handleCloseTag(dom, isSelfClose) {
        this.postHandleNode(dom);
        dom.sortDirective();
        if (!isSelfClose) {
            this.handleSlot(dom);
        }
        //闭合节点出栈
        this.domArr.pop();
        //设置current为最后一个节点
        if (this.domArr.length > 0) {
            this.current = this.domArr[this.domArr.length - 1];
        }
        // 取消isSvg标识
        if (dom.tagName === 'svg') {
            this.isSvg = false;
        }
    }
    /**
     * 判断节点是否为空节点
     * @param dom -	带检测节点
     * @returns
     */
    isVoidTab(dom) {
        return voidTagMap.has(dom.tagName);
    }
}

/**
 * dom比较器
 */
class DiffTool {
    /**
     * 比较节点
     *
     * @param src -         待比较节点（新树节点）
     * @param dst - 	    被比较节点 (旧树节点)
     * @param changeArr -   增删改的节点数组
     * @returns	            改变的节点数组
     */
    static compare(src, dst) {
        const changeArr = [];
        compare(src, dst);
        return changeArr;
        /**
         * 比较节点
         * @param src -     待比较节点（新节点）
         * @param dst - 	被比较节点 (旧节点)
         */
        function compare(src, dst) {
            if (!src.tagName) { //文本节点
                if (!dst.tagName) {
                    if ((src.staticNum || dst.staticNum) && src.textContent !== dst.textContent) {
                        addChange(2, src, dst, dst.parent);
                    }
                    else if (src.moduleId !== dst.moduleId) {
                        addChange(5, src, dst, dst.parent);
                    }
                }
                else { //节点类型不同，替换
                    addChange(5, src, dst, dst.parent);
                }
            }
            else {
                //节点类型不同或对应的子模块不同，替换
                if ((src.moduleId || dst.moduleId) && src.moduleId !== dst.moduleId || src.tagName !== dst.tagName) {
                    addChange(5, src, dst, dst.parent);
                }
                else { //节点类型相同，但有一个不是静态节点，进行属性比较
                    if ((src.staticNum || dst.staticNum) && isChanged(src, dst)) {
                        addChange(2, src, dst, dst.parent);
                    }
                    // 非子模块不比较子节点或者作为slot的子模块
                    // if(!src.moduleId || src.rmid){
                    compareChildren(src, dst);
                    // }
                }
            }
        }
        /**
         * 比较子节点
         * @param src -   新节点
         * @param dst -   旧节点
         */
        function compareChildren(src, dst) {
            //子节点处理
            if (!src.children || src.children.length === 0) {
                // 旧节点的子节点全部删除
                if (dst.children && dst.children.length > 0) {
                    dst.children.forEach(item => addChange(3, item, null, dst));
                }
            }
            else {
                //全部新加节点
                if (!dst.children || dst.children.length === 0) {
                    src.children.forEach((item, index) => addChange(1, item, null, dst, index));
                }
                else { //都有子节点
                    //存储比较后需要add的key
                    const addObj = {};
                    //子节点对比策略
                    let [newStartIdx, newEndIdx, oldStartIdx, oldEndIdx] = [0, src.children.length - 1, 0, dst.children.length - 1];
                    let [newStartNode, newEndNode, oldStartNode, oldEndNode] = [
                        src.children[newStartIdx],
                        src.children[newEndIdx],
                        dst.children[oldStartIdx],
                        dst.children[oldEndIdx]
                    ];
                    while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
                        if (oldStartNode.key === newStartNode.key) { //新前旧前
                            compare(newStartNode, oldStartNode);
                            if (newStartIdx !== oldStartIdx) {
                                addChange(4, newStartNode, null, dst, newStartIdx, oldStartIdx);
                            }
                            newStartNode = src.children[++newStartIdx];
                            oldStartNode = dst.children[++oldStartIdx];
                        }
                        else if (oldEndNode.key === newEndNode.key) { //新后旧后
                            compare(newEndNode, oldEndNode);
                            if (oldEndIdx !== newEndIdx) {
                                addChange(4, newEndNode, null, dst, newEndIdx, oldEndIdx);
                            }
                            newEndNode = src.children[--newEndIdx];
                            oldEndNode = dst.children[--oldEndIdx];
                        }
                        else if (newStartNode.key === oldEndNode.key) { //新前旧后
                            //新前旧后
                            compare(newStartNode, oldEndNode);
                            //放在指定位置
                            if (newStartIdx !== oldEndIdx) {
                                addChange(4, newStartNode, null, dst, newStartIdx, oldEndIdx);
                            }
                            newStartNode = src.children[++newStartIdx];
                            oldEndNode = dst.children[--oldEndIdx];
                        }
                        else if (newEndNode.key === oldStartNode.key) { //新后旧前
                            compare(newEndNode, oldStartNode);
                            if (newEndIdx !== oldStartIdx) {
                                addChange(4, newEndNode, null, dst, newEndIdx, oldStartIdx);
                            }
                            newEndNode = src.children[--newEndIdx];
                            oldStartNode = dst.children[++oldStartIdx];
                        }
                        else {
                            //加入到addObj
                            addObj[newStartNode.key] = addChange(1, newStartNode, null, dst, newStartIdx);
                            //新前指针后移
                            newStartNode = src.children[++newStartIdx];
                        }
                    }
                    //多余新节点，需要添加
                    if (newStartIdx <= newEndIdx) {
                        for (let i = newStartIdx; i <= newEndIdx; i++) {
                            // 添加到dst.children[i]前面
                            addChange(1, src.children[i], null, dst, i);
                        }
                    }
                    //有多余老节点，需要删除或变成移动
                    if (oldStartIdx <= oldEndIdx) {
                        for (let i = oldStartIdx, index = i; i <= oldEndIdx; i++, index++) {
                            const ch = dst.children[i];
                            //如果要删除的节点在addArr中，则表示move，否则表示删除
                            if (addObj.hasOwnProperty(ch.key)) {
                                const o = addObj[ch.key];
                                if (index !== o[4]) { //修改add为move
                                    o[0] = 4;
                                    //设置move前位置
                                    o[5] = i;
                                    //从add转为move，需要比较新旧节点
                                    compare(o[1], ch);
                                }
                                else { //删除不需要移动的元素
                                    let ii;
                                    if ((ii = changeArr.findIndex(item => item[1].key === o[1].key)) !== -1) {
                                        changeArr.splice(ii, 1);
                                    }
                                }
                            }
                            else {
                                addChange(3, ch, null, dst);
                                //删除的元素索引号-1，用于判断是否需要移动节点
                                index--;
                            }
                        }
                    }
                }
            }
        }
        /**
         * 判断节点是否修改
         * @param src - 新树节点
         * @param dst - 旧树节点
         * @returns     true/false
         */
        function isChanged(src, dst) {
            for (const p of ['props', 'assets', 'events']) {
                //属性比较
                if (!src[p] && dst[p] || src[p] && !dst[p]) {
                    return true;
                }
                else if (src[p] && dst[p]) {
                    const keys = Object.keys(src[p]);
                    const keys1 = Object.keys(dst[p]);
                    if (keys.length !== keys1.length) {
                        return true;
                    }
                    else {
                        for (const k of keys) {
                            if (src[p][k] !== dst[p][k]) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        /**
         * 添加到修改数组
         * @param type -    类型 add 1, upd 2,del 3,move 4 ,rep 5
         * @param dom -     目标节点
         * @param dom1 -    相对节点（被替换时有效）
         * @param parent -  父节点
         * @param loc -     添加或移动的目标index
         * @param loc1 -    被移动前位置
         * @returns         changed dom
        */
        function addChange(type, dom, dom1, parent, loc, loc1) {
            const o = [type, dom, dom1, parent, loc, loc1];
            changeArr.push(o);
            return o;
        }
    }
}

/**
 * 自定义元素
 *
 * @remarks
 * 用于扩充标签，主要用于指令简写，参考 ./extend/elementinit.ts。
 *
 * 如果未指定标签名，默认为`div`，也可以用`tag`属性指定
 *
 * @example
 * ```html
 *   <!-- 渲染后标签名为div -->
 *   <if cond={{any}}>hello</if>
 *   <!-- 渲染后标签名为p -->
 *   <if cond={{any}} tag='p'>hello</if>
 * ```
 */
class DefineElement {
    /**
     * 构造器，在dom编译后执行
     * @param node -    虚拟dom节点
     * @param module -  所属模块
     */
    constructor(node, module) {
        if (node.hasProp('tag')) {
            node.tagName = node.getProp('tag');
            node.delProp('tag');
        }
        else {
            node.tagName = 'div';
        }
    }
}

/**
 * 事件工厂
 *
 * @remarks
 * 每个模块一个事件工厂，用于管理模块内虚拟dom对应的事件对象
 */
class EventFactory {
    /**
     * 构造器
     * @param module - 模块
     */
    constructor(module) {
        this.module = module;
        this.eventMap = new Map();
        this.addedEvents = new Map();
    }
    /**
     * 保存事件
     * @param key -     dom key
     * @param event -   事件对象
     */
    addEvent(dom, event) {
        const key = dom.key;
        //判断是否已添加，避免重复添加
        if (this.addedEvents.has(key) && this.addedEvents.get(key).includes(event)) {
            return;
        }
        //代理事件，如果无父节点，则直接处理为自有事件
        if (event.delg) {
            if (dom.parent) {
                this.addToArr(dom.parent.key, event, dom.key);
            }
            else { //不存在父对象，设置delg为false
                event.delg = false;
            }
        }
        // 自有事件
        if (!event.delg) {
            this.addToArr(dom.key, event);
        }
        //添加到addedEvents
        if (!this.addedEvents.has(key)) {
            this.addedEvents.set(key, [event]);
        }
        else {
            this.addedEvents.get(key).push(event);
        }
    }
    /**
     * 添加到dom的own或delg事件队列
     * @param key -       dom key
     * @param event -     事件对象
     * @param key1 -      被代理dom key，仅对代理事件有效
     */
    addToArr(key, event, key1) {
        let cfg;
        if (!this.eventMap.has(key)) {
            cfg = { bindMap: {} };
            this.eventMap.set(key, cfg);
        }
        else {
            cfg = this.eventMap.get(key);
        }
        if (!cfg[event.name]) {
            cfg[event.name] = {
                delg: [],
                own: []
            };
        }
        //类型：delg或own
        let type;
        let value;
        //代理事件
        if (key1) {
            type = 'delg';
            value = { key: key1, event: event };
        }
        else { //非代理事件
            type = 'own';
            value = event;
            cfg[event.name].capture = event.capture || false;
        }
        cfg[event.name][type].push(value);
    }
    /**
     * 获取事件对象
     * @param key -   dom key
     * @returns     事件对象
     */
    getEvent(key) {
        return this.eventMap.get(key);
    }
    /**
     * 移除所有事件
     * @param dom -
     */
    removeAllEvents(dom) {
        if (!this.addedEvents.has(dom.key)) {
            return;
        }
        for (const ev of this.addedEvents.get(dom.key)) {
            this.removeEvent(dom, ev);
        }
        this.addedEvents.delete(dom.key);
    }
    /**
     * 删除事件
     * @param event -     事件对象
     * @param key -       对应dom keys
     */
    removeEvent(dom, event) {
        if (!this.addedEvents.has(dom.key) || !this.addedEvents.get(dom.key).includes(event)) {
            return;
        }
        //从dom event数组移除
        const arr = this.addedEvents.get(dom.key);
        arr.splice(arr.indexOf(event), 1);
        //处理delg和own数组
        if (event.delg) { //代理事件
            //找到父对象
            if (!dom.parent || !this.eventMap.has(dom.parent.key)) {
                return;
            }
            const cfg = this.eventMap.get(dom.parent.key);
            if (!cfg[event.name]) {
                return;
            }
            const obj = cfg[event.name];
            const index = obj.delg.findIndex(item => item.key === dom.key && item.event === event);
            if (index !== -1) {
                obj.delg.splice(index, 1);
            }
        }
        else { //own
            const cfg = this.eventMap.get(dom.key);
            if (!cfg[event.name]) {
                return;
            }
            const obj = cfg[event.name];
            const index = obj.own.findIndex(item => item === event);
            if (index !== -1) {
                obj.own.splice(index, 1);
            }
        }
    }
    /**
     * 绑定key对应节点所有事件
     * @remarks
     * 执行addEventListener操作
     * @param key -   dom key
     */
    bind(key) {
        if (!this.eventMap.has(key)) {
            return;
        }
        const el = this.module.getElement(key);
        const cfg = this.eventMap.get(key);
        for (const key of Object.keys(cfg)) {
            // bindMap 不是事件名
            if (key === 'bindMap') {
                continue;
            }
            el.addEventListener(key, handler, cfg[key].capture);
            cfg['bindMap'][key] = { handler: handler, capture: cfg[key].capture };
        }
        const me = this;
        function handler(e) {
            me.handler.apply(me, [me.module, e]);
        }
    }
    /**
     * 解绑key对应节点的指定事件
     * @remarks
     * 执行removeEventListener操作
     * @param key -         dom key
     * @param eventName -   事件名
     */
    unbind(key, eventName) {
        if (!this.eventMap.has(key)) {
            return;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj['bindMap'] || !eobj[eventName]) {
            return;
        }
        const el = this.module.getElement(key);
        const cfg = eobj['bindMap'][eventName];
        //从html element解绑
        if (el && cfg) {
            el.removeEventListener(eventName, cfg.handler, cfg.capture);
        }
        delete eobj['bindMap'][eventName];
    }
    /**
     * 解绑key对应节点所有事件
     * @param key - dom key
     */
    unbindAll(key) {
        if (!this.eventMap.has(key)) {
            return;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj['bindMap']) {
            return;
        }
        const el = this.module.getElement(key);
        if (el) {
            for (const key of Object.keys(eobj['bindMap'])) {
                const v = eobj['bindMap'][key];
                el.removeEventListener(key, v.handler, v.capture);
            }
        }
        eobj['bindMap'] = {};
    }
    /**
     * 是否拥有key对应的事件对象
     * @param key - dom key
     * @returns     如果key对应事件存在，返回true，否则返回false
     */
    hasEvent(key) {
        return this.eventMap.has(key);
    }
    /**
     * 清除工厂所有事件
     */
    clear() {
        //解绑事件
        for (const key of this.addedEvents.keys()) {
            this.unbindAll(key);
        }
        this.addedEvents.clear();
        this.eventMap.clear();
    }
    /**
     * 事件处理函数
     * @param module - 模块
     * @param e - HTML Event
     */
    handler(module, e) {
        //从事件element获取事件
        const el = e.currentTarget;
        const key = el.key;
        const dom = module.domManager.getRenderedDom(key);
        if (!dom) {
            return;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj || !eobj[e.type]) {
            return;
        }
        const evts = eobj[e.type];
        if (evts.capture) { //先执行自己的事件
            doOwn(evts.own);
            doDelg(evts.delg);
        }
        else {
            if (!doDelg(evts.delg)) {
                doOwn(evts.own);
            }
        }
        /**
         * 处理自有事件
         * @param events -
         * @returns
         */
        function doOwn(events) {
            if (!events) {
                return;
            }
            // 禁止冒泡为false，如果绑定的多个事件中存在1个nopopo，则全部nopopo
            let nopopo = false;
            for (let i = 0; i < events.length; i++) {
                const ev = events[i];
                if (!ev.handler) {
                    continue;
                }
                //外部事件且为根dom，表示为父模块外部传递事件，则model为模块srcDom对应model，否则使用dom对应model
                const model = ev.module !== module && dom.key === 1 ? module.srcDom.model : dom.model;
                //判断为方法名还是函数
                if (typeof ev.handler === 'string') {
                    ev.module.invokeMethod(ev.handler, model, dom, ev, e);
                }
                else if (typeof ev.handler === 'function') {
                    ev.handler.apply(ev.module, [model, dom, ev, e]);
                }
                // 只执行1次，则handler置空
                if (ev.once) {
                    ev.handler = undefined;
                }
                if (!nopopo) {
                    nopopo = ev.nopopo;
                }
            }
            if (nopopo) {
                e.stopPropagation();
            }
        }
        /**
         * 处理代理事件
         * @param events -
         * @returns         是否禁止冒泡
         */
        function doDelg(events) {
            if (!events) {
                return false;
            }
            const elArr = e.path || (e.composedPath ? e.composedPath() : []);
            let nopopo = false;
            for (let i = 0; i < events.length; i++) {
                const evo = events[i];
                const ev = evo.event;
                for (let j = 0; j < elArr.length && elArr[j] !== el; j++) {
                    const k = elArr[j].key;
                    if (k === evo.key) {
                        const dom1 = dom.children.find(item => item.key === k);
                        if (!dom1) {
                            continue;
                        }
                        //外部事件且为根dom，表示为父模块外部传递事件，则model为模块srcDom对应model，否则使用dom对应model
                        const model = ev.module !== module && dom1.key === 1 ? module.srcDom.model : dom1.model;
                        if (typeof ev.handler === 'string') {
                            ev.module.invokeMethod(ev.handler, model, dom1, ev, e);
                        }
                        else if (typeof ev.handler === 'function') {
                            ev.handler.apply(ev.module, model, dom1, ev, e);
                        }
                        // 保留nopopo
                        nopopo = ev.nopopo;
                        // 只执行1次,移除代理事件
                        if (ev.once) {
                            //从当前dom删除
                            events.splice(i--, 1);
                        }
                        break;
                    }
                }
            }
            return nopopo;
        }
    }
}

/**
 * 缓存模块
 */
class NCache {
    constructor() {
        /**
         * 缓存数据容器
         */
        this.cacheData = {};
        /**
         * 订阅map，格式为
         * ```js
         * {
         *  key:[{
         *      module:订阅模块,
         *      handler:回调钩子
         * },...]}
         * ```
         */
        this.subscribeMap = new Map();
    }
    /**
     * 通过提供的键名从内存中拿到对应的值
     * @param key - 键，支持"."（多级数据分割）
     * @returns     值或undefined
     */
    get(key) {
        let p = this.cacheData;
        if (key.indexOf('.') !== -1) {
            const arr = key.split('.');
            if (arr.length > 1) {
                for (let i = 0; i < arr.length - 1 && p; i++) {
                    p = p[arr[i]];
                }
                if (p) {
                    key = arr[arr.length - 1];
                }
            }
        }
        if (p) {
            return p[key];
        }
    }
    /**
     * 通过提供的键名和值将其存储在内存中
     * @param key -     键
     * @param value -   值
     */
    set(key, value) {
        let p = this.cacheData;
        const key1 = key;
        if (key.indexOf('.') !== -1) {
            const arr = key.split('.');
            if (arr.length > 1) {
                for (let i = 0; i < arr.length - 1; i++) {
                    if (!p[arr[i]] || typeof p[arr[i]] !== 'object') {
                        p[arr[i]] = {};
                    }
                    p = p[arr[i]];
                }
                key = arr[arr.length - 1];
            }
        }
        if (p) {
            p[key] = value;
        }
        //处理订阅
        if (this.subscribeMap.has(key1)) {
            const arr = this.subscribeMap.get(key1);
            for (const a of arr) {
                this.invokeSubscribe(a.module, a.handler, value);
            }
        }
    }
    /**
     * 通过提供的键名将其移除
     * @param key -   键
     */
    remove(key) {
        let p = this.cacheData;
        if (key.indexOf('.') !== -1) {
            const arr = key.split('.');
            if (arr.length > 1) {
                for (let i = 0; i < arr.length - 1 && p; i++) {
                    p = p[arr[i]];
                }
                if (p) {
                    key = arr[arr.length - 1];
                }
            }
        }
        if (p) {
            delete p[key];
        }
    }
    /**
     * 订阅
     * @param module -    订阅的模块
     * @param key -       订阅的属性名
     * @param handler -   回调函数或方法名（方法属于module），方法传递参数为订阅属性名对应的值
     */
    subscribe(module, key, handler) {
        if (!this.subscribeMap.has(key)) {
            this.subscribeMap.set(key, [{ module: module, handler: handler }]);
        }
        else {
            const arr = this.subscribeMap.get(key);
            if (!arr.find(item => item.module === module && item.handler === handler)) {
                arr.push({ module: module, handler: handler });
            }
        }
        //如果存在值，则执行订阅回调
        const v = this.get(key);
        if (v) {
            this.invokeSubscribe(module, handler, v);
        }
    }
    /**
     * 调用订阅方法
     * @param module -  模块
     * @param foo -     方法或方法名
     * @param v -       值
     */
    invokeSubscribe(module, foo, v) {
        if (typeof foo === 'string') {
            module.invokeMethod(foo, v);
        }
        else {
            foo.call(module, v);
        }
    }
}

/**
 * 全局缓存
 *
 * @remarks
 * 用于所有模块共享数据，实现模块通信
 */
class GlobalCache {
    /**
     * 保存到cache
     * @param key -     键，支持"."（多级数据分割）
     * @param value -   值
     */
    static set(key, value) {
        this.cache.set(key, value);
    }
    /**
     * 从cache读取
     * @param key - 键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    static get(key) {
        return this.cache.get(key);
    }
    /**
     * 订阅
     *
     * @remarks
     * 如果订阅的数据发生改变，则会触发handler
     *
     * @param module -    订阅的模块
     * @param key -       订阅的属性名
     * @param handler -   回调函数或方法名（方法属于module），方法传递参数为订阅属性名对应的值
     */
    static subscribe(module, key, handler) {
        this.cache.subscribe(module, key, handler);
    }
    /**
     * 从cache移除
     * @param key -   键，支持"."（多级数据分割）
     */
    static remove(key) {
        this.cache.remove(key);
    }
}
/**
 * NCache实例，用于存放缓存对象
 */
GlobalCache.cache = new NCache();

/**
 * 模型类
 *
 * @remarks
 * 模型就是对数据做代理
 *
 * 注意：数据对象中，以下5个属性名（保留字）不能用，可以通过如：`model.__source`的方式获取保留属性
 *
 *      __source:源数据对象
 *
 *      __key:模型的key
 *
 *      __module:所属模块
 *
 *      __parent:父模型
 *
 *      __name:在父模型中的属性名
 *
 */
class Model {
    /**
     * @param data -    数据
     * @param module - 	模块对象
     * @param parent -  父模型
     * @param name -    模型在父对象中的prop name
     * @returns         模型
     */
    constructor(data, module, parent, name) {
        //数据不存在或已经代理，无需再创建
        if (!data || data['__source']) {
            return data;
        }
        // 创建模型
        const proxy = new Proxy(data, {
            set(src, key, value, receiver) {
                const value1 = preHandle(value, module, receiver, key, false);
                //值未变,proxy 不处理
                if (src[key] === value1) {
                    return true;
                }
                const ov = src[key];
                const r = Reflect.set(src, key, value1, receiver);
                module.modelManager.update(receiver, key, ov, value1);
                return r;
            },
            get(src, key, receiver) {
                //如果为代理，则返回源数据
                if (key === '__source') {
                    return receiver ? src : undefined;
                }
                //如果为代理，则返回module
                if (key === '__module') {
                    return receiver ? module : undefined;
                }
                //如果为代理，则返回key
                if (key === '__key') {
                    return receiver ? module.modelManager.getModelKey(src) : undefined;
                }
                //父模型
                if (key === '__parent') {
                    return parent;
                }
                if (key === '__name') {
                    return name;
                }
                let res = Reflect.get(src, key, receiver);
                return preHandle(res, module, receiver, key, true);
            },
            deleteProperty(src, key) {
                const oldValue = src[key];
                delete src[key];
                module.modelManager.update(proxy, key, oldValue, undefined);
                return true;
            }
        });
        module.modelManager.add(data, proxy);
        return proxy;
        /**
         * 预处理
         * 当data为model且源module与当前module不一致时，需要绑定到新module
         * @param data -    数据对象或model
         * @param module-   新模块
         * @param parent -  父对象
         * @param key-      父对象中的名字
         * @param force-    如果data不为model，是否转为model
         * @returns         数据对象
         */
        function preHandle(data, module, parent, key, force) {
            if (!data || (data.constructor !== Object && data.constructor !== Array)) {
                return data;
            }
            const oldMdl = data['__module'];
            //未代理
            if (!oldMdl) {
                if (!force) {
                    return data;
                }
                return new Model(data, module, parent, key);
            }
            if (oldMdl !== module) { //目标模块不一致，需要处理绑定和model.__name
                module.modelManager.add(data['__source'], data);
                oldMdl.modelManager.bindModel(data, module);
                //名字不一致，需要在module中保存
                if (key && key !== data['__name']) {
                    module.modelManager.setModelName(data, key);
                }
            }
            return data;
        }
    }
}

/**
 * 模型工厂
 * @remarks
 * 管理模块的model
 */
class ModelManager {
    /**
     * 构造器
     * @param module -    模块
     */
    constructor(module) {
        /**
         * model与module绑定map
         * @remarks
         * slot引用外部数据或模块传值时有效会导致model被不同模块引用，`bindMap`用来存放对应的模块数组
         *
         * key:    model
         *
         * value:  model绑定的module id 数组
         */
        this.bindMap = new WeakMap();
        /**
         * 数据map
         * ```js
         * {
         *      data1:{
         *          model:model,
         *          key:key
         *      },
         *      data2:,
         *      datan
         * }
         * ```
         * 其中：
         *   datan: 初始数据对象
         *   model: model对象
         *   key:   model key
         */
        this.dataMap = new WeakMap();
        /**
         * 存储模型对应属性名，如果为父传子，则需要保存属于该模型的属性名
         * key: model
         * value: model名字
         */
        this.nameMap = new WeakMap();
        /**
         * model对应监听器map
         * key:model
         * value:object
         * ```js
         * {
         *      key1:{
         *          f:foo1,
         *          deep:true/false
         *      },
         *      key2:,
         *      kn:
         * }
         * ```
         *        其中：prop为被监听属性，foo为监听器方法，deep为是否深度监听
         */
        this.watchMap = new WeakMap();
        /**
         * 是否存在深度watcher
         */
        this.hasDeepWatch = false;
        this.module = module;
    }
    /**
     * 获取model，不存在则新建
     * @param data -    数据
     * @returns         model
     */
    getModel(data) {
        return this.dataMap.has(data) ? this.dataMap.get(data).model : undefined;
    }
    /**
     * 获取model key
     * @remarks
     * 每个model都有一个唯一 key
     * @param model -   model对象
     * @returns         model对应key
     */
    getModelKey(data) {
        return this.dataMap.has(data) ? this.dataMap.get(data).key : undefined;
    }
    /**
     * 设置model名
     * @param model - 模型
     * @param name -  名
     */
    setModelName(model, name) {
        if (!this.nameMap.has(model)) {
            this.nameMap.set(model, name);
        }
    }
    /**
     * 获取模型名
     * @param model - 模型
     * @returns     模型名
     */
    getModelName(model) {
        return this.nameMap.get(model);
    }
    /**
     * 添加数据到map
     * @param data -      原始数据
     * @param model -     模型
     */
    add(data, model) {
        //避免重复添加
        if (this.dataMap.has(data)) {
            return;
        }
        this.dataMap.set(data, { model: model, key: model.__key || Util.genId() });
    }
    /**
     * 添加绑定
     * @remarks
     * 当一个model被多个module引用时，需要添加绑定，以便修改时触发多个模块渲染。
     * @param model -   模型
     * @param module -  模块
     */
    bindModel(model, module) {
        if (!model) {
            return;
        }
        bind(this.bindMap, model, module);
        /**
         * 绑定
         * @param bindMap -     model factory 的bindmap
         * @param model -       model
         * @param module -      待绑定module
         */
        function bind(bindMap, model, module) {
            if (model.__module === module) {
                return;
            }
            if (!bindMap.has(model)) {
                bindMap.set(model, [module.id]);
            }
            else {
                const mids = bindMap.get(model);
                //已经绑定，不再处理子model
                if (mids.includes(module.id)) {
                    return;
                }
                mids.push(module.id);
            }
            //级联绑定
            for (const key of Object.keys(model)) {
                if (model[key] && (model[key].constructor === Object || model[key].constructor === Array)) {
                    bind(bindMap, model[key], module);
                }
            }
        }
    }
    /**
     * 更新导致渲染
     * @remarks
     * 如果不设置oldValue和newValue，则直接强制渲染
     *
     * @param model -     model
     * @param key -       属性
     * @param oldValue -  旧值
     * @param newValue -  新值
     */
    update(model, key, oldValue, newValue) {
        //处理watch
        handleWatcher(this.module, model);
        //添加module渲染
        Renderer.add(this.module);
        //对绑定模块添加渲染
        if (this.bindMap.has(model)) {
            for (const id of this.bindMap.get(model)) {
                const m = ModuleFactory.get(id);
                if (m) {
                    handleWatcher(m, model);
                    Renderer.add(m);
                }
            }
        }
        /**
         * 处理watcher
         * @param module -  模块
         * @param model -   模型
         */
        function handleWatcher(module, model) {
            const map = module.modelManager.watchMap;
            const watcher = map.get(model);
            //当前model存在watcher
            if (watcher && watcher[key]) {
                //查找对应key是否存在watch
                watcher[key].f.call(module, model, key, oldValue, newValue);
            }
            else if (module.modelManager.hasDeepWatch) { //进行deep查找
                for (let m = model; m && m.__parent; m = m.__parent) {
                    //如果已经跨模块，则表示为父传子，父模块指向当前模块
                    const pm = m.__parent.__module === module ? m.__parent : module.model;
                    if (!map.has(pm)) {
                        continue;
                    }
                    const watcher = map.get(pm);
                    const name = module.modelManager.getModelName(m) || m.__name;
                    if (watcher && watcher[name]) {
                        const cfg = watcher[name];
                        // 当前model或父model deep watch
                        if (cfg.deep) {
                            cfg.f.call(module, model, key, oldValue, newValue);
                            //找到即跳出循环
                            break;
                        }
                    }
                }
            }
        }
    }
    /**
     * 监听数据项
     *
     * @param model -   被监听model
     * @param key -     监听数据项名
     * @param operate - 数据项变化时执行方法
     * @param deep -    是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
     *
     * @returns         unwatch函数，执行此函数，可取消监听
     */
    watch(model, key, operate, deep) {
        if (!operate || typeof operate !== 'function') {
            return;
        }
        const me = this;
        //设置深度watch标志
        this.hasDeepWatch = deep;
        //撤销watch数组，数据项为{m:model,k:监听属性,f:触发方法}
        let arr = [];
        if (Array.isArray(key)) {
            for (const k of key) {
                watchOne(model, k, operate);
            }
        }
        else {
            watchOne(model, key, operate);
        }
        //返回取消watch函数
        return () => {
            //避免二次取消
            if (!Array.isArray(arr)) {
                return;
            }
            for (const f of arr) {
                const obj = me.watchMap.get(f.m);
                if (!obj) {
                    continue;
                }
                delete obj[f.k];
                //已经无监听从watchMap移除
                if (Object.keys(obj).length === 0) {
                    me.watchMap.delete(f.m);
                }
            }
            //释放arr
            arr = null;
        };
        /**
         * 监听一个
         * @param model -     当前model
         * @param key -       监听属性，可以支持多级属性，如果为多级属性，倒数第二级对应数据项必须为对象
         * @param operate -   操作方法
         */
        function watchOne(model, key, operate) {
            if (!model || typeof model !== 'object') {
                return;
            }
            let index;
            //如果带'.'，则只取最里面那个对象
            if ((index = key.lastIndexOf('.')) !== -1) {
                model = me.get(model, key.substring(0, index));
                key = key.substring(index + 1);
                if (!model || typeof model !== 'object') {
                    return;
                }
            }
            if (!me.watchMap.has(model)) {
                me.watchMap.set(model, {});
            }
            const obj = me.watchMap.get(model);
            obj[key] = { f: operate, deep: deep };
            //保存用于撤销watch
            arr.push({ m: model, k: key });
        }
    }
    /**
     * 获取model属性值
     * @param key -     属性名，可以分级，如 name.firstName
     * @param model -   模型
     * @returns         属性值
     */
    get(model, key) {
        if (key) {
            if (key.indexOf('.') !== -1) { //层级字段
                const arr = key.split('.');
                for (let i = 0; i < arr.length - 1; i++) {
                    model = model[arr[i]];
                    if (!model) {
                        break;
                    }
                }
                if (!model) {
                    return;
                }
                key = arr[arr.length - 1];
            }
            model = model[key];
        }
        return model;
    }
    /**
     * 设置model属性值
     * @param model -   模型
     * @param key -     属性名，可以分级，如 name.firstName
     * @param value -   属性值
     */
    set(model, key, value) {
        if (key.indexOf('.') !== -1) { //层级字段
            const arr = key.split('.');
            for (let i = 0; i < arr.length - 1; i++) {
                //不存在，则创建新的model
                if (!model[arr[i]]) {
                    model[arr[i]] = {};
                }
                model = model[arr[i]];
            }
            key = arr[arr.length - 1];
        }
        model[key] = value;
    }
}

/**
 * 对象管理器
 * @remarks
 * 用于存储模块的内存变量，`$`开始的数据项可能被nodom占用，使用时禁止使用。
 *
 * 默认属性集
 *
 *  $events     事件集
 *
 *  $domparam   dom参数
 */
class ObjectManager {
    /**
     * module   模块
     * @param module - 模块
     */
    constructor(module) {
        this.module = module;
        this.cache = new NCache();
    }
    /**
     * 保存到cache
     * @param key -     键，支持"."（多级数据分割）
     * @param value -   值
     */
    set(key, value) {
        this.cache.set(key + '', value);
    }
    /**
     * 从cache读取
     * @param key - 键，支持多级数据，如"x.y.z"
     * @returns     缓存的值或undefined
     */
    get(key) {
        return this.cache.get(key);
    }
    /**
     * 从cache移除
     * @param key -   键，支持"."（多级数据分割）
     */
    remove(key) {
        this.cache.remove(key);
    }
    /**
     * 设置事件参数
     * @param id -      事件id
     * @param key -     dom key
     * @param name -    参数名
     * @param value -   参数值
     */
    setEventParam(id, key, name, value) {
        this.cache.set('$events.' + id + '.$params.' + key + '.' + name, value);
    }
    /**
     * 获取事件参数值
     * @param id -      事件id
     * @param key -     dom key
     * @param name -    参数名
     * @returns         参数值
     */
    getEventParam(id, key, name) {
        return this.get('$events.' + id + '.$params.' + key + '.' + name);
    }
    /**
     * 移除事件参数
     * @param id -      事件id
     * @param key -     dom key
     * @param name -    参数名
     */
    removeEventParam(id, key, name) {
        this.remove('$events.' + id + '.$params.' + key + '.' + name);
    }
    /**
     * 清空事件参数
     * @param id -      事件id
     * @param key -     dom key
     */
    clearEventParams(id, key) {
        if (key) { //删除对应dom的事件参数
            this.remove('$events.' + id + '.$params.' + key);
        }
        else { //删除所有事件参数
            this.remove('$events.' + id + '.$params');
        }
    }
    /**
     * 设置dom参数值
     * @param key -     dom key
     * @param name -    参数名
     * @param value -   参数值
     */
    setDomParam(key, name, value) {
        this.set('$domparam.' + key + '.' + name, value);
    }
    /**
     * 获取dom参数值
     * @param key -     dom key
     * @param name -    参数名
     * @returns         参数值
     */
    getDomParam(key, name) {
        return this.get('$domparam.' + key + '.' + name);
    }
    /**
     * 移除dom参数值
     * @param key -     dom key
     * @param name -    参数名
     */
    removeDomParam(key, name) {
        this.remove('$domparam.' + key + '.' + name);
    }
    /**
     * 清除element 参数集
     * @param key -     dom key
     */
    clearDomParams(key) {
        this.remove('$domparam.' + key);
    }
    /**
     * 清除缓存dom对象集
     */
    clearAllDomParams() {
        this.remove('$domparam');
    }
}

/**
 * dom管理器
 * @remarks
 * 用于管理module的虚拟dom树，渲染树，html节点
 */
class DomManager {
    /**
     * 构造方法
     * @param module -  所属模块
     */
    constructor(module) {
        /**
         * html节点map
         * @remarks
         * 用于存放dom key对应的html节点
         */
        this.elementMap = new Map();
        this.module = module;
    }
    /**
     * 从virtual dom 树获取虚拟dom节点
     * @param key - dom key 或 props键值对
     * @returns     编译后虚拟节点
     */
    getVirtualDom(key) {
        if (!this.vdomTree) {
            return null;
        }
        return find(this.vdomTree);
        function find(dom) {
            //对象表示未props查找
            if (typeof key === 'object') {
                if (!Object.keys(key).find(k => key[k] !== dom.props.get(k))) {
                    return dom;
                }
            }
            else if (dom.key === key) { //key查找
                return dom;
            }
            if (dom.children) {
                for (const d of dom.children) {
                    const d1 = find(d);
                    if (d1) {
                        return d1;
                    }
                }
            }
        }
    }
    /**
     * 从渲染树获取key对应的渲染节点
     * @param key - dom key 或 props键值对
     * @returns     渲染后虚拟节点
     */
    getRenderedDom(key) {
        if (!this.renderedTree) {
            return;
        }
        return find(this.renderedTree, key);
        /**
         * 递归查找
         * @param dom - 渲染dom
         * @param key -   待查找key
         * @returns     key对应renderdom 或 undefined
         */
        function find(dom, key) {
            //对象表示未props查找
            if (typeof key === 'object') {
                if (dom.props && !Object.keys(key).find(k => key[k] !== dom.props[k])) {
                    return dom;
                }
            }
            else if (dom.key === key) { //key查找
                return dom;
            }
            if (dom.children) {
                for (const d of dom.children) {
                    if (!d) {
                        continue;
                    }
                    const d1 = find(d, key);
                    if (d1) {
                        return d1;
                    }
                }
            }
        }
    }
    /**
     * 清除html element map 节点
     * @param dom -   dom节点，如果为空，则清空map
     */
    clearElementMap(dom) {
        if (dom) {
            this.elementMap.delete(dom.key);
            //带自定义key的移除
            if (dom.props && dom.props['key']) {
                this.elementMap.delete(dom.props['key']);
            }
        }
        else {
            this.elementMap.clear();
        }
    }
    /**
     * 获取html节点
     * @remarks
     * 当key为数字或字符串时，表示dom key，当key为对象时，表示根据dom属性进行查找
     *
     * @param key - dom key 或 props键值对
     * @returns     html节点
     */
    getElement(key) {
        if (typeof key === 'object') {
            const dom = this.getRenderedDom(key);
            if (dom) {
                key = dom.key;
            }
            else {
                return;
            }
        }
        return this.elementMap.get(key);
    }
    /**
     * 保存html节点
     * @param key -   dom key
     * @param node -  html node
     */
    saveElement(dom, node) {
        this.elementMap.set(dom.key, node);
    }
    /**
     * 释放节点
     * @remarks
     * 释放操作包括：如果被释放节点包含子模块，则子模块需要unmount；释放对应节点资源
     * @param dom - 虚拟dom
     */
    freeNode(dom) {
        if (dom.moduleId) { //子模块
            const m = ModuleFactory.get(dom.moduleId);
            if (m) {
                m.unmount();
            }
        }
        else { //普通节点
            const el = this.module.getElement(dom.key);
            //从map移除
            this.clearElementMap(dom);
            //解绑所有事件
            this.module.eventFactory.unbindAll(dom.key);
            //子节点递归操作
            if (dom.children) {
                for (const d of dom.children) {
                    this.freeNode(d);
                }
            }
            //从html移除
            if (el && el.parentElement) {
                el.parentElement.removeChild(el);
            }
        }
    }
    /**
     * 重置节点相关信息
     */
    reset() {
        this.renderedTree = null;
        this.elementMap.clear();
    }
}

/**
 * 模块类
 *
 * @remarks
 * 模块方法说明：模板内使用的方法，包括事件方法，都在模块内定义
 *
 *  方法this：指向module实例
 *
 *  事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *
 *  表达式方法：参数按照表达式方式给定即可，如：
 * ```html
 *  <div>
 *      <div class={{getCls(st)}} e-click='click'>Hello Nodom</div>
 *  </div>
 * ```
 * ```js
 *  //事件方法
 *  click(model,dom,eventObj,e){
 *      //do something
 *  }
 *  //表达式方法
 *  //state 由表达式中给定，state由表达式传递，为当前dom model的一个属性
 *  getCls(state){
 *      //do something
 *  }
 * ```
 *
 * 模块事件，在模块不同阶段执行
 *
 * onInit              初始化后（constructor后，已经有model对象，但是尚未编译，只执行1次）
 *
 * onBeforeFirstRender 首次渲染前（只执行1次）
 *
 * onFirstRender       首次渲染后（只执行1次）
 *
 * onBeforeRender      渲染前
 *
 * onRender            渲染后
 *
 * onCompile           编译后
 *
 * onBeforeMount       挂载到document前
 *
 * onMount             挂载到document后
 *
 * onBeforeUnMount     从document脱离前
 *
 * onUnmount           从document脱离后
 *
 * onBeforeUpdate      更新到document前
 *
 * onUpdate            更新到document后
 */
class Module {
    /**
     * 构造器
     */
    constructor() {
        /**
         * 子模块id数组
         */
        this.children = [];
        /**
         * slot map
         *
         * key: slot name
         *
         * value: {type:0(外部渲染)/1(内部渲染innerrender),dom:渲染节点,vdom:虚拟节点}
         *
         */
        this.slots = new Map();
        this.id = Util.genId();
        this.modelManager = new ModelManager(this);
        this.domManager = new DomManager(this);
        this.objectManager = new ObjectManager(this);
        this.eventFactory = new EventFactory(this);
        //加入模块工厂
        ModuleFactory.add(this);
    }
    /**
     * 初始化操作
     */
    init() {
        this.state = EModuleState.INIT;
        //初始化model
        this.model = new Model(this.data() || {}, this);
        this.doModuleEvent('onInit');
    }
    /**
     * 模板串方法，使用时需重载
     * @param props -   props对象，在模板中进行配置，从父模块传入
     * @returns         模板串
     * @virtual
     */
    template(props) {
        return null;
    }
    /**
     * 数据方法，使用时需重载
     * @returns  数据对象
     */
    data() {
        return {};
    }
    /**
     * 模型渲染
     * @remarks
     * 渲染流程：
     *
     * 1. 获取首次渲染标志
     *
     * 2. 执行template方法获得模板串
     *
     * 3. 与旧模板串比较，如果不同，则进行编译
     *
     * 4. 判断是否存在虚拟dom树（编译时可能导致模板串为空），没有则结束
     *
     * 5. 如果为首次渲染，执行onBeforeFirstRender事件
     *
     * 6. 执行onBeforeRender事件
     *
     * 7. 保留旧渲染树，进行新渲染
     *
     * 8. 执行onRender事件
     *
     * 9. 如果为首次渲染，执行onFirstRender事件
     *
     * 10. 渲染树为空，从document解除挂载
     *
     * 11. 如果未挂载，执行12，否则执行13
     *
     * 12. 执行挂载，结束
     *
     * 13. 新旧渲染树比较，比较结果为空，结束，否则执行14
     *
     * 14. 执行onBeforeUpdate事件
     *
     * 15. 更新到document
     *
     * 16. 执行onUpdate事件，结束
     */
    render() {
        //获取首次渲染标志
        const firstRender = this.oldTemplate === undefined;
        //检测模板并编译
        const templateStr = this.template(this.props);
        //与旧模板不一样，需要重新编译
        if (templateStr !== this.oldTemplate) {
            this.oldTemplate = templateStr;
            this.compile();
        }
        //不存在domManager.vdomTree，不渲染
        if (!this.domManager.vdomTree) {
            return;
        }
        //首次渲染
        if (firstRender) {
            this.doModuleEvent('onBeforeFirstRender');
        }
        //渲染前事件
        this.doModuleEvent('onBeforeRender');
        //保留旧树
        const oldTree = this.domManager.renderedTree;
        //渲染
        this.domManager.renderedTree = Renderer.renderDom(this, this.domManager.vdomTree, this.model);
        //每次渲染后事件
        this.doModuleEvent('onRender');
        //首次渲染
        if (firstRender) {
            this.doModuleEvent('onFirstRender');
        }
        //渲染树为空，从html卸载
        if (!this.domManager.renderedTree) {
            this.unmount();
            return;
        }
        //已经挂载
        if (this.state === EModuleState.MOUNTED) {
            if (oldTree && this.model) {
                //新旧渲染树节点diff
                const changeDoms = DiffTool.compare(this.domManager.renderedTree, oldTree);
                //执行更改
                if (changeDoms.length > 0) {
                    //html节点更新前事件
                    this.doModuleEvent('onBeforeUpdate');
                    Renderer.handleChangedDoms(this, changeDoms);
                    //html节点更新后事件
                    this.doModuleEvent('onUpdate');
                }
            }
        }
        else { //未挂载
            this.mount();
        }
    }
    /**
     * 添加子模块
     * @param module -    模块id或模块
     */
    addChild(module) {
        if (typeof module === 'number') {
            module = ModuleFactory.get(module);
        }
        if (module) {
            if (!this.children.includes(module.id)) {
                this.children.push(module.id);
                module.parentId = this.id;
            }
        }
    }
    /**
     * 移除子模块
     * @param module -    子模块
     */
    removeChild(module) {
        const ind = this.children.indexOf(module.id);
        if (ind !== -1) {
            module.unmount();
            this.children.splice(ind, 1);
        }
    }
    /**
     * 激活模块(准备渲染)
     */
    active() {
        //如果为unmounted，则设置为准备好状态
        if (this.state === EModuleState.UNMOUNTED || this.state === EModuleState.INIT) {
            this.state = EModuleState.READY;
        }
        Renderer.add(this);
    }
    /**
     * 挂载到document
     */
    mount() {
        //执行挂载前事件
        this.doModuleEvent('onBeforeMount');
        //渲染到fragment
        const rootEl = new DocumentFragment();
        const el = Renderer.renderToHtml(this, this.domManager.renderedTree, rootEl, true);
        //主模块，直接添加到根模块
        if (this === ModuleFactory.getMain()) {
            Renderer.getRootEl().appendChild(el);
        }
        else if (this.srcDom) { //挂载到父模块中
            const pm = this.getParent();
            this.srcElement = pm.getElement(this.srcDom.key);
            if (this.srcElement && this.srcElement.parentElement) {
                this.srcElement.parentElement.replaceChild(el, this.srcElement);
                pm.saveElement(this.srcDom, el);
            }
        }
        //执行挂载后事件
        this.doModuleEvent('onMount');
        this.state = EModuleState.MOUNTED;
    }
    /**
     * 从document移除
     */
    unmount() {
        // 主模块或状态为unmounted的模块不用处理
        if (this.state === EModuleState.UNMOUNTED || ModuleFactory.getMain() === this) {
            return;
        }
        //从render列表移除
        Renderer.remove(this);
        //清空event factory
        this.eventFactory.clear();
        //执行卸载前事件
        this.doModuleEvent('onBeforeUnMount');
        //module根与源el切换
        const el = this.getElement(1);
        if (el) {
            if (this.srcDom) {
                const pm = this.getParent();
                if (el.parentElement) {
                    el.parentElement.replaceChild(this.srcElement, el);
                    pm.saveElement(this.srcDom, this.srcElement);
                }
            }
        }
        this.domManager.reset();
        //设置状态
        this.state = EModuleState.UNMOUNTED;
        //子模块递归卸载
        if (this.children) {
            for (const id of this.children) {
                const m = ModuleFactory.get(id);
                if (m) {
                    m.unmount();
                }
            }
        }
        //执行卸载后事件
        this.doModuleEvent('onUnMount');
    }
    /**
     * 获取父模块
     * @returns     父模块
     */
    getParent() {
        if (this.parentId) {
            return ModuleFactory.get(this.parentId);
        }
    }
    /**
     * 执行模块事件
     * @param eventName -   事件名
     * @returns             执行结果
     */
    doModuleEvent(eventName) {
        const foo = this[eventName];
        if (foo && typeof foo === 'function') {
            return foo.apply(this, [this.model]);
        }
    }
    /**
     * 获取模块方法
     * @param name -    方法名
     * @returns         方法
     */
    getMethod(name) {
        return this[name];
    }
    /**
     * 设置props
     * @param props -   属性值
     * @param dom -     子模块对应渲染后节点
     */
    setProps(props, dom) {
        const dataObj = props['$data'];
        delete props['$data'];
        //props数据复制到模块model
        if (dataObj) {
            for (const d of Object.keys(dataObj)) {
                this.model[d] = dataObj[d];
            }
        }
        //保留src dom
        this.srcDom = dom;
        //如果不存在旧的props，则change为true，否则初始化为false
        let change = false;
        if (!this.props) {
            change = true;
        }
        else {
            for (const k of Object.keys(props)) {
                // object 默认改变
                if (props[k] !== this.props[k]) {
                    change = true;
                }
            }
        }
        //保存事件数组
        this.events = dom.vdom.events;
        //props发生改变或unmounted，激活模块
        //如果属于slot，则由所属slot触发渲染
        if ((change || this.state === EModuleState.UNMOUNTED) && !dom.rmid) {
            this.active();
        }
        //保存props
        this.props = props;
    }
    /**
     * 编译
     */
    compile() {
        //注册子模块
        if (this.modules && Array.isArray(this.modules)) {
            for (const cls of this.modules) {
                ModuleFactory.addClass(cls);
            }
            delete this.modules;
        }
        if (!this.oldTemplate) {
            return;
        }
        //重置初始domkey
        this.domKeyId = 0;
        //清空孩子节点
        this.children = [];
        //清理css url
        CssManager.clearModuleRules(this);
        //清除dom参数
        this.objectManager.clearAllDomParams();
        //编译
        this.domManager.vdomTree = new Compiler(this).compile(this.oldTemplate);
        if (!this.domManager.vdomTree) {
            return;
        }
        //添加从源dom传递的事件
        if (this.events) {
            for (const ev of this.events) {
                this.domManager.vdomTree.addEvent(ev);
            }
        }
        //增加编译后事件
        this.doModuleEvent('onCompile');
    }
    /**
     * 设置不渲染到根dom的属性集合
     * @param props -   待移除的属性名属组
     */
    setExcludeProps(props) {
        this.excludedProps = props;
    }
    /**
     * 处理根节点属性
     * @param src -     编译节点
     * @param dst -     dom节点
     */
    handleRootProps(src, dst) {
        //已合并属性集合
        const added = {};
        if (src.props && src.props.size > 0) {
            for (const k of src.props) {
                let value;
                if (this.excludedProps && this.excludedProps.includes(k[0])) {
                    continue;
                }
                if (k[1] instanceof Expression) {
                    value = k[1].val(this, dst.model);
                }
                else {
                    value = k[1];
                }
                // 合并属性
                if (this.props && this.props.hasOwnProperty(k[0])) {
                    let v = this.props[k[0]];
                    if (v) {
                        if ('style' === k[0]) {
                            v = v.trim();
                            if (!value) {
                                value = v;
                            }
                            else {
                                value = (value + ';' + v).replace(/;{2,}/g, ';');
                            }
                        }
                        else if ('class' === k[0]) {
                            v = v.trim();
                            if (!value) {
                                value = v;
                            }
                            else {
                                value += ' ' + v;
                            }
                        }
                        else {
                            value = v;
                        }
                    }
                    // 设置已处理标志
                    added[k[0]] = true;
                }
                dst.props[k[0]] = value;
            }
        }
        if (this.props) {
            //处理未添加的属性
            for (const p of Object.keys(this.props)) {
                if (added[p] || this.excludedProps && this.excludedProps.includes(p)) {
                    continue;
                }
                dst.props[p] = this.props[p];
            }
        }
    }
    /**
     * 获取html节点
     * @remarks
     * 当key为数字或字符串时，表示dom key，当key为对象时，表示根据dom属性进行查找
     *
     * @param key - dom key 或 props键值对
     * @returns     html节点
     */
    getElement(key) {
        return this.domManager.getElement(key);
    }
    /**
     * 保存html节点
     * @param key -   dom key
     * @param node -  html节点
     */
    saveElement(dom, node) {
        this.domManager.saveElement(dom, node);
        //当路由dom所属moduleid与当前moduleid不一致时，需要在路由dom所属模块进行存储
        if (dom.props && dom.props['role'] === 'router' && dom.props['belong'] && dom.props['belong'] !== this.id) {
            const m = ModuleFactory.get(dom.props['belong']);
            if (m) {
                m.saveElement(dom, node);
            }
        }
    }
    /**
     * 按模块类名获取子模块
     * @remarks
     * 找到第一个满足条件的子模块，如果deep=true，则深度优先
     *
     * 如果attrs不为空，则同时需要匹配子模块属性
     *
     * @example
     * ```html
     *  <div>
     *      <Module1 />
     *      //other code
     *      <Module1 v1='a' v2='b' />
     *  </div>
     * ```
     * ```js
     *  const m = getModule('Module1',true, {v1:'a'});
     *  //m 为模板中的第二个Module1
     * ```
     * @param name -    子模块类名或别名
     * @param deep -    是否深度获取
     * @param attrs -   属性集合
     *
     * @returns         符合条件的子模块或undefined
     */
    getModule(name, deep, attrs) {
        if (!this.children) {
            return;
        }
        const cls = ModuleFactory.getClass(name);
        if (!cls) {
            return;
        }
        return find(this);
        /**
         * 查询
         * @param mdl -   模块
         * @returns     符合条件的子模块
         */
        function find(mdl) {
            for (const id of mdl.children) {
                const m = ModuleFactory.get(id);
                if (m) {
                    if (m.constructor === cls) {
                        if (attrs) { //属性集合不为空
                            //全匹配标识
                            let matched = true;
                            for (const k of Object.keys(attrs)) {
                                if (!m.props || m.props[k] !== attrs[k]) {
                                    matched = false;
                                    break;
                                }
                            }
                            if (matched) {
                                return m;
                            }
                        }
                        else {
                            return m;
                        }
                    }
                    //递归查找
                    if (deep) {
                        const r = find(m);
                        if (r) {
                            return r;
                        }
                    }
                }
            }
        }
    }
    /**
     * 获取模块类名对应的所有子模块
     * @param className -   子模块类名
     * @param deep -        深度查询
     */
    getModules(className, deep) {
        if (!this.children) {
            return;
        }
        const arr = [];
        find(this);
        return arr;
        /**
         * 查询
         * @param module -
         */
        function find(module) {
            if (!module.children) {
                return;
            }
            for (const id of module.children) {
                const m = ModuleFactory.get(id);
                if (m && m.constructor) {
                    if (m.constructor.name === className) {
                        arr.push(m);
                    }
                    if (deep) {
                        find(m);
                    }
                }
            }
        }
    }
    /**
     * 监听model
     * @remarks
     * 参数个数可变，如果第一个参数为属性名，则第二个参数为钩子函数，第三个参数为deep，默认model为根模型
     *
     * 否则按照参数说明
     * @param model -     模型或属性
     * @param key -       属性/属性数组，支持多级属性
     * @param operate -   钩子函数
     * @param deep -      是否深度监听
     * @returns           回收监听器函数，执行后取消监听
     */
    watch(model, key, operate, deep) {
        //是model才能watch，否则watch根model
        if (model['__key']) {
            return this.modelManager.watch(model, key, operate, deep);
        }
        else {
            return this.modelManager.watch(this.model, model, key, operate);
        }
    }
    /**
     * 设置模型属性值
     * @remarks
     * 参数个数可变，如果第一个参数为属性名，则第二个参数为属性值，默认model为根模型，否则按照参数说明
     *
     * @param model -     模型
     * @param key -       子属性，可以分级，如 name.firstName
     * @param value -     属性值
     */
    set(model, key, value) {
        if (typeof key === 'string') {
            this.modelManager.set(model, key, value);
        }
        else {
            this.modelManager.set(this.model, model, key);
        }
    }
    /**
     * 获取模型属性值
     * @remarks
     * 参数个数可变，如果第一个参数为属性名，默认model为根模型，否则按照参数说明
     *
     * @param model -   模型
     * @param key -     属性名，可以分级，如 name.firstName，如果为null，则返回自己
     * @returns         属性值
     */
    get(model, key) {
        if (typeof key === 'string') {
            return this.modelManager.get(model, key);
        }
        else {
            return this.modelManager.get(this.model, model);
        }
    }
    /**
     * 调用模块内方法
     * @remarks
     * 参数个数可变，参数个数最多10个
     *
     * @param methodName -  方法名
     * @param args -        参数
     */
    invokeMethod(methodName, ...args) {
        if (typeof this[methodName] === 'function') {
            return this[methodName](...args);
        }
    }
    /**
     * 调用模块外方法
     * @remarks
     * 当该模块作为子模块使用时，调用方法属于使用此模块的模板对应的模块
     *
     * 对于下面的例子，模块`Module1`需要调用模块`Main`的`outerFoo方法`，则采用`invokeOuterMethod`进行调用。
     * @example
     * ```js
     *  //Module1
     *  class Module1 extends Module{
     *      //your code
     *  }
     *
     *  //Main
     *  class Main extends Module{
     *      modules=[Module1];
     *      template(){
     *          return `
     *              <div>
     *                  <Module1 />
     *              </div>
     *          `
     *      }
     *      outerFoo(){
     *
     *      }
     *  }
     *
     * ```
     * @param methodName -  方法名
     * @param args -        参数
     * @returns             方法返回值
     */
    invokeOuterMethod(methodName, ...args) {
        if (!this.templateModuleId) {
            return;
        }
        const m = ModuleFactory.get(this.templateModuleId);
        if (!m) {
            return;
        }
        return m.invokeMethod(methodName, ...args);
    }
    /**
     * 获取模块当前dom key编号
     * @remarks
     * 主要在手动增加节点时需要，避免key重复
     * @returns   key编号
     */
    getDomKeyId() {
        return ++this.domKeyId;
    }
}

/**
 * 路由管理类
 */
class Router {
    /**
     * 构造器
     * @param basePath -          路由基础路径，显示的完整路径为 basePath + route.path
     * @param defaultEnter -      默认进入时事件函数，传递参数： module,离开前路径
     * @param defaultLeave -      默认离开时事件函数，传递参数： module,进入时路径
     */
    constructor(basePath, defaultEnter, defaultLeave) {
        /**
         * 根路由
         */
        this.root = new Route();
        /**
         * path等待链表
         */
        this.waitList = [];
        /**
         * 激活Dom map
         * key: path
         * value: object，格式为：
         * ```js
         *  {
         *      moduleId:dom所属模板模块id，
         *      model:对应model,
         *      field:激活字段名
         *  }
         * ```
         */
        this.activeModelMap = new Map();
        /**
         * 绑定到module的router指令对应的key，即router容器对应的key，格式为:
         * ```js
         *  {
         *      moduleId:{
         *          mid:router所在模块id,
         *          key:routerKey(路由key),
         *          paths:active路径数组
         *          wait:{mid:待渲染的模块id,path:route.path}
         *      }
         *      ,...
         *  }
         * ```
         *  moduleId: router所属模块id（如果为slot且slot不是innerRender，则为模板对应模块id，否则为当前模块id）
         */
        this.routerMap = new Map();
        this.basePath = basePath;
        this.onDefaultEnter = defaultEnter;
        this.onDefaultLeave = defaultLeave;
        //添加popstate事件
        window.addEventListener('popstate', () => {
            //根据state切换module
            const state = history.state;
            if (!state) {
                return;
            }
            this.startType = 1;
            this.go(state.url);
        });
    }
    /**
     * 跳转
     * @remarks
     * 只是添加到跳转列表，并不会立即进行跳转
     *
     * @param path -    路径
     * @param type -    启动路由类型，参考startType，默认0
     */
    go(path) {
        // 当前路径的父路径不处理
        if (this.currentPath && this.currentPath.startsWith(path)) {
            return;
        }
        //添加路径到等待列表，已存在，不加入
        if (this.waitList.indexOf(path) === -1) {
            this.waitList.push(path);
        }
        //延迟加载，避免同一个路径多次加载
        setTimeout(() => {
            this.load();
        }, 0);
    }
    /**
     * 启动加载
     */
    load() {
        //在加载，或无等待列表，则返回
        if (this.waitList.length === 0) {
            return;
        }
        //从等待队列拿路径加载
        this.start(this.waitList.shift()).then(() => {
            //继续加载
            this.load();
        });
    }
    /**
     * 切换路由
     * @param path - 	路径
     */
    start(path) {
        return __awaiter(this, void 0, void 0, function* () {
            // 当前路径的父路径不处理
            if (this.currentPath && this.currentPath.startsWith(path)) {
                return;
            }
            const diff = this.compare(this.currentPath, path);
            // 不存在上一级模块,则为主模块，否则为上一级模块
            let parentModule = diff[0] === null ? ModuleFactory.getMain() : yield this.getModule(diff[0]);
            //onleave事件，从末往前执行
            for (let i = diff[1].length - 1; i >= 0; i--) {
                const r = diff[1][i];
                if (!r.module) {
                    continue;
                }
                const module = yield this.getModule(r);
                if (Util.isFunction(this.onDefaultLeave)) {
                    this.onDefaultLeave(module, this.currentPath);
                }
                if (Util.isFunction(r.onLeave)) {
                    r.onLeave(module, this.currentPath);
                }
                //从父模块移除
                const pm = module.getParent();
                if (pm) {
                    pm.removeChild(module);
                }
                // 取消挂载
                module.unmount();
            }
            if (diff[2].length === 0) { //路由相同，参数不同
                const route = diff[0];
                if (route !== null) {
                    const module = yield this.getModule(route);
                    // 模块处理
                    this.dependHandle(module, route, diff[3] ? diff[3].module : null);
                }
            }
            else { //路由不同
                //加载模块
                for (let ii = 0; ii < diff[2].length; ii++) {
                    const route = diff[2][ii];
                    //路由不存在或路由没有模块（空路由）
                    if (!route || !route.module) {
                        continue;
                    }
                    const module = yield this.getModule(route);
                    // 模块处理
                    this.dependHandle(module, route, parentModule);
                    //默认全局路由enter事件
                    if (Util.isFunction(this.onDefaultEnter)) {
                        this.onDefaultEnter(module, path);
                    }
                    //当前路由进入事件
                    if (Util.isFunction(route.onEnter)) {
                        route.onEnter(module, path);
                    }
                    parentModule = module;
                }
            }
            //如果是history popstate或新路径是当前路径的子路径，则不加入history
            if (this.startType !== 1) {
                const path1 = (this.basePath || '') + path;
                //子路由或父路由，替换state
                if (path.startsWith(this.currentPath)) {
                    history.replaceState({ url: path1 }, '', path1);
                }
                else { //路径push进history
                    history.pushState({ url: path1 }, '', path1);
                }
            }
            //修改currentPath
            this.currentPath = path;
            //设置start类型为正常start
            this.startType = 0;
        });
    }
    /**
     * 获取module
     * @param route - 路由对象
     * @returns     路由对应模块
     */
    getModule(route) {
        return __awaiter(this, void 0, void 0, function* () {
            let module = route.module;
            //已经是模块实例
            if (typeof module === 'object') {
                return module;
            }
            //模块路径
            if (typeof module === 'string') {
                module = yield ModuleFactory.load(module);
            }
            //模块类
            if (typeof module === 'function') {
                route.module = ModuleFactory.get(module);
            }
            return route.module;
        });
    }
    /**
     * 比较两个路径对应的路由链
     * @param path1 - 	第一个路径
     * @param path2 - 	第二个路径
     * @returns 		数组 [父路由或不同参数的路由，需要销毁的路由数组，需要增加的路由数组，不同参数路由的父路由]
     */
    compare(path1, path2) {
        // 获取路由id数组
        let arr1 = null;
        let arr2 = null;
        if (path1) {
            //采用克隆方式复制，避免被第二个路径返回的路由覆盖参数
            arr1 = this.getRouteList(path1, true);
        }
        if (path2) {
            arr2 = this.getRouteList(path2);
        }
        let len = 0;
        if (arr1 !== null) {
            len = arr1.length;
        }
        if (arr2 !== null) {
            if (arr2.length < len) {
                len = arr2.length;
            }
        }
        else {
            len = 0;
        }
        //需要销毁的旧路由数组
        let retArr1 = [];
        //需要加入的新路由数组
        let retArr2 = [];
        let i = 0;
        for (i = 0; i < len; i++) {
            //找到不同路由开始位置
            if (arr1[i].id === arr2[i].id) {
                //比较参数
                if (JSON.stringify(arr1[i].data) !== JSON.stringify(arr2[i].data)) {
                    i++;
                    break;
                }
            }
            else {
                break;
            }
        }
        //旧路由改变数组
        if (arr1 !== null) {
            retArr1 = arr1.slice(i);
        }
        //新路由改变数组（相对于旧路由）
        if (arr2 !== null) {
            retArr2 = arr2.slice(i);
        }
        //上一级路由或参数不同的当前路由
        let p1 = null;
        //上二级路由或参数不同路由的上一级路由
        let p2 = null;
        if (arr2 && i > 0) {
            // 可能存在空路由，需要向前遍历
            for (let j = i - 1; j >= 0; j--) {
                if (!p1) {
                    if (arr2[j].module) {
                        p1 = arr2[j];
                        continue;
                    }
                }
                else if (!p2) {
                    if (arr2[j].module) {
                        p2 = arr2[j];
                        break;
                    }
                }
            }
        }
        return [p1, retArr1, retArr2, p2];
    }
    /**
     * 添加激活对象
     * @param moduleId -  模块id
     * @param path -      路由路径
     * @param model -     激活字段所在model
     * @param field -     字段名
     */
    addActiveModel(moduleId, path, model, field) {
        if (!model || !field) {
            return;
        }
        //保存path对应active 模型信息
        this.activeModelMap.set(path, { moduleId: moduleId, model: model, field: field });
        //保存path到routerMap
        if (this.routerMap.has(moduleId)) {
            const o = this.routerMap.get(moduleId);
            if (!o['paths']) {
                o['paths'] = [path];
            }
            else {
                if (!o['paths'].includes(path)) {
                    o['paths'].push(path);
                }
            }
        }
        else {
            this.routerMap.set(moduleId, { paths: [path] });
        }
    }
    /**
     * 依赖模块相关处理
     * @param module - 	模块
     * @param pm -        依赖模块
     * @param path - 		view对应的route路径
     */
    dependHandle(module, route, pm) {
        //设置参数
        const o = {
            path: route.path
        };
        if (!Util.isEmpty(route.data)) {
            o['data'] = route.data;
        }
        module.model['$route'] = o;
        if (pm) {
            const mobj = this.routerMap.get(pm.id);
            //尚未渲染，添加到等待渲染对象
            if (!mobj) {
                this.routerMap.set(pm.id, { wait: { mid: module.id, path: route.path } });
                // this.waitedRenderMap.set(pm.id,);
            }
            else {
                //得到router实际所在module
                pm = ModuleFactory.get(mobj['mid']);
                module.srcDom = mobj['dom'].children[0];
                pm.addChild(module);
                //激活
                module.active();
                this.setDomActive(route.fullPath);
            }
        }
    }
    /**
     * 设置路由元素激活属性
     * @param module -    模块
     * @param path -      路径
     * @returns
     */
    setDomActive(path) {
        if (!this.activeModelMap.has(path)) {
            return;
        }
        const obj = this.activeModelMap.get(path);
        if (!this.routerMap.has(obj['moduleId'])) {
            return;
        }
        //获取模块 active path数组
        const arr = this.routerMap.get(obj['moduleId'])['paths'];
        if (!arr) {
            return;
        }
        //当前路径对应model置true
        obj['model'][obj['field']] = true;
        //同模块下的其他路径对应model置false
        for (const p of arr) {
            if (p !== path && this.activeModelMap.has(p)) {
                const o = this.activeModelMap.get(p);
                o['model'][o['field']] = false;
            }
        }
    }
    /**
     * 获取路由数组
     * @param path - 	要解析的路径
     * @param clone - 是否clone，如果为false，则返回路由树的路由对象，否则返回克隆对象
     * @returns     路由对象数组
     */
    getRouteList(path, clone) {
        if (!this.root) {
            return [];
        }
        const pathArr = path.split('/');
        let node = this.root;
        let paramIndex = 0; //参数索引
        const retArr = [];
        let fullPath = ''; //完整路径
        let preNode = this.root; //前一个节点
        for (let i = 0; i < pathArr.length; i++) {
            const v = pathArr[i].trim();
            if (v === '') {
                continue;
            }
            let find = false;
            for (let j = 0; j < node.children.length; j++) {
                if (node.children[j].path === v) {
                    //设置完整路径
                    if (preNode !== this.root) {
                        preNode.fullPath = fullPath;
                        preNode.data = node.data;
                        retArr.push(preNode);
                    }
                    //设置新的查找节点
                    node = clone ? node.children[j].clone() : node.children[j];
                    //参数清空
                    node.data = {};
                    preNode = node;
                    find = true;
                    //参数索引置0
                    paramIndex = 0;
                    break;
                }
            }
            //路径叠加
            fullPath += '/' + v;
            //不是孩子节点,作为参数
            if (!find) {
                if (paramIndex < node.params.length) { //超出参数长度的废弃
                    node.data[node.params[paramIndex++]] = v;
                }
            }
        }
        //最后一个节点
        if (node !== this.root) {
            node.fullPath = fullPath;
            retArr.push(node);
        }
        return retArr;
    }
    /**
     * 获取根路由
     * @returns     根路由对象
     */
    getRoot() {
        return this.root;
    }
    /**
     * 注册路由容器
     * @param moduleId -      模块id
     * @param module -        路由实际所在模块（当使用slot时，与moduleId对应模块不同）
     * @param key -           路由容器key
     */
    registRouter(moduleId, module, dom) {
        let obj;
        if (!this.routerMap.has(moduleId)) {
            obj = { mid: module.id, dom: dom };
            this.routerMap.set(moduleId, obj);
        }
        else {
            obj = this.routerMap.get(moduleId);
            obj.mid = module.id;
            obj.dom = dom;
        }
        if (obj.wait) {
            const m = ModuleFactory.get(obj.wait.mid);
            m.srcDom = dom.children[0];
            module.addChild(m);
            //激活
            m.active();
            //处理带active属性的dom
            this.setDomActive(obj.path);
            //执行后删除
            delete obj.wait;
        }
    }
    /**
     * 尝试激活路径
     * @param path -  待激活的路径
     */
    activePath(path) {
        // 如果当前路径为空或待激活路径是当前路径的子路径
        if (!this.currentPath || path.startsWith(this.currentPath)) {
            this.go(path);
        }
    }
}

/**
 * module 元素
 * @remarks
 * module指令标签，用`<module name='class name' /> 代替 x-module='class name'`
 */
class MODULE extends DefineElement {
    constructor(node, module) {
        super(node, module);
        //类名
        const clazz = node.getProp('name');
        if (!clazz) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'MODULE', 'className');
        }
        node.delProp('name');
        node.addDirective(new Directive('module', clazz, module.id));
    }
}
/**
 * for 元素
 * @remarks
 * repeat指令标签，用`<for cond={{your expression}} /> 代替 x-repeat={{your expression}}`
 */
class FOR extends DefineElement {
    constructor(node, module) {
        super(node, module);
        //条件
        const cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'FOR', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('repeat', cond, module.id));
    }
}
/**
 * 递归元素
 * @remarks
 * recur指令标签，用`<recur cond='recur field' /> 代替 x-recur='recur field'`
 */
class RECUR extends DefineElement {
    constructor(node, module) {
        super(node, module);
        //条件
        const cond = node.getProp('cond');
        node.delProp('cond');
        node.addDirective(new Directive('recur', cond, module.id));
    }
}
/**
 * IF 元素
 * @remarks
 * if指令标签，用`<if cond={{your expression}} /> 代替 x-if={{your expression}}`
 */
class IF extends DefineElement {
    constructor(node, module) {
        super(node, module);
        //条件
        const cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'IF', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('if', cond, module.id));
    }
}
/**
 * ELSE 元素
 * @remarks
 * else指令标签，用`<else/> 代替 x-else`
 */
class ELSE extends DefineElement {
    constructor(node, module) {
        super(node, module);
        node.addDirective(new Directive('else', null, module.id));
    }
}
/**
 * ELSEIF 元素
 * @remarks
 * elseif指令标签，用`<elseif cond={{your expression}} /> 代替 x-elseif={{your expression}}`
 */
class ELSEIF extends DefineElement {
    constructor(node, module) {
        super(node, module);
        //条件
        const cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'ELSEIF', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('elseif', cond, module.id));
    }
}
/**
 * ENDIF 元素
 * @remarks
 * endif指令标签，用`<endif /> 代替 x-endif`
 */
class ENDIF extends DefineElement {
    constructor(node, module) {
        super(node, module);
        node.addDirective(new Directive('endif', null, module.id));
    }
}
/**
 * SHOW 元素
 * @remarks
 * show指令标签，用`<show cond={{your expression}} /> 代替 x-show={{your expression}}`
 */
class SHOW extends DefineElement {
    constructor(node, module) {
        super(node, module);
        //条件
        const cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'SHOW', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('show', cond, module.id));
    }
}
/**
 * 插槽
 * @remarks
 * slot指令标签，用`<slot name='slotname' > 代替 x-slot='slotname'`
 */
class SLOT extends DefineElement {
    constructor(node, module) {
        super(node, module);
        //条件
        const cond = node.getProp('name') || 'default';
        node.delProp('name');
        node.addDirective(new Directive('slot', cond, module.id));
    }
}
/**
 * 路由
 * @remarks
 * route指令标签，用`<route path='routepath' > 代替 x-route='routepath'`
 */
class ROUTE extends DefineElement {
    constructor(node, module) {
        //默认标签为a
        if (!node.hasProp('tag')) {
            node.setProp('tag', 'a');
        }
        super(node, module);
        //条件
        const cond = node.getProp('path');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'ROUTE', 'path');
        }
        node.addDirective(new Directive('route', cond, module.id));
    }
}
/**
 * 路由容器
 * @remarks
 * router指令标签，用`<router /> 代替 x-router`
 */
class ROUTER extends DefineElement {
    constructor(node, module) {
        super(node, module);
        node.addDirective(new Directive('router', null, module.id));
    }
}
//添加到自定义元素管理器
DefineElementManager.add([MODULE, FOR, RECUR, IF, ELSE, ELSEIF, ENDIF, SHOW, SLOT, ROUTE, ROUTER]);

/**
     * 指令类型初始化
     * @remarks
     * 每个指令类型都有一个名字、处理函数和优先级，处理函数`不能用箭头函数`
     * 处理函数在渲染时执行，包含两个参数 module(模块)、dom(目标虚拟dom)
     * 处理函数的this指向指令对象
     * 处理函数的返回值`true`表示继续，`false`表示后续指令不再执行，同时该节点不加入渲染树
     */
(function () {
    /**
     * module 指令
     * 用于指定该元素为模块容器，表示子模块
     * 用法 x-module='模块类名'
     */
    Nodom.createDirective('module', function (module, dom) {
        let m;
        //存在moduleId，表示已经渲染过，不渲染
        let mid = module.objectManager.getDomParam(dom.key, 'moduleId');
        if (mid) {
            m = ModuleFactory.get(mid);
        }
        else {
            const cls = this.value;
            m = ModuleFactory.get(cls);
            if (!m) {
                return true;
            }
            m.templateModuleId = this.templateModuleId;
            mid = m.id;
            //保留modelId
            module.objectManager.setDomParam(dom.key, 'moduleId', mid);
            Renderer.getCurrentModule().addChild(m);
        }
        //保存到dom上，提升渲染性能
        dom.moduleId = mid;
        //记录位置
        //设置props，如果改变了props，启动渲染
        const o = {};
        if (dom.props) {
            for (const p of Object.keys(dom.props)) {
                const v = dom.props[p];
                if (p[0] === '$') { //数据
                    if (!o['$data']) {
                        o['$data'] = {};
                    }
                    o['$data'][p.substring(1)] = v;
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
        return true;
    }, 8);
    /**
     *  model指令
     */
    Nodom.createDirective('model', function (module, dom) {
        const model = module.get(dom.model, this.value);
        if (model) {
            dom.model = model;
        }
        return true;
    }, 1);
    /**
     * 指令名 repeat
     * 描述：重复指令
     */
    Nodom.createDirective('repeat', function (module, dom) {
        const rows = this.value;
        // 无数据不渲染
        if (!Util.isArray(rows) || rows.length === 0) {
            return false;
        }
        const src = dom.vdom;
        //索引名
        const idxName = src.getProp('index');
        const parent = dom.parent;
        //禁用该指令
        this.disabled = true;
        //避免在渲染时对src设置了model，此处需要删除
        for (let i = 0; i < rows.length; i++) {
            if (!rows[i]) {
                continue;
            }
            if (idxName && typeof rows[i] === 'object') {
                rows[i][idxName] = i;
            }
            const d = Renderer.renderDom(module, src, rows[i], parent, rows[i].__key);
            //删除index属性
            if (idxName) {
                delete d.props['index'];
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
     *      <element1>...</element1>
     *      <element2>...</element2>
     *      <recur ref='r1' />
     * </recur>
     * ```
     */
    Nodom.createDirective('recur', function (module, dom) {
        const src = dom.vdom;
        //当前节点是递归节点存放容器
        if (dom.props.hasOwnProperty('ref')) {
            //如果出现在repeat中，src为单例，需要在使用前清空子节点，避免沿用上次的子节点
            src.children = [];
            //递归存储名
            const name = '$recurs.' + (dom.props['ref'] || 'default');
            const node = module.objectManager.get(name);
            if (!node) {
                return true;
            }
            const model = dom.model;
            const cond = node.getDirective('recur');
            const m = model[cond.value];
            //不存在子层数组，不再递归
            if (!m) {
                return true;
            }
            //克隆，后续可以继续用
            const node1 = node.clone();
            node1.removeDirective('recur');
            dom.children || (dom.children = []);
            if (!Array.isArray(m)) { //非数组recur
                Renderer.renderDom(module, node1, m, dom, m.__key);
            }
            else { //数组内recur，依赖repeat得到model，repeat会取一次数组元素，所以需要dom model
                Renderer.renderDom(module, node1, model, dom, m['__key']);
            }
            //删除ref属性
            delete dom.props['ref'];
        }
        else { //递归节点
            const data = dom.model[this.value];
            if (!data) {
                return true;
            }
            //递归名，默认default
            const name = '$recurs.' + (dom.props['name'] || 'default');
            //删除name属性
            delete dom.props['name'];
            //保存递归定义的节点
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
    Nodom.createDirective('if', function (module, dom) {
        if (!dom.parent) {
            return;
        }
        module.objectManager.setDomParam(dom.parent.key, '$if', this.value);
        return this.value;
    }, 5);
    /**
     * 指令名 else
     * 描述：else指令
     */
    Nodom.createDirective('else', function (module, dom) {
        if (!dom.parent) {
            return;
        }
        return !module.objectManager.getDomParam(dom.parent.key, '$if');
    }, 5);
    /**
     * elseif 指令
     */
    Nodom.createDirective('elseif', function (module, dom) {
        if (!dom.parent) {
            return;
        }
        const v = module.objectManager.getDomParam(dom.parent.key, '$if');
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
    Nodom.createDirective('endif', function (module, dom) {
        if (!dom.parent) {
            return;
        }
        module.objectManager.removeDomParam(dom.parent.key, '$if');
        //endif 不显示
        return false;
    }, 5);
    /**
     * 指令名 show
     * 描述：显示指令
     */
    Nodom.createDirective('show', function (module, dom) {
        //show指令参数 {origin:通过style设置的初始display属性,rendered:是否渲染过}
        let showParam = module.objectManager.getDomParam(dom.key, '$show');
        //为false且未渲染过，则不渲染
        if (!this.value && (!showParam || !showParam['rendered'])) {
            return false;
        }
        if (!showParam) {
            showParam = {};
            module.objectManager.setDomParam(dom.key, '$show', showParam);
        }
        let style = dom.props['style'];
        const reg = /display\s*\:[\w\-]+/;
        let regResult;
        let display;
        if (style) {
            regResult = reg.exec(style);
            //保存第一个style display属性
            if (regResult !== null) {
                const ra = regResult[0].split(':');
                display = ra[1].trim();
                //保存第一个display属性
                if (!showParam['origin'] && display !== 'none') {
                    showParam['origin'] = display;
                }
            }
        }
        // 渲染标识，value为false且尚未进行渲染，则不渲染
        if (!this.value) {
            if (style) {
                if (display) {
                    //把之前的display替换为none
                    if (display !== 'none') {
                        style = style.substring(0, regResult.index) + 'display:none' + style.substring(regResult.index + regResult[0].length);
                    }
                }
                else {
                    style += ';display:none';
                }
            }
            else {
                style = 'display:none';
            }
        }
        else {
            //设置渲染标志
            showParam['rendered'] = true;
            if (display === 'none') {
                if (style) {
                    if (showParam['origin']) {
                        style = style.substring(0, regResult.index) + 'display:' + showParam['origin'] + style.substring(regResult.index + regResult[0].length);
                    }
                    else {
                        style = style.substring(0, regResult.index) + style.substring(regResult.index + regResult[0].length);
                    }
                }
            }
        }
        if (style) {
            dom.props['style'] = style;
        }
        return true;
    }, 5);
    /**
     * 指令名 field
     * 描述：字段指令
     */
    Nodom.createDirective('field', function (module, dom) {
        dom.assets || (dom.assets = {});
        //修正staticnum
        if (dom.staticNum === 0) {
            dom.staticNum = 1;
        }
        const dataValue = module.get(dom.model, this.value);
        if (dom.tagName === 'select') {
            dom.props['value'] = dataValue;
            //延迟设置value，避免option尚未渲染
            setTimeout(() => {
                const el = module.domManager.getElement(dom.key);
                if (el) {
                    el.value = dataValue;
                }
            }, 0);
        }
        else if (dom.tagName === 'input') {
            switch (dom.props['type']) {
                case 'radio':
                    const value = dom.props['value'];
                    dom.props['name'] = this.value;
                    if (dataValue == value) {
                        dom.props['checked'] = 'checked';
                        dom.assets['checked'] = true;
                    }
                    else {
                        delete dom.props['checked'];
                        dom.assets['checked'] = false;
                    }
                    break;
                case 'checkbox':
                    //设置状态和value
                    const yv = dom.props['yes-value'];
                    //当前值为yes-value
                    if (dataValue == yv) {
                        dom.props['value'] = yv;
                        dom.assets['checked'] = true;
                    }
                    else { //当前值为no-value
                        dom.props['value'] = dom.props['no-value'];
                        dom.assets['checked'] = false;
                    }
                    break;
                default:
                    const v = (dataValue !== undefined && dataValue !== null) ? dataValue : '';
                    dom.props['value'] = v;
                    dom.assets['value'] = v;
            }
        }
        else {
            const v = (dataValue !== undefined && dataValue !== null) ? dataValue : '';
            dom.props['value'] = v;
            dom.assets['value'] = v;
        }
        //设置dom参数，避免二次添加事件
        if (!module.objectManager.getDomParam(dom.key, '$addedFieldEvent')) {
            module.objectManager.setDomParam(dom.key, '$addedFieldEvent', true);
            const event = new NEvent(null, 'change', function (model, dom) {
                const el = this.getElement(dom.key);
                if (!el) {
                    return;
                }
                const directive = dom.vdom.getDirective('field');
                const type = dom.props['type'];
                let field = directive.value;
                let v = el.value;
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
                const arr = field.split('.');
                if (arr.length === 1) {
                    model[field] = v;
                }
                else {
                    let temp = model;
                    field = arr.pop();
                    for (let i = 0; i < arr.length && temp; i++) {
                        temp = temp[arr[i]];
                    }
                    if (temp) {
                        temp[field] = v;
                    }
                }
            });
            dom.vdom.addEvent(event, 0);
        }
        return true;
    }, 10);
    /**
     * route指令
     */
    Nodom.createDirective('route', function (module, dom) {
        if (!Nodom['$Router']) {
            throw new NError('uninit', NodomMessage.TipWords.route);
        }
        //a标签需要设置href
        if (dom.tagName === 'a') {
            dom.props['href'] = 'javascript:void(0)';
        }
        dom.props['path'] = this.value;
        //有激活属性
        if (dom.props['active']) {
            const acName = dom.props['active'];
            delete dom.props['active'];
            //active 转expression
            const router = Nodom['$Router'];
            //添加激活model
            router.addActiveModel(module.id, this.value, dom.model, acName);
            //路由状态为激活，尝试激活路径
            if (dom.model[acName]) {
                router.activePath(this.value);
            }
        }
        //添加click事件,避免重复创建事件对象，创建后缓存
        let event = GlobalCache.get('$routeClickEvent');
        if (!event) {
            event = new NEvent(module, 'click', function (model, dom) {
                const path = dom.props['path'];
                if (Util.isEmpty(path)) {
                    return;
                }
                Nodom['$Router'].go(path);
            });
            GlobalCache.set('$routeClickEvent', event);
        }
        //为virtual dom添加事件
        dom.vdom.addEvent(event);
        return true;
    }, 10);
    /**
     * 增加router指令
     */
    Nodom.createDirective('router', function (module, dom) {
        if (!Nodom['$Router']) {
            throw new NError('uninit', NodomMessage.TipWords.route);
        }
        //建立新子节点            
        dom.children = [{
                key: dom.key + '_r',
                model: dom.model,
                props: { role: 'router', belong: module.id }
            }];
        Nodom['$Router'].registRouter(module.id, Renderer.getCurrentModule(), dom);
        return true;
    }, 10);
    /**
     * 插头指令
     * 用于模块中，可实现同名替换
     */
    Nodom.createDirective('slot', function (module, dom) {
        this.value || (this.value = 'default');
        const mid = dom.parent.moduleId;
        const src = dom.vdom;
        //父dom有module指令，表示为替代节点，替换子模块中的对应的slot节点；否则为子模块定义slot节点
        if (mid) {
            const m = ModuleFactory.get(mid);
            //子模块不存在或子模块没有此名字的slot，则不处理
            if (!m) {
                return false;
            }
            let sl = m.slots.get(this.value);
            // 子模块尚未渲染
            if (!sl) {
                if (!sl) {
                    sl = {
                        dom: dom,
                        vdom: src
                    };
                }
                dom.rmid = mid;
                m.slots.set(this.value, sl);
                return true;
            }
            else if (sl.type === 0) {
                sl.dom = dom;
                dom.rmid = mid;
                return true;
            }
            else {
                sl.vdom = src;
            }
            return false;
        }
        else { //源slot节点
            const cfg = module.slots.get(this.value);
            const type = src.hasProp('innerrender') ? 1 : 0;
            if (cfg) {
                cfg.type = type;
                if (type === 1) { //内部渲染
                    if (cfg.dom) {
                        for (const d of cfg.vdom.children) {
                            Renderer.renderDom(module, d, dom.model, dom.parent, dom.model['__key'] + 's');
                        }
                        return false;
                    }
                }
                else if (cfg.dom && cfg.dom.children) { //有祖先模块渲染后的节点，直接替换
                    if (dom.parent) {
                        for (let c of cfg.dom.children) {
                            dom.parent.children.push(c);
                            c.parent = dom.parent;
                        }
                    }
                    return false;
                }
            }
            module.slots.set(this.value, {
                type: type
            });
            //无替代节点，直接渲染
            return true;
        }
    }, 5);
}());

export { Compiler, CssManager, DefineElement, DefineElementManager, DiffTool, Directive, DirectiveManager, DirectiveType, EModuleState, EventFactory, Expression, GlobalCache, Model, ModelManager, Module, ModuleFactory, NCache, NError, NEvent, Nodom, NodomMessage, NodomMessage_en, NodomMessage_zh, Renderer, Route, Router, Scheduler, Util, VirtualDom };
//# sourceMappingURL=nodom.esm.js.map
