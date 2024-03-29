import { NError } from "./error";
import { Util } from "./util";

/**
 * 调度器
 * @remarks
 * 管理所有需调度的任务并进行循环调度，默认采用requestAnimationFrame方式进行循环
 */
export class Scheduler{
	/**
	 * 待执行任务列表
	 */
	private static tasks:Array<object> = [];
	
	/**
	 * 执行任务
	 */
	public static dispatch(){
		Scheduler.tasks.forEach((item)=>{
			if(Util.isFunction(item['func'])){
				if(item['thiser']){
					item['func'].call(item['thiser']);
				}else{
					item['func']();
				}
			}
		});
	}

	/**
	 * 启动调度器
	 * @param scheduleTick - 	渲染间隔（ms），默认50ms
	 */
	public static start(scheduleTick?:number){
		Scheduler.dispatch();
		if(window.requestAnimationFrame){
			window.requestAnimationFrame(Scheduler.start);
		}else{
			window.setTimeout(Scheduler.start,scheduleTick||50);
		}		
	}

	/**
	 * 添加任务
	 * @param foo - 	待执行任务函数
	 * @param thiser - 	this指向
	 */
	public static addTask(foo:()=>void,thiser?:object){
		if(!Util.isFunction(foo)){
			throw new NError("invoke","Scheduler.addTask","0","function");
		}
		Scheduler.tasks.push({func:foo,thiser:thiser});
	}

	/**
	 * 移除任务
	 * @param foo - 	任务函数
	 */
	public static removeTask(foo){
		if(!Util.isFunction(foo)){
			throw new NError("invoke","Scheduler.removeTask","0","function");
		}
		let ind = -1;
		if((ind = Scheduler.tasks.indexOf(foo)) !== -1){
			Scheduler.tasks.splice(ind,1);
		}	
	}
}
