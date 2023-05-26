/**
 * 自定义元素管理器
 */
class DefineElementManager {
    /**
     * 添加自定义元素类
     * @param clazz     自定义元素类或类数组
     * @param alias     别名
     */
    static add(clazz, alias) {
        if (Array.isArray(clazz)) {
            for (let c of clazz) {
                this.elements.set(c.name.toUpperCase(), c);
            }
        }
        else {
            this.elements.set((alias || clazz.name).toUpperCase(), clazz);
        }
    }
    /**
     * 获取自定义元素类
     * @param tagName   元素名
     * @returns         自定义元素类
     */
    static get(tagName) {
        return this.elements.get(tagName.toUpperCase());
    }
    /**
     * 是否存在自定义元素
     * @param tagName   元素名
     * @returns         存在或不存在
     */
    static has(tagName) {
        return this.elements.has(tagName.toUpperCase());
    }
}
/**
 * 自定义element
 */
DefineElementManager.elements = new Map();

/**
 * 指令类
 */
class DirectiveType {
    /**
     * 构造方法
     * @param name      指令类型名
     * @param handle    渲染时执行方法
     * @param prio      类型优先级
     */
    constructor(name, handle, prio) {
        this.name = name;
        this.prio = prio >= 0 ? prio : 10;
        this.handle = handle;
    }
}

/**
 * 指令管理器
 */
class DirectiveManager {
    /**
     * 增加指令映射
     * @param name      指令类型名
     * @param handle    渲染处理函数
     * @param prio      类型优先级
     */
    static addType(name, handle, prio) {
        this.directiveTypes.set(name, new DirectiveType(name, handle, prio));
    }
    /**
     * 移除指令映射
     * @param name  指令类型名
     */
    static removeType(name) {
        this.directiveTypes.delete(name);
    }
    /**
     * 获取指令
     * @param name  指令类型名
     * @returns     指令类型或undefined
     */
    static getType(name) {
        return this.directiveTypes.get(name);
    }
    /**
     * 是否含有某个指令
     * @param name  指令类型名
     * @returns     true/false
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
 * 消息js文件 中文文件
 */
const NodomMessage_en = {
    /**
     * tip words
     */
    TipWords: {
        application: "Application",
        system: "System",
        module: "Module",
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
 * 消息js文件 中文文件
 */
const NodomMessage_zh = {
    /**
     * 提示单词
     */
    TipWords: {
        application: "应用",
        system: "系统",
        module: "模块",
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
 * 过滤器工厂，存储模块过滤器
 */
class ModuleFactory {
    /**
     * 添加模块到工厂
     * @param item  模块对象
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
     * @param name  类或实例id
     */
    static get(name) {
        let tp = typeof name;
        if (tp === 'number') { //数字，模块id
            return this.modules.get(name);
        }
        else {
            if (tp === 'string') { //字符串，模块类名
                if (!this.classes.has(name)) { //为别名
                    name = this.aliasMap.get(name);
                }
                if (this.classes.has(name)) {
                    return Reflect.construct(this.classes.get(name), []);
                }
            }
            else { //模块类
                return Reflect.construct(name, []);
            }
        }
    }
    /**
     * 是否存在模块类
     * @param clazzName     模块类名
     * @returns     true/false
     */
    static hasClass(clazzName) {
        const name = clazzName.toLowerCase();
        return this.classes.has(name) || this.aliasMap.has(name);
    }
    /**
     * 添加模块类
     * @param clazz     模块类
     * @param alias     注册别名
     */
    static addClass(clazz, alias) {
        //转换成小写
        let name = clazz.name.toLowerCase();
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
     * @param name  类名或别名
     * @returns     模块类
     */
    static getClass(name) {
        name = name.toLowerCase();
        return this.classes.has(name) ? this.classes.get(name) : this.classes.get(this.aliasMap.get(name));
    }
    /**
     * 装载module
     * @param modulePath    模块类路径
     * @return              模块类
     */
    static load(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let m = yield import(modulePath);
            if (m) {
                //通过import的模块，查找模块类
                for (let k of Object.keys(m)) {
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
     * @param id    模块id
     */
    static remove(id) {
        this.modules.delete(id);
    }
    /**
     * 设置主模块
     * @param m 	模块
     */
    static setMain(m) {
        this.mainModule = m;
    }
    /**
     * 获取主模块
     * @returns 	应用的主模块
     */
    static getMain() {
        return this.mainModule;
    }
}
/**
 * 模块对象集合 {moduleId:模块对象}}
 */
ModuleFactory.modules = new Map();
/**
 * 模块类集合 {className:模块类}
 */
ModuleFactory.classes = new Map();
/**
 * 别名map
 * key:     别名
 * value:   类名
 */
ModuleFactory.aliasMap = new Map();

/**
 * 表达式类
 */
class Expression {
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

/**
 * css 管理器
 * 针对不同的rule，处理方式不同
 * CssStyleRule 进行保存和替换，同时 scopeInModule(模块作用域)有效
 * CssImportRule 路径不重复添加，因为必须加在stylerule前面，所以需要记录最后的import索引号
 */
class CssManager {
    /**
     * 处理style 元素
     * @param module    模块
     * @param dom       虚拟dom
     * @param root      模块root dom
     * @param add       是否添加根模块类名
     * @returns         如果是styledom，则返回true，否则返回false
     */
    static handleStyleDom(module, dom, root, add) {
        if (dom.tagName.toLowerCase() !== 'style') {
            return false;
        }
        if (add) {
            let cls = this.cssPreName + module.id;
            if (root.props['class']) {
                root.props['class'] = dom.props['class'] + ' ' + cls;
            }
            else {
                root.props['class'] = cls;
            }
        }
        return true;
    }
    /**
     * 处理 style 下的文本元素
     * @param module    模块
     * @param dom       style text element
     * @returns         如果是styleTextdom返回true，否则返回false
     */
    static handleStyleTextDom(module, dom) {
        if (!dom.parent || dom.parent.tagName.toLowerCase() !== 'style') {
            return false;
        }
        //scope=this，在模块根节点添加 限定 class
        CssManager.addRules(module, dom.textContent, dom.parent.props['scope'] === 'this' ? '.' + this.cssPreName + module.id : undefined);
        return true;
    }
    /**
     * 添加多个css rule
     * @param cssText           rule集合
     * @param module            模块
     * @param scopeName         作用域名(前置选择器)
     */
    static addRules(module, cssText, scopeName) {
        //sheet 初始化
        if (!this.sheet) {
            //safari不支持 cssstylesheet constructor，用 style代替
            let sheet = document.createElement('style');
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
                    let txt = cssText.substring(startIndex, re.index + 1);
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
         * @param module         模块
         * @param cssText        css 文本
         * @param scopeName      作用域名(前置选择器)
         * @returns              如果css文本最后一个"{"前没有字符串，则返回void
         */
        function handleStyle(module, cssText, scopeName) {
            const reg = /.+(?=\{)/; //匹配字符"{"前出现的所有字符
            let r = reg.exec(cssText);
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
         * @param cssText   css文本
         * @returns         如果cssText中"()"内有字符串且importMap中存在键值为"()"内字符串的第一个字符，则返回void
         */
        function handleImport(cssText) {
            let ind = cssText.indexOf('(');
            let ind1 = cssText.lastIndexOf(')');
            if (ind === -1 || ind1 === -1 || ind >= ind1) {
                return;
            }
            let css = cssText.substring(ind, ind1);
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
     * @param module  模块
     * @returns       如果模块不存在css rules，则返回void
     */
    static clearModuleRules(module) {
        let rules = module.objectManager.get('$cssRules');
        if (!rules || rules.length === 0) {
            return;
        }
        //从sheet清除
        for (let i = 0; i < this.sheet.cssRules.length; i++) {
            let r = this.sheet.cssRules[i];
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
 * 渲染器
 */
class Renderer {
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
            //绑定事件
            module.eventFactory.bind(dom);
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

class RequestManager {
    /**
     * ajax 请求
     * @param config    object 或 string
     *                  如果为string，则直接以get方式获取资源
     *                  object 项如下:
     *                  参数名|类型|默认值|必填|可选值|描述
     *                  -|-|-|-|-|-
     *                  url|string|无|是|无|请求url
     *					method|string|GET|否|GET,POST,HEAD|请求类型
     *					params|Object/FormData|{}|否|无|参数，json格式
     *					async|bool|true|否|true,false|是否异步
     *  				timeout|number|0|否|无|请求超时时间
     *                  type|string|text|否|json,text|
     *					withCredentials|bool|false|否|true,false|同源策略，跨域时cookie保存
     *                  header|Object|无|否|无|request header 对象
     *                  user|string|无|否|无|需要认证的请求对应的用户名
     *                  pwd|string|无|否|无|需要认证的请求对应的密码
     *                  rand|bool|无|否|无|请求随机数，设置则浏览器缓存失效
     */
    static request(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = Date.now();
            if (this.requestMap.has(config.url)) {
                const obj = this.requestMap.get(config.url);
                if (time - obj.time < this.rejectReqTick && Util.compare(obj.params, config.params)) {
                    return;
                }
            }
            this.requestMap.set(config.url, {
                time: time,
                params: config.params
            });
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
                    else {
                        reject({ type: 'error', url: url });
                    }
                };
                req.ontimeout = () => reject({ type: 'timeout' });
                req.onerror = () => reject({ type: 'error', url: url });
                //上传数据
                let data = null;
                switch (method) {
                    case 'GET':
                        //参数
                        let pa;
                        if (Util.isObject(config.params)) {
                            let ar = [];
                            for (let k of Object.keys(config.params)) {
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
                            let fd = new FormData();
                            for (let k of Object.keys(config.params)) {
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
                req.open(method, url, async, config.user, config.pwd);
                //设置request header
                if (config.header) {
                    Util.getOwnProps(config.header).forEach((item) => {
                        req.setRequestHeader(item, config.header[item]);
                    });
                }
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
     * 清除超时缓存请求信息
     */
    static clearCache() {
        const time = Date.now();
        for (let key of this.requestMap.keys()) {
            if (time - this.requestMap.get(key).time > this.rejectReqTick) {
                this.requestMap.delete(key);
            }
        }
    }
}
/**
 * 拒绝相同请求（url，参数）时间间隔
 */
RequestManager.rejectReqTick = 500;
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
     *
     * @param config 路由配置项
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
        for (let o of Object.keys(config)) {
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
     * @param child
     */
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    /**
     * 通过路径解析路由对象
     */
    parse() {
        let pathArr = this.path.split('/');
        let node = this.parent;
        let param = [];
        let paramIndex = -1; //最后一个参数开始
        let prePath = ''; //前置路径
        for (let i = 0; i < pathArr.length; i++) {
            let v = pathArr[i].trim();
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
                    let r = node.children[j];
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
        let r = new Route();
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
 * 模块状态类型
 */
var EModuleState;
(function (EModuleState) {
    /**
     * 准备好，可渲染
     */
    EModuleState[EModuleState["READY"] = 1] = "READY";
    /**
     * 未挂载到html dom
     */
    EModuleState[EModuleState["UNMOUNTED"] = 3] = "UNMOUNTED";
    /**
     * 已挂载到dom树
     */
    EModuleState[EModuleState["MOUNTED"] = 4] = "MOUNTED";
})(EModuleState || (EModuleState = {}));

/**
 * 路由管理类
 * @since 	1.0
 */
class Router {
    /**
     * 把路径加入跳转列表(准备跳往该路由)
     * @param path 	路径
     */
    static go(path) {
        //相同路径不加入
        if (path === this.currentPath) {
            return;
        }
        //添加路径到等待列表，已存在，不加入
        if (this.waitList.indexOf(path) === -1) {
            this.waitList.push(path);
        }
        //延迟加载，避免同一个路径多次加入
        setTimeout(() => {
            this.load();
        }, 0);
    }
    /**
     * 启动加载
     */
    static load() {
        //在加载，或无等待列表，则返回
        if (this.waitList.length === 0) {
            return;
        }
        let path = this.waitList.shift();
        this.start(path).then(() => {
            //继续加载
            this.load();
        });
    }
    /**
     * 切换路由
     * @param path 	路径
     */
    static start(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let diff = this.compare(this.currentPath, path);
            // 当前路由依赖的容器模块
            let parentModule;
            if (diff[0] === null) { //不存在上一级模块
                //默认为主模块
                parentModule = ModuleFactory.getMain();
                // 当router key map不为空且主模块无router容器时，则取第一个key对应的模块为父模块
                if (this.routerKeyMap.size > 0) {
                    const mid = this.routerKeyMap.keys().next().value;
                    if (mid !== parentModule.id) {
                        const m = ModuleFactory.get(mid);
                        if (m) {
                            parentModule = m;
                        }
                    }
                }
            }
            else {
                parentModule = yield this.getModule(diff[0]);
            }
            //onleave事件，从末往前执行
            for (let i = diff[1].length - 1; i >= 0; i--) {
                const r = diff[1][i];
                if (!r.module) {
                    continue;
                }
                const module = yield this.getModule(r);
                if (Util.isFunction(this.onDefaultLeave)) {
                    this.onDefaultLeave(module.model);
                }
                if (Util.isFunction(r.onLeave)) {
                    r.onLeave(module.model);
                }
                // 清理map映射
                this.activeFieldMap.delete(module.id);
                // 取消挂载
                module.unmount();
            }
            if (diff[2].length === 0) { //路由相同，参数不同
                let route = diff[0];
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
                        this.onDefaultEnter(module.model);
                    }
                    //当前路由进入事件
                    if (Util.isFunction(route.onEnter)) {
                        route.onEnter(module.model);
                    }
                    parentModule = module;
                }
            }
            //如果是history popstate，则不加入history
            if (this.startStyle === 0) {
                let path1 = (Router.basePath || '') + path;
                //子路由，替换state
                if (path.startsWith(this.currentPath)) {
                    history.replaceState(path1, '', path1);
                }
                else { //路径push进history
                    history.pushState(path1, '', path1);
                }
            }
            //修改currentPath
            this.currentPath = path;
            //设置start类型为正常start
            this.startStyle = 0;
        });
    }
    /*
     * 重定向
     * @param path 	路径
     */
    static redirect(path) {
        this.go(path);
    }
    /**
     * 获取module
     * @param route 路由对象
     * @returns     路由对应模块
     */
    static getModule(route) {
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
     * @param path1 	第一个路径
     * @param path2 	第二个路径
     * @returns 		数组 [父路由或不同参数的路由，第一个需要销毁的路由数组，第二个需要增加的路由数组，不同参数路由的父路由]
     */
    static compare(path1, path2) {
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
     * 添加激活字段
     * @param module    模块
     * @param path      路由路径
     * @param model     激活字段所在model
     * @param field     字段名
     */
    static addActiveField(module, path, model, field) {
        if (!model || !field) {
            return;
        }
        let arr = Router.activeFieldMap.get(module.id);
        if (!arr) { //尚未存在，新建
            Router.activeFieldMap.set(module.id, [{ path: path, model: model, field: field }]);
        }
        else if (arr.find(item => item.model === model && item.field === field) === undefined) { //不重复添加
            arr.push({ path: path, model: model, field: field });
        }
    }
    /**
     * 依赖模块相关处理
     * @param module 	模块
     * @param pm        依赖模块
     * @param path 		view对应的route路径
     */
    static dependHandle(module, route, pm) {
        const me = this;
        //设置参数
        let o = {
            path: route.path
        };
        if (!Util.isEmpty(route.data)) {
            o['data'] = route.data;
        }
        module.model['$route'] = o;
        if (pm) {
            if (pm.state === EModuleState.MOUNTED) { //被依赖已挂载在html dom树中
                module.setContainer(pm.getElement(Router.routerKeyMap.get(pm.id)));
                //激活
                module.active();
                this.setDomActive(pm, route.fullPath);
            }
            else { //被依赖模块不处于被渲染后状态
                if (pm['onMount']) {
                    const foo = pm['onMount'];
                    pm['onMount'] = (model) => {
                        foo(model);
                        module.setContainer(pm.getElement(Router.routerKeyMap.get(pm.id)));
                        //激活
                        module.active();
                        me.setDomActive(pm, route.fullPath);
                        //还原onMount方法
                        pm['onMount'] = foo;
                    };
                }
                else {
                    pm['onMount'] = (model) => {
                        module.setContainer(pm.getElement(Router.routerKeyMap.get(pm.id)));
                        //激活
                        module.active();
                        me.setDomActive(pm, route.fullPath);
                        //只执行一次
                        delete pm['onMount'];
                    };
                }
            }
        }
    }
    /**
     * 设置路由元素激活属性
     * @param module    模块
     * @param path      路径
     * @returns
     */
    static setDomActive(module, path) {
        let arr = Router.activeFieldMap.get(module.id);
        if (!arr) {
            return;
        }
        for (let o of arr) {
            o.model[o.field] = o.path === path;
        }
    }
    /**
     * 获取路由数组
     * @param path 	要解析的路径
     * @param clone 是否clone，如果为false，则返回路由树的路由对象，否则返回克隆对象
     * @returns     路由对象数组
     */
    static getRouteList(path, clone) {
        if (!this.root) {
            return [];
        }
        let pathArr = path.split('/');
        let node = this.root;
        let paramIndex = 0; //参数索引
        let retArr = [];
        let fullPath = ''; //完整路径
        let preNode = this.root; //前一个节点
        for (let i = 0; i < pathArr.length; i++) {
            let v = pathArr[i].trim();
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
}
/**
 * path等待链表
 */
Router.waitList = [];
/**
 * 启动方式 0:直接启动 1:popstate 启动
 */
Router.startStyle = 0;
/**
 * 激活Dom map，格式为{moduleId:[]}
 */
Router.activeFieldMap = new Map();
/**
 * 绑定到module的router指令对应的key，即router容器对应的key，格式为 {moduleId:routerKey,...}
 */
Router.routerKeyMap = new Map();
/**
 * 根路由
 */
Router.root = new Route();
//处理popstate事件
window.addEventListener('popstate', function (e) {
    //根据state切换module
    const state = history.state;
    if (!state) {
        return;
    }
    Router.startStyle = 1;
    Router.go(state);
});

/**
 * 调度器，用于每次空闲的待操作序列调度
 */
class Scheduler {
    static dispatch() {
        Scheduler.tasks.forEach((item) => {
            if (Util.isFunction(item.func)) {
                if (item.thiser) {
                    item.func.call(item.thiser);
                }
                else {
                    item.func();
                }
            }
        });
    }
    /**
     * 启动调度器
     * @param scheduleTick 	渲染间隔
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
     * @param foo 		任务和this指向
     * @param thiser 	this指向
     */
    static addTask(foo, thiser) {
        if (!Util.isFunction(foo)) {
            throw new NError("invoke", "Scheduler.addTask", "0", "function");
        }
        Scheduler.tasks.push({ func: foo, thiser: thiser });
    }
    /**
     * 移除任务
     * @param foo 	任务
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
Scheduler.tasks = [];

/**
 * nodom提示消息
 */
var NodomMessage;
/**
 * 新建一个App
 * @param clazz     模块类
 * @param el        el选择器
 * @param language  语言（zh,en），默认zh
 */
function nodom(clazz, el, language) {
    return __awaiter(this, void 0, void 0, function* () {
        //设置nodom语言
        switch (language || 'zh') {
            case 'zh':
                NodomMessage = NodomMessage_zh;
                break;
            case 'en':
                NodomMessage = NodomMessage_en;
        }
        //渲染器启动渲染
        Scheduler.addTask(Renderer.render, Renderer);
        //启动调度器
        Scheduler.start();
        let mdl = ModuleFactory.get(clazz);
        mdl.setContainer(document.querySelector(el));
        mdl.active();
    });
}
/**
 * 暴露的创建路由方法
 * @param config  数组或单个配置
 */
function createRoute(config, parent) {
    let route;
    parent = parent || Router.root;
    if (Util.isArray(config)) {
        for (let item of config) {
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
 * @param name      指令名
 * @param priority  优先级（1最小，1-10为框架保留优先级）
 * @param init      初始化方法
 * @param handler   渲染时方法
 */
function createDirective(name, handler, priority) {
    return DirectiveManager.addType(name, handler, priority);
}
/**
 * 注册模块
 * @param clazz     模块类
 * @param name      注册名，如果没有，则为类名
 */
function registModule(clazz, name) {
    ModuleFactory.addClass(clazz, name);
}
/**
 * ajax 请求
 * @param config    object 或 string
 *                  如果为string，则直接以get方式获取资源
 *                  object 项如下:
 *                  参数名|类型|默认值|必填|可选值|描述
 *                  -|-|-|-|-|-
 *                  url|string|无|是|无|请求url
 *					method|string|GET|否|GET,POST,HEAD|请求类型
 *					params|Object/FormData|{}|否|无|参数，json格式
 *					async|bool|true|否|true,false|是否异步
 *  				timeout|number|0|否|无|请求超时时间
 *                  type|string|text|否|json,text|
 *					withCredentials|bool|false|否|true,false|同源策略，跨域时cookie保存
 *                  header|Object|无|否|无|request header 对象
 *                  user|string|无|否|无|需要认证的请求对应的用户名
 *                  pwd|string|无|否|无|需要认证的请求对应的密码
 *                  rand|bool|无|否|无|请求随机数，设置则浏览器缓存失效
 */
function request(config) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield RequestManager.request(config);
    });
}

/**
 * 异常处理类
 * @since       1.0.0
 */
class NError extends Error {
    constructor(errorName, p1, p2, p3, p4) {
        super(errorName);
        let msg = NodomMessage.ErrorMsgs[errorName];
        if (msg === undefined) {
            this.message = "未知错误";
            return;
        }
        //复制请求参数
        let params = [msg];
        for (let i = 1; i < arguments.length; i++) {
            params.push(arguments[i]);
        }
        this.message = this.compile.apply(null, params);
    }
    /**
     * 编译字符串，把{n}替换成带入值
     * @param src   待编译的字符串
     * @returns     转换后的消息
     */
    compile(src, p1, p2, p3, p4, p5) {
        let reg;
        let args = arguments;
        let index = 0;
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
    }
}

/**
 * 基础服务库
 * @since       1.0.0
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
            'NaN', 'Number', 'Object', 'prototype', 'String',
            'isPrototypeOf', 'undefined', 'valueOf'
        ].forEach(item => {
            this.keyWordMap.set(item, true);
        });
    }
    /**
     * 是否为 js 保留关键字
     * @param name  名字
     * @returns     如果为保留字，则返回true，否则返回false
     */
    static isKeyWord(name) {
        return this.keyWordMap.has(name);
    }
    /******对象相关******/
    /**
     * 对象复制
     * @param srcObj    源对象
     * @param expKey    不复制的键正则表达式或名
     * @param extra     clone附加参数
     * @returns         复制的对象
     */
    static clone(srcObj, expKey, extra) {
        let me = this;
        let map = new WeakMap();
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
            let dst;
            //带有clone方法，则直接返回clone值
            if (src.clone && Util.isFunction(src.clone)) {
                return src.clone(extra);
            }
            else if (me.isObject(src)) {
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
            else if (me.isMap(src)) {
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
     * 合并多个对象并返回
     * @param   参数数组
     * @returns 返回对象
     */
    static merge(o1, o2, o3, o4, o5, o6) {
        let me = this;
        for (let i = 0; i < arguments.length; i++) {
            if (!this.isObject(arguments[i])) {
                throw new NError('invoke', 'Util.merge', i + '', 'object');
            }
        }
        let retObj = Object.assign.apply(null, arguments);
        subObj(retObj);
        return retObj;
        //处理子对象
        function subObj(obj) {
            for (let o of Object.keys(obj)) {
                if (me.isObject(obj[o]) || me.isArray(obj[o])) { //对象或数组
                    retObj[o] = me.clone(retObj[o]);
                }
            }
        }
    }
    /**
     * 把obj2对象所有属性赋值给obj1
     * @returns 返回对象obj1
     */
    static assign(obj1, obj2) {
        if (Object.assign) {
            Object.assign(obj1, obj2);
        }
        else {
            this.getOwnProps(obj2).forEach(function (p) {
                obj1[p] = obj2[p];
            });
        }
        return obj1;
    }
    /**
     * 比较两个对象值是否相同(只比较object和array)
     * @param src   源对象
     * @param dst   目标对象
     * @returns     值相同则返回true，否则返回false
     */
    static compare(src, dst) {
        return cmp(src, dst);
        function cmp(o1, o2) {
            if (o1 === o2) {
                return true;
            }
            let keys1 = Object.keys(o1);
            let keys2 = Object.keys(o2);
            if (keys1.length !== keys2.length) {
                return false;
            }
            for (let k of keys1) {
                if (typeof o1[k] === 'object' && typeof o2[k] === 'object') {
                    let r = cmp(o1[k], o2[k]);
                    if (!r) {
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
     * @param obj   需要获取属性的对象
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
     * @param foo   检查的对象
     * @returns     true/false
     */
    static isFunction(foo) {
        return foo !== undefined && foo !== null && foo.constructor === Function;
    }
    /**
     * 判断是否为数组
     * @param obj   检查的对象
     * @returns     true/false
     */
    static isArray(obj) {
        return Array.isArray(obj);
    }
    /**
     * 判断是否为map
     * @param obj   检查的对象
     */
    static isMap(obj) {
        return obj !== null && obj !== undefined && obj.constructor === Map;
    }
    /**
     * 判断是否为对象
     * @param obj   检查的对象
     * @returns     true/false
     */
    static isObject(obj) {
        return obj !== null && obj !== undefined && obj.constructor === Object;
    }
    /**
     * 判断是否为整数
     * @param v     检查的值
     * @returns     true/false
     */
    static isInt(v) {
        return Number.isInteger(v);
    }
    /**
     * 判断是否为number
     * @param v     检查的值
     * @returns     true/false
     */
    static isNumber(v) {
        return typeof v === 'number';
    }
    /**
     * 判断是否为boolean
     * @param v     检查的值
     * @returns     true/false
     */
    static isBoolean(v) {
        return typeof v === 'boolean';
    }
    /**
     * 判断是否为字符串
     * @param v     检查的值
     * @returns     true/false
     */
    static isString(v) {
        return typeof v === 'string';
    }
    /**
     * 判断是否为数字串
     * @param v     检查的值
     * @returns     true/false
     */
    static isNumberString(v) {
        return /^\d+\.?\d*$/.test(v);
    }
    /**
     * 判断对象/字符串是否为空
     * @param obj   检查的对象
     * @returns     true/false
     */
    static isEmpty(obj) {
        if (obj === null || obj === undefined)
            return true;
        let tp = typeof obj;
        if (this.isObject(obj)) {
            let keys = Object.keys(obj);
            if (keys !== undefined) {
                return keys.length === 0;
            }
        }
        else if (tp === 'string') {
            return obj === '';
        }
        return false;
    }
    /**
     * 把srcNode替换为nodes
     * @param srcNode       源dom
     * @param nodes         替换的dom或dom数组
     */
    static replaceNode(srcNode, nodes) {
        let pnode = srcNode.parentNode;
        let bnode = srcNode.nextSibling;
        if (pnode === null) {
            return;
        }
        pnode.removeChild(srcNode);
        const nodeArr = this.isArray(nodes) ? nodes : [nodes];
        nodeArr.forEach(function (node) {
            if (bnode === undefined || bnode === null) {
                pnode.appendChild(node);
            }
            else {
                pnode.insertBefore(node, bnode);
            }
        });
    }
    /**
     * 清空子节点
     * @param el   需要清空的节点
     */
    static empty(el) {
        let nodes = el.childNodes;
        for (let i = nodes.length - 1; i >= 0; i--) {
            el.removeChild(nodes[i]);
        }
    }
    /******日期相关******/
    /**
     * 日期格式化
     * @param timestamp  时间戳
     * @param format     日期格式
     * @returns          日期串
     */
    static formatDate(timeStamp, format) {
        if (this.isString(timeStamp)) {
            //排除日期格式串,只处理时间戳
            let reg = /^\d+$/;
            if (reg.test(timeStamp)) {
                timeStamp = Number(timeStamp);
            }
            else {
                throw new NError('invoke', 'Util.formatDate', '0', 'date string', 'date');
            }
        }
        //得到日期
        let date = new Date(timeStamp);
        // invalid date
        if (isNaN(date.getDay())) {
            throw new NError('invoke', 'Util.formatDate', '0', 'date string', 'date');
        }
        let o = {
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
     * 编译字符串，把{n}替换成带入值
     * @param src   待编译的字符串
     * @returns     转换后的消息
     */
    static compileStr(src, p1, p2, p3, p4, p5) {
        let reg;
        let args = arguments;
        let index = 0;
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
    }
    /**
     * 函数调用
     * @param foo   函数
     * @param obj   this指向
     * @param args  参数数组
     */
    static apply(foo, obj, args) {
        if (!foo) {
            return;
        }
        return Reflect.apply(foo, obj || null, args);
    }
    /**
     * 合并并修正路径，即路径中出现'//','///','\/'的情况，统一置换为'/'
     * @param paths     待合并路径数组
     * @returns         返回路径
     */
    static mergePath(paths) {
        return paths.join('/').replace(/(\/{2,})|\\\//g, '\/');
    }
    /**
     * eval
     * @param evalStr   eval串
     * @returns         eval值
     */
    static eval(evalStr) {
        return new Function(`return(${evalStr})`)();
    }
    /**
     * 改造 dom key，避免克隆时重复，格式为：key_id
     * @param node    节点
     * @param id      附加id
     * @param deep    是否深度处理
     */
    static setNodeKey(node, id, deep) {
        node.key = this.genUniqueKey(node.key, id);
        if (deep && node.children) {
            for (let c of node.children) {
                Util.setNodeKey(c, id, true);
            }
        }
    }
    /**
     * 设置dom asset
     * @param dom       渲染后的dom节点
     * @param name      asset name
     * @param value     asset value
     */
    static setDomAsset(dom, name, value) {
        if (!dom.assets) {
            dom.assets = {};
        }
        dom.assets[name] = value;
    }
    /**
     * 通过两个整数，生成唯一key
     * @param x     第一个整整数
     * @param y     第二个正整数
     * @returns 唯一key，为避免与genId的key相同，对结果取负
     */
    static genUniqueKey(x, y) {
        // if(x<0){
        //     x = -x;
        // }
        // if(y<0){
        //     y = -y;
        // }
        // return -((x << 16) | y);
        return x + '_' + y;
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
     * @param type  	类型名
     * @param value 	指令值
     */
    constructor(type, value) {
        this.id = Util.genId();
        if (type) {
            this.type = DirectiveManager.getType(type);
            if (!this.type) {
                throw new NError('notexist1', NodomMessage.TipWords['directive'], type);
            }
        }
        if (Util.isString(value)) {
            this.value = value.trim();
        }
        else if (value instanceof Expression) {
            this.expression = value;
        }
        else {
            this.value = value;
        }
    }
    /**
     * 执行指令
     * @param module    模块
     * @param dom       渲染目标节点对象
     * @returns         true/false
     */
    exec(module, dom) {
        //禁用，不执行
        if (this.disabled) {
            return true;
        }
        if (this.expression) {
            this.value = this.expression.val(module, dom.model);
        }
        return this.type.handle.apply(this, [module, dom]);
    }
    /**
     * 克隆
     */
    clone() {
        let d = new Directive();
        d.type = this.type;
        d.expression = this.expression;
        d.value = this.value;
        return d;
    }
}

/**
 * 事件类
 * @remarks
 * 事件分为自有事件和代理事件
 * @author      yanglei
 * @since       1.0
 */
class NEvent {
    /**
     * @param eventName     事件名
     * @param eventStr      事件串或事件处理函数,以“:”分割,中间不能有空格,结构为: 方法名[:delg(代理到父对象):nopopo(禁止冒泡):once(只执行一次):capture(useCapture)]
     *                      如果为函数，则替代第三个参数
     * @param handler       事件执行函数，如果方法不在module methods中定义，则可以直接申明，eventStr第一个参数失效，即eventStr可以是":delg:nopopo..."
     */
    constructor(module, eventName, eventStr, handler) {
        this.id = Util.genId();
        this.module = module;
        this.name = eventName;
        // GlobalCache.saveEvent(this);
        //如果事件串不为空，则不需要处理
        if (eventStr) {
            let tp = typeof eventStr;
            if (tp === 'string') {
                let eStr = eventStr.trim();
                eStr.split(':').forEach((item, i) => {
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
            else if (tp === 'function') {
                handler = eventStr;
            }
        }
        //新增事件方法（不在methods中定义）
        if (handler) {
            this.handler = handler;
        }
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
     * @param module    模块
     * @param dom       虚拟dom
     * @param name      参数名
     * @param value     参数值
     */
    setParam(module, dom, name, value) {
        module.objectManager.setEventParam(this.id, dom.key, name, value);
    }
    /**
     * 获取附加参数值
     * @param module    模块
     * @param dom       虚拟dom
     * @param name      参数名
     * @returns         附加参数值
     */
    getParam(module, dom, name) {
        return module.objectManager.getEventParam(this.id, dom.key, name);
    }
    /**
     * 移除参数
     * @param module    模块
     * @param dom       虚拟dom
     * @param name      参数名
     */
    removeParam(module, dom, name) {
        return module.objectManager.removeEventParam(this.id, dom.key, name);
    }
    /**
     * 清参数cache
     * @param module    模块
     * @param dom       虚拟dom
     */
    clearParam(module, dom) {
        module.objectManager.clearEventParam(this.id, dom.key);
    }
}

/**
 * 虚拟dom
 */
class VirtualDom {
    /**
     * @param tag       标签名
     * @param key       key
     * @param module 	模块
     */
    constructor(tag, key, module) {
        /**
         * 对应的所有表达式的字段都属于dom model内
         */
        this.allModelField = true;
        /**
         * 自关闭节点是否已经自关闭
         */
        this.selfClosed = false;
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
            this.directives = [];
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
        return (this.directives &&
            this.directives.findIndex((item) => item.type.name === typeName) !== -1);
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

const voidTagMap = new Set('area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'.split(','));
/**
 * - 模板标签必须闭合
 */
/**
 * - 模板标签必须闭合
 */
class Compiler {
    /**
     * 构造器
     * @param module
     */
    constructor(module) {
        /**
         * 虚拟dom树
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
         * 当前编译的模板 主要用于报错的时候定位
         */
        this.template = '';
        this.module = module;
    }
    /**
     * 编译
     * @param elementStr     待编译html串
     * @returns              虚拟dom
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
        if (this.domArr.length === 0) {
            throw new NError('wrongTemplate');
        }
        // 处理<div><div><div>abc这样的模板
        for (let i = this.domArr.length - 1; i >= 1; i--) {
            if (!this.domArr[i].isClosed) {
                if (this.domArr[i].tagName !== undefined) {
                    this.warnStartTagNotClose(this.domArr[i]);
                }
                if (!this.domArr[i - 1].isClosed) {
                    this.domArr[i].isClosed = true;
                    let temp = this.domArr.pop();
                    this.domArr[i - 1].add(temp);
                }
            }
        }
        if (!this.domArr[this.domArr.length - 1].isClosed) {
            this.domArr[this.domArr.length - 1].isClosed = true;
            this.warnStartTagNotClose(this.domArr[this.domArr.length - 1]);
        }
        // 后处理，主要处理没有使用一个容器包裹所有节点的情况
        // domArr.length > 1  新建一个div节点接收domArr里面的所有节点
        // domArr.length == 1 如果是文本节点或者是模块，则新建一个div节点接收，其他情况直接使用该节点
        // domArr.length < 1 模板错误，抛出编译模板报错
        let dom;
        if (this.domArr.length > 1) {
            // 说明没有使用一个容器包裹所有的节点
            dom = new VirtualDom('div', this.genKey(), this.module);
            // dom.add([...this.domArr]);
            this.domArr.forEach((item) => {
                dom.add(item);
            });
            dom.isClosed = true;
        }
        else if (this.domArr.length == 1) {
            if (this.domArr[0].tagName && !this.domArr[0].hasDirective('module')) {
                dom = this.domArr[0];
            }
            else {
                dom = new VirtualDom('div', this.genKey(), this.module);
                dom.add(this.domArr[0]);
                dom.isClosed = true;
            }
        }
        else {
            throw new NError('wrongTemplate');
        }
        return dom;
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
     * @param srcStr 	源串
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
     * 处理开始节点
     * @param srcStr 待编译字符串
     * @returns 编译处理后的字符串
     */
    compileStartTag(srcStr) {
        // 抓取<div
        const match = /^<\s*([a-z][^\s\/\>]*)/i.exec(srcStr);
        // 抓取成功
        if (match) {
            // 设置当前正在编译的节点
            this.current = new VirtualDom(match[1].toLowerCase(), this.genKey(), this.module);
            // 当前节点入栈
            this.domArr.push(this.current);
            // 截断字符串 准备处理属性
            this.current.tagStartPos = this.template.length - srcStr.length;
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
            // 开始标签结束
            this.current.tagEndPos = this.template.length - srcStr.substring(1).length;
            if (this.isVoidTag(this.current)) {
                if (!this.current.selfClosed) {
                    this.warnStartTagNotClose(this.current);
                }
                this.handleSelfClosingTag();
            }
            return srcStr.substring(1).trimStart();
        }
        else {
            // 开始标签没结束>
            throw new NError('needEndTag', this.current.tagName);
        }
    }
    /**
     * 处理标签属性
     * @param srcStr 待编译字符串
     * @returns 编译后字符串
     */
    compileAttributes(srcStr) {
        // 确保处理完成之后是>开头
        while (srcStr.length != 0 && !srcStr.startsWith('>')) {
            // 抓取形如：a='b' a={{b}} a="b" a=`b` / a 的属性串;
            const match = /^(\/|\$?[a-z_][\w-]*)(?:\s*=\s*((?:'[^']*')|(?:"[^"]*")|(?:`[^`]*`)|(?:{{[^}}]*}})))?/i.exec(srcStr);
            // 抓取成功 处理属性
            if (match) {
                // HTML在解析 属性的时候会把大写属性名改成小写(数据项除外)，这里为了和html一致 统一把属性名处理成为小写
                let name = match[1][0] !== '$' ? match[1].toLowerCase() : match[1];
                if (name === '/') {
                    // 是自闭合标签
                    this.handleSelfClosingTag();
                    this.current.selfClosed = true;
                }
                else {
                    // 是普通属性
                    let value = !match[2]
                        ? undefined
                        : match[2].startsWith(`"`)
                            ? match[2].substring(1, match[2].length - 1)
                            : match[2].startsWith(`'`)
                                ? match[2].substring(1, match[2].length - 1)
                                : match[2];
                    if (value && value.startsWith('{{')) {
                        value = new Expression(value.substring(2, value.length - 2));
                        //表达式 staticNum为-1
                        this.current.staticNum = -1;
                    }
                    if (name.startsWith('x-')) {
                        // 指令
                        this.current.addDirective(new Directive(name.substring(2), value));
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
            }
            if (match) {
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
     * 处理结束标签
     * @param srcStr 待编译字符串
     * @returns 编译后字符串
     */
    compileEndTag(srcStr) {
        // 抓取</div>
        const match = /^<\/\s*([a-z][^\>]*)/i.exec(srcStr);
        if (match) {
            // 抓取成功
            const name = match[1].toLowerCase().trim();
            if (this.current && this.current.tagName === name) {
                // 当前节点与闭合标签名相同 尝试闭合
                if (this.domArr.length < 1) {
                    // 当前栈空 错误闭合 按照html 测试 a</b>c 的结果丢弃该字符串
                    return srcStr.substring(match.index + match[0].length + 1);
                }
                else if (this.domArr.length == 1) {
                    // 当前栈只有一个节点，处理该节点，并且将当前节点指向undefined
                    this.handleCloseTag();
                    this.current = undefined;
                }
                else {
                    // 当前栈内有多个节点
                    // 1.处理当前节点
                    let temp = this.domArr.pop();
                    this.handleCloseTag();
                    this.current = !this.domArr[this.domArr.length - 1].isClosed
                        ? this.domArr[this.domArr.length - 1]
                        : undefined;
                    this.current ? this.current.add(temp) : this.domArr.push(temp);
                }
            }
            else {
                //
                /**
                 * 没找到闭合标签与当前标签不匹配 ，分两种情况
                 * 1. 当前结束标签与栈中之前的元素匹配正常闭合只是中间有标签没闭合；
                 * 2. 当前结束标签与栈中所有元素都不匹配
                 * */
                if (this.domArr.length === 0) {
                    this.warnEndTagNotMatch(name, srcStr);
                }
                else {
                    // 尝试寻找与其匹配的开始节点
                    let pos = 0;
                    for (let i = this.domArr.length - 1; i >= 1; i--) {
                        if (!this.domArr[i].isClosed && name === this.domArr[i].tagName) {
                            pos = i;
                            break;
                        }
                    }
                    if (pos !== 0) {
                        // warn 用户中间有未闭合的节点
                        for (let i = this.domArr.length - 1; i >= pos; i--) {
                            if (this.domArr[i].tagName !== undefined && i !== pos) {
                                // 不是文本节点
                                this.warnStartTagNotClose(this.domArr[i]);
                            }
                            // 如果是空标签那么不能将节点放进去
                            if (!this.domArr[i - 1].isClosed) {
                                this.domArr[i].isClosed = true;
                                let temp = this.domArr.pop();
                                this.domArr[i - 1].add(temp);
                            }
                        }
                        this.current = undefined;
                    }
                    else {
                        // pos = 0 表示当前栈没有元素与当前闭合标签匹配
                        this.warnEndTagNotMatch(name, srcStr);
                    }
                }
                return srcStr.substring(match.index + match[0].length + 1);
            }
        }
        else {
            // 抓取失败
            throw new NError('needEndTag', this.current.tagName);
        }
        return srcStr.substring(match.index + match[0].length + 1).trimStart();
    }
    /**
     * 编译text
     * @param srcStr 	源串
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
                        txt = this.preHandleText(srcStr.substring(0, match.index + match[0].length));
                    }
                    this.textArr.push(txt);
                }
                srcStr = srcStr.substring(match.index + match[0].length);
            }
        }
        // 最开始是< 或者字符消耗完毕 退出循环
        let text = new VirtualDom(undefined, this.genKey());
        if (this.isExprText) {
            text.expressions = [...this.textArr];
            //动态文本节点，staticNum=-1
            text.staticNum = -1;
        }
        else {
            text.textContent = this.textArr.join('');
        }
        if (this.current) {
            // 当前节点未闭合
            if (this.isExprText) {
                this.current.add(text);
            }
            else {
                if (text.textContent.length !== 0) {
                    this.current.add(text);
                }
            }
        }
        else {
            // 当前不存在未闭合节点，说明text是第一个节点 或者 没有用一个容器把所有节点包裹起来。
            // 如果文本节点不是全空则直接push当前文本节点 ，等到编译完成的时候使用一个统一的div包裹所有的domArr里面的节点。
            // 如果是全空文本节点则直接丢弃
            if (this.isExprText) {
                this.domArr.push(text);
            }
            else {
                if (text.textContent.trim().length !== 0) {
                    this.domArr.push(text);
                }
            }
        }
        // 文本节点也要闭合
        /**
         *  防止下面的情况出现
         * <div>abc</div>
         *  something
         * <div>abc</div>
         */
        text.isClosed = true;
        // 重置状态
        this.isExprText = false;
        this.textArr = [];
        // 返回字符串
        return srcStr;
    }
    /**
     * 预处理html保留字符 如 &nbsp;,&lt;等
     * @param str   待处理的字符串
     * @returns     解析之后的串
     */
    preHandleText(str) {
        let reg = /&[a-z]+;/;
        if (reg.test(str)) {
            let div = document.createElement('div');
            div.innerHTML = str;
            return div.textContent + '';
        }
        return str;
    }
    /**
     * 处理当前节点是模块或者自定义节点
     */
    postHandleNode() {
        let clazz = DefineElementManager.get(this.current.tagName);
        if (clazz) {
            Reflect.construct(clazz, [this.current, this.module]);
        }
        const node = this.current;
        // 是否是模块类
        if (ModuleFactory.hasClass(node.tagName)) {
            const dir = new Directive('module', node.tagName);
            dir.params = { srcId: this.module.id };
            node.addDirective(dir);
            node.tagName = 'div';
        }
    }
    /**
     * 处理插槽
     */
    handleSlot() {
        let dom = this.current;
        if (!dom.children ||
            dom.children.length === 0 ||
            !dom.hasDirective('module')) {
            return;
        }
        let slotCt;
        for (let j = 0; j < dom.children.length; j++) {
            let c = dom.children[j];
            if (c.hasDirective('slot')) {
                //带slot的不处理
                continue;
            }
            //@ts-ignore
            if (!slotCt) {
                //第一个直接被slotCt替换
                slotCt = new VirtualDom('div', this.genKey());
                slotCt.addDirective(new Directive('slot'));
                //当前位置，用slot替代
                dom.children.splice(j, 1, slotCt);
            }
            else {
                //直接删除
                dom.children.splice(j--, 1);
            }
            slotCt.add(c);
        }
    }
    /**
     * 处理闭合节点
     */
    handleCloseTag() {
        this.postHandleNode();
        this.current.sortDirective();
        this.handleSlot();
        this.current.isClosed = true;
    }
    /**
     * 处理自闭合节点
     */
    handleSelfClosingTag() {
        this.postHandleNode();
        this.current.sortDirective();
        if (this.domArr.length > 1) {
            this.domArr.pop();
            this.domArr[this.domArr.length - 1].add(this.current);
            this.current = this.domArr[this.domArr.length - 1];
        }
        else {
            this.current = undefined;
        }
    }
    /**
     * 如有闭合标签没有匹配到任何开始标签 给用户警告
     * @param name 标签名
     * @param srcStr 剩余模板字符串
     */
    warnEndTagNotMatch(name, srcStr) {
        console.warn(`[Nodom warn]: 模块 %c${this.module.constructor.name}%c 中 </${name}> 未匹配到对应的开始标签。
      \n\t ${this.template.substring(0, this.template.length - srcStr.length)}%c</${name}>%c${srcStr.substring(name.length + 3)}`, 'color:red;font-weight:bold;', '', 'color:red;font-weight:bold;', ``);
    }
    /**
     * 当前节点没有闭合给用户输出警告
     * @param dom 节点
     */
    warnStartTagNotClose(dom) {
        console.warn(`[Nodom warn]: 模块：%c${this.module.constructor.name}%c 中 ${dom.tagName} 标签未闭合！ \n\t ${this.template.substring(0, dom.tagStartPos)}%c${this.template.substring(dom.tagStartPos, dom.tagEndPos)}%c${this.template.substring(dom.tagEndPos)}`, 'color:red;font-weight:bold;', '', 'color:red;font-weight:bold;', '');
    }
    /**
     * 判断节点是都是空节点
     * @param dom
     * @returns
     */
    isVoidTag(dom) {
        return voidTagMap.has(dom.tagName);
    }
}

/**
 * 比较器
 */
class DiffTool {
    /**
     * 比较节点
     * @param src           待比较节点（新树节点）
     * @param dst 	        被比较节点 (旧树节点)
     * @param changeArr     增删改的节点数组
     * @returns	            [[type(add 1, upd 2,move 3 ,rep 4,del 5),dom(操作节点),dom1(被替换或修改节点),parent(父节点),loc(位置)]]
     */
    static compare(src, dst) {
        const changeArr = [];
        compare(src, dst);
        return changeArr;
        /**
         * 比较节点
         * @param src           待比较节点（新树节点）
         * @param dst 	        被比较节点 (旧树节点)
         * @returns	            [[type(add 1, upd 2,del 3,move 4 ,rep 5),dom(操作节点),dom1(被替换或修改节点),parent(父节点),
         *                       loc(dom在父的children index)]]
         */
        function compare(src, dst) {
            if (!src.tagName) { //文本节点
                if (!dst.tagName) {
                    if ((src.staticNum || dst.staticNum) && src.textContent !== dst.textContent) {
                        addChange(2, src, null, dst.parent);
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
                if (src.tagName !== dst.tagName) {
                    addChange(5, src, dst, dst.parent);
                }
                else { //节点类型相同，但有一个不是静态节点，进行属性比较
                    if ((src.staticNum || dst.staticNum) && isChange(src, dst)) {
                        addChange(2, src, null, dst.parent);
                    }
                    if (!src.moduleId) { //子模块不比较子节点
                        compareChildren(src, dst);
                    }
                }
            }
        }
        /**
         * 比较子节点
         * @param src   新节点
         * @param dst   旧节点
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
                    let addObj = {};
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
                                addChange(4, newStartNode, null, dst, newStartIdx);
                            }
                            newStartNode = src.children[++newStartIdx];
                            oldStartNode = dst.children[++oldStartIdx];
                        }
                        else if (oldEndNode.key === newEndNode.key) { //新后旧后
                            compare(newEndNode, oldEndNode);
                            if (oldEndIdx !== newEndIdx) {
                                addChange(4, newEndNode, null, dst, newEndIdx);
                            }
                            newEndNode = src.children[--newEndIdx];
                            oldEndNode = dst.children[--oldEndIdx];
                        }
                        else if (newStartNode.key === oldEndNode.key) { //新前旧后
                            //新前旧后
                            compare(newStartNode, oldEndNode);
                            //放在指定位置
                            if (newStartIdx !== oldEndIdx) {
                                addChange(4, newStartNode, null, dst, newStartIdx);
                            }
                            newStartNode = src.children[++newStartIdx];
                            oldEndNode = dst.children[--oldEndIdx];
                        }
                        else if (newEndNode.key === oldStartNode.key) { //新后旧前
                            compare(newEndNode, oldStartNode);
                            if (newEndIdx !== oldStartIdx) {
                                addChange(4, newEndNode, null, dst, newEndIdx);
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
                            let ch = dst.children[i];
                            //如果要删除的节点在addArr中，则表示move，否则表示删除
                            if (addObj.hasOwnProperty(ch.key)) {
                                let o = addObj[ch.key];
                                if (index !== o[4]) { //修改为move
                                    o[0] = 4;
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
         * @parma src   新树节点
         * @param dst   旧树节点
         *
         */
        function isChange(src, dst) {
            for (let p of ['props', 'assets']) {
                //属性比较
                if (!src[p] && dst[p] || src[p] && !dst[p]) {
                    return true;
                }
                else if (src[p] && dst[p]) {
                    let keys = Object.keys(src[p]);
                    let keys1 = Object.keys(dst[p]);
                    if (keys.length !== keys1.length) {
                        return true;
                    }
                    else {
                        for (let k of keys) {
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
         * 添加刪除替換
         * @param type      类型 add 1, upd 2,del 3,move 4 ,rep 5
         * @param dom       虚拟节点
         * @param dom1      相对节点
         * @param parent    父节点
         * @param loc       添加或移动的目标index
         * @returns         添加的change数组
        */
        function addChange(type, dom, dom1, parent, loc) {
            const o = [type, dom, dom1, parent, loc];
            changeArr.push(o);
            return o;
        }
    }
}

/**
 * 自定义元素
 * 用于扩充定义，主要对ast obj进行前置处理
 */
class DefineElement {
    /**
     * 构造器，在dom编译后执行
     * @param node
     * @param module
     */
    constructor(node) {
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
 * 事件管理器
 */
class EventManager {
    /**
     * 处理外部事件
     * @param dom       dom节点
     * @param event     事件对象
     * @returns         如果有是外部事件，则返回true，否则返回false
     */
    static handleExtendEvent(module, dom, event) {
        let evts = this.get(event.name);
        if (!evts) {
            return false;
        }
        for (let key of Object.keys(evts)) {
            let ev = new NEvent(module, key, evts[key]);
            ev.capture = event.capture;
            ev.nopopo = event.nopopo;
            ev.delg = event.delg;
            ev.once = event.once;
            //设置依赖事件
            ev.dependEvent = event;
            module.eventFactory.addEvent(dom, ev);
        }
        return true;
    }
    /**
      * 注册扩展事件
      * @param eventName    事件名
      * @param handleObj    事件处理集
      */
    static regist(eventName, handleObj) {
        this.extendEventMap.set(eventName, handleObj);
    }
    /**
     * 取消注册扩展事件
     * @param eventName     事件名
     */
    static unregist(eventName) {
        return this.extendEventMap.delete(eventName);
    }
    /**
     * 获取扩展事件
     * @param eventName     事件名
     * @returns             事件处理集
     */
    static get(eventName) {
        return this.extendEventMap.get(eventName);
    }
}
/**
 * 外部事件集
 */
EventManager.extendEventMap = new Map();

/**
 * 事件工厂
 * 每个模块一个事件工厂，用于管理模块内虚拟dom对应的事件对象
 */
class EventFactory {
    /**
     * 构造器
     * @param module 模块
     */
    constructor(module) {
        this.module = module;
        this.eventMap = new Map();
        this.addedEvents = new Map();
    }
    /**
     * 保存事件
     * @param key       dom key
     * @param event     事件对象
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
     * @param key       dom key
     * @param event     事件对象
     * @param key1      被代理dom key，仅对代理事件有效
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
     * @param key   dom key
     * @returns     事件对象
     */
    getEvent(key) {
        return this.eventMap.get(key);
    }
    /**
     * 删除事件
     * @param event     事件对象
     * @param key       对应dom keys
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
            let cfg = this.eventMap.get(dom.parent.key);
            if (!cfg[event.name]) {
                return;
            }
            let obj = cfg[event.name];
            let index = obj.delg.findIndex(item => item.key === dom.key && item.event === event);
            if (index !== -1) {
                obj.delg.splice(index, 1);
                // 解绑事件
                if (obj.delg.length === 0 && obj.own.length === 0) {
                    this.unbind(dom.parent.key, event.name);
                }
            }
        }
        else { //own
            let cfg = this.eventMap.get(dom.key);
            if (!cfg[event.name]) {
                return;
            }
            let obj = cfg[event.name];
            let index = obj.own.findIndex(item => item === event);
            if (index !== -1) {
                obj.own.splice(index, 1);
                // 解绑事件
                if (obj.delg.length === 0 && obj.own.length === 0) {
                    this.unbind(dom.key, event.name);
                }
            }
        }
    }
    /**
     * 绑定dom事件
     * @param dom   渲染dom节点
     */
    bind(dom) {
        if (!this.eventMap.has(dom.key)) {
            return;
        }
        const el = this.module.getElement(dom.key);
        const cfg = this.eventMap.get(dom.key);
        for (let key of Object.keys(cfg)) {
            // bindMap 不是事件名
            if (key === 'bindMap') {
                continue;
            }
            el.addEventListener(key, handler, cfg[key].capture);
            cfg.bindMap[key] = { handler: handler, capture: cfg[key].capture };
        }
        const me = this;
        function handler(e) {
            me.handler.apply(me, [me.module, e]);
        }
    }
    /**
     * 从eventfactory解绑所有事件
     * @param key           dom key
     * @param eventName     事件名
     */
    unbind(key, eventName) {
        if (!this.eventMap.has(key)) {
            return;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj.bindMap || !eobj[eventName]) {
            return;
        }
        const el = this.module.getElement(key);
        const cfg = eobj.bindMap[eventName];
        //从html element解绑
        if (el && cfg) {
            el.removeEventListener(eventName, cfg.handler, cfg.capture);
        }
        delete eobj.bindMap[eventName];
    }
    /**
     * 解绑html element事件
     * @param key   dom key
     */
    unbindAll(key) {
        if (!this.eventMap.has(key)) {
            return;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj.bindMap) {
            return;
        }
        const el = this.module.getElement(key);
        if (el) {
            for (let key of Object.keys(eobj.bindMap)) {
                const v = eobj.bindMap[key];
                el.removeEventListener(key, v.handler, v.capture);
            }
        }
        eobj.bindMap = {};
    }
    /**
     * 是否拥有key对应的事件对象
     * @param key   dom key
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
        for (let key of this.addedEvents.keys()) {
            this.unbindAll(key);
        }
        this.addedEvents.clear();
        this.eventMap.clear();
    }
    /**
     * 事件handler
     * @param module    模块
     * @param e         HTML Event
     */
    handler(module, e) {
        //从事件element获取事件
        let el = e.currentTarget;
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
         * @param events
         * @returns
         */
        function doOwn(events) {
            if (!events) {
                return;
            }
            let nopopo = false;
            for (let i = 0; i < events.length; i++) {
                const ev = events[i];
                if (typeof ev.handler === 'string') {
                    module.invokeMethod(ev.handler, dom.model, dom, ev, e);
                }
                else if (typeof ev.handler === 'function') {
                    ev.handler.apply(module, [dom.model, dom, ev, e]);
                }
                if (ev.once) { //移除事件
                    events.splice(i--, 1);
                }
                nopopo = ev.nopopo;
            }
            if (nopopo) {
                e.stopPropagation();
            }
        }
        /**
         * 处理代理事件
         * @param events
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
                        const dom1 = module.domManager.getRenderedDom(k);
                        if (typeof ev.handler === 'string') {
                            module.invokeMethod(ev.handler, dom1.model, dom1, ev, e);
                        }
                        else if (typeof ev.handler === 'function') {
                            ev.handler.apply(module, [dom1.model, dom1, ev, e]);
                        }
                        // 保留nopopo
                        nopopo = ev.nopopo;
                        if (ev.once) { //移除代理事件，需要从被代理元素删除
                            //从当前dom删除
                            events.splice(i--, 1);
                            //从被代理dom删除
                            const ind = module.eventFactory.get(k).indexOf(ev);
                            module.eventFactory.get(k).splice(ind, 1);
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
 * NCache模块-存储在内存中
 */
class NCache {
    constructor() {
        /**
         * 订阅map，格式为 {key:[{module:订阅模块,handler:},...]}
         */
        this.subscribeMap = new Map();
        this.cacheData = {};
    }
    /**
     * 通过提供的键名从内存中拿到对应的值
     * @param key   键，支持"."（多级数据分割）
     * @reutrns     值或undefined
     */
    get(key) {
        let p = this.cacheData;
        if (key.indexOf('.') !== -1) {
            let arr = key.split('.');
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
     * @param key       键
     * @param value     值
     */
    set(key, value) {
        let p = this.cacheData;
        let key1 = key;
        if (key.indexOf('.') !== -1) {
            let arr = key.split('.');
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
            let arr = this.subscribeMap.get(key1);
            for (let a of arr) {
                this.invokeSubscribe(a.module, a.handler, value);
            }
        }
    }
    /**
     * 通过提供的键名将其移除
     * @param key   键
     */
    remove(key) {
        let p = this.cacheData;
        if (key.indexOf('.') !== -1) {
            let arr = key.split('.');
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
     * @param module    订阅的模块
     * @param key       字段key
     * @param handler   回调函数 参数为key对应value
     */
    subscribe(module, key, handler) {
        if (!this.subscribeMap.has(key)) {
            this.subscribeMap.set(key, [{ module: module, handler: handler }]);
        }
        else {
            let arr = this.subscribeMap.get(key);
            if (!arr.find(item => item.module === module && item.handler === handler)) {
                arr.push({ module: module, handler: handler });
            }
        }
        //如果存在值，则执行订阅回调
        let v = this.get(key);
        if (v) {
            this.invokeSubscribe(module, handler, v);
        }
    }
    /**
     * 调用订阅方法
     * @param module    模块
     * @param foo       方法或方法名
     * @param v         值
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
 */
class GlobalCache {
    /**
     * 保存到cache
     * @param key       键，支持"."（多级数据分割）
     * @param value     值
     */
    static set(key, value) {
        this.cache.set(key, value);
    }
    /**
     * 从cache读取
     * @param key   键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    static get(key) {
        return this.cache.get(key);
    }
    /**
     * 订阅
     * @param module    订阅的模块
     * @param key       字段key
     * @param handler   回调函数 参数为key对应value
     */
    static subscribe(module, key, handler) {
        this.cache.subscribe(module, key, handler);
    }
    /**
     * 从cache移除
     * @param key   键，支持"."（多级数据分割）
     */
    static remove(key) {
        this.cache.remove(key);
    }
}
//NCache实例
GlobalCache.cache = new NCache();

/**
 * 工厂基类
 */
class NFactory {
    /**
     * @param module 模块
     */
    constructor(module) {
        /**
         * 工厂item对象
         */
        this.items = new Map();
        if (module !== undefined) {
            this.moduleId = module.id;
        }
    }
    /**
     * 添加到工厂
     * @param name 	item name
     * @param item	item
     */
    add(name, item) {
        this.items.set(name, item);
    }
    /**
     * 获得item
     * @param name 	item name
     * @returns     item
     */
    get(name) {
        return this.items.get(name);
    }
    /**
     * 从容器移除
     * @param name 	item name
     */
    remove(name) {
        this.items.delete(name);
    }
    /**
     * 是否拥有该项
     * @param name  item name
     * @return      true/false
     */
    has(name) {
        return this.items.has(name);
    }
}

/**
 * 模型类
 * 对数据做代理
 * 注意:以下5个属性名不能用
 *      __source:源数据对象
 *      __key:模型的key
 *      __module:所属模块
 *      __parent:父模型
 *      __name:在父对象中的属性名
 */
class Model {
    /**
     * @param data 		数据
     * @param module 	模块对象
     * @param parent    父模型
     * @param name      模型在父对象中的prop name
     * @returns         模型代理对象
     */
    constructor(data, module, parent, name) {
        //数据不存在或已经代理，无需再创建
        if (!data || data.__source) {
            return;
        }
        // 创建模型
        let proxy = new Proxy(data, {
            set(src, key, value, receiver) {
                let value1 = value;
                //proxy转换为源对象，否则比较会出错
                if (value && value.__source) {
                    const source = value.__source;
                    // 已经被代理，但是可能没添加当前module
                    if (source) {
                        //可能父传子，需要添加引用
                        if (value.__module !== module) {
                            module.modelManager.add(source, value);
                            value.__module.modelManager.bindModel(value, module);
                            //保存value在本模块中的属性名
                            module.modelManager.setModelName(value, key);
                        }
                        value1 = source;
                    }
                }
                //值未变,proxy 不处理
                if (src[key] === value1) {
                    return true;
                }
                let ov = src[key];
                let r = Reflect.set(src, key, value1, receiver);
                module.modelManager.update(receiver, key, ov, value);
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
                //只处理object和array
                if (res && (res.constructor === Object || res.constructor === Array)) {
                    let m = module.modelManager.getModel(res);
                    if (!m) {
                        m = new Model(res, module, receiver, key);
                    }
                    res = m;
                }
                return res;
            },
            deleteProperty(src, key) {
                let oldValue = src[key];
                delete src[key];
                module.modelManager.update(proxy, key, oldValue, undefined);
                return true;
            }
        });
        module.modelManager.add(data, proxy);
        return proxy;
    }
}

/**
 * 模型工厂
 */
class ModelManager {
    /**
     * 构造器
     * @param module    模块
     */
    constructor(module) {
        /**
         * 数据map
         * {data:{model:model,key:key}
         * 其中：
         *      data:       初始数据对象
         *      model:      model对象
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
         *  key:model
         *  value:{key1:{f:foo1,deep:true/false},key2:,...}
         *        其中：prop为被监听属性，foo为监听器方法，deep为是否深度监听
         */
        this.watchMap = new WeakMap();
        /**
         * 是否存在深度watcher
         */
        this.hasDeepWatch = false;
        /**
         * 绑定module map，slot引用外部数据时有效
         * {model:[moduleid1,moduleid2,...]}
         */
        this.bindMap = new WeakMap();
        this.module = module;
    }
    /**
     * 获取model，不存在则新建
     * @param data      数据
     * @returns         model
     */
    getModel(data) {
        return this.dataMap.has(data) ? this.dataMap.get(data).model : undefined;
    }
    /**
     * 获取model key
     * @param model     model对象
     * @returns         model对应key
     */
    getModelKey(data) {
        return this.dataMap.has(data) ? this.dataMap.get(data).key : undefined;
    }
    /**
     * 设置模型名
     * @param model 模型
     * @param name  名
     */
    setModelName(model, name) {
        if (!this.nameMap.has(model)) {
            this.nameMap.set(model, name);
        }
    }
    /**
     * 获取模型名
     * @param model 模型
     * @returns     模型名
     */
    getModelName(model) {
        return this.nameMap.get(model);
    }
    /**
     * 添加数据到map
     * @param data      原始数据
     * @param model     模型
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
     * @param model     模型
     * @param moduleId  模块id
     */
    bindModel(model, module) {
        if (!model) {
            return;
        }
        bind(this.bindMap, model, module);
        /**
         * 绑定
         * @param bindMap
         * @param model
         * @param module
         */
        function bind(bindMap, model, module) {
            if (model.__module === module) {
                return;
            }
            let mids;
            if (!bindMap.has(model)) {
                mids = [];
                bindMap.set(model, mids);
            }
            else {
                mids = bindMap.get(model);
            }
            if (!mids.includes(module.id)) {
                mids.push(module.id);
            }
            //级联绑定
            for (let key of Object.keys(model)) {
                if (model[key] && typeof model[key] === 'object') {
                    bind(bindMap, model[key], module);
                }
            }
        }
    }
    /**
     * 更新导致渲染
     * 如果不设置oldValue和newValue，则直接强制渲染
     * @param model     model
     * @param key       属性
     * @param oldValue  旧值
     * @param newValue  新值
     */
    update(model, key, oldValue, newValue) {
        //处理watch
        handleWatcher(this.module, model);
        //添加module渲染
        Renderer.add(this.module);
        //对绑定模块添加渲染
        if (this.bindMap.has(model)) {
            for (let id of this.bindMap.get(model)) {
                const m = ModuleFactory.get(id);
                if (m) {
                    handleWatcher(m, model);
                    Renderer.add(m);
                }
            }
        }
        /**
         * 处理watcher
         * @param mdl   模块
         * @param model 模型
         */
        function handleWatcher(mdl, model) {
            const map = mdl.modelManager.watchMap;
            let watcher = map.get(model);
            //当前model存在watcher
            if (watcher && watcher[key]) {
                //查找对应key是否存在watch
                watcher[key].f.call(mdl, model, key, oldValue, newValue);
            }
            else if (mdl.modelManager.hasDeepWatch) { //进行deep查找
                for (let m = model; m && m.__parent; m = m.__parent) {
                    //如果已经跨模块，则表示为父传子，父模块指向当前模块
                    let pm = m.__parent.__module === mdl ? m.__parent : mdl.model;
                    if (!map.has(pm)) {
                        continue;
                    }
                    const watcher = map.get(pm);
                    const name = mdl.modelManager.getModelName(m) || m.__name;
                    if (watcher && watcher[name]) {
                        let cfg = watcher[name];
                        // 当前model或父model deep watch
                        if (cfg.deep) {
                            cfg.f.call(mdl, model, key, oldValue, newValue);
                            //找到即跳出循环
                            break;
                        }
                    }
                }
            }
        }
    }
    /**
     * 监听某个数据项
     * 注意：执行此操作时，该数据项必须已经存在，否则监听失败
     * @param model     带watch的model
     * @param key       数据项名或数组
     * @param operate   数据项变化时执行方法
     * @param module    指定模块，如果指定，则表示该model绑定的所有module都会触发watch事件，在model父(模块)传子(模块)传递的是对象时会导致多个watch出发
     * @param deep      是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
     *
     * @returns         unwatch函数
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
            for (let k of key) {
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
            for (let f of arr) {
                let obj = me.watchMap.get(f.m);
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
         * @param model     当前model
         * @param key       监听属性，可以支持多级属性，如果为多级属性，倒数第二级对应数据项必须为对象
         * @param operate   操作方法
         * @returns
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
     * 查询model子属性
     * @param key       属性名，可以分级，如 name.firstName
     * @param model     模型
     * @returns         属性对应model proxy
     */
    get(model, key) {
        if (key) {
            if (key.indexOf('.') !== -1) { //层级字段
                let arr = key.split('.');
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
     * 设置值
     * @param model     模型
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     */
    set(model, key, value) {
        if (key.indexOf('.') !== -1) { //层级字段
            let arr = key.split('.');
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
 * 指令管理器
 * $directives  指令集
 * $expressions 表达式集
 * $events      事件集
 * $savedoms    dom相关缓存 包括 html dom 和 参数
 * $doms        渲染树
 */
class ObjectManager {
    /**
     * module   模块
     * @param module
     */
    constructor(module) {
        this.module = module;
        this.cache = new NCache();
    }
    /**
     * 保存到cache
     * @param key       键，支持"."（多级数据分割）
     * @param value     值
     */
    set(key, value) {
        this.cache.set(key + '', value);
    }
    /**
     * 从cache读取
     * @param key   键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    get(key) {
        return this.cache.get(key);
    }
    /**
     * 从cache移除
     * @param key   键，支持"."（多级数据分割）
     */
    remove(key) {
        this.cache.remove(key);
    }
    /**
     * 设置事件参数
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     * @param value     参数值
     */
    setEventParam(id, key, name, value) {
        this.cache.set('$events.' + id + '.$params.' + key + '.' + name, value);
    }
    /**
     * 获取事件参数值
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     * @returns         参数值
     */
    getEventParam(id, key, name) {
        return this.get('$events.' + id + '.$params.' + key + '.' + name);
    }
    /**
     * 移除事件参数
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     */
    removeEventParam(id, key, name) {
        this.remove('$events.' + id + '.$params.' + key + '.' + name);
    }
    /**
     * 清空事件参数
     * @param id        事件id
     * @param key       dom key
     */
    clearEventParam(id, key) {
        if (key) { //删除对应dom的事件参数
            this.remove('$events.' + id + '.$params.' + key);
        }
        else { //删除所有事件参数
            this.remove('$events.' + id + '.$params');
        }
    }
    /**
     * 设置dom参数值
     * @param key       dom key
     * @param name      参数名
     * @param value     参数值
     */
    setDomParam(key, name, value) {
        this.set('$domparam.' + key + '.' + name, value);
    }
    /**
     * 获取dom参数值
     * @param key       dom key
     * @param name      参数名
     * @returns         参数值
     */
    getDomParam(key, name) {
        return this.get('$domparam.' + key + '.' + name);
    }
    /**
     * 移除dom参数值
     * @param key       dom key
     * @param name      参数名
     */
    removeDomParam(key, name) {
        this.remove('$domparam.' + key + '.' + name);
    }
    /**
     * 清除element 参数集
     * @param key   dom key
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
 * dom 管理器，用于管理模块的虚拟dom，旧渲染树
 */
class DomManager {
    constructor(module) {
        /**
         *  key:html node映射
         */
        this.elementMap = new Map();
        this.module = module;
    }
    /**
     * 从origin tree 获取虚拟dom节点
     * @param key   dom key
     */
    getOriginDom(key) {
        if (!this.vdomTree) {
            return null;
        }
        return find(this.vdomTree);
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
     * 从渲染树中获取key对应的渲染节点
     * @param key   dom key
     */
    getRenderedDom(key) {
        if (!this.renderedTree) {
            return;
        }
        return find(this.renderedTree, key);
        /**
         * 递归查找
         * @param dom   渲染dom
         * @param key   待查找key
         * @returns     key对应renderdom 或 undefined
         */
        function find(dom, key) {
            if (dom.key === key) {
                return dom;
            }
            if (dom.children) {
                for (let d of dom.children) {
                    if (!d) {
                        continue;
                    }
                    let d1 = find(d, key);
                    if (d1) {
                        return d1;
                    }
                }
            }
        }
    }
    /**
     * 克隆渲染后的dom节点
     * @param key   dom key或dom节点
     * @param deep  是否深度复制（复制子节点）
     */
    cloneRenderedDom(key, deep) {
        let src;
        if (typeof key === 'string') {
            src = this.getRenderedDom(key);
        }
        else {
            src = key;
        }
        if (!src) {
            return null;
        }
        let dst = {
            key: key,
            vdom: src.vdom,
            tagName: src.tagName,
            staticNum: src.staticNum,
            textContent: src.textContent,
            moduleId: src.moduleId
        };
        if (src.props) {
            dst.props = {};
            for (let k of Object.keys(src.props)) {
                dst.props[k] = src.props[k];
            }
        }
        if (src.assets) {
            dst.assets = {};
            for (let k of Object.keys(src.assets)) {
                dst.assets[k] = src.assets[k];
            }
        }
        if (deep && src.children) {
            dst.children = [];
            for (let c of src.children) {
                dst.children.push(this.cloneRenderedDom(c));
            }
        }
        return dst;
    }
    /**
     * 清除html element map 节点
     * @param dom   dom节点，如果为空，则清空map
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
     * 获取html node
     * @param key   dom key
     * @returns     html node
     */
    getElement(key) {
        return this.elementMap.get(key);
    }
    /**
     * save html node
     * @param key   dom key
     * @param node  html node
     */
    saveElement(key, node) {
        this.elementMap.set(key, node);
    }
    /**
     * 释放node
     * 包括从dom树解挂，释放对应结点资源
     * @param dom       虚拟dom
     */
    freeNode(dom) {
        if (dom.moduleId) { //子模块
            let m = ModuleFactory.get(dom.moduleId);
            if (m) {
                m.unmount();
            }
        }
        else { //普通节点
            //从map移除
            this.clearElementMap(dom);
            //解绑所有事件
            this.module.eventFactory.unbindAll(dom.key);
            //子节点递归操作
            if (dom.children) {
                for (let d of dom.children) {
                    this.freeNode(d);
                }
            }
        }
    }
    /**
     * 重置
     */
    reset() {
        this.renderedTree = null;
        this.elementMap.clear();
    }
}

/**
 * 模块类
 * 模块方法说明：模板内使用的方法，包括事件，都直接在模块内定义
 *      方法this：指向module实例
 *      事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *      表达式方法：参数按照表达式方式给定即可
 * 模块事件
 *      onBeforeFirstRender 首次渲染前
 *      onFirstRender       首次渲染后
 *      onBeforeRender      增量渲染前
 *      onRender            增量渲染后
 *      onCompile           编译后
 *      onBeforeMount       挂载到html dom树前（onFirstRender渲染后）
 *      onMount             挂载到html dom树后(首次渲染到html树后)
 *      onBeforeUnMount     从html dom树解挂前
 *      onUnmount           从html dom树解挂后
 *      onBeforeUpdate      更新到html dom树前（onRender后，针对增量渲染）
 *      onUpdate            更新到html dom树后（针对增量渲染）
 */
class Module {
    /**
     * 构造器
     */
    constructor() {
        /**
         * 编译后的根结点props
         */
        this.originProps = new Map();
        /**
         * 子模块id数组
         */
        this.children = [];
        this.id = Util.genId();
        this.modelManager = new ModelManager(this);
        this.domManager = new DomManager(this);
        this.objectManager = new ObjectManager(this);
        this.eventFactory = new EventFactory(this);
        //初始化model
        this.model = new Model(this.data() || {}, this);
        // 设置状态为未挂载
        this.state = EModuleState.UNMOUNTED;
        //加入模块工厂
        ModuleFactory.add(this);
    }
    /**
     * 模板串方法，使用时重载
     * @param props     props对象，在模板容器dom中进行配置，从父模块传入
     * @returns         模板串
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
        if (this.state === EModuleState.UNMOUNTED) {
            return;
        }
        //检测模板并编译
        let templateStr = this.template(this.props);
        //与旧模板不一样，需要重新编译
        if (templateStr !== this.oldTemplate) {
            this.oldTemplate = templateStr;
            this.compile();
        }
        //不存在domManager.vdomTree，不渲染
        if (!this.domManager.vdomTree) {
            return;
        }
        if (!this.hasRendered) { //首次渲染
            this.doModuleEvent('onBeforeFirstRender');
        }
        //渲染前事件
        this.doModuleEvent('onBeforeRender');
        //保留旧树
        const oldTree = this.domManager.renderedTree;
        //渲染
        this.domManager.renderedTree = Renderer.renderDom(this, this.domManager.vdomTree, this.model);
        if (!this.hasRendered) { //首次渲染
            this.doModuleEvent('onFirstRender');
            this.hasRendered = true;
        }
        //每次渲染后事件
        this.doModuleEvent('onRender');
        //渲染树为空，解挂
        if (!this.domManager.renderedTree) {
            this.unmount();
            this.hasRendered = true;
            return;
        }
        //已经挂载
        if (this.state === EModuleState.MOUNTED) {
            if (oldTree && this.model) {
                // 比较节点
                let changeDoms = DiffTool.compare(this.domManager.renderedTree, oldTree);
                this.doModuleEvent('onBeforeUpdate');
                //执行更改
                if (changeDoms.length > 0) {
                    Renderer.handleChangedDoms(this, changeDoms);
                    //执行更新到html事件
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
        }
    }
    /**
     * 移除子模块
     * @param module    子模块
     */
    removeChild(module) {
        let ind = this.children.indexOf(module.id);
        if (ind !== -1) {
            module.unmount();
            this.children.splice(ind, 1);
        }
    }
    /**
     * 激活模块(准备渲染)
     * @param type  0 手动， 1父节点setProps激活，默认0
     */
    active() {
        //如果为unmounted，则设置渲染为准备好状态
        if (this.state === EModuleState.UNMOUNTED) {
            this.state = EModuleState.READY;
        }
        Renderer.add(this);
    }
    /**
     * 挂载到html dom
     */
    mount() {
        //执行挂载事件
        this.doModuleEvent('onBeforeMount');
        //渲染到fragment
        let rootEl = new DocumentFragment();
        const el = Renderer.renderToHtml(this, this.domManager.renderedTree, rootEl, true);
        if (this.container) { //自带容器（主模块或路由模块）
            this.container.appendChild(rootEl);
        }
        else if (this.srcDom) {
            const pm = this.getParent();
            if (!pm) {
                return;
            }
            //替换占位符
            this.srcElement = pm.getElement(this.srcDom.key);
            if (this.srcElement) {
                this.srcElement.parentElement.replaceChild(el, this.srcElement);
            }
            pm.saveElement(this.srcDom.key, el);
        }
        //执行挂载事件
        this.doModuleEvent('onMount');
        this.state = EModuleState.MOUNTED;
    }
    /**
     * 解挂，从htmldom 移除
     */
    unmount() {
        // 主模块或状态为unmounted的模块不用处理
        if (this.state === EModuleState.UNMOUNTED || ModuleFactory.getMain() === this) {
            return;
        }
        //从render列表移除
        Renderer.remove(this.id);
        //清空event factory
        this.eventFactory.clear();
        // this.hasRendered = false;
        this.doModuleEvent('onBeforeUnMount');
        //module根与源el切换
        const el = this.getElement(1);
        if (el) {
            if (this.container) { //带容器(路由方法加载)
                this.container.removeChild(el);
            }
            else if (this.srcDom) {
                const pm = this.getParent();
                if (pm) {
                    //设置模块占位符
                    if (el.parentElement) {
                        el.parentElement.replaceChild(this.srcElement, el);
                    }
                    pm.saveElement(this.srcDom.key, this.srcElement);
                }
            }
        }
        this.domManager.reset();
        //设置状态
        this.state = EModuleState.UNMOUNTED;
        this.doModuleEvent('onUnMount');
        //子模块递归卸载
        if (this.children) {
            for (let id of this.children) {
                let m = ModuleFactory.get(id);
                if (m) {
                    m.unmount();
                }
            }
        }
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
     * @param eventName 	事件名
     * @returns             执行结果，各事件返回值如下：
     *                          onBeforeRender：如果为true，表示不进行渲染
     */
    doModuleEvent(eventName) {
        let foo = this[eventName];
        if (foo && typeof foo === 'function') {
            return foo.apply(this, [this.model]);
        }
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
    invokeMethod(methodName, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        let m = this;
        let foo = m[methodName];
        if (!foo && this.compileMid) {
            m = ModuleFactory.get(this.compileMid);
            if (m) {
                foo = m[methodName];
            }
        }
        if (foo && typeof foo === 'function') {
            let args = [];
            for (let i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            return foo.apply(m, args);
        }
    }
    /**
     * 设置props
     * @param props     属性值
     * @param dom       子模块对应渲染后节点
     */
    setProps(props, dom) {
        let dataObj = props.$data;
        this.changedProps = {};
        delete props.$data;
        //props数据复制到模块model
        if (dataObj) {
            for (let d of Object.keys(dataObj)) {
                this.model[d] = dataObj[d];
            }
        }
        //保留src dom
        this.srcDom = dom;
        //如果不存在旧的props，则change为true，否则初始化为false
        let change = false;
        if (!this.props) {
            this.changedProps = props;
            change = true;
        }
        else {
            for (let k of Object.keys(props)) {
                // object 默认改变
                if (props[k] !== this.props[k]) {
                    change = true;
                    //保留更改的属性
                    this.changedProps[k] = props[k];
                }
            }
        }
        //保存事件数组
        this.events = dom.vdom.events;
        //合并根dom属性
        if (change) {
            this.mergeProps(this.changedProps);
        }
        //props发生改变或unmounted，激活模块
        if (change || this.state === EModuleState.UNMOUNTED) {
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
            for (let cls of this.modules) {
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
        //编译
        this.domManager.vdomTree = new Compiler(this).compile(this.oldTemplate);
        if (!this.domManager.vdomTree) {
            return;
        }
        //保存originProps(由编译后的节点属性确认)
        if (this.domManager.vdomTree.props) {
            for (let p of this.domManager.vdomTree.props) {
                this.originProps.set(p[0], p[1]);
            }
        }
        //合并属性
        this.mergeProps(this.props);
        //添加从源dom传递的事件
        if (this.events) {
            for (let ev of this.events) {
                this.domManager.vdomTree.addEvent(ev);
            }
        }
        //增加编译后事件
        this.doModuleEvent('onCompile');
    }
    /**
     * 设置不渲染到根dom的属性集合
     * @param props     待移除的属性名属组
     */
    setExcludeProps(props) {
        this.excludedProps = props;
    }
    /**
    * 合并根节点属性
    * @param dom       dom节点
    * @param props     属性集合
    * @returns         是否改变
    */
    mergeProps(props) {
        if (!props || !this.domManager.vdomTree) {
            return;
        }
        //设置根属性
        for (let k of Object.keys(props)) {
            //排除的props不添加到属性
            if (!this.excludedProps || !this.excludedProps.includes(k)) {
                //如果dom自己有k属性，则处理为数组
                if (this.originProps.has(k)) {
                    this.domManager.vdomTree.setProp(k, [props[k], this.originProps.get(k)]);
                }
                else { //dom自己无此属性
                    this.domManager.vdomTree.setProp(k, props[k]);
                }
            }
        }
    }
    /**
     * 获取html node
     * @param key   dom key
     * @returns     html node
     */
    getElement(key) {
        return this.domManager.elementMap.get(key);
    }
    /**
     * save html node
     * @param key   dom key
     * @param node  html node
     */
    saveElement(key, node) {
        this.domManager.elementMap.set(key, node);
    }
    /**
     * 获取模块类名对应的第一个子模块(如果设置deep，则深度优先)
     * @param name          子模块类名或别名
     * @param deep          是否深度获取
     * @param attrs         属性集合
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
         * @param mdl   模块
         * @returns     符合条件的子模块
         */
        function find(mdl) {
            for (let id of mdl.children) {
                let m = ModuleFactory.get(id);
                if (m) {
                    if (m.constructor === cls) {
                        if (attrs) { //属性集合不为空
                            //全匹配标识
                            let matched = true;
                            for (let k of Object.keys(attrs)) {
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
                        let r = find(m);
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
     * @param className     子模块类名
     * @param deep          深度查询
     */
    getModules(className, deep) {
        if (!this.children) {
            return;
        }
        let arr = [];
        find(this);
        return arr;
        /**
         * 查询
         * @param module
         */
        function find(module) {
            if (!module.children) {
                return;
            }
            for (let id of module.children) {
                let m = ModuleFactory.get(id);
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
     * 监听
     * 如果第一个参数为属性名，则第二个参数为钩子函数，第三个参数为deep，默认model为根模型
     * 否则按照以下说明
     * @param model     模型或属性
     * @param key       属性/属性数组，支持多级属性
     * @param operate   钩子函数
     * @param deep      是否深度监听
     * @returns         可回收监听器，执行后取消监听
     */
    watch(model, key, operate, deep) {
        if (model['__key']) {
            return this.modelManager.watch(model, key, operate, deep);
        }
        else {
            return this.modelManager.watch(this.model, model, key, operate);
        }
    }
    /**
     * 设置模型属性值
     * 如果第一个参数为属性名，则第二个参数为属性值，默认model为根模型
     * 否则按照以下说明
     * @param model     模型
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     */
    set(model, key, value) {
        if (model['__key']) {
            this.modelManager.set(model, key, value);
        }
        else {
            this.modelManager.set(this.model, model, key);
        }
    }
    /**
     * 获取模型属性值
     * 如果第一个参数为属性名，默认model为根模型
     * 否则按照以下说明
     * @param model     模型
     * @param key       属性名，可以分级，如 name.firstName，如果为null，则返回自己
     * @returns         属性值
     */
    get(model, key) {
        if (model['__key']) {
            return this.modelManager.get(model, key);
        }
        else {
            return this.modelManager.get(this.model, model);
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

/**
 * module 元素
 */
class MODULE extends DefineElement {
    constructor(node, module) {
        super(node);
        //类名
        let clazz = node.getProp('name');
        if (!clazz) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'MODULE', 'className');
        }
        node.delProp('name');
        node.addDirective(new Directive('module', clazz));
    }
}
/**
 * for 元素
 */
class FOR extends DefineElement {
    constructor(node, module) {
        super(node);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'FOR', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('repeat', cond));
    }
}
/**
 * 递归元素
 */
class RECUR extends DefineElement {
    constructor(node, module) {
        super(node);
        //条件
        let cond = node.getProp('cond');
        node.delProp('cond');
        node.addDirective(new Directive('recur', cond));
    }
}
/**
 * IF 元素
 */
class IF extends DefineElement {
    constructor(node, module) {
        super(node);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'IF', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('if', cond));
    }
}
class ELSE extends DefineElement {
    constructor(node, module) {
        super(node);
        node.addDirective(new Directive('else', null));
    }
}
/**
 * ELSEIF 元素
 */
class ELSEIF extends DefineElement {
    constructor(node, module) {
        super(node);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'ELSEIF', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('elseif', cond));
    }
}
/**
 * ENDIF 元素
 */
class ENDIF extends DefineElement {
    constructor(node, module) {
        super(node);
        node.addDirective(new Directive('endif', null));
    }
}
/**
 * 替代器
 */
class SLOT extends DefineElement {
    constructor(node, module) {
        super(node);
        //条件
        let cond = node.getProp('name') || 'default';
        node.delProp('name');
        node.addDirective(new Directive('slot', cond));
    }
}
DefineElementManager.add([MODULE, FOR, IF, RECUR, ELSE, ELSEIF, ENDIF, SLOT]);

((function () {
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
    createDirective('module', function (module, dom) {
        let m;
        //存在moduleId，表示已经渲染过，不渲染
        let mid = module.objectManager.getDomParam(dom.key, 'moduleId');
        if (mid) {
            m = ModuleFactory.get(mid);
        }
        else {
            let cls = this.value;
            if (typeof cls === 'string') {
                cls = cls.toLocaleLowerCase();
            }
            m = ModuleFactory.get(cls);
            if (!m) {
                return true;
            }
            //设置编译源id
            if (this.params && this.params.srcId) {
                m.compileMid = this.params.srcId;
            }
            mid = m.id;
            //保留modelId
            module.objectManager.setDomParam(dom.key, 'moduleId', mid);
            module.addChild(m);
        }
        //保存到dom上，提升渲染性能
        dom.moduleId = mid;
        //变成文本节点，作为子模块占位符，子模块渲染后插入到占位符前面
        delete dom.tagName;
        //设置props，如果改变了props，启动渲染
        let o = {};
        if (dom.props) {
            for (let p of Object.keys(dom.props)) {
                let v = dom.props[p];
                if (p[0] === '$') { //数据
                    if (!o.$data) {
                        o.$data = {};
                    }
                    o.$data[p.substring(1)] = v;
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
    createDirective('model', function (module, dom) {
        let model = module.get(this.value, dom.model);
        if (model) {
            dom.model = model;
        }
        return true;
    }, 1);
    /**
     * 指令名 repeat
     * 描述：重复指令
     */
    createDirective('repeat', function (module, dom) {
        let rows = this.value;
        // 无数据，不渲染
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
        delete src.model;
        for (let i = 0; i < rows.length; i++) {
            if (!rows[i]) {
                continue;
            }
            if (idxName) {
                rows[i][idxName] = i;
            }
            //渲染一次-1，所以需要+1
            src.staticNum++;
            let d = Renderer.renderDom(module, src, rows[i], parent, rows[i].__key);
            //删除$index属性
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
     *      <div>...</div>
     *      <p>...</p>
     *      <recur ref='r1' />
     * </recur>
     * ```
     */
    createDirective('recur', function (module, dom) {
        const src = dom.vdom;
        //当前节点是递归节点存放容器
        if (dom.props.hasOwnProperty('ref')) {
            //如果出现在repeat中，src为单例，需要在使用前清空子节点，避免沿用上次的子节点
            src.children = [];
            //递归存储名
            const name = '$recurs.' + (dom.props['ref'] || 'default');
            let node = module.objectManager.get(name);
            if (!node) {
                return true;
            }
            let model = dom.model;
            let cond = node.getDirective('recur');
            let m = model[cond.value];
            //不存在子层数组，不再递归
            if (!m) {
                return true;
            }
            //克隆，后续可以继续用
            let node1 = node.clone();
            //recur子节点不为数组，依赖子层数据，否则依赖repeat数据
            if (!Array.isArray(m)) {
                node1.model = m;
                //避免key相同，进行子节点key处理
                Util.setNodeKey(node1, m.__key, true);
            }
            src.children = [node1];
            node1.parent = src;
        }
        else { //递归节点
            let data = dom.model[this.value];
            if (!data) {
                return true;
            }
            //递归名，默认default
            const name = '$recurs.' + (dom.props['name'] || 'default');
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
    createDirective('if', function (module, dom) {
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
    createDirective('else', function (module, dom) {
        if (!dom.parent) {
            return;
        }
        return !module.objectManager.getDomParam(dom.parent.key, '$if');
    }, 5);
    /**
     * elseif 指令
     */
    createDirective('elseif', function (module, dom) {
        if (!dom.parent) {
            return;
        }
        let v = module.objectManager.getDomParam(dom.parent.key, '$if');
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
    createDirective('endif', function (module, dom) {
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
    createDirective('show', function (module, dom) {
        //show指令参数 {origin:通过style设置的初始display属性,rendered:是否渲染过}
        let showParam = module.objectManager.getDomParam(dom.key, '$show');
        //为false且未渲染过，则不渲染
        if (!this.value && (!showParam || !showParam.rendered)) {
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
                let ra = regResult[0].split(':');
                display = ra[1].trim();
                //保存第一个display属性
                if (!showParam.origin && display !== 'none') {
                    showParam.origin = display;
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
            showParam.rendered = true;
            if (display === 'none') {
                if (showParam.origin) {
                    style = style.substring(0, regResult.index) + 'display:' + showParam.origin + style.substring(regResult.index + regResult[0].length);
                }
                else {
                    style = style.substring(0, regResult.index) + style.substring(regResult.index + regResult[0].length);
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
    createDirective('field', function (module, dom) {
        const type = dom.props['type'] || 'text';
        const tgname = dom.tagName.toLowerCase();
        const model = dom.model;
        if (!model) {
            return true;
        }
        let dataValue = module.get(this.value, model);
        if (type === 'radio') {
            let value = dom.props['value'];
            if (dataValue == value) {
                dom.props['checked'] = 'checked';
                Util.setDomAsset(dom, 'checked', true);
            }
            else {
                delete dom.props['checked'];
                Util.setDomAsset(dom, 'checked', false);
            }
        }
        else if (type === 'checkbox') {
            //设置状态和value
            let yv = dom.props['yes-value'];
            //当前值为yes-value
            if (dataValue == yv) {
                dom.props['value'] = yv;
                Util.setDomAsset(dom, 'checked', true);
            }
            else { //当前值为no-value
                dom.props['value'] = dom.props['no-value'];
                Util.setDomAsset(dom, 'checked', false);
            }
        }
        else if (tgname === 'select') { //下拉框
            dom.props['value'] = dataValue;
            Util.setDomAsset(dom, 'value', dataValue);
        }
        else {
            let v = (dataValue !== undefined && dataValue !== null) ? dataValue : '';
            dom.props['value'] = v;
            Util.setDomAsset(dom, 'value', v);
        }
        let event = GlobalCache.get('$fieldChangeEvent');
        if (!event) {
            event = new NEvent(null, 'change', function (model, dom) {
                const el = this.getElement(dom.key);
                if (!el) {
                    return;
                }
                let directive = dom.vdom.getDirective('field');
                let type = dom.props['type'];
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
                let arr = field.split('.');
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
            GlobalCache.set('$fieldChangeEvent', event);
        }
        dom.vdom.addEvent(event);
        return true;
    }, 10);
    /**
     * route指令
     */
    createDirective('route', function (module, dom) {
        //a标签需要设置href
        if (dom.tagName.toLowerCase() === 'a') {
            dom.props['href'] = 'javascript:void(0)';
        }
        dom.props['path'] = this.value;
        //有激活属性
        if (dom.props['active']) {
            let acName = dom.props['active'];
            delete dom.props['active'];
            //active 转expression
            Router.addActiveField(module, this.value, dom.model, acName);
            if ((Router.currentPath && this.value.startsWith(Router.currentPath) || !Router.currentPath) && dom.model[acName]) {
                Router.go(this.value);
            }
        }
        //添加click事件,避免重复创建事件对象，创建后缓存
        let event = GlobalCache.get('$routeClickEvent');
        if (!event) {
            event = new NEvent(null, 'click', function (model, dom, evObj, e) {
                let path = dom.props['path'];
                if (Util.isEmpty(path)) {
                    return;
                }
                Router.go(path);
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
    createDirective('router', function (module, dom) {
        Router.routerKeyMap.set(module.id, dom.key);
        return true;
    }, 10);
    /**
     * 插头指令
     * 用于模块中，可实现同名替换
     */
    createDirective('slot', function (module, dom) {
        this.value = this.value || 'default';
        let mid = dom.parent.moduleId;
        const src = dom.vdom;
        //父dom有module指令，表示为替代节点，替换子模块中的对应的slot节点；否则为子模块定义slot节点
        if (mid) {
            let m = ModuleFactory.get(mid);
            if (m) {
                //缓存当前替换节点
                m.objectManager.set('$slots.' + this.value, { dom: src, model: dom.model });
            }
        }
        else { //源slot节点
            //获取替换节点进行替换，如果没有，则渲染子节点
            const cfg = module.objectManager.get('$slots.' + this.value);
            const children = cfg ? cfg.dom.children : src.children;
            if (children) {
                for (let d of children) {
                    let model;
                    if (src.hasProp('innerrender')) { //内部数据渲染
                        model = dom.model;
                    }
                    else if (cfg) { //外部数据渲染
                        model = cfg.model;
                        //绑定数据
                        model.__module.modelManager.bindModel(model, module);
                    }
                    //以dom key作为附加key
                    Renderer.renderDom(module, d, model, dom.parent, src.key + 's');
                }
            }
        }
        return false;
    }, 5);
    /**
     * 指令名
     * 描述：动画指令
     */
    createDirective('animation', function (module, dom) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        const confObj = this.value;
        if (!Util.isObject(confObj)) {
            return new Error('未找到animation配置对象');
        }
        // 获得tigger
        const tigger = confObj.tigger == false ? false : true;
        // 用于判断是动画还是过渡
        const type = confObj.type || "transition";
        // 用于判断是否是 进入/离开动画 
        const isAppear = confObj.isAppear == false ? false : true;
        // 提取 动画/过渡 名
        const nameEnter = ((_a = confObj.name) === null || _a === void 0 ? void 0 : _a.enter) || confObj.name;
        const nameLeave = ((_b = confObj.name) === null || _b === void 0 ? void 0 : _b.leave) || confObj.name;
        // 提取 动画/过渡 持续时间
        const durationEnter = ((_c = confObj.duration) === null || _c === void 0 ? void 0 : _c.enter) || confObj.duration || '';
        const durationLeave = ((_d = confObj.duration) === null || _d === void 0 ? void 0 : _d.leavr) || confObj.duration || '';
        // 提取 动画/过渡 延迟时间
        const delayEnter = ((_e = confObj.delay) === null || _e === void 0 ? void 0 : _e.enter) || confObj.delay || '0s';
        const delayLeave = ((_f = confObj.delay) === null || _f === void 0 ? void 0 : _f.leave) || confObj.delay || '0s';
        // 提取 动画/过渡 时间函数
        const timingFunctionEnter = ((_g = confObj.timingFunction) === null || _g === void 0 ? void 0 : _g.enter) || confObj.timingFunction || 'ease';
        const timingFunctionLeave = ((_h = confObj.timingFunction) === null || _h === void 0 ? void 0 : _h.leave) || confObj.timingFunction || 'ease';
        // 提取动画/过渡 钩子函数
        const beforeEnter = ((_k = (_j = confObj.hooks) === null || _j === void 0 ? void 0 : _j.enter) === null || _k === void 0 ? void 0 : _k.before) ? confObj.hooks.enter.before : ((_l = confObj.hooks) === null || _l === void 0 ? void 0 : _l.before) || undefined;
        const afterEnter = ((_o = (_m = confObj.hooks) === null || _m === void 0 ? void 0 : _m.enter) === null || _o === void 0 ? void 0 : _o.after) ? confObj.hooks.enter.after : ((_p = confObj.hooks) === null || _p === void 0 ? void 0 : _p.after) || undefined;
        const beforeLeave = ((_r = (_q = confObj.hooks) === null || _q === void 0 ? void 0 : _q.leave) === null || _r === void 0 ? void 0 : _r.before) ? confObj.hooks.leave.before : ((_s = confObj.hooks) === null || _s === void 0 ? void 0 : _s.before) || undefined;
        const afterLeave = ((_u = (_t = confObj.hooks) === null || _t === void 0 ? void 0 : _t.leave) === null || _u === void 0 ? void 0 : _u.after) ? confObj.hooks.leave.after : ((_v = confObj.hooks) === null || _v === void 0 ? void 0 : _v.after) || undefined;
        // 定义动画或者过渡结束回调。
        let handler = () => {
            const el = module.getElement(dom.key);
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
                [el.style.width, el.style.height] = getOriginalWidthAndHeight(dom);
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
        let el = module.getElement(dom.key);
        if (!tigger) {
            // tigger为false 播放Leave动画
            if (el) {
                if (el.getAttribute('class').indexOf(`${nameLeave}-leave-to`) != -1) {
                    // 当前已经处于leave动画播放完成之后，若是进入离开动画，这时候需要他保持隐藏状态。
                    dom.props['class'] += ` ${nameLeave}-leave-to`;
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
                setTimeout(() => {
                    // el已经渲染出来，取得el 根据动画/过渡的类型来做不同的事
                    let el = module.getElement(dom.key);
                    if (isAppear) {
                        // 动画/过渡 是进入离开动画/过渡，并且当前是需要让他隐藏所以我们不播放动画，直接隐藏。
                        el.classList.add(`${nameLeave}-leave-to`);
                        // 这里必须将这个属性加入到dom中,否则该模块其他数据变化触发增量渲染时,diff会将这个节点重新渲染,导致显示异常
                        // 这里添加添加属性是为了避免diff算法重新渲染该节点
                        dom.props['class'] += ` ${nameLeave}-leave-to`;
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
                if (el.getAttribute('class').indexOf(`${nameEnter}-enter-to`) != -1) {
                    // 这里不需要像tigger=false时那样处理，这时候他已经处于进入动画播放完毕状态，
                    // 模块内其他数据变化引起该指令重新执行，这时候需要他保持现在显示的状态，直接返回true
                    dom.props['class'] += ` ${nameEnter}-enter-to`;
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
                setTimeout(() => {
                    // 等虚拟dom把元素更新上去了之后，取得元素
                    let el = module.getElement(dom.key);
                    if (isAppear) {
                        // 这里必须将这个属性加入到dom中,否则该模块其他数据变化触发增量渲染时,diff会将这个节点重新渲染,导致显示异常
                        // 这里添加添加属性是为了避免diff算法重新渲染该节点
                        dom.props['class'] += ` ${nameEnter}-enter-to`;
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
                let [width, height] = getElRealSzie(el);
                // setTimeout(() => {
                requestAnimationFrame(() => {
                    // 移除掉上一次过渡的最终状态
                    el.classList.remove(nameEnter + '-enter-to');
                    // 设置过渡的类名
                    el.classList.add(nameLeave + '-leave-active');
                    // 设置离开过渡的开始类
                    el.classList.add(nameLeave + '-leave-from');
                    // fold过渡的开始状态
                    if (nameLeave == 'fold-height') {
                        el.style.height = height;
                    }
                    else if (nameLeave == 'fold-width') {
                        el.style.width = width;
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
                    requestAnimationFrame(() => {
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
                requestAnimationFrame(() => {
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
                let delay = parseFloat(delayEnter) * 1000;
                setTimeout(() => {
                    let [width, height] = getElRealSzie(el);
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
                    requestAnimationFrame(() => {
                        // 下一帧请求过渡效果
                        // 过渡开始之前先将元素显示
                        if (isAppear) {
                            el.style.display = '';
                        }
                        // 第三帧触发过渡
                        requestAnimationFrame(() => {
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
                let delay = parseFloat(delayEnter) * 1000;
                setTimeout(() => {
                    // 动画开始之前先将元素显示
                    requestAnimationFrame(() => {
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
                const position = window.getComputedStyle(el).getPropertyValue("position");
                const vis = window.getComputedStyle(el).getPropertyValue("visibility");
                // 先脱流
                el.style.position = 'absolute';
                // 然后将元素变为
                el.style.visibility = 'hidden';
                el.style.display = '';
                let width = window.getComputedStyle(el).getPropertyValue("width");
                let height = window.getComputedStyle(el).getPropertyValue("height");
                // 还原样式
                el.style.position = position;
                el.style.visibility = vis;
                el.style.display = 'none';
                return [width, height];
            }
            else {
                let width = window.getComputedStyle(el).getPropertyValue("width");
                let height = window.getComputedStyle(el).getPropertyValue("height");
                return [width, height];
            }
        }
        /**
         * 如果dom上得style里面有width/height
         * @param dom 虚拟dom
         * @returns 获得模板上的width/height 如果没有则返回空字符串
         */
        function getOriginalWidthAndHeight(dom) {
            const oStyle = dom.vdom.getProp('style');
            let width;
            let height;
            if (oStyle) {
                let arr = oStyle.trim().split(/;\s*/);
                for (const a of arr) {
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
    }, 10);
})());

/**
 * tap事件
 */
EventManager.regist('tap', {
    touchstart(dom, module, evtObj, e) {
        let tch = e.touches[0];
        evtObj.dependEvent.setParam(module, dom, 'pos', { sx: tch.pageX, sy: tch.pageY, t: Date.now() });
    },
    touchmove(dom, module, evtObj, e) {
        let pos = evtObj.dependEvent.getParam(module, dom, 'pos');
        if (!pos) {
            return;
        }
        let tch = e.touches[0];
        let dx = tch.pageX - pos.sx;
        let dy = tch.pageY - pos.sy;
        //判断是否移动
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            pos.move = true;
        }
    },
    touchend(dom, module, evtObj, e) {
        let pos = evtObj.dependEvent.getParam(module, dom, 'pos');
        if (!pos) {
            return;
        }
        evtObj.dependEvent.removeParam(module, dom, 'pos');
        let dt = Date.now() - pos.t;
        //点下时间不超过200ms,触发事件
        if (!pos.move && dt < 200) {
            let foo = evtObj.dependEvent.handler;
            if (typeof foo === 'string') {
                module.invokeMethod(evtObj.dependEvent.handler, dom.model, dom, evtObj.dependEvent, e);
            }
            else {
                foo.apply(module, [dom.model, dom, evtObj.dependEvent, e]);
            }
        }
    }
});
/**
 * swipe事件
 */
EventManager.regist('swipe', {
    touchstart(dom, module, evtObj, e) {
        let tch = e.touches[0];
        let t = Date.now();
        evtObj.dependEvent.setParam(module, dom, 'swipe', {
            oldTime: [t, t],
            speedLoc: [{ x: tch.pageX, y: tch.pageY }, { x: tch.pageX, y: tch.pageY }],
            oldLoc: { x: tch.pageX, y: tch.pageY }
        });
    },
    touchmove(dom, module, evtObj, e) {
        let nt = Date.now();
        let tch = e.touches[0];
        let mv = evtObj.dependEvent.getParam(module, dom, 'swipe');
        //50ms记录一次
        if (nt - mv.oldTime[1] > 50) {
            mv.speedLoc[0] = { x: mv.speedLoc[1].x, y: mv.speedLoc[1].y };
            mv.speedLoc[1] = { x: tch.pageX, y: tch.pageY };
            mv.oldTime[0] = mv.oldTime[1];
            mv.oldTime[1] = nt;
        }
        mv.oldLoc = { x: tch.pageX, y: tch.pageY };
    },
    touchend(dom, module, evtObj, e) {
        let mv = evtObj.dependEvent.getParam(module, dom, 'swipe');
        let nt = Date.now();
        //取值序号 0 或 1，默认1，如果释放时间与上次事件太短，则取0
        let ind = (nt - mv.oldTime[1] < 30) ? 0 : 1;
        let dx = mv.oldLoc.x - mv.speedLoc[ind].x;
        let dy = mv.oldLoc.y - mv.speedLoc[ind].y;
        let s = Math.sqrt(dx * dx + dy * dy);
        let dt = nt - mv.oldTime[ind];
        //超过300ms 不执行事件
        if (dt > 300 || s < 10) {
            return;
        }
        let v0 = s / dt;
        //速度>0.1,触发swipe事件
        if (v0 > 0.05) {
            let sname = '';
            if (dx < 0 && Math.abs(dy / dx) < 1) {
                e.v0 = v0; //添加附加参数到e
                sname = 'swipeleft';
            }
            if (dx > 0 && Math.abs(dy / dx) < 1) {
                e.v0 = v0;
                sname = 'swiperight';
            }
            if (dy > 0 && Math.abs(dx / dy) < 1) {
                e.v0 = v0;
                sname = 'swipedown';
            }
            if (dy < 0 && Math.abs(dx / dy) < 1) {
                e.v0 = v0;
                sname = 'swipeup';
            }
            //处理swipe
            if (evtObj.dependEvent.name === sname) {
                let foo = evtObj.dependEvent.handler;
                if (typeof foo === 'string') {
                    module.invokeMethod(foo, dom.model, dom, evtObj.dependEvent, e);
                }
                else if (typeof foo === 'function') {
                    foo.apply(module, [dom.model, dom, evtObj.dependEvent, e]);
                }
            }
        }
    }
});
//把swpie注册到4个方向
EventManager.regist('swipeleft', EventManager.get('swipe'));
EventManager.regist('swiperight', EventManager.get('swipe'));
EventManager.regist('swipeup', EventManager.get('swipe'));
EventManager.regist('swipedown', EventManager.get('swipe'));
/**
 * double click
 */
EventManager.regist('dblclick', {
    click(dom, module, evtObj, e) {
        let firstClick = evtObj.dependEvent.getParam(module, dom, 'firstClick');
        if (firstClick) {
            let t = Date.now();
            //两次点击在300ms内，视为双击
            if (t - firstClick < 300) {
                let foo = evtObj.dependEvent.handler;
                if (typeof foo === 'string') {
                    module.invokeMethod(evtObj.dependEvent.handler, dom.model, dom, evtObj.dependEvent, e);
                }
                else {
                    foo.apply(module, [dom.model, dom, evtObj.dependEvent, e]);
                }
            }
        }
        else {
            evtObj.dependEvent.setParam(module, dom, 'firstClick', Date.now());
        }
        //延迟清理firstClick
        setTimeout(() => {
            evtObj.dependEvent.removeParam(module, dom, 'firstClick');
        }, 500);
    },
});

export { Compiler, CssManager, DefineElement, DefineElementManager, DiffTool, Directive, DirectiveManager, DirectiveType, EModuleState, EventFactory, EventManager, Expression, GlobalCache, Model, ModelManager, Module, ModuleFactory, NCache, NError, NEvent, NFactory, NodomMessage, NodomMessage_en, NodomMessage_zh, Renderer, Route, Router, Scheduler, Util, VirtualDom, createDirective, createRoute, nodom, registModule, request };
//# sourceMappingURL=nodom.esm.js.map
