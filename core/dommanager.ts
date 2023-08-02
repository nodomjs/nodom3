import { Module } from "./module";
import { ModuleFactory } from "./modulefactory";
import { RenderedDom } from "./types";
import { VirtualDom } from "./virtualdom";

/**
 * dom 管理器，用于管理模块的虚拟dom，旧渲染树
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
     * 渲染过的树
     */
    public renderedTree:RenderedDom;

    /**
     *  key:html node映射
     */
    public elementMap:Map<number|string,Node> = new Map();

    /**
     * 构造方法
     * @param module -    所属模块
     */
    constructor(module:Module){
        this.module = module;
    }
    /**
     * 从origin tree 获取虚拟dom节点
     * @param key -   dom key 或 props 键值对
     * @returns     编译后虚拟节点 
     */
    public getOriginDom(key:string|number|object):VirtualDom{
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
     * 从渲染树中获取key对应的渲染节点
     * @param key - dom key或props键值对
     * @returns     渲染后虚拟节点
     */
    public getRenderedDom(key:object):RenderedDom{
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
        function find(dom:RenderedDom,key:object):RenderedDom{
            //对象表示未props查找
            if(typeof key === 'object'){
                if(!Object.keys(key).find(k=>key[k] !== dom.props[k])){
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
     * 获取html node
     * @param key -   dom key 或 props 键值对
     * @returns     html node
     */
    public getElement(key:number|string|object):Node{
        if(typeof key === 'object'){
            key = this.getRenderedDom(key);
        }
        return this.elementMap.get(<string|number>key);
    }

    /**
     * save html node
     * @param key -   dom key
     * @param node -  html node
     */
    public saveElement(key:number|string,node:Node){
        this.elementMap.set(key,node);
    }

    /**
     * 释放node
     * 包括从dom树解挂，释放对应结点资源
     * @param dom -       虚拟dom
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
     * 重置
     */
    public reset(){
        this.renderedTree = null;
        this.elementMap.clear();
    }
}