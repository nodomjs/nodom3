import { DirectiveManager } from "./directivemanager";
import { NError } from "./error";
import { NodomMessage_en } from "./locales/msg_en";
import { NodomMessage_zh } from "./locales/msg_zh";
import { Model } from "./model";
import { ModelManager } from "./modelmanager";
import { Module } from "./module";
import { ModuleFactory } from "./modulefactory";
import { Renderer } from "./renderer";
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
    let mdl = ModuleFactory.get(clazz);
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
    return new Promise((resolve, reject) => {
        if (typeof config === 'string') {
            config = {
                url: config
            }
        }
        config.params = config.params || {};
        //随机数
        if (config.rand) { //针对数据部分，仅在app中使用
            config.params.$rand = Math.random();
        }
        let url: string = config.url;
        const async: boolean = config.async === false ? false : true;
        const req: XMLHttpRequest = new XMLHttpRequest();
        //设置同源策略
        req.withCredentials = config.withCredentials;
        //类型默认为get
        const method: string = (config.method || 'GET').toUpperCase();
        //超时，同步时不能设置
        req.timeout = async ? config.timeout : 0;

        req.onload = () => {
            if (req.status === 200) {
                let r = req.responseText;
                if (config.type === 'json') {
                    try {
                        r = JSON.parse(r);
                    } catch (e) {
                        reject({ type: "jsonparse" });
                    }
                }
                resolve(r);
            } else {
                reject({ type: 'error', url: url });
            }
        }

        req.ontimeout = () => reject({ type: 'timeout' });
        req.onerror = () => reject({ type: 'error', url: url });
        //上传数据
        let data = null;
        switch (method) {
            case 'GET':
                //参数
                let pa: string;
                if (Util.isObject(config.params)) {
                    let ar: string[] = [];
                    for(let k of Object.keys(config.params)){
                        const v = config.params[k];
                        if(v === undefined || v === null){
                            continue;
                        }
                        ar.push(k + '=' + v);
                    }
                    pa = ar.join('&');
                }
                if (pa !== undefined) {
                    if (url.indexOf('?') !== -1) {
                        url += '&' + pa;
                    } else {
                        url += '?' + pa;
                    }
                }

                break;
            case 'POST':
                if (config.params instanceof FormData) {
                    data = config.params;
                } else {
                    let fd: FormData = new FormData();
                    for(let k of Object.keys(config.params)){
                        const v = config.params[k];
                        if(v === undefined || v === null){
                            continue;
                        }
                        fd.append(k, v);
                    }
                    data = fd;                  
                }
                break;
        }

        req.open(method, url, async, config.user, config.pwd);
        //设置request header
        if (config.header) {
            Util.getOwnProps(config.header).forEach((item) => {
                req.setRequestHeader(item, config.header[item]);
            })
        }
        req.send(data);
    }).catch((re) => {
        switch (re.type) {
            case "error":
                throw new NError("notexist1", NodomMessage.TipWords['resource'], re.url);
            case "timeout":
                throw new NError("timeout");
            case "jsonparse":
                throw new NError("jsonparse");
        }
    });
}

/**
 * 观察某个数据项
 * @param model     带watch的model
 * @param key       数据项名或数组
 * @param operate   数据项变化时执行方法
 * @param module    指定模块，如果指定，则表示该model绑定的所有module都会触发watch事件，在model父(模块)传子(模块)传递的是对象时会导致多个watch出发
 * @param deep      是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
 * 
 * @returns         unwatch函数
 */
export function watch(model:Model,key: string|string[], operate: Function,module?:Module,deep?:boolean):Function {
    return ModelManager.watch(model,key,operate,module,deep);
}

/**
 * 获取模型key
 * @param model     模型 
 * @returns         模型key
 */
export function getmkey(model:Model):number{
    return ModelManager.getModelKey(model);
}

/**
 * 设置值
 * @param model     模型
 * @param key       子属性，可以分级，如 name.firstName
 * @param value     属性值
 */
export function $set(model:Model,key:string,value:any){
    return ModelManager.set(model,key,value);
}

/**
 * 查询model子属性
 * @param model     模型
 * @param key       属性名，可以分级，如 name.firstName，如果为null，则返回自己
 * @returns         属性对应model proxy
 */
export function $get(model:Model, key: string):any {
    return ModelManager.get(model,key);
}
