import { IRenderedDom } from "./types";
/**
 * 比较器
 */
export declare class DiffTool {
    /**
     * 比较节点
     * @param src           待比较节点（新树节点）
     * @param dst 	        被比较节点 (旧树节点)
     * @param changeArr     增删改的节点数组
     * @returns	            [[type(add 1, upd 2,del 3,move 4 ,rep 5),dom(操作节点),dom1(被替换或修改节点),parent(父节点),loc(位置)]]
     */
    static compare(src: IRenderedDom, dst: IRenderedDom, changeArr: Array<any>): void;
}
