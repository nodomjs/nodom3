import { DirectiveManager } from "./directivemanager";
import { NError } from "./error";
import { NodomMessage_en } from "./locales/msg_en";
import { NodomMessage_zh } from "./locales/msg_zh";
import { ModuleFactory } from "./modulefactory";
import { Renderer } from "./renderer";
import { RequestManager } from "./requestmanager";
import { Route } from "./route";
import { Scheduler } from "./scheduler";
import { DirectiveMethod, RouteCfg, UnknownClass } from "./types";
import { Util } from "./util";

/**
 * nodom提示消息
 */
export let NodomMessage = NodomMessage_zh;

/**
 * Nodom接口暴露类
 */
export class Nodom{
    /**
     * 是否为debug模式，开启后，表达式编译异常会输出到控制台
     */
    public static isDebug:boolean;

    /**
     * 应用初始化
     * @param clazz -     模块类
     * @param selector -  根模块容器选择器，默认使用document.body
     */
    public static app(clazz:unknown,selector?:string){
        //设置渲染器的根 element
        Renderer.setRootEl(document.querySelector(selector)||document.body);
        //渲染器启动渲染任务
        Scheduler.addTask(Renderer.render, Renderer);
        //添加请求清理任务
        Scheduler.addTask(RequestManager.clearCache);
        //启动调度器
        Scheduler.start();
        ModuleFactory.get(<UnknownClass>clazz).active();
    }

    /**
     * 启用debug模式
     */
    public static debug(){
        this.isDebug = true;
    }

    /**
     * 设置语言
     * @param lang -  语言（zh,en），默认zh
     */
    public static setLang(lang:string){
        //设置nodom语言
        switch(lang||'zh'){
            case 'zh':
                NodomMessage = NodomMessage_zh;
                break;
            case 'en':
                NodomMessage = NodomMessage_en;
        }
    }

    /**
     * use插件（实例化）
     * @remarks
     * 插件实例化后以单例方式存在，第二次use同一个插件，将不进行任何操作，实例化后可通过Nodom['$类名']方式获取
     * @param clazz -   插件类
     * @param params -  参数
     * @returns         实例化后的插件对象
     */
    public static use(clazz:unknown,params?:unknown[]):unknown{
        if(!clazz['name']){
            new NError('notexist',NodomMessage.TipWords.plugin);
        }
        if(!this['$'+clazz['name']]){
            this['$'+clazz['name']] = Reflect.construct(<UnknownClass>clazz,params||[]); 
        }
        return this['$'+clazz['name']];
    }

    /**
     * 创建路由
     * @remarks
     * 配置项可以用嵌套方式
     * @example
     * ```js
     * Nodom.createRoute([{
     *   path: '/router',
     *   //直接用模块类，需import
     *   module: MdlRouteDir,
     *   routes: [
     *       {
     *           path: '/route1',
     *           module: MdlPMod1,
     *           routes: [{
     *               path: '/home',
     *               //直接用路径，实现懒加载
     *               module:'/examples/modules/route/mdlmod1.js'
     *           }, ...]
     *       }, {
     *           path: '/route2',
     *           module: MdlPMod2,
     *           //设置进入事件
     *           onEnter: function (module,path) {},
     *           //设置离开事件
     *           onLeave: function (module,path) {},
     *           ...
     *       }
     *   ]
     * }])
     * ```
     * @param config -  路由配置
     * @param parent -  父路由
     */
    public static createRoute(config: RouteCfg | Array<RouteCfg>,parent?:Route): Route {
        if(!Nodom['$Router']){
            throw new NError('uninit',NodomMessage.TipWords.route)
        }
        
        let route:Route;
        parent = parent || Nodom['$Router'].getRoot();
        if (Util.isArray(config)) {
            for (const item of <Array<RouteCfg>>config) {
                route = new Route(item,parent);
            }
        } else {
            route = new Route(<RouteCfg>config,parent);
        }
        return route;
    }

    /**
     * 创建指令
     * @param name -      指令名 
     * @param priority -  优先级（1最小，1-10为框架保留优先级）
     * @param handler -   渲染时方法
     */
    public static createDirective(name: string, handler: DirectiveMethod,priority?: number) {
        return DirectiveManager.addType(name,handler,priority);
    }

    /**
     * 注册模块
     * @param clazz -   模块类
     * @param name -    注册名，如果没有，则为类名
     */
    public static registModule(clazz:unknown,name?:string){
        ModuleFactory.addClass(<UnknownClass>clazz,name);
    }

    /**
     * ajax 请求，如果需要用第三方ajax插件替代，重载该方法
     * @param config -  object 或 string，如果为string，则表示url，直接以get方式获取资源，如果为 object，配置项如下:
     * ```
     *  参数名|类型|默认值|必填|可选值|描述
     *  -|-|-|-|-|-
     *  url|string|无|是|无|请求url
     *	method|string|GET|否|GET,POST,HEAD|请求类型
     *	params|object/FormData|空object|否|无|参数，json格式
     *	async|bool|true|否|true,false|是否异步
     *  timeout|number|0|否|无|请求超时时间
     *  type|string|text|否|json,text|
     *	withCredentials|bool|false|否|true,false|同源策略，跨域时cookie保存
     *  header|Object|无|否|无|request header 对象
     *  user|string|无|否|无|需要认证的请求对应的用户名
     *  pwd|string|无|否|无|需要认证的请求对应的密码
     *  rand|bool|无|否|无|请求随机数，设置则浏览器缓存失效
     * ```
     */
    public static async request(config): Promise<unknown> {
        return await RequestManager.request(config);
    }

    /**
     * 重复请求拒绝时间间隔
     * @remarks
     * 如果设置此项，当url一致时且间隔时间小于time，则拒绝请求
     * @param time -  时间间隔（ms）
     */
    public static setRejectTime(time:number){
        RequestManager.setRejectTime(time);
    }
}


