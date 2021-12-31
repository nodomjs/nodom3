/**
 * 指令类
 */
export class DirectiveType {
    /**
     * 构造方法
     * @param name      指令类型名
     * @param handle    渲染时执行方法
     * @param prio      类型优先级
     */
    constructor(name, handle, prio) {
        this.name = name;
        this.prio = prio >= 0 ? prio : 10;
        this.handle = handle;
    }
}
//# sourceMappingURL=directivetype.js.map