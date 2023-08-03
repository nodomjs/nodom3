import { Directive } from './directive'
import { DirectiveManager } from './directivemanager'
import { NEvent } from './event'
import { Expression } from './expression'
import { Module } from './module'
import { Util } from './util'

/**
 * 虚拟dom
 * @remarks
 * 编译后的dom节点，与渲染后的dom节点(RenderedDom)不同
 */
export class VirtualDom {
	/**
	 * 元素名，如div
	 */
	public tagName: string

	/**
	 * key，数字或字符串，整颗虚拟dom树唯一
	 */
	public key: number|string

	/**
	 * 文本内容
	 * @remarks
	 * element为textnode时有效
	 */
	public textContent: string

	/**
	 * 表达式+字符串数组，用于text node
	 */
	public expressions: Array<Expression | string>

	/**
	 * 指令集
	 */
	public directives: Directive[]

	/**
	 * 直接属性
	 * @remarks
	 * 不是来自于attribute，而是直接作用于html element，如el.checked,el.value等
	 */
	public assets: Map<string, string|number|boolean>

	/**
	 * 属性(attribute)集合
	 * @remarks
	 * 属性值可能是值，也可能是表达式
	 */
	public props: Map<string, string|number|boolean|object|Expression>

	/**
	 * 事件数组
	 */
	public events: Array<NEvent>

	/**
	 * 子节点数组[]
	 */
	public children: Array<VirtualDom>

	/**
	 * 父虚拟dom
	 */
	public parent: VirtualDom;

	/**
	 * 是否为svg节点
	 */
	public isSvg:boolean;

	/**
	 * 静态标识数
	 * @remarks
	 * 用于判断是否为静态节点，默认为1，表示至少渲染1次
	 * 
	 *  0 表示静态，不进行比较
	 * 
	 *  1 渲染后 -1
	 * 
	 *  -1 每次都渲染
	 */
	public staticNum: number

	/**
	 * @param tag -     标签名
	 * @param key -     key
	 * @param module - 	模块
	 */
	constructor(tag?: string, key?: number|string, module?: Module) {
		this.key = key || (module ? module.getDomKeyId() : Util.genId())
		this.staticNum = 1;
		if (tag) {
			this.tagName = tag
		}
	}

	/**
	 * 移除多个指令
	 * @param directives - 	待删除的指令类型数组或指令类型
	 * @returns             如果虚拟dom上的指令集为空，则返回void
	 */
	public removeDirectives(directives: string[]) {
		if (!this.directives) {
			return
		}
		//数组
		directives.forEach((d) => {
			this.removeDirective(d)
		})
	}

	/**
	 * 移除指令
	 * @param directive - 	待删除的指令类型名
	 * @returns             如果虚拟dom上的指令集为空，则返回void
	 */
	public removeDirective(directive: string) {
		if (!this.directives) {
			return
		}

		let ind
		if ((ind = this.directives.findIndex(
				(item) => item.type.name === directive
			)) !== -1
		) {
			this.directives.splice(ind, 1)
		}
		if (this.directives.length === 0) {
			delete this.directives
		}
	}

	/**
	 * 添加指令
	 * @param directive -     指令对象
	 * @param sort -          是否排序
	 * @returns             如果虚拟dom上的指令集不为空，且指令集中已经存在传入的指令对象，则返回void
	 */
	public addDirective(directive: Directive, sort?: boolean) {
		if (!this.directives) {
			this.directives = [directive];
			return;
		} else if (this.directives.find((item) => item.type.name === directive.type.name)){
			return
		}
		this.directives.push(directive)
		//指令按优先级排序
		if (sort) {
			this.sortDirective()
		}
	}

	/**
	 * 指令排序
	 * @returns           如果虚拟dom上指令集为空，则返回void
	 */
	public sortDirective() {
		if (!this.directives) {
			return
		}
		if (this.directives.length > 1) {
			this.directives.sort((a, b) => {
				return DirectiveManager.getType(a.type.name).prio <
					DirectiveManager.getType(b.type.name).prio
					? -1
					: 1
			})
		}
	}

	/**
	 * 是否有某个类型的指令
	 * @param typeName - 	    指令类型名
	 * @returns             如果指令集不为空，且含有传入的指令类型名则返回true，否则返回false
	 */
	public hasDirective(typeName: string): boolean {
		return this.directives && this.directives.find(item => item.type.name === typeName) !== undefined;
	}

	/**
	 * 获取某个类型的指令
	 * @param module -            模块
	 * @param directiveType - 	指令类型名
	 * @returns                 如果指令集为空，则返回void；否则返回指令类型名等于传入参数的指令对象
	 */
	public getDirective(directiveType: string): Directive {
		if (!this.directives) {
			return
		}
		return this.directives.find((item) => item.type.name === directiveType)
	}

	/**
	 * 添加子节点
	 * @param dom -       子节点
	 * @param index -     指定位置，如果不传此参数，则添加到最后
	 */
	public add(dom: VirtualDom, index?: number) {
		if (!this.children) {
			this.children = []
		}
		if (index) {
			this.children.splice(index, 0, dom)
		} else {
			this.children.push(dom)
		}
		dom.parent = this
	}

	/**
	 * 移除子节点
	 * @param dom -   子节点
	 */
	public remove(dom: VirtualDom) {
		const index = this.children.indexOf(dom)
		if (index !== -1) {
			this.children.splice(index, 1)
		}
	}

	/**
	 * 是否拥有属性
	 * @param propName -  属性名
	 * @param isExpr -    是否只检查表达式属性
	 * @returns         如果属性集含有传入的属性名返回true，否则返回false
	 */
	public hasProp(propName: string) {
		if (this.props) {
			return this.props.has(propName)
		}
	}

	/**
	 * 获取属性值
	 * @param propName -  属性名
	 * @returns         传入属性名的value
	 */
	public getProp(propName: string) {
		if (this.props) {
			return this.props.get(propName)
		}
	}

	/**
	 * 设置属性值
	 * @param propName -  属性名
	 * @param v -         属性值
	 */
	public setProp(propName: string, v: string|number|boolean|object|Expression) {
		if (!this.props) {
			this.props = new Map()
		}
		this.props.set(propName, v)
	}

	/**
	 * 删除属性
	 * @param props -     属性名或属性名数组
	 * @returns         如果虚拟dom上的属性集为空，则返回void
	 */
	public delProp(props: string | string[]) {
		if (!this.props) {
			return
		}
		this.props.delete(<string>props)
	}

	/**
	 * 设置asset
	 * @param assetName -     asset name
	 * @param value -         asset value
	 */
	public setAsset(assetName: string, value: string|number|boolean) {
		if (!this.assets) {
			this.assets = new Map()
		}
		this.assets.set(assetName, value)
		this.setStaticOnce();
	}

	/**
	 * 删除asset
	 * @param assetName -     asset name
	 * @returns             如果虚拟dom上的直接属性集为空，则返回void
	 */
	public delAsset(assetName: string) {
		if (!this.assets) {
			return
		}
		this.assets.delete(assetName)
		this.setStaticOnce();
	}

	/**
	 * 设置cache参数
	 * @param module -    模块
	 * @param name -      参数名
	 * @param value -     参数值
	 */
	public setParam(module: Module, name: string, value: string|boolean|number|object) {
		module.objectManager.setDomParam(this.key, name, value)
	}

	/**
	 * 获取参数值
	 * @param module -    模块
	 * @param name -      参数名
	 * @returns         参数值
	 */
	public getParam(module: Module, name: string) {
		return module.objectManager.getDomParam(this.key, name)
	}

	/**
	 * 移除参数
	 * @param module -    模块
	 * @param name -      参数名
	 */
	public removeParam(module: Module, name: string) {
		module.objectManager.removeDomParam(this.key, name)
	}

	/**
	 * 设置单次静态标志
	 */
	private setStaticOnce() {
		if (this.staticNum !== -1) {
			this.staticNum = 1;
		}
	}

	/**
	 * 克隆
	 */
	public clone(): VirtualDom {
		const dst: VirtualDom = new VirtualDom(this.tagName, this.key)
		if (this.tagName) {
			//属性
			if (this.props && this.props.size > 0) {
				for (const p of this.props) {
					dst.setProp(p[0], p[1])
				}
			}

			if (this.assets && this.assets.size > 0) {
				for (const p of this.assets) {
					dst.setAsset(p[0], p[1])
				}
			}

			if (this.directives && this.directives.length > 0) {
				dst.directives = []
				for (const d of this.directives) {
					dst.directives.push(d.clone())
				}
			}
			//复制事件
			dst.events = this.events

			//子节点clone
			if (this.children) {
				for (const c of this.children) {
					dst.add(c.clone())
				}
			}
		} else {
			dst.expressions = this.expressions
			dst.textContent = this.textContent
		}
		dst.staticNum = this.staticNum
		return dst
	}

	/**
	 * 保存事件
	 * @param event -     事件对象
	 * @param index - 	位置
	 */
	public addEvent(event: NEvent,index?:number) {
		if (!this.events) {
			this.events = [event]
		}else if(!this.events.includes(event)){
			if(index >= 0){
				this.events.splice(index,0,event)
			}else{
				this.events.push(event)
			}
		}
	}
}
