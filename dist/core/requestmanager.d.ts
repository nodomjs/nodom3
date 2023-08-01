export declare class RequestManager {
    /**
     * 拒绝相同请求（url，参数）时间间隔
     */
    static rejectReqTick: number;
    /**
     * 请求map，用于缓存之前的请求url和参数
     * key:     url
     * value:   请求参数
     */
    private static requestMap;
    /**
     * 设置相同请求拒绝时间间隔
     * @param time  时间间隔（ms）
     */
    static setRejectTime(time: number): void;
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
    static request(config: any): Promise<any>;
    /**
     * 清除超时缓存请求信息
     */
    static clearCache(): void;
}
