/**
 * 模块状态类型
 */
export var EModuleState;
(function (EModuleState) {
    /**
     * 准备好，可渲染
     */
    EModuleState[EModuleState["READY"] = 1] = "READY";
    /**
     * 未挂载到html dom
     */
    EModuleState[EModuleState["UNMOUNTED"] = 3] = "UNMOUNTED";
    /**
     * 已挂载到dom树
     */
    EModuleState[EModuleState["MOUNTED"] = 4] = "MOUNTED";
})(EModuleState || (EModuleState = {}));
//# sourceMappingURL=types.js.map