import { Module } from "./module";
import { ModuleFactory } from "./modulefactory";
import { RenderedDom } from "./types";
import { VirtualDom } from "./virtualdom";

/**
 * dom管理器
 * @remarks
 * 用于管理module的虚拟dom树，渲染树，html节点
 */
export class DomManager{
    /**
     * 所属模块
     */
    private module:Module;

    /**
     * 编译后的虚拟dom树
     */
    public vdomTree:VirtualDom;

    /**
     * 渲染后的dom树
     */
    public renderedTree:RenderedDom;

    /**
     * html节点map
     * @remarks
     * 用于存放dom key对应的html节点 
     */
    private elementMap:Map<number|string,Node> = new Map();

    /**
     * 构造方法
     * @param module -  所属模块
     */
    constructor(module:Module){
        this.module = module;
    }
    /**
     * 从virtual dom 树获取虚拟dom节点
     * @param key - dom key 或 props键值对
     * @returns     编译后虚拟节点 
     */
    public getVirtualDom(key:string|number|object):VirtualDom{
        if(!this.vdomTree){
            return null;
        }
        return find(this.vdomTree);
        function find(dom:VirtualDom){
            //对象表示未props查找
            if(typeof key === 'object'){
                if(!Object.keys(key).find(k=>key[k] !== dom.props.get(k))){
                    return dom;
                }
            }else if(dom.key === key){ //key查找
                return dom;
            }
            if(dom.children){
                for(const d of dom.children){
                    const d1 = find(d);
                    if(d1){
                        return d1;
                    }
                }
            }
        }
    }

    /**
     * 从渲染树获取key对应的渲染节点
     * @param key - dom key 或 props键值对
     * @returns     渲染后虚拟节点
     */
    public getRenderedDom(key:object|string|number):RenderedDom{
        if(!this.renderedTree){
            return;
        }
        return find(this.renderedTree,key);
        /**
         * 递归查找
         * @param dom - 渲染dom  
         * @param key -   待查找key
         * @returns     key对应renderdom 或 undefined
         */
        function find(dom:RenderedDom,key:object|string|number):RenderedDom{
            //对象表示未props查找
            if(typeof key === 'object'){
                if(dom.props && !Object.keys(key).find(k=>key[k] !== dom.props[k])){
                    return dom;
                }
            }else if(dom.key === key){ //key查找
                return dom;
            }
            if(dom.children){
                for(const d of dom.children){
                    if(!d){
                        continue;
                    }
                    const d1 = find(d,key);
                    if(d1){
                        return d1;
                    }
                }
            }
        }
    }

    /**
     * 清除html element map 节点
     * @param dom -   dom节点，如果为空，则清空map
     */
    public clearElementMap(dom?:RenderedDom){
        if(dom){
            this.elementMap.delete(dom.key);
            //带自定义key的移除
            if(dom.props && dom.props['key']){
                this.elementMap.delete(dom.props['key']);
            }
        }else{
            this.elementMap.clear();
        }
    }

    /**
     * 获取html节点
     * @remarks
     * 当key为数字或字符串时，表示dom key，当key为对象时，表示根据dom属性进行查找
     * 
     * @param key - dom key 或 props键值对
     * @returns     html节点
     */
    public getElement(key:number|string|object):Node{
        if(typeof key === 'object'){
            const dom = this.getRenderedDom(key);
            if(dom){
                key = dom.key;
            }else{
                return;
            }
        }
        return this.elementMap.get(<string|number>key);
    }

    /**
     * 保存html节点
     * @param key -   dom key
     * @param node -  html node
     */
    public saveElement(key:number|string,node:Node){
        this.elementMap.set(key,node);
    }

    /**
     * 释放节点
     * @remarks
     * 释放操作包括：如果被释放节点包含子模块，则子模块需要unmount；释放对应节点资源
     * @param dom - 虚拟dom
     */
    public freeNode(dom:RenderedDom){
        if(dom.moduleId){  //子模块
            const m = ModuleFactory.get(dom.moduleId);
            if(m){
                m.unmount();
            }
        }else{      //普通节点
            //从map移除
            this.clearElementMap(dom);
            //解绑所有事件
            this.module.eventFactory.unbindAll(dom.key);
            //子节点递归操作
            if(dom.children){
                for(const d of dom.children){
                    this.freeNode(d);
                }
            }
        }
    }

    /**
     * 重置节点相关信息
     */
    public reset(){
        this.renderedTree = null;
        this.elementMap.clear();
    }
}