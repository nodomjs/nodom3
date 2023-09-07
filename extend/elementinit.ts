import { DefineElement } from "../core/defineelement";
import { DefineElementManager } from "../core/defineelementmanager";
import { NError } from "../core/error";
import { NodomMessage } from "../core/nodom";
import { VirtualDom } from "../core/virtualdom";
import { Directive } from "../core/directive";
import { Module } from "../core/module";
import { Expression } from "../core/expression";

/**
 * module 元素
 * @remarks
 * module指令标签，用`<module name='class name' /> 代替 x-module='class name'`
 */
class MODULE extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //类名
        const clazz = <string>node.getProp('name');
        if (!clazz) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'],'MODULE', 'className');
        }
        node.delProp('name');
        node.addDirective(new Directive('module',clazz,module.id));
    }
}

/**
 * for 元素
 * @remarks
 * repeat指令标签，用`<for cond={{your expression}} /> 代替 x-repeat={{your expression}}`
 */
class FOR extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        const cond = <Expression>node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'FOR', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('repeat',cond,module.id));
    }
}
/**
 * 递归元素
 * @remarks
 * recur指令标签，用`<recur cond='recur field' /> 代替 x-recur='recur field'`
 */
class RECUR extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        const cond = <Expression>node.getProp('cond');
        node.delProp('cond');
        node.addDirective(new Directive('recur',cond,module.id));
    }
}

/**
 * IF 元素
 * @remarks
 * if指令标签，用`<if cond={{your expression}} /> 代替 x-if={{your expression}}`
 */
class IF extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        const cond = <Expression>node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'IF', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('if',cond,module.id));
    }
}

/**
 * ELSE 元素
 * @remarks
 * else指令标签，用`<else/> 代替 x-else`
 */
class ELSE extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        node.addDirective(new Directive('else',null,module.id));
    }
}

/**
 * ELSEIF 元素
 * @remarks
 * elseif指令标签，用`<elseif cond={{your expression}} /> 代替 x-elseif={{your expression}}`
 */
class ELSEIF extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        const cond = <Expression>node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty',NodomMessage.TipWords['element'], 'ELSEIF', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('elseif',cond,module.id));
    }
}

/**
 * ENDIF 元素
 * @remarks
 * endif指令标签，用`<endif /> 代替 x-endif`
 */
class ENDIF extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        node.addDirective(new Directive('endif',null,module.id));
    }
}

/**
 * SHOW 元素
 * @remarks
 * show指令标签，用`<show cond={{your expression}} /> 代替 x-show={{your expression}}`
 */
class SHOW extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        const cond = <Expression>node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'SHOW', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('show',cond,module.id));
    }
}

/**
 * 插槽
 * @remarks
 * slot指令标签，用`<slot name='slotname' > 代替 x-slot='slotname'`
 */
class SLOT extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        //条件
        const cond = node.getProp('name') || 'default';
        node.delProp('name');
        node.addDirective(new Directive('slot',<string>cond,module.id));
    }
}

/**
 * 路由
 * @remarks
 * route指令标签，用`<route path='routepath' > 代替 x-route='routepath'`
 */
class ROUTE extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        //默认标签为a
        if(!node.hasProp('tag')){
            node.setProp('tag','a');
        }
        super(node,module);
        //条件
        const cond = node.getProp('path');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'ROUTE', 'path');
        }
        node.addDirective(new Directive('route',<string>cond,module.id));
    }
}

/**
 * 路由容器
 * @remarks
 * router指令标签，用`<router /> 代替 x-router`
 */
class ROUTER extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node,module);
        node.addDirective(new Directive('router',null,module.id));
    }
}

//添加到自定义元素管理器
DefineElementManager.add([MODULE,FOR,RECUR,IF,ELSE,ELSEIF,ENDIF,SHOW,SLOT,ROUTE,ROUTER]);