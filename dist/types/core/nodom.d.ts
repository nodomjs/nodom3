import { Route } from "./route";
import { IRouteCfg } from "./types";
/**
 * nodom提示消息
 */
export declare var NodomMessage: any;
/**
 * 新建一个App
 * @param clazz     模块类
 * @param el        el选择器
 */
export declare function nodom(clazz: any, el: string): void;
/**
 * 暴露的创建路由方法
 * @param config  数组或单个配置
 */
export declare function createRoute(config: IRouteCfg | Array<IRouteCfg>, parent?: Route): Route;
/**
 * 创建指令
 * @param name      指令名
 * @param priority  优先级（1最小，1-10为框架保留优先级）
 * @param init      初始化方法
 * @param handler   渲染时方法
 */
export declare function createDirective(name: string, handler: Function, priority?: number): void;
/**
 * 注册模块
 * @param clazz     模块类
 * @param name      注册名，如果没有，则为类名
 */
export declare function registModule(clazz: any, name?: string): void;
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
export declare function request(config: any): Promise<any>;
