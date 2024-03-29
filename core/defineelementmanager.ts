import { DefineElementClass} from "./types";

/**
 * 自定义元素管理器
 * 
 * @remarks
 * 所有自定义元素需要添加到管理器才能使用
 */
export class DefineElementManager {
    /**
     * 自定义元素集合
     */
    private static elements: Map<string, DefineElementClass> = new Map();
    
    /**
     * 添加自定义元素
     * @param clazz -   自定义元素类或类数组
     */
    public static add(clazz:unknown[]|unknown) {
        if(Array.isArray(clazz)){
            for(const c of clazz){
                this.elements.set(c.name.toUpperCase(), <DefineElementClass>c);
            }
        }else{
            this.elements.set((<DefineElementClass>clazz).name.toUpperCase(), <DefineElementClass>clazz);
        }
    }

    /**
     * 获取自定义元素类
     * @param tagName - 元素名
     * @returns         自定义元素类
     */
    public static get(tagName: string): DefineElementClass {
        return this.elements.get(tagName.toUpperCase());
    }

    /**
     * 是否存在自定义元素
     * @param tagName - 元素名
     * @returns         存在或不存在
     */
    public static has(tagName:string):boolean{
        return this.elements.has(tagName.toUpperCase());
    }
}
