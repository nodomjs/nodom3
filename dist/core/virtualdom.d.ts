import { Directive } from './directive';
import { NEvent } from './event';
import { Expression } from './expression';
import { Module } from './module';
/**
 * 虚拟dom
 * @remarks
 * 编译后的dom节点，与渲染后的dom节点(RenderedDom)不同
 */
export declare class VirtualDom {
    /**
     * 元素名，如div
     */
    tagName: string;
    /**
     * key，数字或字符串，整颗虚拟dom树唯一
     */
    key: number | string;
    /**
     * 文本内容
     * @remarks
     * element为textnode时有效
     */
    textContent: string;
    /**
     * 表达式+字符串数组，用于text node
     */
    expressions: Array<Expression | string>;
    /**
     * 指令集
     */
    directives: Directive[];
    /**
     * 直接属性
     * @remarks
     * 不是来自于attribute，而是直接作用于html element，如el.checked,el.value等
     */
    assets: Map<string, string | number | boolean>;
    /**
     * 属性(attribute)集合
     * @remarks
     * 属性值可能是值，也可能是表达式
     */
    props: Map<string, string | number | boolean | object | Expression>;
    /**
     * 事件数组
     */
    events: Array<NEvent>;
    /**
     * 子节点数组[]
     */
    children: Array<VirtualDom>;
    /**
     * 父虚拟dom
     */
    parent: VirtualDom;
    /**
     * 是否为svg节点
     */
    isSvg: boolean;
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
    staticNum: number;
    /**
     * @param tag -     标签名
     * @param key -     key
     * @param module - 	模块
     */
    constructor(tag?: string, key?: number | string, module?: Module);
    /**
     * 移除多个指令
     * @param directives - 	待删除的指令类型数组或指令类型
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    removeDirectives(directives: string[]): void;
    /**
     * 移除指令
     * @param directive - 	待删除的指令类型名
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    removeDirective(directive: string): void;
    /**
     * 添加指令
     * @param directive -     指令对象
     * @param sort -          是否排序
     * @returns             如果虚拟dom上的指令集不为空，且指令集中已经存在传入的指令对象，则返回void
     */
    addDirective(directive: Directive, sort?: boolean): void;
    /**
     * 指令排序
     * @returns           如果虚拟dom上指令集为空，则返回void
     */
    sortDirective(): void;
    /**
     * 是否有某个类型的指令
     * @param typeName - 	    指令类型名
     * @returns             如果指令集不为空，且含有传入的指令类型名则返回true，否则返回false
     */
    hasDirective(typeName: string): boolean;
    /**
     * 获取某个类型的指令
     * @param module -            模块
     * @param directiveType - 	指令类型名
     * @returns                 如果指令集为空，则返回void；否则返回指令类型名等于传入参数的指令对象
     */
    getDirective(directiveType: string): Directive;
    /**
     * 添加子节点
     * @param dom -       子节点
     * @param index -     指定位置，如果不传此参数，则添加到最后
     */
    add(dom: VirtualDom, index?: number): void;
    /**
     * 移除子节点
     * @param dom -   子节点
     */
    remove(dom: VirtualDom): void;
    /**
     * 是否拥有属性
     * @param propName -  属性名
     * @param isExpr -    是否只检查表达式属性
     * @returns         如果属性集含有传入的属性名返回true，否则返回false
     */
    hasProp(propName: string): boolean;
    /**
     * 获取属性值
     * @param propName -  属性名
     * @returns         传入属性名的value
     */
    getProp(propName: string): string | number | boolean | object | Expression;
    /**
     * 设置属性值
     * @param propName -  属性名
     * @param v -         属性值
     */
    setProp(propName: string, v: string | number | boolean | object | Expression): void;
    /**
     * 删除属性
     * @param props -     属性名或属性名数组
     * @returns         如果虚拟dom上的属性集为空，则返回void
     */
    delProp(props: string | string[]): void;
    /**
     * 设置asset
     * @param assetName -     asset name
     * @param value -         asset value
     */
    setAsset(assetName: string, value: string | number | boolean): void;
    /**
     * 删除asset
     * @param assetName -     asset name
     * @returns             如果虚拟dom上的直接属性集为空，则返回void
     */
    delAsset(assetName: string): void;
    /**
     * 设置cache参数
     * @param module -    模块
     * @param name -      参数名
     * @param value -     参数值
     */
    setParam(module: Module, name: string, value: string | boolean | number | object): void;
    /**
     * 获取参数值
     * @param module -    模块
     * @param name -      参数名
     * @returns         参数值
     */
    getParam(module: Module, name: string): unknown;
    /**
     * 移除参数
     * @param module -    模块
     * @param name -      参数名
     */
    removeParam(module: Module, name: string): void;
    /**
     * 设置单次静态标志
     */
    private setStaticOnce;
    /**
     * 克隆
     */
    clone(): VirtualDom;
    /**
     * 保存事件
     * @param event -     事件对象
     * @param index - 	位置
     */
    addEvent(event: NEvent, index?: number): void;
}
