import { NError } from "./error";
import { NodomMessage } from "./nodom";
import { VirtualDom } from "./virtualdom";
/**
 * 基础服务库
 * @since       1.0.0
 */
export class Util {
    /**
     * 全局id
     */
    private static generatedId: number = 1;
    
    /**
     * js 保留字 map
     */
    public static keyWordMap = new Map();
    
    /**
     * 唯一主键
     */
    public static genId() {
        return this.generatedId++;
    }

    /**
     * 初始化保留字map
     */
    public static initKeyMap(){
        [
            'arguments','boolean','break','byte','catch',
            'char','const','default','delete','do',
            'double','else','enum','eval','false',
            'float','for','function','goto','if',
            'in','instanceof','int','let','long',
            'null','return','short','switch','this',
            'throw','true','try','this','throw',
            'typeof','var','while','with','Array',
            'Date','JSON', 'Set','Map','eval',
            'Infinity','isFinite','isNaN','isPrototypeOf','Math',
            'new','NaN','Number','Object','prototype','String',
            'isPrototypeOf','undefined','valueOf'
        ].forEach(item=>{
            this.keyWordMap.set(item,true);
        });
    }
    /**
     * 是否为 js 保留关键字
     * @param name  名字
     * @returns     如果为保留字，则返回true，否则返回false
     */
    public static isKeyWord(name:string):boolean{
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

    public static clone(srcObj: Object, expKey?: RegExp | string[], extra?: any): any {
        let me = this;
        let map: WeakMap<Object, any> = new WeakMap();
        return clone(srcObj, expKey, extra);

        /**
         * clone对象
         * @param src      待clone对象
         * @param expKey   不克隆的键
         * @param extra    clone附加参数
         * @returns        克隆后的对象
         */
        function clone(src, expKey, extra?) {
            //非对象或函数，直接返回            
            if (!src || typeof src !== 'object' || Util.isFunction(src)) {
                return src;
            }
            let dst;

            //带有clone方法，则直接返回clone值
            if (src.clone && Util.isFunction(src.clone)) {
                return src.clone(extra);
            } else if (me.isObject(src)) {
                dst = new Object();
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                map.set(src, dst);
                Object.getOwnPropertyNames(src).forEach((prop) => {
                    //不克隆的键
                    if (expKey) {
                        if (expKey.constructor === RegExp && (<RegExp>expKey).test(prop) //正则表达式匹配的键不复制
                            || Util.isArray(expKey) && (<any[]>expKey).includes(prop)    //被排除的键不复制
                        ) {
                            return;
                        }
                    }
                    dst[prop] = getCloneObj(src[prop], expKey, extra);
                });
            } else if (me.isMap(src)) {
                dst = new Map();
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                src.forEach((value, key) => {
                    //不克隆的键
                    if (expKey) {
                        if (expKey.constructor === RegExp && (<RegExp>expKey).test(key)       //正则表达式匹配的键不复制
                            || (<any[]>expKey).includes(key)) {     //被排除的键不复制
                            return;
                        }
                    }
                    dst.set(key, getCloneObj(value, expKey, extra));
                });
            } else if (me.isArray(src)) {
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
                if (!map.has(value)) {  //clone新对象
                    co = clone(value, expKey, extra);
                } else {                    //从map中获取对象
                    co = map.get(value);
                }
                return co;
            }
            return value;
        }
    }
    
    /**
     * 比较两个对象值是否相同(只比较object和array)
     * @param src   源对象
     * @param dst   目标对象 
     * @returns     值相同则返回true，否则返回false 
     */
    public static compare(src:any,dst:any):boolean{
        return cmp(src,dst);
        function cmp(o1,o2){
            if(o1 === o2){
                return true;
            }
            let keys1 = Object.keys(o1);
            let keys2 = Object.keys(o2);
            if(keys1.length !== keys2.length){
                return false;
            }
            for(let k of keys1){
                if(typeof o1[k] === 'object' && typeof o2[k] === 'object'){
                    let r = cmp(o1[k],o2[k]);
                    if(!r){
                        return false;
                    }
                }else if(o1[k] !== o2[k]){
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
    public static getOwnProps(obj): Array<string> {
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
    public static isFunction(foo): boolean {
        return foo !== undefined && foo !== null && foo.constructor === Function;
    }

    /**
     * 判断是否为数组
     * @param obj   检查的对象
     * @returns     true/false
     */
    public static isArray(obj): boolean {
        return Array.isArray(obj);
    }

    /**
     * 判断是否为map
     * @param obj   检查的对象
     */
    public static isMap(obj): boolean {
        return obj !== null && obj !== undefined && obj.constructor === Map;
    }

    /**
     * 判断是否为对象
     * @param obj   检查的对象
     * @returns     true/false
     */
    public static isObject(obj): boolean {
        return obj !== null && obj !== undefined && obj.constructor === Object;
    }

    /**
     * 判断对象/字符串是否为空
     * @param obj   检查的对象
     * @returns     true/false
     */
    public static isEmpty(obj): boolean {
        if (obj === null || obj === undefined)
            return true;
        let tp = typeof obj;
        if (this.isObject(obj)) {
            let keys = Object.keys(obj);
            if (keys !== undefined) {
                return keys.length === 0;
            }
        } else if (tp === 'string') {
            return obj === '';
        }
        return false;
    }

    /******日期相关******/
    /**
     * 日期格式化
     * @param timestamp  时间戳
     * @param format     日期格式
     * @returns          日期串
     */
    public static formatDate(timeStamp: string | number, format: string): string {
        if (typeof timeStamp === 'string') {
            //排除日期格式串,只处理时间戳
            let reg = /^\d+$/;
            if (reg.test(<string>timeStamp)) {
                timeStamp = Number(<string>timeStamp);
            } else {
                throw new NError('invoke', 'Util.formatDate', '0', 'date string', 'date');
            }
        } 
        //得到日期
        let date: Date = new Date(timeStamp);
        // invalid date
        if (isNaN(date.getDay())) {
            throw new NError('invoke', 'Util.formatDate', '0', 'date string', 'date');
        }

        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "H+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "S": date.getMilliseconds() //毫秒
        };

        let re;
        //年
        if (re=/(y+)/.exec(format)) {
            format = format.replace(re[0], (date.getFullYear() + "").substring(4 - re[0].length));
        }
        //月日
        this.getOwnProps(o).forEach(function (k) {
            if (re=new RegExp("(" + k + ")").exec(format)) {
                format = format.replace(re[0], re[0].length===1?o[k]:("00" + o[k]).substring((o[k]+'').length));
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
    public static compileStr(src: string, p1?: any, p2?: any, p3?: any, p4?: any, p5?: any): string {
        let reg: RegExp;
        let args = arguments;
        let index = 0;
        for (; ;) {
            if (src.indexOf('\{' + index + '\}') !== -1) {
                reg = new RegExp('\\{' + index + '\\}', 'g');
                src = src.replace(reg, args[index + 1]);
                index++;
            } else {
                break;
            }
        }
        return src;
    }

    /**
     * 改造 dom key，避免克隆时重复，格式为：key_id
     * @param node    节点
     * @param id      附加id
     * @param deep    是否深度处理
     */
    public static setNodeKey(node:VirtualDom, id?:number,deep?:boolean){
        node.key = node.key + '_' + id;
        if(deep && node.children){
            for(let c of node.children) {
                Util.setNodeKey(c,id,true);
            }
        }
    }
}

//初始化keymap
Util.initKeyMap();