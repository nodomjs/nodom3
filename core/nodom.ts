import { DirectiveManager } from "./directivemanager";
import { NError } from "./error";
import { NodomMessage_en } from "./locales/msg_en";
import { NodomMessage_zh } from "./locales/msg_zh";
import { ModuleFactory } from "./modulefactory";
import { Renderer } from "./renderer";
import { RequestManager } from "./requestmanager";
import { Route } from "./route";
import { Scheduler } from "./scheduler";
import { IRouteCfg } from "./types";
import { Util } from "./util";

/**
 * nodom提示消息
 */
export var NodomMessage=NodomMessage_zh;

/**
 * nodom 类
 */
export class Nodom{
    /**
     * 新建一个App
     * @param clazz     模块类
     * @param selector  el选择器
     */
    public static app(clazz:any,selector:string){
        //设置渲染器的根 element
        Renderer.setRootEl(document.querySelector(selector)||document.body);
        //渲染器启动渲染
        Scheduler.addTask(Renderer.render, Renderer);
        //启动调度器
        Scheduler.start();
        
        let mdl:any = ModuleFactory.get(clazz);
        mdl.active();
    }

    /**
     * 设置语言
     * @param lang  语言（zh,en），默认zh
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
     * 插件实例化后以单例方式存在，第二次use同一个插件，将不进行任何操作，实例化后可通过Nodom['$类名']方式获取
     * @param clazz     插件类
     * @param params    参数
     * @returns         实例化后的插件对象
     */
    public static use(clazz:any,params?:any[]):any{
        if(!clazz.name){
            new NError('notexist',NodomMessage.TipWords.plugin);
        }
        if(!this['$'+clazz.name]){
            this['$'+clazz.name] = Reflect.construct(clazz,params||[]); 
        }
        return this['$'+clazz.name];
    }

    /**
     * 暴露的创建路由方法
     * @param config  数组或单个配置
     */
    public static createRoute(config: IRouteCfg | Array<IRouteCfg>,parent?:Route): Route {
        if(!Nodom['$Router']){
            throw new NError('uninit',NodomMessage.TipWords.route)
        }
        
        let route:Route;
        parent = parent || Nodom['$Router'].getRoot();
        if (Util.isArray(config)) {
            for (let item of <Array<IRouteCfg>>config) {
                route = new Route(item,parent);
            }
        } else {
            route = new Route(<IRouteCfg>config,parent);
        }
        return route;
    }

    /**
     * 创建指令
     * @param name      指令名 
     * @param priority  优先级（1最小，1-10为框架保留优先级）
     * @param init      初始化方法
     * @param handler   渲染时方法
     */
    public static createDirective(name: string, handler: Function,priority?: number) {
        return DirectiveManager.addType(name,handler,priority);
    }

    /**
     * 注册模块
     * @param clazz     模块类
     * @param name      注册名，如果没有，则为类名
     */
    public static registModule(clazz:any,name?:string){
        ModuleFactory.addClass(clazz,name);
    }

    /**
     * ajax 请求
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
    public static async request(config): Promise<any> {
        return await RequestManager.request(config);
    }
}

/**
 * Nodom.app的简写方式
 * @param clazz     模块类
 * @param el        根容器
 */
export function nodom(clazz:any,el:string){
    return Nodom.app(clazz,el);
}


