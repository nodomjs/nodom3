/**
 * 模块状态类型
 */
export var EModuleState;
(function (EModuleState) {
    /**
     * 初始化
     */
    EModuleState[EModuleState["INITED"] = 1] = "INITED";
    /**
     * 非激活(休眠态)
     */
    EModuleState[EModuleState["UNACTIVE"] = 2] = "UNACTIVE";
    /**
     * 未挂载到html dom
     */
    EModuleState[EModuleState["UNMOUNTED"] = 3] = "UNMOUNTED";
    /**
     * 已渲染到dom树
     */
    EModuleState[EModuleState["RENDERED"] = 4] = "RENDERED";
})(EModuleState || (EModuleState = {}));
//# sourceMappingURL=types.js.map