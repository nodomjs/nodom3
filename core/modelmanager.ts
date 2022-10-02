import { VirtualDom } from "./virtualdom";
import { Model } from "./model";
import { Module } from "./module";
import { ModuleFactory } from "./modulefactory";
import { Renderer } from "./renderer";
import { Util } from "./util";

/**
 * 模型工厂
 */
export class ModelManager {
    
    /**
     * 数据map
     * {data:model}，
     * 其中：
     *      data:       初始数据对象
     *      model:      model对象
     *      
     */
    private static dataMap: WeakMap<object,Model> = new WeakMap();

    /**
     * 模型map
     * {model:{key:,modules:,watchers:}}
     * 其中：
     *  key:        model key
     *  modules:    该model对象绑定的模块id数组
     *  watchers:   model对应监听器map {prop:{foo:modules}}
     *               其中：prop为被监听属性，foo为监听器方法，modules为被监听属性所影响的模块数组
     */
    public static modelMap:Map<object,any> = new Map();

    /**
     * 用于保存bindToModule时的子对象对应mids
     * {data:[mids]}
     * 其中：
     *  data:   data object
     *  mids:   moduleid 数组
     */
    private static tempMap:WeakMap<object,number[]> = new WeakMap();
    /**
     * 获取model map
     * @returns  model map
     */
    public static getMap():Map<object,any>{
        return this.modelMap;
    }
    /**
     * 获取model，不存在则新建
     * @param data      数据
     * @param module    所属模块
     * @returns         model
     */
    public static getModel(data:any,receiver?:Model):Model{
        // let model;
        if(this.dataMap.has(data)){
            const mdl = this.dataMap.get(data);
            //存在暂存的数据模块绑定，需要添加到model模块绑定
            if(this.tempMap.has(data)){
                const mids = this.getModuleIds(mdl);
                const newIds = this.tempMap.get(data);
                this.tempMap.delete(data);
                for(let id of newIds){
                    if(mids.indexOf(id) === -1){
                        mids.push(id);
                    }
                }
            }
            return mdl;
        }
    }

    /**
     * 获取model key
     * @param model     model对象
     * @returns         model对应key
     */
    public static getModelKey(model:Model):number{
        if(this.modelMap.has(model)){
            return this.modelMap.get(model).key;
        }
    }

    /**
     * 添加数据到map
     * @param data 
     */
    public static add(data,model,receiver?:Model){
        this.dataMap.set(data,model);
        // 复制父model模块
        let mids = [];
        if(receiver){
            mids = this.getModuleIds(receiver).slice(0);
            
        }
        this.modelMap.set(model,{key:Util.genId(),modules:mids});
    }
    
    /**
     * 绑定model到module
     * @param model     模型 
     * @param module    模块
     * @param isSecond  是否为第二次绑定（通常为传递给子模块的数据对象） 
     * @returns 
     */
    public static bindToModule(model:Model,module:Module,isSecond?:boolean){
        if(!this.modelMap.has(model)){
            this.modelMap.set(model,{key:Util.genId()});
        }
        let obj = this.modelMap.get(model);
        
        if(!obj.modules){
            obj.modules = [module.id];
        }else{
            if(obj.modules.indexOf(module.id) === -1){
                obj.modules.push(module.id);
            }
        }
        /**
         * 第二次为增量绑定，需要对子对象进行处理
         */
        if(isSecond){
            saveChildren(model,this.tempMap);
        }

        /**
         * 保存子对象的模块绑定到临时map中
         * @param mdl   模型
         * @param map   临时map
         */
        function saveChildren(mdl:Model,map:WeakMap<object,number[]>){
            for(let key of Object.keys(mdl)){
                if(mdl[key] && typeof mdl[key] === 'object'){
                    let d = mdl[key].___source;
                    if(map.has(d)){
                        map.get(d).push(module.id);
                    }else{
                        map.set(d,[module.id])
                    }
                    //递归处理
                    saveChildren(mdl[key],map);
                }
            }
        }
    }

    /**
     * 获取model绑定的moduleId
     * @param model     模型
     * @returns model绑定的模块id数组
     */
    public static getModuleIds(model:Model):number[]{
        if(!this.modelMap.has(model)){
            return;
        }
        return this.modelMap.get(model).modules;
    }

    /**
     * 更新导致渲染
     * 如果不设置oldValue和newValue，则直接强制渲染
     * @param model     model
     * @param key       属性
     * @param oldValue  旧值
     * @param newValue  新值
     */
    public static update(model: Model, key: string, oldValue?: any, newValue?: VirtualDom) {
        const modules = this.getModuleIds(model);
        if(!modules){
            return;
        }
        //所有module渲染
        for(let mid of modules){
            const m:Module = ModuleFactory.get(mid);
            if(m){
                Renderer.add(m);
            }
        }

        let watchers = this.modelMap.get(model)['watchers'];
        if(!watchers){
            return;
        }
        if(!watchers.has(key)){
            return;
        }
        let foos = watchers.get(key);
        for(let v of foos){
            for(let mid of v[1]){
                const m:Module = ModuleFactory.get(mid);
                if(m){
                    v[0].call(m,model,key,oldValue,newValue);
                }
            }
        }
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
    public static watch(model:Model,key: string|string[], operate: Function,module?:Module,deep?:boolean):Function {
        let mids = module?[module.id]:ModelManager.getModuleIds(model);
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
            if(arr){
                for(let f of arr){
                    let map = ModelManager.modelMap.get(f.m)['watchers'];
                    if(!map || !map.has(f.k)){
                        continue;
                    }
                    if(!f.operate){
                        map.delete(f.k);
                    }else if(map.get(f.k).has(f.operate)){
                        map.get(f.k).delete(f.operate);
                    }
                }
            }
            //释放arr
            arr = null;
        }
        
        /**
         * 监听一个
         * @param model     当前model  
         * @param key       监听键
         * @param operate   操作方法
         * @returns 
         */
        function watchOne(model:Model,key:string,operate:Function){
            let index = -1;
            //如果带'.'，则只取最里面那个对象
            if ((index = key.lastIndexOf('.')) !== -1) {
                model = ModelManager.get(model,key.substring(0, index));
                key = key.substring(index + 1);
            }
            if (!model) {
                return;
            }
            
            const obj = ModelManager.modelMap.get(model);
            if(!obj['watchers']){
                obj['watchers'] = new Map();
            }
            let map = obj['watchers'];
            if(!map.has(key)){
                map.set(key,new Map());
            }
            map.get(key).set(operate,mids);

            //添加到撤销数组
            arr.push({m:model,k:key,f:operate});
            //深度监听
            if(deep && model[key] && typeof model[key] === 'object'){
                for(let k of Object.keys(model[key])){
                    if(typeof model[key][k] !== 'function'){
                        watchOne(model[key],k,operate);
                    }
                }
            }
        }
    }

    /**
     * 查询model子属性
     * @param key       属性名，可以分级，如 name.firstName
     * @param model     模型
     * @returns         属性对应model proxy
     */
    public static get(model:Model, key?: string):any {
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
    public static set(model:Model,key:string,value:any){
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

    /**
     * 判断一个对象是否为model（proxy）
     * @param model     待检测对象
     * @returns         true/false
     */
    public static isModel(model):boolean{
        return model!==undefined && model!==null && model.___source !== undefined;
    }
}
