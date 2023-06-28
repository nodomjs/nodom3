import { DirectiveManager } from "./directivemanager";
import { NodomMessage_en } from "./locales/msg_en";
import { NodomMessage_zh } from "./locales/msg_zh";
import { ModuleFactory } from "./modulefactory";
import { Renderer } from "./renderer";
import { RequestManager } from "./requestmanager";
import { Route } from "./route";
import { Router } from "./router";
import { Scheduler } from "./scheduler";
import { IRouteCfg } from "./types";
import { Util } from "./util";

/**
 * nodom提示消息
 */
export var NodomMessage;
/**
 * 新建一个App
 * @param clazz     模块类
 * @param el        el选择器
 * @param language  语言（zh,en），默认zh
 */
export async function nodom(clazz:any,el:string,language?:string){
    //设置nodom语言
    switch(language||'zh'){
        case 'zh':
            NodomMessage = NodomMessage_zh;
            break;
        case 'en':
            NodomMessage = NodomMessage_en;
    }
    //渲染器启动渲染
    Scheduler.addTask(Renderer.render, Renderer);
    //启动调度器
    Scheduler.start();
    let mdl:any = ModuleFactory.get(clazz);
    mdl.setContainer(document.querySelector(el));
    mdl.active();
}

/**
 * 暴露的创建路由方法
 * @param config  数组或单个配置
 */
export function createRoute(config: IRouteCfg | Array<IRouteCfg>,parent?:Route): Route {
    let route:Route;
    parent = parent || Router.root;
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
export function createDirective(name: string, handler: Function,priority?: number) {
    return DirectiveManager.addType(name,handler,priority);
}

/**
 * 注册模块
 * @param clazz     模块类
 * @param name      注册名，如果没有，则为类名
 */
export function registModule(clazz:any,name?:string){
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
 *  				timeout|number|0|否|无|请求超时时间
 *                  type|string|text|否|json,text|
 *					withCredentials|bool|false|否|true,false|同源策略，跨域时cookie保存
 *                  header|Object|无|否|无|request header 对象
 *                  user|string|无|否|无|需要认证的请求对应的用户名
 *                  pwd|string|无|否|无|需要认证的请求对应的密码
 *                  rand|bool|无|否|无|请求随机数，设置则浏览器缓存失效
 */
export async function request(config): Promise<any> {
    return await RequestManager.request(config);
}