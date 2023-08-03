/**
 * 调度器
 * @remarks
 * 管理所有需调度的任务并进行循环调度，默认采用requestAnimationFrame方式进行循环
 */
export declare class Scheduler {
    /**
     * 待执行任务列表
     */
    private static tasks;
    /**
     * 执行任务
     */
    static dispatch(): void;
    /**
     * 启动调度器
     * @param scheduleTick - 	渲染间隔（ms），默认50ms
     */
    static start(scheduleTick?: number): void;
    /**
     * 添加任务
     * @param foo - 	待执行任务函数
     * @param thiser - 	this指向
     */
    static addTask(foo: () => void, thiser?: object): void;
    /**
     * 移除任务
     * @param foo - 	任务函数
     */
    static removeTask(foo: any): void;
}
