import { Module } from "./module";
import { RenderedDom } from "./types";
/**
 * css 管理器
 * @privateRemarks
 * 针对不同的rule，处理方式不同
 *
 * CssStyleRule 进行保存和替换，同时模块作用域scope有效
 *
 * CssImportRule 路径不重复添加，因为必须加在stylerule前面，所以需要记录最后的import索引号
 */
export declare class CssManager {
    /**
     * style sheet
     */
    private static sheet;
    /**
     * import url map，用于存储import的url路径
     */
    private static importMap;
    /**
     * importrule 位置
     */
    private static importIndex;
    /**
     * css class 前置名
     */
    private static cssPreName;
    /**
     * 处理style 元素
     * @param module -  模块
     * @param dom -     虚拟dom
     * @param root -    模块root dom
     * @param add -     是否添加根模块类名
     * @returns         如果是styledom，则返回true，否则返回false
     */
    static handleStyleDom(module: Module, dom: RenderedDom, root: RenderedDom): void;
    /**
     * 处理 style 下的文本元素
     * @param module -  模块
     * @param dom -     style text element
     * @returns         如果是styleTextdom返回true，否则返回false
     */
    static handleStyleTextDom(module: Module, dom: RenderedDom): boolean;
    /**
     * 添加多个css rule
     * @param cssText -     rule集合
     * @param module -      模块
     * @param scopeName -   作用域名(前置选择器)
     */
    private static addRules;
    /**
     * 清除模块css rules
     * @param module -  模块
     */
    static clearModuleRules(module: Module): void;
}
