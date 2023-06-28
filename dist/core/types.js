/**
 * 模块状态类型
 */
export var EModuleState;
(function (EModuleState) {
    /**
     * 已初始化
     */
    EModuleState[EModuleState["INIT"] = 1] = "INIT";
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