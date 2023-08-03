import { DefineElementClass } from "./types";
/**
 * 自定义元素管理器
 *
 * @remarks
 * 所有自定义元素需要添加到管理器才能使用
 */
export declare class DefineElementManager {
    /**
     * 自定义元素集合
     */
    private static elements;
    /**
     * 添加自定义元素
     * @param clazz -   自定义元素类或类数组
     */
    static add(clazz: unknown[] | unknown): void;
    /**
     * 获取自定义元素类
     * @param tagName - 元素名
     * @returns         自定义元素类
     */
    static get(tagName: string): DefineElementClass;
    /**
     * 是否存在自定义元素
     * @param tagName - 元素名
     * @returns         存在或不存在
     */
    static has(tagName: string): boolean;
}
