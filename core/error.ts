import { NodomMessage } from "./nodom";

/**
 * 异常处理类
 * @since       1.0.0
 */
export  class NError extends Error{
    constructor(errorName:string,p1?:string,p2?:string,p3?:string,p4?:string){
        super(errorName);
        let msg:string = NodomMessage.ErrorMsgs[errorName];
        if(msg === undefined){
            this.message = "未知错误";
            return;
        }
        //复制请求参数
        let params:Array<string> = [msg];
        for(let i=1;i<arguments.length;i++){
            params.push(arguments[i]);
        }
        this.message = this.compile.apply(null,params);
    }

    /**
     * 编译字符串，把{n}替换成带入值
     * @param src   待编译的字符串
     * @returns     转换后的消息
     */
    private compile(src: string, p1?: any, p2?: any, p3?: any, p4?: any, p5?: any): string {
        let reg: RegExp;
        let args = arguments;
        let index = 0;
        for (; ;) {
            if (src.indexOf('\{' + index + '\}') !== -1) {
                reg = new RegExp('\\{' + index + '\\}', 'g');
                src = src.replace(reg, args[index + 1]);
                index++;
            } else {
                break;
            }
        }
        return src;
    }
}   
