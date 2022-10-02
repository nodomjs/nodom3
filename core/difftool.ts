import { IRenderedDom } from "./types";
/**
 * 比较器
 */
export class DiffTool{
    /**
     * 比较节点
     * @param src           待比较节点（新树节点）
     * @param dst 	        被比较节点 (旧树节点)
     * @param changeArr     增删改的节点数组
     * @returns	            [[type(add 1, upd 2,move 3 ,rep 4,del 5),dom(操作节点),dom1(被替换或修改节点),parent(父节点),loc(位置)]]
     */
    public static compare(src:IRenderedDom,dst:IRenderedDom):any[] {
        const changeArr = [];
        compare(src,dst);
        return changeArr;

        /**
         * 比较节点
         * @param src           待比较节点（新树节点）
         * @param dst 	        被比较节点 (旧树节点)
         * @returns	            [[type(add 1, upd 2,del 3,move 4 ,rep 5),dom(操作节点),dom1(被替换或修改节点),parent(父节点),
         *                       loc(dom在父的children index)]]
         */
        function compare(src:IRenderedDom,dst:IRenderedDom) {
            if (!src.tagName) { //文本节点
                if (!dst.tagName) {
                    if ((src.staticNum || dst.staticNum) && src.textContent !== dst.textContent) {
                        addChange(2,src,null,dst.parent);
                    }
                } else { //节点类型不同，替换
                    addChange(5,src,dst, dst.parent);
                }
            } else {
                //节点类型不同或对应的子模块不同，替换
                if (src.tagName !== dst.tagName || src.subModuleId !== dst.subModuleId) { 
                    addChange(5,src,dst, dst.parent);
                }else{
                    //节点类型相同，但有一个不是静态节点，进行属性比较
                    if(src.staticNum || dst.staticNum && isChange(src,dst)){
                        addChange(2,src,null,dst.parent);
                    }
                    if(!src.subModuleId){  //子模块不比较子节点
                        compareChildren(src,dst);
                    }
                }
            }
            if(src.staticNum>0){
                src.staticNum--;
            }
        }

        /**
         * 比较子节点
         * @param src   新节点
         * @param dst   旧节点
         */
        function compareChildren(src,dst){
            //子节点处理
            if (!src.children || src.children.length === 0) {
                // 旧节点的子节点全部删除
                if (dst.children && dst.children.length > 0) {
                    dst.children.forEach(item => addChange(3,item,null,dst));
                }
            } else {
                //全部新加节点
                if (!dst.children || dst.children.length === 0) {
                    src.children.forEach((item,index) => addChange(1, item,null, dst,index));
                } else { //都有子节点
                    //存储比较后需要add的key
                    let addObj={};
                    //子节点对比策略
                    let [newStartIdx,newEndIdx,oldStartIdx,oldEndIdx] = [0,src.children.length-1,0,dst.children.length-1];
                    let [newStartNode,newEndNode,oldStartNode,oldEndNode] = [
                        src.children[newStartIdx],
                        src.children[newEndIdx],
                        dst.children[oldStartIdx],
                        dst.children[oldEndIdx]
                    ]
                    
                    while(newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
                        if (oldStartNode.key === newStartNode.key) {  //新前旧前
                            compare(newStartNode,oldStartNode);
                            if(newStartIdx !== oldStartIdx){
                                addChange(4,newStartNode,null,dst,newStartIdx);
                            }
                            newStartNode = src.children[++newStartIdx];
                            oldStartNode = dst.children[++oldStartIdx];
                        } else if (oldEndNode.key === newEndNode.key) { //新后旧后
                            compare(newEndNode,oldEndNode);
                            if(oldEndIdx !== newEndIdx){
                                addChange(4,newEndNode,null,dst,newEndIdx);
                            }
                            newEndNode = src.children[--newEndIdx];
                            oldEndNode = dst.children[--oldEndIdx];
                        } else if (newStartNode.key === oldEndNode.key) { //新前旧后
                            //新前旧后
                            compare(newStartNode,oldEndNode);
                            //放在指定位置
                            if(newStartIdx !== oldEndIdx){
                                addChange(4,newStartNode,null,dst,newStartIdx);
                            }
                            newStartNode = src.children[++newStartIdx];
                            oldEndNode = dst.children[--oldEndIdx];
                        } else if (newEndNode.key === oldStartNode.key) {  //新后旧前
                            compare(newEndNode,oldStartNode);
                            if(newEndIdx !== oldStartIdx){
                                addChange(4, newEndNode, null,dst, newEndIdx);
                            }
                            newEndNode = src.children[--newEndIdx];
                            oldStartNode = dst.children[++oldStartIdx];
                        } else {
                            //加入到addObj
                            addObj[newStartNode.key]= addChange(1, newStartNode, null,dst,newStartIdx);
                            //新前指针后移
                            newStartNode = src.children[++newStartIdx];
                        }
                    }

                    //多余新节点，需要添加
                    if (newStartIdx<=newEndIdx) {
                        for (let i = newStartIdx; i <= newEndIdx; i++) {
                            // 添加到dst.children[i]前面
                            addChange(1,src.children[i], null ,dst,i);
                        }
                    }
                    
                    //有多余老节点，需要删除或变成移动
                    if(oldStartIdx<=oldEndIdx){
                        for (let i = oldStartIdx,index=i; i <= oldEndIdx; i++,index++) {
                            let ch=dst.children[i];
                            //如果要删除的节点在addArr中，则表示move，否则表示删除
                            if(addObj.hasOwnProperty(ch.key)){ 
                                let o = addObj[ch.key];
                                if(index !== o[4]){ //修改为move
                                    o[0] = 4;
                                    //从add转为move，需要比较新旧节点
                                    compare(o[1],ch);
                                }else{  //删除不需要移动的元素
                                    let ii;
                                    if((ii=changeArr.findIndex(item=>item[1].key === o[1].key)) !== -1){
                                        changeArr.splice(ii,1);
                                    }
                                }
                            }else{
                                addChange(3,ch,null,dst);
                                //删除的元素索引号-1，用于判断是否需要移动节点
                                index--;
                            }
                        }
                    }
                }
            }
        }
        /**
         * 判断节点是否修改
         * @parma src   新树节点
         * @param dst   旧树节点
         * 
         */
        function isChange(src:IRenderedDom,dst:IRenderedDom):boolean{
            for(let p of ['props','assets']){
                //属性比较
                if(!src[p] && dst[p] || src[p] && !dst[p]){
                    return true;
                }else if(src[p] && dst[p]){
                    let keys = Object.keys(src[p]);
                    let keys1 = Object.keys(dst[p]);
                    if(keys.length !== keys1.length){
                        return true;
                    }else{
                        for(let k of keys){
                            if(src[p][k] !== dst[p][k]){
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        
        /**
         * 添加刪除替換
         * @param type      类型 add 1, upd 2,del 3,move 4 ,rep 5
         * @param dom       虚拟节点    
         * @param dom1      相对节点
         * @param parent    父节点
         * @param loc       添加或移动的目标index
         * @returns         添加的change数组
        */
        function addChange(type:number,dom: IRenderedDom, dom1: IRenderedDom,parent?:IRenderedDom,loc?:number){
            const o = [type,dom,dom1,parent,loc];
            changeArr.push(o);
            return o;
        }
    }
}
