import { NError } from "./error";
import { NodomMessage } from "./nodom";
import { Util } from "./util";

export class RequestManager{
    /**
     * 拒绝相同请求（url，参数）时间间隔
     */
    public static rejectReqTick:number = 0;

    /**
     * 请求map，用于缓存之前的请求url和参数
     * key:     url
     * value:   请求参数
     */
    private static requestMap:Map<string,object> = new Map();

    /**
     * 设置相同请求拒绝时间间隔
     * @param time -  时间间隔（ms）
     */
    public static setRejectTime(time:number){
        this.rejectReqTick = time;
    }
    /**
     * ajax 请求
     * 
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
        const time = Date.now();
        //如果设置了rejectReqTick，则需要进行判断
        if(this.rejectReqTick>0){
            if(this.requestMap.has(config.url)){
                const obj = this.requestMap.get(config.url);
                if(time - obj['time'] < this.rejectReqTick && Util.compare(obj['params'],config.params)){
                    return new Promise((resolve)=>{
                        resolve(null)
                    });
                }
            }
            //加入请求集合
            this.requestMap.set(config.url,{
                time:time,
                params:config.params
            });
        }
        
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
                //正常返回处理
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
                } else { //异常返回处理
                    reject({ type: 'error', url: url });
                }
            }
            //设置timeout和error
            req.ontimeout = () => reject({ type: 'timeout' });
            req.onerror = () => reject({ type: 'error', url: url });
            //上传数据
            let data = null;
            switch (method) {
                case 'GET':
                    //参数
                    let pa: string;
                    if (Util.isObject(config.params)) {
                        const ar: string[] = [];
                        for(const k of Object.keys(config.params)){
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
                        const fd: FormData = new FormData();
                        for(const k of Object.keys(config.params)){
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
            //打开请求
            req.open(method, url, async, config.user, config.pwd);
            //设置request header
            if (config.header) {
                Util.getOwnProps(config.header).forEach((item) => {
                    req.setRequestHeader(item, config.header[item]);
                })
            }
            //发送请求
            req.send(data);
        }).catch((re) => {
            switch (re.type) {
                case "error":
                    throw new NError("notexist1",[NodomMessage.TipWords['resource'], re.url]);
                case "timeout":
                    throw new NError("timeout");
                case "jsonparse":
                    throw new NError("jsonparse");
            }
        });
    }

    /**
     * 清除超时的缓存请求
     */
    public static clearCache(){
        const time = Date.now();
        if(this.rejectReqTick>0){
            if(this.requestMap){
                for(const kv of this.requestMap){
                    if(time - kv[1]['time'] > this.rejectReqTick){
                        this.requestMap.delete(kv[0]);
                    }
                }
            }
        }
    }
}