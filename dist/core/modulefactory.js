/**
 * 过滤器工厂，存储模块过滤器
 */
export class ModuleFactory {
    /**
     * 添加模块到工厂
     * @param item  模块对象
     */
    static add(item) {
        // //第一个为主模块
        if (this.modules.size === 0) {
            this.mainModule = item;
        }
        this.modules.set(item.id, item);
        //添加模块类
        this.addClass(item.constructor);
    }
    /**
     * 获得模块
     * @param name  类、类名或实例id
     */
    static get(name) {
        if (typeof name === 'number') {
            return this.modules.get(name);
        }
        else {
            return this.getInstance(name);
        }
    }
    /**
     * 是否存在模块类
     * @param clazzName     模块类名
     * @returns     true/false
     */
    static hasClass(clazzName) {
        return this.classes.has(clazzName.toLowerCase());
    }
    /**
     * 添加模块类
     * @param clazz     模块类
     * @param alias     注册别名
     */
    static addClass(clazz, alias) {
        //转换成小写
        let name = clazz.name.toLowerCase();
        if (this.classes.has(name)) {
            return;
        }
        this.classes.set(name, clazz);
        if (alias) {
            this.classes.set(alias, clazz);
        }
    }
    /**
     * 获取模块实例（通过类名）
     * @param className     模块类或类名
     * @param props         模块外部属性
     */
    static getInstance(clazz) {
        let className = (typeof clazz === 'string') ? clazz : clazz.name.toLowerCase();
        let cls;
        // 初始化模块
        if (!this.classes.has(className) && typeof clazz === 'function') {
            cls = clazz;
        }
        else {
            cls = this.classes.get(className);
        }
        if (!cls) {
            return;
        }
        let m = Reflect.construct(cls, []);
        m.init();
        return m;
    }
    /**
     * 从工厂移除模块
     * @param id    模块id
     */
    static remove(id) {
        this.modules.delete(id);
    }
    /**
     * 设置主模块
     * @param m 	模块
     */
    static setMain(m) {
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
/**
 * 模块对象工厂 {moduleId:{key:容器key,className:模块类名,instance:模块实例}}
 */
ModuleFactory.modules = new Map();
/**
 * 模块类集合 {className:class}
 */
ModuleFactory.classes = new Map();
//# sourceMappingURL=modulefactory.js.map