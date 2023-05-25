import { Module } from "./module";

/**
 * 过滤器工厂，存储模块过滤器
 */
export class ModuleFactory {
    /**
     * 模块对象集合 {moduleId:模块对象}}
     */
    private static modules: Map<number, Module> = new Map();

    /**
     * 模块类集合 {className:模块类}
     */
    public static classes: Map<string, Module> = new Map();

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
     * @param item  模块对象
     */
    public static add(item: Module) {
        // 第一个为主模块
        if (this.modules.size === 0) {
            this.mainModule = item;
        }
        this.modules.set(item.id, item);
        //添加模块类
        this.addClass(item.constructor);
    }

    /**
     * 获得模块
     * @param name  类或实例id
     */
    public static get(name: any): Module {
        let tp = typeof name;
        if (tp === 'number') {  //数字，模块id
            return this.modules.get(name);
        } else{
            let m;
            if(tp === 'string'){ //字符串，模块类名
                if(!this.classes.has(name)){  //为别名
                    name = this.aliasMap.get(name);
                }
                if(this.classes.has(name)){
                    return Reflect.construct(<any>this.classes.get(name),[]);
                }
            } else{ //模块类
                return Reflect.construct(name,[]);
            }
        } 
    }

    /**
     * 是否存在模块类
     * @param clazzName     模块类名
     * @returns     true/false
     */
    public static hasClass(clazzName: string): boolean {
        const name = clazzName.toLowerCase();
        return this.classes.has(name) || this.aliasMap.has(name);
    }

    /**
     * 添加模块类
     * @param clazz     模块类
     * @param alias     注册别名
     */
    public static addClass(clazz: any, alias?: string) {
        //转换成小写
        let name = clazz.name.toLowerCase();
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
     * @param name  类名或别名 
     * @returns     模块类
     */
    public static getClass(name:string):any{
        name = name.toLowerCase();
        return this.classes.has(name)?this.classes.get(name):this.classes.get(this.aliasMap.get(name));
    }
    
    /**
     * 装载module
     * @param modulePath    模块类路径
     * @return              模块类
     */
    public static async load(modulePath:string):Promise<any>{
        let m = await import(modulePath);
        if(m){
            //通过import的模块，查找模块类
            for(let k of Object.keys(m)){
                if(m[k].name){
                    this.addClass(m[k]);
                    return m[k];
                }
            }
        }
    }
    /**
     * 从工厂移除模块
     * @param id    模块id
     */
    static remove(id: number) {
        this.modules.delete(id);
    }
    /**
     * 设置主模块
     * @param m 	模块 
     */
    static setMain(m: Module) {
        this.mainModule = m;
    }

    /**
     * 获取主模块
     * @returns 	应用的主模块
     */
    static getMain() {
        return this.mainModule;
    }
}
