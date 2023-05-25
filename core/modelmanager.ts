import { ModuleFactory } from "./modulefactory";
import { Model } from "./model";
import { Module } from "./module";
import { Renderer } from "./renderer";
import { Util } from "./util";

/**
 * 模型工厂
 */
export class ModelManager {
    /**
     * 所属模块
     */
    public module:Module;

    /**
     * 数据map
     * {data:{model:model,key:key}
     * 其中：
     *      data:       初始数据对象
     *      model:      model对象
     */
    private dataMap: WeakMap<object,any> = new WeakMap();

    /**
     * 存储模型对应属性名，如果为父传子，则需要保存属于该模型的属性名
     * key: model
     * value: model名字
     */
    private nameMap:WeakMap<object,any> = new WeakMap();
    /** 
     * model对应监听器map 
     *  key:model
     *  value:{key1:{f:foo1,deep:true/false},key2:,...}
     *        其中：prop为被监听属性，foo为监听器方法，deep为是否深度监听
     */
    private watchMap:WeakMap<object,any> = new WeakMap();

    /**
     * 是否存在深度watcher
     */
    private hasDeepWatch:boolean = false;

    /**
     * 绑定module map，slot引用外部数据时有效
     * {model:[moduleid1,moduleid2,...]}
     */
    public bindMap:WeakMap<object,number[]> = new WeakMap();

    
    /**
     * 构造器
     * @param module    模块
     */
    constructor(module:Module){
        this.module = module;
    }

    /**
     * 获取model，不存在则新建
     * @param data      数据
     * @returns         model
     */
    public getModel(data:any):Model{
        return this.dataMap.has(data)?this.dataMap.get(data).model:undefined;
    }

    /**
     * 获取model key
     * @param model     model对象
     * @returns         model对应key
     */
    public getModelKey(data:any):number{
        return this.dataMap.has(data)?this.dataMap.get(data).key:undefined;
    }

    /**
     * 设置模型名
     * @param model 模型 
     * @param name  名
     */
    public setModelName(model:any,name:string){
        if(!this.nameMap.has(model)){
            this.nameMap.set(model,name);
        }
    }    

    /**
     * 获取模型名
     * @param model 模型 
     * @returns     模型名
     */
    public getModelName(model:any):string{
        return this.nameMap.get(model);
    }

    /**
     * 添加数据到map
     * @param data      原始数据
     * @param model     模型
     */
    public add(data,model){
        //避免重复添加
        if(this.dataMap.has(data)){
            return;
        }
        this.dataMap.set(data,{model:model,key:model.__key || Util.genId()});
    }
    
    /**
     * 添加绑定
     * @param model     模型 
     * @param moduleId  模块id
     */
    public bindModel(model:any,module:Module){
        if(!model){
            return;
        }
        bind(this.bindMap,model,module);
        /**
         * 绑定
         * @param bindMap 
         * @param model 
         * @param module 
         */
        function bind(bindMap,model,module){
            if(model.__module === module){
                return;
            }
            let mids;
            if(!bindMap.has(model)){
                mids = [];
                bindMap.set(model,mids);
            }else{
                mids = bindMap.get(model);
            }
            if(!mids.includes(module.id)){
                mids.push(module.id);
            }
            //级联绑定
            for(let key of Object.keys(model)){
                if(model[key] && typeof model[key] === 'object'){
                    bind(bindMap,model[key],module);
                }
            }
        }
    }

    /**
     * 更新导致渲染
     * 如果不设置oldValue和newValue，则直接强制渲染
     * @param model     model
     * @param key       属性
     * @param oldValue  旧值
     * @param newValue  新值
     */
    public update(model: Model, key: string, oldValue?: any, newValue?: any) {
        //处理watch
        handleWatcher(this.module,model);
        //添加module渲染
        Renderer.add(this.module);
        //对绑定模块添加渲染
        if(this.bindMap.has(model)){
            for(let id of this.bindMap.get(model)){
                const m = ModuleFactory.get(id);
                if(m){
                    handleWatcher(m,model);
                    Renderer.add(m);
                }
            }
        }
        
        /**
         * 处理watcher
         * @param mdl   模块
         * @param model 模型
         */  
        function handleWatcher(mdl,model){
            const map = mdl.modelManager.watchMap;
            let watcher = map.get(model);
            //当前model存在watcher
            if(watcher && watcher[key]){
                //查找对应key是否存在watch
                watcher[key].f.call(mdl,model,key,oldValue,newValue);
            }else if(mdl.modelManager.hasDeepWatch){   //进行deep查找
                for(let m = model;m && m.__parent;m=m.__parent){
                    //如果已经跨模块，则表示为父传子，父模块指向当前模块
                    let pm = m.__parent.__module === mdl?m.__parent:mdl.model;
                    if(!map.has(pm)){
                        continue;
                    }
                    const watcher = map.get(pm);
                    const name = mdl.modelManager.getModelName(m)||m.__name;
                    if(watcher && watcher[name]){
                        let cfg = watcher[name];
                        // 当前model或父model deep watch
                        if(cfg.deep){
                            cfg.f.call(mdl,model,key,oldValue,newValue);
                            //找到即跳出循环
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * 监听某个数据项
     * 注意：执行此操作时，该数据项必须已经存在，否则监听失败
     * @param model     带watch的model
     * @param key       数据项名或数组
     * @param operate   数据项变化时执行方法
     * @param module    指定模块，如果指定，则表示该model绑定的所有module都会触发watch事件，在model父(模块)传子(模块)传递的是对象时会导致多个watch出发
     * @param deep      是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
     * 
     * @returns         unwatch函数
     */
    public watch(model:Model,key: string|string[], operate: Function,deep?:boolean):Function {
        if(!operate || typeof operate !== 'function'){
            return;
        }
        const me = this;
        //设置深度watch标志
        this.hasDeepWatch = deep;
        //撤销watch数组，数据项为{m:model,k:监听属性,f:触发方法}
        let arr = [];
        if(Array.isArray(key)){
            for(let k of key){
                watchOne(model,k,operate);
            }
        }else{
            watchOne(model,key,operate);
        }

        //返回取消watch函数
        return ()=>{
            //避免二次取消
            if(!Array.isArray(arr)){
                return;
            }
            for(let f of arr){
                let obj = me.watchMap.get(f.m);
                if(!obj){
                    continue;
                }
                delete obj[f.k];
                //已经无监听从watchMap移除
                if(Object.keys(obj).length === 0){
                    me.watchMap.delete(f.m);
                }
            }
            //释放arr
            arr = null;
        }
        
        /**
         * 监听一个
         * @param model     当前model  
         * @param key       监听属性，可以支持多级属性，如果为多级属性，倒数第二级对应数据项必须为对象
         * @param operate   操作方法
         * @returns 
         */
        function watchOne(model:Model,key:string,operate:Function){
            if (!model || typeof model !== 'object') {
                return;
            }
            let index;
            //如果带'.'，则只取最里面那个对象
            if ((index = key.lastIndexOf('.')) !== -1) {
                model = me.get(model,key.substring(0, index));
                key = key.substring(index + 1);
                if (!model || typeof model !== 'object') {
                    return;
                }
            }
            
            if(!me.watchMap.has(model)){
                me.watchMap.set(model,{});
            }
            const obj= me.watchMap.get(model);
            obj[key] = {f:operate,deep:deep};
            //保存用于撤销watch
            arr.push({m:model,k:key});
        }
    }

    
    /**
     * 查询model子属性
     * @param key       属性名，可以分级，如 name.firstName
     * @param model     模型
     * @returns         属性对应model proxy
     */
    public get(model:Model, key?: string):any {
        if(key){
            if (key.indexOf('.') !== -1) {    //层级字段
                let arr = key.split('.');
                for (let i = 0; i < arr.length - 1; i++) {
                    model = model[arr[i]];
                    if (!model) {
                        break;
                    }
                }
                if (!model) {
                    return;
                }
                key = arr[arr.length - 1];
            }
            model = model[key];
        }
        return model;
    }

    /**
     * 设置值
     * @param model     模型
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     */
    public set(model:Model,key:string,value:any){
        if (key.indexOf('.') !== -1) {    //层级字段
            let arr = key.split('.');
            for (let i = 0; i < arr.length - 1; i++) {
                //不存在，则创建新的model
                if (!model[arr[i]]) {
                    model[arr[i]] = {};
                }
                model = model[arr[i]];
            }
            key = arr[arr.length - 1];
        }
        model[key] = value;
    }
}