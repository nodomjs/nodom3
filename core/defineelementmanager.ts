import { DefineElement } from "./defineelement";

/**
 * 自定义元素管理器
 */
export class DefineElementManager {
    /**
     * 自定义element
     */
    private static elements: Map<string, DefineElement> = new Map();
    /**
     * 添加自定义元素类
     * @param clazz     自定义元素类或类数组
     * @param alias     别名   
     */
    public static add(clazz:any,alias?:string) {
        if(Array.isArray(clazz)){
            for(let c of clazz){
                this.elements.set(c.name.toUpperCase(), c);
            }
        }else{
            this.elements.set((alias||clazz.name).toUpperCase(), clazz);
        }
    }

    /**
     * 获取自定义元素类
     * @param tagName   元素名
     * @returns         自定义元素类
     */
    public static get(tagName: string): any {
        return this.elements.get(tagName.toUpperCase());
    }

    /**
     * 是否存在自定义元素
     * @param tagName   元素名
     * @returns         存在或不存在
     */
    public static has(tagName:string):boolean{
        return this.elements.has(tagName.toUpperCase());
    }
}
