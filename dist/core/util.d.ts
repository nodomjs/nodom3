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
     * 比较两个对象值是否相同(只比较object和array)
     * @param src   源对象
     * @param dst   目标对象
     * @returns     值相同则返回true，否则返回false
     */
    static compare(src: any, dst: any): boolean;
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
     * 判断对象/字符串是否为空
     * @param obj   检查的对象
     * @returns     true/false
     */
    static isEmpty(obj: any): boolean;
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
}
