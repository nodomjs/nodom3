import { Module } from "./module";
import { UnknownClass } from "./types";

/**
 * 过滤器工厂，存储模块过滤器
 */
export class ModuleFactory {
    /**
     * 模块对象集合 
     * key: 模块id
     * value: 模块对象
     */
    private static modules: Map<number, Module> = new Map();

    /**
     * 模块类集合
     *  key:    模块类名或别名
     *  value:  模块类
     */
    public static classes: Map<string, UnknownClass> = new Map();

    /**
     * 别名map
     * key:     别名
     * value:   类名
     */
    public static aliasMap:Map<string,string> = new Map();

    /**
     * 主模块
     */
    private static mainModule: Module;

    /**
     * 添加模块到工厂
     * @param item -  模块对象
     */
    public static add(item: Module) {
        // 第一个为主模块
        if (this.modules.size === 0) {
            this.mainModule = item;
        }
        this.modules.set(item.id, item);
        //添加模块类
        this.addClass(<UnknownClass>item.constructor);
    }

    /**
     * 获得模块
     * @param name -  类或实例id
     */
    public static get(name: number|string|UnknownClass): Module {
        const tp = typeof name;
        let mdl:Module;
        if (tp === 'number') {  //数字，模块id
            return this.modules.get(<number>name);
        } else{
            if(tp === 'string'){ //字符串，模块类名
                name = (<string>name).toLowerCase();
                if(!this.classes.has(name)){  //为别名
                    name = this.aliasMap.get(name);
                }
                if(this.classes.has(name)){
                    mdl = Reflect.construct(<UnknownClass>this.classes.get(name),[]);
                }
            } else{ //模块类
                mdl = Reflect.construct(<UnknownClass>name,[]);
            }
            if(mdl){
                mdl.init();
                return mdl;
            }
        } 
    }

    /**
     * 是否存在模块类
     * @param clazzName -     模块类名
     * @returns     true/false
     */
    public static hasClass(clazzName: string): boolean {
        const name = clazzName.toLowerCase();
        return this.classes.has(name) || this.aliasMap.has(name);
    }

    /**
     * 添加模块类
     * @param clazz -     模块类
     * @param alias -     注册别名
     */
    public static addClass(clazz: UnknownClass, alias?: string) {
        //转换成小写
        const name = clazz.name.toLowerCase();
        if (this.classes.has(name)) {
            return;
        }
        this.classes.set(name, clazz);
        //添加别名
        if (alias) {
            this.aliasMap.set(alias.toLowerCase(),name);
        }
    }

    /**
     * 获取模块类
     * @param name -  类名或别名 
     * @returns     模块类
     */
    public static getClass(name:string):UnknownClass{
        name = name.toLowerCase();
        return this.classes.has(name)?this.classes.get(name):this.classes.get(this.aliasMap.get(name));
    }
    
    /**
     * 装载module
     * @param modulePath -   模块类路径
     * @returns              模块类
     */
    public static async load(modulePath:string):Promise<UnknownClass>{
        const m = await import(modulePath);
        if(m){
            //通过import的模块，查找模块类
            for(const k of Object.keys(m)){
                if(m[k].name){
                    this.addClass(m[k]);
                    return m[k];
                }
            }
        }
    }
    
    /**
     * 从工厂移除模块
     * @param id -    模块id
     */
    public static remove(id: number) {
        this.modules.delete(id);
    }
    /**
     * 设置主模块
     * @param m - 	模块 
     */
    public static setMain(m: Module) {
        this.mainModule = m;
    }

    /**
     * 获取主模块
     * @returns 	应用的主模块
     */
    public static getMain() {
        return this.mainModule;
    }
}
