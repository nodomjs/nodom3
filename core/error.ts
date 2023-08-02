import { NodomMessage } from "./nodom";
import { Util } from "./util";

/**
 * 异常处理类
 */
export  class NError extends Error{
    constructor(errorName:string,params?:string[]){
        super(errorName);
        const msg:string = NodomMessage.ErrorMsgs[errorName];
        if(msg === undefined){
            this.message = "未知错误";
            return;
        }
        //编译提示信息
        this.message = Util.compileStr(msg,params);
    }
}   
