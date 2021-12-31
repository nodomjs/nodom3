import { Directive } from "./directive";
import { NEvent } from "./event";
import { Expression } from "./expression";
import { Model } from "./model";
import { Module } from "./module";
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
     * 静态属性(attribute)集合
     * {prop1:value1,...}
     */
    props: Map<string, any>;
    /**
     * 事件数组
     */
    events: Array<NEvent>;
    /**
     * 子节点数组[]
     */
    children: Array<VirtualDom>;
    /**
     * 样式map
     */
    private styleMap;
    /**
     * class 数组
     */
    private classArr;
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
     * @param tag       标签名
     * @param key       key
     */
    constructor(tag?: string, key?: string, module?: Module);
    /**
     * 移除多个指令
     * @param directives 	待删除的指令类型数组或指令类型
     */
    removeDirectives(directives: string[]): void;
    /**
     * 移除指令
     * @param directive 	待删除的指令类型名
     */
    removeDirective(directive: string): void;
    /**
     * 添加指令
     * @param directive     指令对象
     * @param sort          是否排序
     */
    addDirective(directive: Directive, sort?: boolean): void;
    /**
     * 指令排序
     */
    sortDirective(): void;
    /**
     * 是否有某个类型的指令
     * @param typeName 	    指令类型名
     * @returns             true/false
     */
    hasDirective(typeName: string): boolean;
    /**
     * 获取某个类型的指令
     * @param module            模块
     * @param directiveType 	指令类型名
     * @returns                 指令对象
     */
    getDirective(directiveType: string): Directive;
    /**
     * 添加子节点
     */
    add(dom: VirtualDom): void;
    /**
     * 是否存在某个class
     * @param cls   class name
     * @return      true/false
     */
    hasClass(module: any, cls: string): boolean;
    /**
     * 初始化class数组
     */
    private initClassArr;
    /**
     * 添加css class
     * @param cls class名,可以多个，以“空格”分割
     */
    addClass(cls: string): void;
    /**
     * 删除css class
     * @param cls class名,可以多个，以“空格”分割
     */
    removeClass(cls: string): void;
    /**
     * 初始化style map
     */
    private initStyleMap;
    /**
     * 添加style
     *  @param styleStr style字符串
     */
    addStyle(styleStr: string): void;
    /**
     * 删除style
     * @param styleStr style字符串，可以是stylename:stylevalue[;...]或stylename1;stylename2
     */
    removeStyle(styleStr: string): void;
    /**
     * 是否拥有属性
     * @param propName  属性名
     * @param isExpr    是否只检查表达式属性
     */
    hasProp(propName: string): boolean;
    /**
     * 获取属性值
     * @param propName  属性名
     * @param isExpr    是否只获取表达式属性
     */
    getProp(propName: string, isExpr?: boolean): any;
    /**
     * 设置属性值
     * @param propName  属性名
     * @param v         属性值
     */
    setProp(propName: string, v: any): void;
    /**
     * 删除属性
     * @param props     属性名或属性名数组
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
