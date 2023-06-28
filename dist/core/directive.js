import { DirectiveManager } from "./directivemanager";
import { Util } from "./util";
import { Expression } from "./expression";
import { NError } from "./error";
import { NodomMessage } from "./nodom";
/**
 * 指令类
 */
export class Directive {
    /**
     * 构造方法
     * @param type  	    类型名
     * @param value 	    指令值
     * @param templateMid   模板所属的module id，即指令用于哪个模板，则该参数指向模板对应的模块id
     */
    constructor(type, value, templateMid) {
        this.id = Util.genId();
        if (type) {
            this.type = DirectiveManager.getType(type);
            if (!this.type) {
                throw new NError('notexist1', NodomMessage.TipWords['directive'], type);
            }
        }
        if (typeof value === 'string') {
            this.value = value.trim();
        }
        else if (value instanceof Expression) {
            this.expression = value;
        }
        else {
            this.value = value;
        }
        this.templateModuleId = templateMid;
    }
    /**
     * 执行指令
     * @param module    模块
     * @param dom       渲染目标节点对象
     * @returns         true/false
     */
    exec(module, dom) {
        //禁用，不执行
        if (this.disabled) {
            return true;
        }
        if (this.expression) {
            this.value = this.expression.val(module, dom.model);
        }
        return this.type.handle.apply(this, [module, dom]);
    }
    /**
     * 克隆
     */
    clone() {
        let d = new Directive();
        d.type = this.type;
        d.expression = this.expression;
        d.value = this.value;
        d.templateModuleId = this.templateModuleId;
        return d;
    }
}
//# sourceMappingURL=directive.js.map