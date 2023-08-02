/**
 * 调度器，用于每次空闲的待操作序列调度
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
     * @param foo - 		任务和this指向
     * @param thiser - 		this指向
     */
    static addTask(foo: () => void, thiser?: object): void;
    /**
     * 移除任务
     * @param foo - 	任务
     */
    static removeTask(foo: any): void;
}
