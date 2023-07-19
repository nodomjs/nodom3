import { Route } from "./route";
import { IRouteCfg } from "./types";
/**
 * nodom提示消息
 */
export declare var NodomMessage: {
    TipWords: {
        application: string;
        system: string;
        module: string;
        clazz: string;
        moduleClass: string;
        model: string;
        directive: string;
        directiveType: string;
        expression: string;
        event: string;
        method: string;
        filter: string;
        filterType: string;
        data: string;
        dataItem: string;
        route: string;
        routeView: string;
        plugin: string;
        resource: string;
        root: string;
        element: string;
    };
    ErrorMsgs: {
        unknown: string;
        uninit: string;
        paramException: string;
        invoke: string;
        invoke1: string;
        invoke2: string;
        invoke3: string;
        exist: string;
        exist1: string;
        notexist: string;
        notexist1: string;
        notupd: string;
        notremove: string;
        notremove1: string;
        namedinvalid: string;
        initial: string;
        jsonparse: string;
        timeout: string;
        config: string;
        config1: string;
        itemnotempty: string;
        itemincorrect: string;
        needEndTag: string;
        needStartTag: string;
        tagError: string;
        wrongTemplate: string;
        wrongExpression: string;
    };
    WeekDays: string[];
};
/**
 * nodom 类
 */
export declare class Nodom {
    /**
     * 是否为debug模式，开启后，表达式编译异常会输出到控制台
     */
    static isDebug: boolean;
    /**
     * 新建一个App
     * @param clazz     模块类
     * @param selector  根容器标签选择器，如果不写，则使用document.body
     */
    static app(clazz: any, selector: string): void;
    /**
     * 启用debug模式
     */
    static debug(): void;
    /**
     * 设置语言
     * @param lang  语言（zh,en），默认zh
     */
    static setLang(lang: string): void;
    /**
     * use插件（实例化）
     * 插件实例化后以单例方式存在，第二次use同一个插件，将不进行任何操作，实例化后可通过Nodom['$类名']方式获取
     * @param clazz     插件类
     * @param params    参数
     * @returns         实例化后的插件对象
     */
    static use(clazz: any, params?: any[]): any;
    /**
     * 暴露的创建路由方法
     * @param config  数组或单个配置
     */
    static createRoute(config: IRouteCfg | Array<IRouteCfg>, parent?: Route): Route;
    /**
     * 创建指令
     * @param name      指令名
     * @param priority  优先级（1最小，1-10为框架保留优先级）
     * @param init      初始化方法
     * @param handler   渲染时方法
     */
    static createDirective(name: string, handler: Function, priority?: number): void;
    /**
     * 注册模块
     * @param clazz     模块类
     * @param name      注册名，如果没有，则为类名
     */
    static registModule(clazz: any, name?: string): void;
    /**
     * ajax 请求，如果需要用第三方ajax插件替代，重载该方法
     * @param config    object 或 string
     *                  如果为string，则直接以get方式获取资源
     *                  object 项如下:
     *                  参数名|类型|默认值|必填|可选值|描述
     *                  -|-|-|-|-|-
     *                  url|string|无|是|无|请求url
     *					method|string|GET|否|GET,POST,HEAD|请求类型
     *					params|Object/FormData|{}|否|无|参数，json格式
     *					async|bool|true|否|true,false|是否异步
     *  				    timeout|number|0|否|无|请求超时时间
     *                  type|string|text|否|json,text|
     *					withCredentials|bool|false|否|true,false|同源策略，跨域时cookie保存
     *                  header|Object|无|否|无|request header 对象
     *                  user|string|无|否|无|需要认证的请求对应的用户名
     *                  pwd|string|无|否|无|需要认证的请求对应的密码
     *                  rand|bool|无|否|无|请求随机数，设置则浏览器缓存失效
     */
    static request(config: any): Promise<any>;
}
/**
 * Nodom.app的简写方式
 * @param clazz     模块类
 * @param selector  根容器标签选择器，如果不写，则使用document.body
 */
export declare function nodom(clazz: any, selector?: string): void;
