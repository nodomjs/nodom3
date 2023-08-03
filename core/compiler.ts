import { DefineElementManager } from './defineelementmanager'
import { Directive } from './directive'
import { NError } from './error'
import { NEvent } from './event'
import { Expression } from './expression'
import { Module } from './module'
import { ModuleFactory } from './modulefactory'
import { VirtualDom } from './virtualdom'

const voidTagMap = new Set(
	'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'.split(',')
)

/**
 * 编译器
 * 
 * @remarks
 * 用于编译模板串为虚拟dom(VirtualDom)节点，存放于模块的 domManager.vdomTree
 */
export class Compiler {
	/**
	 * 模块
	 */
	private module: Module

	/**
	 * 当前节点
	 */
	private current: VirtualDom

	/**
	 * 虚拟dom数组
	 */
	private domArr: Array<VirtualDom> = []

	/**
	 * 文本节点
	 */
	private textArr: Array<string|Expression> = []

	/**
	 * 是否是表达式文本节点
	 */
	private isExprText: boolean = false

	/**
	 * 当前编译的模板，用于报错的时候定位
	 */
	private template: string = ''

	/**
	 * 根节点
	 */
	private root:VirtualDom;

	/**
	 * 当前处理标签是否在svg区域
	 */
	private isSvg:boolean;

	/**
	 * 构造器
	 * @param module - 模块
	 */
	constructor(module: Module) {
		this.module = module
	}

	/**
	 * 编译
	 * @param elementStr - 	待编译html串
	 * @returns             虚拟dom树根节点
	 */
	public compile(elementStr: string): VirtualDom {
		if(!elementStr){
			return;
		}
		// 清除注释
		this.template = elementStr.replace(/\<\!\-\-[\s\S]*?\-\-\>/g, '').trim()
		elementStr = this.template
		// 编译
		this.compileTemplate(elementStr)
		//处理未关闭节点
		if(this.domArr.length>0){
			this.forceClose(0)
		}
		return this.root
	}

	/**
	 * 产生dom key
	 * @returns   dom key
	 */
	private genKey(): number {
		return this.module.getDomKeyId()
	}

	/**
	 * 编译模板
	 * @param srcStr - 	源串
	 */
	private compileTemplate(srcStr: string) {
		while (srcStr.length !== 0) {
			if (srcStr.startsWith('<')) {
				// 标签
				if (srcStr[1] == '/') {
					// 结束标签
					srcStr = this.compileEndTag(srcStr)
				} else {
					// 开始标签
					srcStr = this.compileStartTag(srcStr)
				}
			} else {
				// 文本节点
				srcStr = this.compileText(srcStr)
			}
		}
	}

	/**
	 * 处理开始标签
	 * @param srcStr - 待编译字符串
	 * @returns 编译处理后的字符串
	 */
	private compileStartTag(srcStr: string): string {
		// 抓取<div
		const match = /^<\s*([a-z][^\s\/\>]*)/i.exec(srcStr)
		// 抓取成功
		if (match) {
			// 设置当前正在编译的节点
			const dom = new VirtualDom(
				match[1].toLowerCase(),
				this.genKey(),
				this.module
			)
			if(dom.tagName === 'svg'){
				this.isSvg = true;
			}
			//设置svg标志
			dom.isSvg = this.isSvg;

			if(!this.root){
				this.root = dom;
			}
			if(this.current){
				this.current.add(dom)
			}
			//设置当前节点
			this.current = dom
			// 当前节点入栈
			this.domArr.push(dom)
			// 截断字符串 准备处理属性
			srcStr = srcStr.substring(match.index + match[0].length).trimStart()
		} else {
			// <!-- 或者<后跟符号不是字符
			// 当作text节点
			this.textArr.push(srcStr[0])
			return srcStr.substring(1)
		}

		// 处理属性
		srcStr = this.compileAttributes(srcStr)
		// 属性处理完成之后 判断是否结束
		if (srcStr.startsWith('>')) {
			if (this.isVoidTab(this.current)) {  //属于自闭合，则处理闭合
				this.handleCloseTag(this.current,true)
			}
			return srcStr.substring(1).trimStart()
		}
		return srcStr;
	}

	/**
	 * 处理标签属性
	 * @param srcStr - 待编译字符串
	 * @returns 编译后字符串
	 */
	private compileAttributes(srcStr: string): string {
		while (srcStr.length !== 0 && srcStr[0]!=='>') {
			// 抓取形如： /> a='b' a={{b}} a="b" a=`b` a $data={{***}} a={{***}}的属性串;
			const match = /^((\/\>)|\$?[a-z_][\w-]*)(?:\s*=\s*((?:'[^']*')|(?:"[^"]*")|(?:`[^`]*`)|(?:{{[^}}]*}})))?/i.exec(srcStr)
			// 抓取成功 处理属性
			if (match) {
				if (match[0] === '/>') {  //自闭合标签结束则退出
					// 是自闭合标签
					this.handleCloseTag(this.current,true);
					srcStr = srcStr.substring(match.index + match[0].length).trimStart()
					break;
				} else { //属性
					const name = match[1][0]!=='$'?match[1].toLowerCase():match[1];
					// 是普通属性
					let value:string|Expression = !match[3]
						? undefined
						: match[3].startsWith(`"`)
						? match[3].substring(1, match[3].length - 1)
						: match[3].startsWith(`'`)
						? match[3].substring(1, match[3].length - 1)
						: match[3]
					if (value && value.startsWith('{{')) {
						value = new Expression(value.substring(2, value.length - 2))
						//表达式 staticNum为-1
						this.current.staticNum = -1;
					}
					if (name.startsWith('x-')) {
						// 指令
						this.current.addDirective(new Directive(name.substring(2), value,this.module.id))
					} else if (name.startsWith('e-')) {
						// 事件
						this.current.addEvent(
							new NEvent(this.module, name.substring(2), value)
						)
					} else {
						//普通属性
						this.current.setProp(name, value)
					}
				}
				srcStr = srcStr.substring(match.index + match[0].length).trimStart()
			} else {
				if (this.current) {
					throw new NError('tagError', [this.current.tagName])
				}
				throw new NError('wrongTemplate')
			}
		}
		return srcStr
	}

	/**
	 * 编译结束标签
	 * @param srcStr - 	源串
	 * @returns 		剩余的串
	 */
	private compileEndTag(srcStr: string): string {
		// 抓取结束标签
		const match = /^<\/\s*([a-z][^\>]*)/i.exec(srcStr)
		if(match){
			const name = match[1].toLowerCase().trim();
			//如果找不到匹配的标签头则丢弃
			let index;
			for(let i=this.domArr.length-1;i>=0;i--){
				if(this.domArr[i].tagName === name){
					index = i;
					break;
				}
			}
			//关闭
			if(index){
				this.forceClose(index);
			}
			return srcStr.substring(match.index + match[0].length + 1)
		}
		return srcStr;
	}

	/**
	 * 强制闭合
	 * @param index - 在domArr中的索引号
	 * @returns 
	 */
	private forceClose(index){
		if(index===-1 || index > this.domArr.length-1){
			return;
		}
		for(let i=this.domArr.length-1;i>=index;i--){
			this.handleCloseTag(this.domArr[i])
		}
	}
	
	/**
	 * 编译text
	 * @param srcStr - 	源串
	 * @returns 		
	 */
	private compileText(srcStr: string): string {
		// 字符串最开始变为< 或者字符串消耗完 则退出循环
		while (!srcStr.startsWith('<') && srcStr.length !== 0) {
			if (srcStr.startsWith('{')) {
				// 可能是表达式
				const matchExp = /^{{([\s\S]*?)}}/i.exec(srcStr)
				if (matchExp) {
					// 抓取成功
					this.textArr.push(new Expression(matchExp[1]))
					this.isExprText = true
					srcStr = srcStr.substring(matchExp.index + matchExp[0].length)
				} else {
					// 跳过单独的{
					typeof this.textArr[this.textArr.length] === 'string'
						? (this.textArr[this.textArr.length] += '{')
						: this.textArr.push('{')
					srcStr = srcStr.substring(1)
				}
			} else {
				// 非表达式，处理成普通字符节点
				const match = /([^\<\{]*)/.exec(srcStr)
				if (match) {
					let txt: string
					if (this.current && this.current.tagName === 'pre') {
						// 在pre标签里
						txt = this.preHandleText(
							srcStr.substring(0, match.index + match[0].length)
						)
					} else {
						txt = this.preHandleText(
							srcStr.substring(0, match.index + match[0].length).trim()
						)
					}
					if(txt !== ''){
						this.textArr.push(txt)
					}
				}
				srcStr = srcStr.substring(match.index + match[0].length)
			}
		}
		// 最开始是< 或者字符消耗完毕 退出循环
		const text = new VirtualDom(undefined, this.genKey())
		if(this.isExprText){
			text.expressions = [...this.textArr];
			//动态文本节点，staticNum=-1
			text.staticNum = -1;
		}else{
			text.textContent = this.textArr.join('')
		}
		if (this.current && (this.isExprText || text.textContent.length !== 0)) {
			this.current.add(text)
		} 
		// 重置状态
		this.isExprText = false
		this.textArr = []
		// 返回字符串
		return srcStr
	}

	/**
	 * 预处理html保留字符 如 &nbsp;,&lt;等
	 * @param str -   待处理的字符串
	 * @returns     解析之后的串
	 */
	private preHandleText(str: string): string {
		const reg = /&[a-z]+;/
		if (reg.test(str)) {
			const div = document.createElement('div')
			div.innerHTML = str
			return div.textContent
		}
		return str
	}

	/**
	 * 处理当前节点是模块或者自定义节点
	 * @param dom - 	虚拟dom节点
	 */
	private postHandleNode(dom:VirtualDom) {
		const clazz = DefineElementManager.get(dom.tagName)
		if (clazz) {
			Reflect.construct(clazz, [dom, this.module])
		}
		// 是否是模块类
		if (ModuleFactory.hasClass(dom.tagName)) {
			dom.addDirective(new Directive('module', dom.tagName,this.module.id))
			dom.tagName = 'div'
		}
	}
	/**
	 * 处理插槽
	 * @param dom - 	虚拟dom节点
	 */
	private handleSlot(dom:VirtualDom) {
		if (
			!dom.children ||
			dom.children.length === 0 ||
			!dom.hasDirective('module')
		) {
			return
		}
		let slotCt: VirtualDom
		for (let j = 0; j < dom.children.length; j++) {
			const c = dom.children[j]
			if (c.hasDirective('slot')) {
				//带slot的不处理
				continue
			}
			if (!slotCt) { //初始化default slot container
				//第一个直接被slotCt替换
				slotCt = new VirtualDom('div', this.genKey())
				slotCt.addDirective(new Directive('slot','default',this.module.id))
				//当前位置，用slot替代
				dom.children.splice(j, 1, slotCt)
			} else { 		//添加到default slot container
				//直接删除
				dom.children.splice(j--, 1)
			}
			slotCt.add(c)
		}
	}

	/**
	 * 标签闭合
	 */
	private handleCloseTag(dom:VirtualDom,isSelfClose?:boolean) {
		this.postHandleNode(dom)
		dom.sortDirective()
		if(!isSelfClose){
			this.handleSlot(dom)
		}
		//闭合节点出栈
		this.domArr.pop();
		//设置current为最后一个节点
		if(this.domArr.length>0){
			this.current = this.domArr[this.domArr.length-1];
		}
		// 取消isSvg标识
		if(dom.tagName === 'svg'){
			this.isSvg = false;
		}
	}
	/**
	 * 判断节点是否为空节点
	 * @param dom -	带检测节点
	 * @returns
	 */
	private isVoidTab(dom: VirtualDom) {
		return voidTagMap.has(dom.tagName)
	}
}