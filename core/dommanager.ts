import { Module } from "./module";
import { ModuleFactory } from "./modulefactory";
import { IRenderedDom } from "./types";
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
     * 虚拟dom树
     */
    public vdomTree:VirtualDom;

    /**
     * 渲染过的树
     */
    public renderedTree:IRenderedDom;

    /**
     *  key:html node映射
     */
    public elementMap:Map<number,Node> = new Map();

    constructor(module:Module){
        this.module = module;
    }
    /**
     * 从origin tree 获取虚拟dom节点
     * @param key   dom key
     */
    public getOriginDom(key:number):VirtualDom{
        if(!this.vdomTree){
            return null;
        }
        return find(this.vdomTree);
        function find(dom:VirtualDom){
            if(dom.key === key){
                return dom;
            }
            if(dom.children){
                for(let d of dom.children){
                    let d1 = find(d);
                    if(d1){
                        return d1;
                    }
                }
            }
        }
    }

    /**
     * 从渲染树中获取key对应的渲染节点
     * @param key   dom key
     */
     public getRenderedDom(key:number):IRenderedDom{
        if(!this.renderedTree){
            return;
        }
        return find(this.renderedTree,key);
        /**
         * 递归查找
         * @param dom   渲染dom  
         * @param key   待查找key
         * @returns     key对应renderdom 或 undefined
         */
        function find(dom:IRenderedDom,key:number):IRenderedDom{
            if(dom.key === key){
                return dom;
            }
            if(dom.children){
                for(let d of dom.children){
                    if(!d){
                        continue;
                    }
                    let d1 = find(d,key);
                    if(d1){
                        return d1;
                    }
                }
            }
        }
    }

    /**
     * 克隆渲染后的dom节点
     * @param key   dom key或dom节点
     * @param deep  是否深度复制（复制子节点）
     */
    public cloneRenderedDom(key:IRenderedDom|number,deep?:boolean):IRenderedDom{
        let src:IRenderedDom;
        if(typeof key === 'string'){
            src = this.getRenderedDom(key);
        }else{
            src = <IRenderedDom>key;
        }
    
        if(!src){
            return null;
        }
        let dst:any = {
            key:key,
            vdom:src.vdom,
            tagName:src.tagName,
            staticNum:src.staticNum,
            textContent:src.textContent,
            moduleId:src.moduleId
        };
        if(src.props){
            dst.props = {};
            for(let k of Object.keys(src.props)){
                dst.props[k] = src.props[k];
            }
        }
        if(src.assets){
            dst.assets = {};
            for(let k of Object.keys(src.assets)){
                dst.assets[k] = src.assets[k];
            }
        }

        if(deep && src.children){
            dst.children = [];
            for(let c of src.children){
                dst.children.push(this.cloneRenderedDom(c))
            }
        }
        return dst;
    }


    /**
     * 清除html element map 节点
     * @param dom   dom节点，如果为空，则清空map
     */
    public clearElementMap(dom?:IRenderedDom){
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
     * @param key   dom key 
     * @returns     html node
     */
    public getElement(key:number):Node{
        return this.elementMap.get(key);
    }

    /**
     * save html node
     * @param key   dom key
     * @param node  html node
     */
    public saveElement(key:number,node:Node){
        this.elementMap.set(key,node);
    }

    /**
     * 释放node
     * 包括从dom树解挂，释放对应结点资源
     * @param dom       虚拟dom
     */
    public freeNode(dom:IRenderedDom){
        if(dom.moduleId){  //子模块
            let m = ModuleFactory.get(dom.moduleId);
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
                for(let d of dom.children){
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