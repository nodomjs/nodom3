/**
 * 自定义元素管理器
 */
export declare class DefineElementManager {
    /**
     * 自定义element
     */
    private static elements;
    /**
     * 添加自定义元素类
     * @param clazz     自定义元素类或类数组
     * @param alias     别名
     */
    static add(clazz: any, alias?: string): void;
    /**
     * 获取自定义元素类
     * @param tagName   元素名
     * @returns         自定义元素类
     */
    static get(tagName: string): any;
    /**
     * 是否存在自定义元素
     * @param tagName   元素名
     * @returns         存在或不存在
     */
    static has(tagName: string): boolean;
}
