import { IRenderedDom } from "./types";
import { VirtualDom } from "./virtualdom";
/**
 * 基础服务库
 * @since       1.0.0
 */
export declare class Util {
    /**
     * 全局id
     */
    private static generatedId;
    /**
     * js 保留字 map
     */
    static keyWordMap: Map<any, any>;
    /**
     * 唯一主键
     */
    static genId(): number;
    /**
     * 初始化保留字map
     */
    static initKeyMap(): void;
    /**
     * 是否为 js 保留关键字
     * @param name  名字
     * @returns     如果为保留字，则返回true，否则返回false
     */
    static isKeyWord(name: string): boolean;
    /******对象相关******/
    /**
     * 对象复制
     * @param srcObj    源对象
     * @param expKey    不复制的键正则表达式或名
     * @param extra     clone附加参数
     * @returns         复制的对象
     */
    static clone(srcObj: Object, expKey?: RegExp | string[], extra?: any): any;
    /**
     * 合并多个对象并返回
     * @param   参数数组
     * @returns 返回对象
     */
    static merge(o1?: Object, o2?: Object, o3?: Object, o4?: Object, o5?: Object, o6?: Object): any;
    /**
     * 把obj2对象所有属性赋值给obj1
     * @returns 返回对象obj1
     */
    static assign(obj1: any, obj2: any): any;
    /**
     * 比较两个对象值是否相同(只比较object和array)
     * @param src   源对象
     * @param dst   目标对象
     * @returns     值相同则返回true，否则返回false
     */
    static compare(src: any, dst: any, deep?: boolean): boolean;
    /**
     * 获取对象自有属性
     * @param obj   需要获取属性的对象
     * @returns     返回属性数组
     */
    static getOwnProps(obj: any): Array<string>;
    /**************对象判断相关************/
    /**
     * 判断是否为函数
     * @param foo   检查的对象
     * @returns     true/false
     */
    static isFunction(foo: any): boolean;
    /**
     * 判断是否为数组
     * @param obj   检查的对象
     * @returns     true/false
     */
    static isArray(obj: any): boolean;
    /**
     * 判断是否为map
     * @param obj   检查的对象
     */
    static isMap(obj: any): boolean;
    /**
     * 判断是否为对象
     * @param obj   检查的对象
     * @returns     true/false
     */
    static isObject(obj: any): boolean;
    /**
     * 判断是否为整数
     * @param v     检查的值
     * @returns     true/false
     */
    static isInt(v: any): boolean;
    /**
     * 判断是否为number
     * @param v     检查的值
     * @returns     true/false
     */
    static isNumber(v: any): boolean;
    /**
     * 判断是否为boolean
     * @param v     检查的值
     * @returns     true/false
     */
    static isBoolean(v: any): boolean;
    /**
     * 判断是否为字符串
     * @param v     检查的值
     * @returns     true/false
     */
    static isString(v: any): boolean;
    /**
     * 判断是否为数字串
     * @param v     检查的值
     * @returns     true/false
     */
    static isNumberString(v: any): boolean;
    /**
     * 判断对象/字符串是否为空
     * @param obj   检查的对象
     * @returns     true/false
     */
    static isEmpty(obj: any): boolean;
    /**
     * 把srcNode替换为nodes
     * @param srcNode       源dom
     * @param nodes         替换的dom或dom数组
     */
    static replaceNode(srcNode: Node, nodes: Node | Array<Node>): void;
    /**
     * 清空子节点
     * @param el   需要清空的节点
     */
    static empty(el: HTMLElement): void;
    /******日期相关******/
    /**
     * 日期格式化
     * @param timestamp  时间戳
     * @param format     日期格式
     * @returns          日期串
     */
    static formatDate(timeStamp: string | number, format: string): string;
    /******字符串相关*****/
    /**
     * 编译字符串，把{n}替换成带入值
     * @param src   待编译的字符串
     * @returns     转换后的消息
     */
    static compileStr(src: string, p1?: any, p2?: any, p3?: any, p4?: any, p5?: any): string;
    /**
     * 函数调用
     * @param foo   函数
     * @param obj   this指向
     * @param args  参数数组
     */
    static apply(foo: Function, obj: any, args?: Array<any>): any;
    /**
     * 合并并修正路径，即路径中出现'//','///','\/'的情况，统一置换为'/'
     * @param paths     待合并路径数组
     * @returns         返回路径
     */
    static mergePath(paths: string[]): string;
    /**
     * eval
     * @param evalStr   eval串
     * @returns         eval值
     */
    static eval(evalStr: string): any;
    /**
     * 改造 dom key，避免克隆时重复，格式为：key_id
     * @param node    节点
     * @param id      附加id
     * @param deep    是否深度处理
     */
    static setNodeKey(node: VirtualDom, id?: string, deep?: boolean): void;
    /**
     * 设置dom asset
     * @param dom       渲染后的dom节点
     * @param name      asset name
     * @param value     asset value
     */
    static setDomAsset(dom: IRenderedDom, name: string, value: any): void;
    /**
     * 删除dom asset
     * @param dom   渲染后的dom节点
     * @param name  asset name
     * @returns
     */
    static delDomAsset(dom: IRenderedDom, name: string): void;
}
