import { DefineElement } from "../core/defineelement";
import { DefineElementManager } from "../core/defineelementmanager";
import { NError } from "../core/error";
import { NodomMessage } from "../core/nodom";
import { VirtualDom } from "../core/virtualdom";
import { Directive } from "../core/directive";
import { Module } from "../core/module";

/**
 * module 元素
 */
class MODULE extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        //类名
        let clazz = node.getProp('name');
        if (!clazz) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'MODULE', 'className');
        }
        node.delProp('name');
        node.addDirective(new Directive('module',clazz));
    }
}

/**
 * for 元素
 */
class FOR extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'FOR', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('repeat',cond));
    }
}
/**
 * 递归元素
 */
class RECUR extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        //条件
        let cond = node.getProp('cond');
        node.delProp('cond');
        node.addDirective(new Directive('recur',cond));
    }
}

/**
 * IF 元素
 */
class IF extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'IF', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('if',cond));
    }
}

class ELSE extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        node.addDirective(new Directive('else',null));
    }
}
/**
 * ELSEIF 元素
 */
class ELSEIF extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'ELSEIF', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('elseif',cond));
    }
}
/**
 * ENDIF 元素
 */
class ENDIF extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        node.addDirective(new Directive('endif',null));
    }
}

/**
 * 替代器
 */
class SLOT extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        //条件
        let cond = node.getProp('name') || 'default';
        node.delProp('name');
        node.addDirective(new Directive('slot',cond));
    }
}

DefineElementManager.add([MODULE,FOR,IF,RECUR,ELSE,ELSEIF,ENDIF,SLOT]);