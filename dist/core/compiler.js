import { DefineElementManager } from './defineelementmanager';
import { Directive } from './directive';
import { NError } from './error';
import { NEvent } from './event';
import { Expression } from './expression';
import { ModuleFactory } from './modulefactory';
import { VirtualDom } from './virtualdom';
const voidTagMap = new Set('area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'.split(','));
/**
 * - 模板标签必须闭合
 */
/**
 * - 模板标签必须闭合
 */
export class Compiler {
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
//# sourceMappingURL=compiler.js.map