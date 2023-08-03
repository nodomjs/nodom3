import { ChangedDom, RenderedDom } from "./types";
/**
 * dom比较器
 */
export declare class DiffTool {
    /**
     * 比较节点
     *
     * @param src -         待比较节点（新树节点）
     * @param dst - 	    被比较节点 (旧树节点)
     * @param changeArr -   增删改的节点数组
     * @returns	            改变的节点数组
     */
    static compare(src: RenderedDom, dst: RenderedDom): ChangedDom[];
}
