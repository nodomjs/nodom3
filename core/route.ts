import { IRouteCfg } from "./types";
import { Util } from "./util";

/**
 * 路由类
 */
 export class Route {
    /**
     * 路由id
     */
    id:number;
    /**
     * 路由参数名数组
     */
    params:Array<string> = [];
    /**
     * 路由参数数据
     */
    data:any = {};
    /**
     * 子路由
     */
    children:Array<Route> = [];
    /**
     * 进入路由事件方法
     */
    onEnter:Function;
    /**
     * 离开路由方法
     */
    onLeave:Function;
    
    /**
     * 路由路径
     */
    path:string;
    /**
     * 完整路径
     */
    fullPath:string;

    /**
     * 路由对应模块对象或类或模块类名
     */
    module:any;
    
    /**
     * 模块路径，当module为类名时需要，默认执行延迟加载
     */
    modulePath:string;

    /**
     * 父路由
     */
    parent:Route;

    /**
     * 
     * @param config 路由配置项
     */
    constructor(config?:IRouteCfg,parent?:Route) {
        if (!config || Util.isEmpty(config.path)) {
            return;
        }
        this.id = Util.genId();
        //参数赋值
        for(let o of Object.keys(config)){
            this[o] = config[o];   
        }
        this.parent = parent;
        //解析路径
        if(this.path){
            this.parse();
        }
        if(parent){
            parent.addChild(this);
        }
        //子路由
        if (config.routes && Array.isArray(config.routes)) {
            config.routes.forEach((item) => {
                new Route(item,this);
            });
        }
    }
    
    /**
     * 添加子路由
     * @param child 
     */
    public addChild(child:Route){
        this.children.push(child);
        child.parent = this;
    }

    /**
     * 通过路径解析路由对象
     */
    private parse(){
        let pathArr:Array<string> = this.path.split('/');
        let node:Route = this.parent;
        let param:Array<string> = [];
        let paramIndex:number = -1; //最后一个参数开始
        let prePath:string = '';    //前置路径
        for (let i = 0; i < pathArr.length; i++) {
            let v = pathArr[i].trim();
            if (v === '') {
                pathArr.splice(i--, 1);
                continue;
            }

            if (v.startsWith(':')) { //参数
                if (param.length === 0) {
                    paramIndex = i;
                }
                param.push(v.substring(1));
            } else {
                paramIndex = -1;
                param = []; //上级路由的参数清空
                this.path = v; //暂存path
                let j = 0;
                for (; j < node.children.length; j++) {
                    let r = node.children[j];
                    if (r.path === v) {
                        node = r;
                        break;
                    }
                }

                //没找到，创建新节点
                if (j === node.children.length) {
                    if (prePath !== '') {
                        new Route({ path: prePath},node);
                        node = node.children[node.children.length - 1];
                    }
                    prePath = v;
                }
            }

            //不存在参数
            this.params = paramIndex===-1?[]:param;
        }
    }

    /**
     * 克隆
     * @returns 克隆对象
     */
    clone(){
        let r = new Route();
        Object.getOwnPropertyNames(this).forEach(item=>{
            if(item === 'data'){    
                return;
            }
            r[item] = this[item];
        });
        if(this.data){
            r.data = Util.clone(this.data);
        }
        return r;
    }
}