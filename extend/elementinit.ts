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
        node.addDirective(new Directive('module',clazz,module.id));
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
        node.addDirective(new Directive('repeat',cond,module.id));
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
        node.addDirective(new Directive('recur',cond,module.id));
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
        node.addDirective(new Directive('if',cond,module.id));
    }
}

/**
 * ELSE 元素
 */
class ELSE extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        node.addDirective(new Directive('else',null,module.id));
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
        node.addDirective(new Directive('elseif',cond,module.id));
    }
}

/**
 * ENDIF 元素
 */
class ENDIF extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        node.addDirective(new Directive('endif',null,module.id));
    }
}

/**
 * SHOW 元素
 */
class SHOW extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'SHOW', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('show',cond,module.id));
    }
}

/**
 * 插槽
 */
class SLOT extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        //条件
        let cond = node.getProp('name') || 'default';
        node.delProp('name');
        node.addDirective(new Directive('slot',cond,module.id));
    }
}

/**
 * 路由
 */
class ROUTE extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        //默认标签为a
        if(!node.hasProp('tag')){
            node.setProp('tag','a');
        }
        
        super(node);
        //条件
        let cond = node.getProp('path');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'ROUTE', 'path');
        }
        node.addDirective(new Directive('route',cond,module.id));
    }
}

/**
 * 路由容器
 */
class ROUTER extends DefineElement{
    constructor(node: VirtualDom,module:Module){
        super(node);
        node.addDirective(new Directive('router',null,module.id));
    }
}

//添加到自定义元素管理器
DefineElementManager.add([MODULE,FOR,RECUR,IF,ELSE,ELSEIF,ENDIF,SHOW,SLOT,ROUTE,ROUTER]);