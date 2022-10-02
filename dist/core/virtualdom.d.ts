import { Directive } from "./directive";
import { NEvent } from "./event";
import { Expression } from "./expression";
import { Model } from "./model";
import { Module } from "./module";
import { IRenderedDom } from "./types";
/**
 * 虚拟dom
 */
export declare class VirtualDom {
    /**
     * 元素名，如div
     */
    tagName: string;
    /**
     * key，整颗虚拟dom树唯一
     */
    key: string;
    /**
     * 绑定模型
     */
    model: Model;
    /**
     * element为textnode时有效
     */
    textContent: string;
    /**
     * 表达式+字符串数组，用于textnode
     */
    expressions: Array<Expression | string>;
    /**
     * 指令集
     */
    directives: Directive[];
    /**
     * 直接属性 不是来自于attribute，而是直接作用于html element，如el.checked,el.value等
     */
    assets: Map<string, any>;
    /**
     * 属性(attribute)集合
     * {prop1:value1,...}
     * 属性值可能是值，也可能是表达式，还可能是数组，当为子模块时，存在从props传递过来的属性，如果模块模版存在相同属性，则会变成数组。
     */
    props: Map<string, any>;
    /**
     * 删除的class名数组
     */
    removedClassMap: Map<string, boolean>;
    /**
     * 删除的style属性名map
     */
    removedStyleMap: Map<string, boolean>;
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
     * staticNum 静态标识数
     *  0 表示静态，不进行比较
     *  > 0 每次比较后-1
     *  < 0 不处理
     */
    staticNum: number;
    /**
     * 对应的所有表达式的字段都属于dom model内
     */
    allModelField: boolean;
    /**
     * 未改变标志，本次不渲染
     */
    notChange: boolean;
    /**
     * 渲染后节点，isStatic为true时保留
     */
    renderedDom: IRenderedDom;
    /**
     * @param tag       标签名
     * @param key       key
     */
    constructor(tag?: string, key?: string, module?: Module);
    /**
     * 移除多个指令
     * @param directives 	待删除的指令类型数组或指令类型
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    removeDirectives(directives: string[]): void;
    /**
     * 移除指令
     * @param directive 	待删除的指令类型名
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    removeDirective(directive: string): void;
    /**
     * 添加指令
     * @param directive     指令对象
     * @param sort          是否排序
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
     * @param typeName 	    指令类型名
     * @returns             如果指令集不为空，且含有传入的指令类型名则返回true，否则返回false
     */
    hasDirective(typeName: string): boolean;
    /**
     * 获取某个类型的指令
     * @param module            模块
     * @param directiveType 	指令类型名
     * @returns                 如果指令集为空，则返回void；否则返回指令类型名等于传入参数的指令对象
     */
    getDirective(directiveType: string): Directive;
    /**
     * 添加子节点
     * @param dom       子节点
     * @param index     指定位置，如果不传此参数，则添加到最后
     */
    add(dom: VirtualDom, index?: number): void;
    /**
     * 移除子节点
     * @param dom   子节点
     */
    remove(dom: VirtualDom): void;
    /**
     * 添加css class
     * @param cls class名或表达式,可以多个，以“空格”分割
     */
    addClass(cls: string | Expression): void;
    /**
     * 删除css class，因为涉及到表达式，此处只记录删除标识
     * @param cls class名,可以多个，以“空格”分割
     */
    removeClass(cls: string): void;
    /**
     * 获取class串
     * @returns class 串
     */
    getClassString(values: any): string;
    /**
     * 添加style
     *  @param style style字符串或表达式
     */
    addStyle(style: string | Expression): void;
    /**
     * 删除style
     * @param styleStr style字符串，多个style以空格' '分割
     */
    removeStyle(styleStr: string): void;
    /**
     * 获取style串
     * @returns style 串
     */
    getStyleString(values: any): string;
    /**
     * 是否拥有属性
     * @param propName  属性名
     * @param isExpr    是否只检查表达式属性
     * @returns         如果属性集含有传入的属性名返回true，否则返回false
     */
    hasProp(propName: string): boolean;
    /**
     * 获取属性值
     * @param propName  属性名
     * @param isExpr    是否只获取表达式属性
     * @returns         传入属性名的value
     */
    getProp(propName: string, isExpr?: boolean): any;
    /**
     * 设置属性值
     * @param propName  属性名
     * @param v         属性值
     */
    setProp(propName: string, v: any): void;
    /**
     * 添加属性，如果原来的值存在，则属性值变成数组
     * @param pName     属性名
     * @param pValue    属性值
     */
    addProp(pName: any, pValue: any): boolean;
    /**
     * 删除属性
     * @param props     属性名或属性名数组
     * @returns         如果虚拟dom上的属性集为空，则返回void
     */
    delProp(props: string | string[]): void;
    /**
     * 设置asset
     * @param assetName     asset name
     * @param value         asset value
     */
    setAsset(assetName: string, value: any): void;
    /**
     * 删除asset
     * @param assetName     asset name
     * @returns             如果虚拟dom上的直接属性集为空，则返回void
     */
    delAsset(assetName: string): void;
    /**
     * 获取html dom
     * @param module    模块
     * @returns         对应的html dom
     */
    getEl(module: Module): Node;
    /**
     * 查找子孙节点
     * @param key 	element key
     * @returns		虚拟dom/undefined
     */
    query(key: string): any;
    /**
     * 设置cache参数
     * @param module    模块
     * @param name      参数名
     * @param value     参数值
     */
    setParam(module: Module, name: string, value: any): void;
    /**
     * 获取参数值
     * @param module    模块
     * @param name      参数名
     * @returns         参数值
     */
    getParam(module: Module, name: string): any;
    /**
     * 移除参数
     * @param module    模块
     * @param name      参数名
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
     * @param key       dom key
     * @param event     事件对象
     */
    addEvent(event: NEvent): void;
}
