/**
 * 新旧dom树比较后更改的节点
 *
 * @remarks
 * 元素依次为：
 * ```js
 * 0：修改类型，可选值 1: add（添加）, 2: upd（更新）,3: del（删除）, 4: move（移动） ,5: rep（替换）
 * 1：目标节点
 * 2：相对节点（rep时有效）
 * 3：目标节点的父节点
 * 4：目标节点在父节点中的index
 * 5：被移动前位置(move时有效)
 * ```
 */
export declare type ChangedDom = [number, RenderedDom, RenderedDom?, RenderedDom?, number?, number?];

/**
 * 编译器
 *
 * @remarks
 * 用于编译模板串为虚拟dom(VirtualDom)节点，存放于模块的 domManager.vdomTree
 */
export declare class Compiler {
    /**
     * 模块
     */
    private module;
    /**
     * 当前节点
     */
    private current;
    /**
     * 虚拟dom数组
     */
    private domArr;
    /**
     * 文本节点
     */
    private textArr;
    /**
     * 是否是表达式文本节点
     */
    private isExprText;
    /**
     * 当前编译的模板，用于报错的时候定位
     */
    private template;
    /**
     * 根节点
     */
    private root;
    /**
     * 当前处理标签是否在svg区域
     */
    private isSvg;
    /**
     * 构造器
     * @param module - 模块
     */
    constructor(module: Module);
    /**
     * 编译
     * @param elementStr - 	待编译html串
     * @returns             虚拟dom树根节点
     */
    compile(elementStr: string): VirtualDom;
    /**
     * 产生dom key
     * @returns   dom key
     */
    private genKey;
    /**
     * 编译模板
     * @param srcStr - 	源串
     */
    private compileTemplate;
    /**
     * 处理开始标签
     * @param srcStr - 待编译字符串
     * @returns 编译处理后的字符串
     */
    private compileStartTag;
    /**
     * 处理标签属性
     * @param srcStr - 待编译字符串
     * @returns 编译后字符串
     */
    private compileAttributes;
    /**
     * 编译结束标签
     * @param srcStr - 	源串
     * @returns 		剩余的串
     */
    private compileEndTag;
    /**
     * 强制闭合
     * @param index - 在domArr中的索引号
     * @returns
     */
    private forceClose;
    /**
     * 编译text
     * @param srcStr - 	源串
     * @returns
     */
    private compileText;
    /**
     * 预处理html保留字符 如 &nbsp;,&lt;等
     * @param str -   待处理的字符串
     * @returns     解析之后的串
     */
    private preHandleText;
    /**
     * 处理当前节点是模块或者自定义节点
     * @param dom - 	虚拟dom节点
     */
    private postHandleNode;
    /**
     * 处理插槽
     * @param dom - 	虚拟dom节点
     */
    private handleSlot;
    /**
     * 标签闭合
     */
    private handleCloseTag;
    /**
     * 判断节点是否为空节点
     * @param dom -	带检测节点
     * @returns
     */
    private isVoidTab;
}

/**
 * css 管理器
 * @privateRemarks
 * 针对不同的rule，处理方式不同
 *
 * CssStyleRule 进行保存和替换，同时模块作用域scope有效
 *
 * CssImportRule 路径不重复添加，因为必须加在stylerule前面，所以需要记录最后的import索引号
 */
export declare class CssManager {
    /**
     * style sheet
     */
    private static sheet;
    /**
     * import url map，用于存储import的url路径
     */
    private static importMap;
    /**
     * importrule 位置
     */
    private static importIndex;
    /**
     * css class 前置名
     */
    private static cssPreName;
    /**
     * 处理style 元素
     * @param module -  模块
     * @param dom -     虚拟dom
     * @param root -    模块root dom
     * @param add -     是否添加根模块类名
     * @returns         如果是styledom，则返回true，否则返回false
     */
    static handleStyleDom(module: Module, dom: RenderedDom, root: RenderedDom): void;
    /**
     * 处理 style 下的文本元素
     * @param module -  模块
     * @param dom -     style text element
     * @returns         如果是styleTextdom返回true，否则返回false
     */
    static handleStyleTextDom(module: Module, dom: RenderedDom): boolean;
    /**
     * 添加多个css rule
     * @param cssText -     rule集合
     * @param module -      模块
     * @param scopeName -   作用域名(前置选择器)
     */
    private static addRules;
    /**
     * 清除模块css rules
     * @param module -  模块
     */
    static clearModuleRules(module: Module): void;
}

/**
 * 自定义元素
 *
 * @remarks
 * 用于扩充标签，主要用于指令简写，参考 ./extend/elementinit.ts。
 *
 * 如果未指定标签名，默认为`div`，也可以用`tag`属性指定
 *
 * @example
 * ```html
 *   <!-- 渲染后标签名为div -->
 *   <if cond={{any}}>hello</if>
 *   <!-- 渲染后标签名为p -->
 *   <if cond={{any}} tag='p'>hello</if>
 * ```
 */
export declare class DefineElement {
    /**
     * 构造器，在dom编译后执行
     * @param node -    虚拟dom节点
     * @param module -  所属模块
     */
    constructor(node: VirtualDom, module: Module);
}

/**
 * 自定义element 类
 */
export declare type DefineElementClass = (dom: VirtualDom, module: Module) => DefineElement;

/**
 * 自定义元素管理器
 *
 * @remarks
 * 所有自定义元素需要添加到管理器才能使用
 */
export declare class DefineElementManager {
    /**
     * 自定义元素集合
     */
    private static elements;
    /**
     * 添加自定义元素
     * @param clazz -   自定义元素类或类数组
     */
    static add(clazz: unknown[] | unknown): void;
    /**
     * 获取自定义元素类
     * @param tagName - 元素名
     * @returns         自定义元素类
     */
    static get(tagName: string): DefineElementClass;
    /**
     * 是否存在自定义元素
     * @param tagName - 元素名
     * @returns         存在或不存在
     */
    static has(tagName: string): boolean;
}

/**
 * dom比较器
 */
export declare class DiffTool {
    /**
     * 比较节点
     *
     * @param src -         待比较节点（新树节点）
     * @param dst - 	    被比较节点 (旧树节点)
     * @param changeArr -   增删改的节点数组
     * @returns	            改变的节点数组
     */
    static compare(src: RenderedDom, dst: RenderedDom): ChangedDom[];
}

/**
 * 指令类
 */
export declare class Directive {
    /**
     * 指令id
     */
    id: number;
    /**
     * 指令类型
     */
    type: DirectiveType;
    /**
     * 指令值
     */
    value: unknown;
    /**
     * 表达式
     */
    expression: Expression;
    /**
     * 禁用指令
     */
    disabled: boolean;
    /**
     * 模板所属模块id
     * @remarks
     * 使用该指令的模板对应的module id
     *
     * 下例中，`if`指令对应的templateModule 是`Main`模块，即`templateModuleId`是模块`Main`的id。
     * @example
     * ```js
     *  class Main extends Module{
     *      template(props){
     *          return `
     *              <div>
     *                  <Module1>
     *                      <div x-if={{r}}>yes</div>
     *                  </Module1>
     *              </div>
     *          `
     *      }
     *  }
     * ```
     */
    templateModuleId: number;
    /**
     * 构造方法
     * @param type -  	    类型名
     * @param value - 	    指令值
     * @param templateMid - 模板所属的module id
     */
    constructor(type?: string, value?: string | Expression, templateMid?: number);
    /**
     * 执行指令
     * @param module -  模块
     * @param dom -     渲染目标节点对象
     * @returns         是否继续渲染
     */
    exec(module: Module, dom: RenderedDom): boolean;
    /**
     * 克隆
     * @returns     新克隆的指令
     */
    clone(): Directive;
}

/**
 * 指令管理器
 */
export declare class DirectiveManager {
    /**
     * 指令映射
     */
    private static directiveTypes;
    /**
     * 增加指令映射
     * @param name -    指令类型名
     * @param handle -  渲染处理函数
     * @param prio -    类型优先级
     */
    static addType(name: string, handler: DirectiveMethod, prio?: number): void;
    /**
     * 移除指令映射
     * @param name -    指令类型名
     */
    static removeType(name: string): void;
    /**
     * 获取指令
     * @param name -    指令类型名
     * @returns         指令类型或undefined
     */
    static getType(name: string): DirectiveType;
    /**
     * 是否含有某个指令
     * @param name -    指令类型名
     * @returns         true/false
     */
    static hasType(name: string): boolean;
}

/**
 * 指令方法
 */
export declare type DirectiveMethod = (module: Module, dom: RenderedDom) => boolean;

/**
 * 指令类型
 */
export declare class DirectiveType {
    /**
     * 指令类型名
     */
    name: string;
    /**
     * 优先级，越小优先级越高
     */
    prio: number;
    /**
     * 渲染时执行函数
     */
    handler: DirectiveMethod;
    /**
     * 构造方法
     * @param name -    指令类型名
     * @param handle -  渲染时执行方法
     * @param prio -    类型优先级
     */
    constructor(name: string, handler: DirectiveMethod, prio?: number);
}

/**
 * dom管理器
 * @remarks
 * 用于管理module的虚拟dom树，渲染树，html节点
 */
declare class DomManager {
    /**
     * 所属模块
     */
    private module;
    /**
     * 编译后的虚拟dom树
     */
    vdomTree: VirtualDom;
    /**
     * 渲染后的dom树
     */
    renderedTree: RenderedDom;
    /**
     * html节点map
     * @remarks
     * 用于存放dom key对应的html节点
     */
    private elementMap;
    /**
     * 构造方法
     * @param module -  所属模块
     */
    constructor(module: Module);
    /**
     * 从virtual dom 树获取虚拟dom节点
     * @param key - dom key 或 props键值对
     * @returns     编译后虚拟节点
     */
    getVirtualDom(key: string | number | object): VirtualDom;
    /**
     * 从渲染树获取key对应的渲染节点
     * @param key - dom key 或 props键值对
     * @returns     渲染后虚拟节点
     */
    getRenderedDom(key: object | string | number): RenderedDom;
    /**
     * 清除html element map 节点
     * @param dom -   dom节点，如果为空，则清空map
     */
    clearElementMap(dom?: RenderedDom): void;
    /**
     * 获取html节点
     * @remarks
     * 当key为数字或字符串时，表示dom key，当key为对象时，表示根据dom属性进行查找
     *
     * @param key - dom key 或 props键值对
     * @returns     html节点
     */
    getElement(key: number | string | object): Node;
    /**
     * 保存html节点
     * @param key -   dom key
     * @param node -  html node
     */
    saveElement(dom: RenderedDom, node: Node): void;
    /**
     * 释放节点
     * @remarks
     * 释放操作包括：如果被释放节点包含子模块，则子模块需要unmount；释放对应节点资源
     * @param dom - 虚拟dom
     */
    freeNode(dom: RenderedDom): void;
    /**
     * 重置节点相关信息
     */
    reset(): void;
}

/**
 * 模块状态类型
 */
export declare enum EModuleState {
    /**
     * 已初始化
     */
    INIT = 1,
    /**
     * 未挂载到html dom
     */
    UNMOUNTED = 2,
    /**
     * 已挂载到dom树
     */
    MOUNTED = 3,
    /**
     * 准备渲染
     */
    READY = 4
}

/**
 * 事件工厂
 *
 * @remarks
 * 每个模块一个事件工厂，用于管理模块内虚拟dom对应的事件对象
 */
export declare class EventFactory {
    /**
     * 所属模块
     */
    private module;
    /**
     * 事件map
     * key:虚拟domkey，
     * value: object
     * ```js
     * {
     *      bindMap:{},
     *      eventName1:{
     *          own:[event对象,...],
     *          delg:[{key:被代理key,event:event对象,...],
     *          toDelg:[event对象],
     *          capture:useCapture
     *      },
     *      eventName2:,
     *      eventNamen:
     * }
     * ```
     * 其中：
     *    eventName:事件名，如click等
     *    配置项说明:
     *      bindMap:已绑定事件map，其中键为事件名，值为capture，解绑时需要
     *      own:自己的事件数组
     *      delg:代理事件数组（代理子对象）
     *      capture:在own和delg都存在时，如果capture为true，则先执行own，再执行delg，为false时则相反。如果只有own，则和html event的cature事件处理机制相同。
     */
    private eventMap;
    /**
     * domkey对应event对象数组
     * key: dom key
     * value: NEvent数组
     */
    private addedEvents;
    /**
     * 构造器
     * @param module - 模块
     */
    constructor(module: Module);
    /**
     * 保存事件
     * @param key -     dom key
     * @param event -   事件对象
     */
    addEvent(dom: RenderedDom, event: NEvent): void;
    /**
     * 添加到dom的own或delg事件队列
     * @param key -       dom key
     * @param event -     事件对象
     * @param key1 -      被代理dom key，仅对代理事件有效
     */
    private addToArr;
    /**
     * 获取事件对象
     * @param key -   dom key
     * @returns     事件对象
     */
    getEvent(key: number): object;
    /**
     * 移除所有事件
     * @param dom -
     */
    removeAllEvents(dom: RenderedDom): void;
    /**
     * 删除事件
     * @param event -     事件对象
     * @param key -       对应dom keys
     */
    removeEvent(dom: RenderedDom, event: NEvent): void;
    /**
     * 绑定key对应节点所有事件
     * @remarks
     * 执行addEventListener操作
     * @param key -   dom key
     */
    bind(key: string | number): void;
    /**
     * 解绑key对应节点的指定事件
     * @remarks
     * 执行removeEventListener操作
     * @param key -         dom key
     * @param eventName -   事件名
     */
    unbind(key: number, eventName: string): void;
    /**
     * 解绑key对应节点所有事件
     * @param key - dom key
     */
    unbindAll(key: number | string): void;
    /**
     * 是否拥有key对应的事件对象
     * @param key - dom key
     * @returns     如果key对应事件存在，返回true，否则返回false
     */
    private hasEvent;
    /**
     * 清除工厂所有事件
     */
    clear(): void;
    /**
     * 事件处理函数
     * @param module - 模块
     * @param e - HTML Event
     */
    private handler;
}

/**
 * 事件方法
 */
export declare type EventMethod = (model: any, dom: any, evobj: any, event: any) => void;

/**
 * 表达式类
 * @remarks
 * 表达式中的特殊符号
 *
 *  this:指向渲染的module
 *
 *  $model:指向当前dom的model
 */
export declare class Expression {
    /**
     * 表达式id
     */
    id: number;
    /**
     * 执行函数
     */
    execFunc: ExpressionMethod;
    /**
     * 源表达式串
     */
    exprStr: string;
    /**
     * @param exprStr -	表达式串
     */
    constructor(exprStr: string);
    /**
     * 编译表达式串，替换字段和方法
     * @param exprStr -   表达式串
     * @returns         编译后的表达式串
     */
    private compile;
    /**
     * 表达式计算
     * @param module -  模块
     * @param model - 	模型
     * @returns 		计算结果
     */
    val(module: Module, model: Model): unknown;
}

/**
 * 表达式方法
 */
export declare type ExpressionMethod = (model: Model) => unknown;

/**
 * 全局缓存
 *
 * @remarks
 * 用于所有模块共享数据，实现模块通信
 */
export declare class GlobalCache {
    /**
     * NCache实例，用于存放缓存对象
     */
    private static cache;
    /**
     * 保存到cache
     * @param key -     键，支持"."（多级数据分割）
     * @param value -   值
     */
    static set(key: string, value: unknown): void;
    /**
     * 从cache读取
     * @param key - 键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    static get(key: any): unknown;
    /**
     * 订阅
     *
     * @remarks
     * 如果订阅的数据发生改变，则会触发handler
     *
     * @param module -    订阅的模块
     * @param key -       订阅的属性名
     * @param handler -   回调函数或方法名（方法属于module），方法传递参数为订阅属性名对应的值
     */
    static subscribe(module: Module, key: string, handler: string | ((value: any) => void)): void;
    /**
     * 从cache移除
     * @param key -   键，支持"."（多级数据分割）
     */
    static remove(key: any): void;
}

/**
 * 模型类
 *
 * @remarks
 * 模型就是对数据做代理
 *
 * 注意：数据对象中，以下5个属性名（保留字）不能用，可以通过如：`model.__source`的方式获取保留属性
 *
 *      __source:源数据对象
 *
 *      __key:模型的key
 *
 *      __module:所属模块
 *
 *      __parent:父模型
 *
 *      __name:在父模型中的属性名
 *
 */
export declare class Model {
    /**
     * @param data -    数据
     * @param module - 	模块对象
     * @param parent -  父模型
     * @param name -    模型在父对象中的prop name
     * @returns         模型
     */
    constructor(data: object, module: Module, parent?: Model, name?: string);
}

/**
 * 模型工厂
 * @remarks
 * 管理模块的model
 */
export declare class ModelManager {
    /**
     * 所属模块
     */
    module: Module;
    /**
     * model与module绑定map
     * @remarks
     * slot引用外部数据或模块传值时有效会导致model被不同模块引用，`bindMap`用来存放对应的模块数组
     *
     * key:    model
     *
     * value:  model绑定的module id 数组
     */
    bindMap: WeakMap<object, number[]>;
    /**
     * 数据map
     * ```js
     * {
     *      data1:{
     *          model:model,
     *          key:key
     *      },
     *      data2:,
     *      datan
     * }
     * ```
     * 其中：
     *   datan: 初始数据对象
     *   model: model对象
     *   key:   model key
     */
    private dataMap;
    /**
     * 存储模型对应属性名，如果为父传子，则需要保存属于该模型的属性名
     * key: model
     * value: model名字
     */
    private nameMap;
    /**
     * model对应监听器map
     * key:model
     * value:object
     * ```js
     * {
     *      key1:{
     *          f:foo1,
     *          deep:true/false
     *      },
     *      key2:,
     *      kn:
     * }
     * ```
     *        其中：prop为被监听属性，foo为监听器方法，deep为是否深度监听
     */
    private watchMap;
    /**
     * 是否存在深度watcher
     */
    private hasDeepWatch;
    /**
     * 构造器
     * @param module -    模块
     */
    constructor(module: Module);
    /**
     * 获取model，不存在则新建
     * @param data -    数据
     * @returns         model
     */
    getModel(data: object): Model;
    /**
     * 获取model key
     * @remarks
     * 每个model都有一个唯一 key
     * @param model -   model对象
     * @returns         model对应key
     */
    getModelKey(data: object): number;
    /**
     * 设置model名
     * @param model - 模型
     * @param name -  名
     */
    setModelName(model: Model, name: string): void;
    /**
     * 获取模型名
     * @param model - 模型
     * @returns     模型名
     */
    getModelName(model: Model): string;
    /**
     * 添加数据到map
     * @param data -      原始数据
     * @param model -     模型
     */
    add(data: any, model: any): void;
    /**
     * 添加绑定
     * @remarks
     * 当一个model被多个module引用时，需要添加绑定，以便修改时触发多个模块渲染。
     * @param model -   模型
     * @param module -  模块
     */
    bindModel(model: Model, module: Module): void;
    /**
     * 更新导致渲染
     * @remarks
     * 如果不设置oldValue和newValue，则直接强制渲染
     *
     * @param model -     model
     * @param key -       属性
     * @param oldValue -  旧值
     * @param newValue -  新值
     */
    update(model: Model, key: string, oldValue?: unknown, newValue?: unknown): void;
    /**
     * 监听数据项
     *
     * @param model -   被监听model
     * @param key -     监听数据项名
     * @param operate - 数据项变化时执行方法
     * @param deep -    是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
     *
     * @returns         unwatch函数，执行此函数，可取消监听
     */
    watch(model: Model, key: string | string[], operate: (m: any, k: any, ov: any, nv: any) => void, deep?: boolean): () => void;
    /**
     * 获取model属性值
     * @param key -     属性名，可以分级，如 name.firstName
     * @param model -   模型
     * @returns         属性值
     */
    get(model: Model, key?: string): unknown;
    /**
     * 设置model属性值
     * @param model -   模型
     * @param key -     属性名，可以分级，如 name.firstName
     * @param value -   属性值
     */
    set(model: Model, key: string, value: unknown): void;
}

/**
 * 模块类
 *
 * @remarks
 * 模块方法说明：模板内使用的方法，包括事件方法，都在模块内定义
 *
 *  方法this：指向module实例
 *
 *  事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *
 *  表达式方法：参数按照表达式方式给定即可，如：
 * ```html
 *  <div>
 *      <div class={{getCls(st)}} e-click='click'>Hello Nodom</div>
 *  </div>
 * ```
 * ```js
 *  //事件方法
 *  click(model,dom,eventObj,e){
 *      //do something
 *  }
 *  //表达式方法
 *  //state 由表达式中给定，state由表达式传递，为当前dom model的一个属性
 *  getCls(state){
 *      //do something
 *  }
 * ```
 *
 * 模块事件，在模块不同阶段执行
 *
 * onInit              初始化后（constructor后，已经有model对象，但是尚未编译，只执行1次）
 *
 * onBeforeFirstRender 首次渲染前（只执行1次）
 *
 * onFirstRender       首次渲染后（只执行1次）
 *
 * onBeforeRender      渲染前
 *
 * onRender            渲染后
 *
 * onCompile           编译后
 *
 * onBeforeMount       挂载到document前
 *
 * onMount             挂载到document后
 *
 * onBeforeUnMount     从document脱离前
 *
 * onUnmount           从document脱离后
 *
 * onBeforeUpdate      更新到document前
 *
 * onUpdate            更新到document后
 */
export declare class Module {
    /**
     * 模块id(全局唯一)
     */
    id: number;
    /**
     * 模型，代理过的data
     */
    model: Model;
    /**
     * 子模块id数组
     */
    children: Array<number>;
    /**
     * 模块状态
     */
    state: EModuleState;
    /**
     * 模型管理器
     */
    modelManager: ModelManager;
    /**
     * 对象管理器，用于管理虚拟dom节点、指令、表达式、事件对象及其运行时参数
     */
    objectManager: ObjectManager;
    /**
     * dom 管理器，管理虚拟dom、渲染dom和html node
     */
    domManager: DomManager;
    /**
     * 事件工厂
     */
    eventFactory: EventFactory;
    /**
     * 源dom，子模块对应dom
     */
    srcDom: RenderedDom;
    /**
     * 源element
     */
    srcElement: Node;
    /**
     * 源节点传递的事件，需要追加到模块根节点上
     */
    events: NEvent[];
    /**
     * 模板对应模块id，作为子模块时有效
     */
    templateModuleId: number;
    /**
     * 父模块通过dom节点传递的属性
     */
    props: object;
    /**
     * 子模块类集合，模板中引用的模块类需要声明
     * 如果类已经通过registModule注册过，这里不再需要定义，只需import即可
     */
    modules: unknown[];
    /**
     * 不渲染的属性（这些属性用于生产模板，不作为属性渲染到模块根节点）
     */
    private excludedProps;
    /**
     * 父模块 id
     */
    private parentId;
    /**
     * 生成dom时的keyid，每次编译置0
     */
    private domKeyId;
    /**
     * 旧模板串
     */
    private oldTemplate;
    /**
     * slot map
     *
     * key: slot name
     *
     * value: {type:0(外部渲染)/1(内部渲染innerrender),dom:渲染节点,vdom:虚拟节点}
     *
     */
    slots: Map<string, {
        type?: number;
        dom?: RenderedDom;
        vdom?: VirtualDom;
    }>;
    /**
     * 构造器
     */
    constructor();
    /**
     * 初始化操作
     */
    init(): void;
    /**
     * 模板串方法，使用时需重载
     * @param props -   props对象，在模板中进行配置，从父模块传入
     * @returns         模板串
     * @virtual
     */
    template(props?: object): string;
    /**
     * 数据方法，使用时需重载
     * @returns  数据对象
     */
    data(): object;
    /**
     * 模型渲染
     * @remarks
     * 渲染流程：
     *
     * 1. 获取首次渲染标志
     *
     * 2. 执行template方法获得模板串
     *
     * 3. 与旧模板串比较，如果不同，则进行编译
     *
     * 4. 判断是否存在虚拟dom树（编译时可能导致模板串为空），没有则结束
     *
     * 5. 如果为首次渲染，执行onBeforeFirstRender事件
     *
     * 6. 执行onBeforeRender事件
     *
     * 7. 保留旧渲染树，进行新渲染
     *
     * 8. 执行onRender事件
     *
     * 9. 如果为首次渲染，执行onFirstRender事件
     *
     * 10. 渲染树为空，从document解除挂载
     *
     * 11. 如果未挂载，执行12，否则执行13
     *
     * 12. 执行挂载，结束
     *
     * 13. 新旧渲染树比较，比较结果为空，结束，否则执行14
     *
     * 14. 执行onBeforeUpdate事件
     *
     * 15. 更新到document
     *
     * 16. 执行onUpdate事件，结束
     */
    render(): boolean;
    /**
     * 添加子模块
     * @param module -    模块id或模块
     */
    addChild(module: number | Module): void;
    /**
     * 移除子模块
     * @param module -    子模块
     */
    removeChild(module: Module): void;
    /**
     * 激活模块(准备渲染)
     */
    active(): void;
    /**
     * 挂载到document
     */
    mount(): void;
    /**
     * 从document移除
     */
    unmount(): void;
    /**
     * 获取父模块
     * @returns     父模块
     */
    getParent(): Module;
    /**
     * 执行模块事件
     * @param eventName -   事件名
     * @returns             执行结果
     */
    doModuleEvent(eventName: string): boolean;
    /**
     * 获取模块方法
     * @param name -    方法名
     * @returns         方法
     */
    getMethod(name: string): UnknownMethod;
    /**
     * 设置props
     * @param props -   属性值
     * @param dom -     子模块对应渲染后节点
     */
    setProps(props: object, dom: RenderedDom): void;
    /**
     * 编译
     */
    compile(): void;
    /**
     * 设置不渲染到根dom的属性集合
     * @param props -   待移除的属性名属组
     */
    setExcludeProps(props: string[]): void;
    /**
     * 处理根节点属性
     * @param src -     编译节点
     * @param dst -     dom节点
     */
    handleRootProps(src: any, dst: any): void;
    /**
     * 获取html节点
     * @remarks
     * 当key为数字或字符串时，表示dom key，当key为对象时，表示根据dom属性进行查找
     *
     * @param key - dom key 或 props键值对
     * @returns     html节点
     */
    getElement(key: object | string | number): Node;
    /**
     * 保存html节点
     * @param key -   dom key
     * @param node -  html节点
     */
    saveElement(dom: RenderedDom, node: Node): void;
    /**
     * 按模块类名获取子模块
     * @remarks
     * 找到第一个满足条件的子模块，如果deep=true，则深度优先
     *
     * 如果attrs不为空，则同时需要匹配子模块属性
     *
     * @example
     * ```html
     *  <div>
     *      <Module1 />
     *      //other code
     *      <Module1 v1='a' v2='b' />
     *  </div>
     * ```
     * ```js
     *  const m = getModule('Module1',true, {v1:'a'});
     *  //m 为模板中的第二个Module1
     * ```
     * @param name -    子模块类名或别名
     * @param deep -    是否深度获取
     * @param attrs -   属性集合
     *
     * @returns         符合条件的子模块或undefined
     */
    getModule(name: string, deep?: boolean, attrs?: object): Module;
    /**
     * 获取模块类名对应的所有子模块
     * @param className -   子模块类名
     * @param deep -        深度查询
     */
    getModules(className: string, deep?: boolean): Module[];
    /**
     * 监听model
     * @remarks
     * 参数个数可变，如果第一个参数为属性名，则第二个参数为钩子函数，第三个参数为deep，默认model为根模型
     *
     * 否则按照参数说明
     * @param model -     模型或属性
     * @param key -       属性/属性数组，支持多级属性
     * @param operate -   钩子函数
     * @param deep -      是否深度监听
     * @returns           回收监听器函数，执行后取消监听
     */
    watch(model: Model | string | string[], key: string | string[] | ((m: any, k: any, ov: any, nv: any) => void), operate?: boolean | ((m: any, k: any, ov: any, nv: any) => void), deep?: boolean): () => void;
    /**
     * 设置模型属性值
     * @remarks
     * 参数个数可变，如果第一个参数为属性名，则第二个参数为属性值，默认model为根模型，否则按照参数说明
     *
     * @param model -     模型
     * @param key -       子属性，可以分级，如 name.firstName
     * @param value -     属性值
     */
    set(model: Model | string, key: unknown, value?: unknown): void;
    /**
     * 获取模型属性值
     * @remarks
     * 参数个数可变，如果第一个参数为属性名，默认model为根模型，否则按照参数说明
     *
     * @param model -   模型
     * @param key -     属性名，可以分级，如 name.firstName，如果为null，则返回自己
     * @returns         属性值
     */
    get(model: Model | string, key?: string): unknown;
    /**
     * 调用模块内方法
     * @remarks
     * 参数个数可变，参数个数最多10个
     *
     * @param methodName -  方法名
     * @param args -        参数
     */
    invokeMethod(methodName: string, ...args: any[]): any;
    /**
     * 调用模块外方法
     * @remarks
     * 当该模块作为子模块使用时，调用方法属于使用此模块的模板对应的模块
     *
     * 对于下面的例子，模块`Module1`需要调用模块`Main`的`outerFoo方法`，则采用`invokeOuterMethod`进行调用。
     * @example
     * ```js
     *  //Module1
     *  class Module1 extends Module{
     *      //your code
     *  }
     *
     *  //Main
     *  class Main extends Module{
     *      modules=[Module1];
     *      template(){
     *          return `
     *              <div>
     *                  <Module1 />
     *              </div>
     *          `
     *      }
     *      outerFoo(){
     *
     *      }
     *  }
     *
     * ```
     * @param methodName -  方法名
     * @param args -        参数
     * @returns             方法返回值
     */
    invokeOuterMethod(methodName: string, ...args: any[]): unknown;
    /**
     * 获取模块当前dom key编号
     * @remarks
     * 主要在手动增加节点时需要，避免key重复
     * @returns   key编号
     */
    getDomKeyId(): number;
}

/**
 * 模块工厂
 * @remarks
 * 管理所有模块类、模块实例
 */
export declare class ModuleFactory {
    /**
     * 模块对象集合
     * @remarks
     * 格式为map，其中：
     *
     * key: 模块id
     *
     * value: 模块对象
     */
    private static modules;
    /**
     * 模块类集合
     * @remarks
     * 格式为map，其中：
     *
     *  key:    模块类名或别名
     *
     *  value:  模块类
     */
    static classes: Map<string, UnknownClass>;
    /**
     * 别名map
     * @remarks
     * 格式为map，其中：
     *
     * key:     别名
     *
     * value:   类名
     */
    static aliasMap: Map<string, string>;
    /**
     * 主模块
     */
    private static mainModule;
    /**
     * 添加模块实例到工厂
     * @param item -  模块对象
     */
    static add(item: Module): void;
    /**
     * 获得模块
     * @remarks
     * 当name为id时，则获取对应id的模块
     *
     * 当name为字符串时，表示模块类名
     *
     * 当name为class时，表示模块类
     *
     * @param name -  类或实例id
     */
    static get(name: number | string | UnknownClass): Module;
    /**
     * 是否存在模块类
     * @param clazzName -   模块类名
     * @returns     true/false
     */
    static hasClass(clazzName: string): boolean;
    /**
     * 添加模块类
     * @param clazz -   模块类
     * @param alias -   别名
     */
    static addClass(clazz: unknown, alias?: string): void;
    /**
     * 获取模块类
     * @param name -    类名或别名
     * @returns         模块类
     */
    static getClass(name: string): UnknownClass;
    /**
     * 加载模块
     * @remarks
     * 用于实现模块懒加载
     * @param modulePath -   模块类路径
     * @returns              模块类
     */
    static load(modulePath: string): Promise<UnknownClass>;
    /**
     * 从工厂移除模块
     * @param id -    模块id
     */
    static remove(id: number): void;
    /**
     * 设置应用主模块
     * @param m - 	模块
     */
    static setMain(m: Module): void;
    /**
     * 获取应用主模块
     * @returns 	应用的主模块
     */
    static getMain(): Module;
}

/**
 * 缓存模块
 */
export declare class NCache {
    /**
     * 缓存数据容器
     */
    private cacheData;
    /**
     * 订阅map，格式为
     * ```js
     * {
     *  key:[{
     *      module:订阅模块,
     *      handler:回调钩子
     * },...]}
     * ```
     */
    private subscribeMap;
    /**
     * 通过提供的键名从内存中拿到对应的值
     * @param key - 键，支持"."（多级数据分割）
     * @returns     值或undefined
     */
    get(key: string): any;
    /**
     * 通过提供的键名和值将其存储在内存中
     * @param key -     键
     * @param value -   值
     */
    set(key: string, value: unknown): void;
    /**
     * 通过提供的键名将其移除
     * @param key -   键
     */
    remove(key: string): void;
    /**
     * 订阅
     * @param module -    订阅的模块
     * @param key -       订阅的属性名
     * @param handler -   回调函数或方法名（方法属于module），方法传递参数为订阅属性名对应的值
     */
    subscribe(module: Module, key: string, handler: string | ((value: any) => void)): void;
    /**
     * 调用订阅方法
     * @param module -  模块
     * @param foo -     方法或方法名
     * @param v -       值
     */
    private invokeSubscribe;
}

/**
 * 异常处理类
 */
export declare class NError extends Error {
    constructor(errorName: string, ...params: any[]);
}

/**
 * 事件类
 * @remarks
 * 事件分为自有事件和代理事件，事件默认传递参数为：
 *
 * 0: model(事件对应数据模型)
 *
 * 1: dom(事件target对应的虚拟dom节点)
 *
 * 2: evObj(Nodom Event对象)
 *
 * 3: e(Html Event对象)
 */
export declare class NEvent {
    /**
     * 事件id
     */
    id: number;
    /**
     * 事件所属模块
     */
    module: Module;
    /**
     * 事件名
     */
    name: string;
    /**
     * 事件处理方法
     * @remarks
     * 事件钩子对应的方法函数、方法名或表达式，如果为方法名，需要在模块中定义
     */
    handler: string | EventMethod;
    /**
     * 表达式，当定义的事件串为表达式时有效
     */
    private expr;
    /**
     * 代理模式，事件代理到父对象
     */
    delg: boolean;
    /**
     * 禁止冒泡，代理模式下无效
     */
    nopopo: boolean;
    /**
     * 只执行一次
     */
    once: boolean;
    /**
     * 使用capture，代理模式下无效
     */
    capture: boolean;
    /**
     * 依赖事件
     * @remarks
     * 当事件为扩展事件时，用于存储原始事件
     */
    dependEvent: NEvent;
    /**
     * @param eventName -   事件名
     * @param eventStr -    事件串或事件处理函数,以“:”分割,中间不能有空格,结构为: `方法名:delg:nopopo:once:capture`，`":"`后面的内容选择使用，如果eventStr为函数，则替代第三个参数
     * @param handler -     事件执行函数，如果方法不在module methods中定义，则通过此参数设置事件钩子，此时，eventStr第一个参数失效，即eventStr可以是":delg:nopopo"
     */
    constructor(module: Module, eventName: string, eventStr?: string | Expression | EventMethod, handler?: EventMethod);
    /**
     * 事件串初始化
     * @param eventStr -  事件串
     * @param handler -   事件钩子函数
     */
    private init;
    /**
     * 表达式处理
     * @remarks
     * 用于动态事件名传递，当handler为expression时有效
     * @param module -    模块
     * @param model -     对应model
     */
    handleExpr(module: any, model: any): this;
    /**
     * 解析事件字符串
     * @param eventStr -  待解析的字符串
     */
    private parseEvent;
    /**
     * 触屏转换
     */
    private touchOrNot;
    /**
     * 设置附加参数值
     * @param module -    模块
     * @param dom -       虚拟dom
     * @param name -      参数名
     * @param value -     参数值
     */
    setParam(dom: RenderedDom, name: string, value: unknown): void;
    /**
     * 获取附加参数值
     * @param dom -       虚拟dom
     * @param name -      参数名
     * @returns         附加参数值
     */
    getParam(dom: RenderedDom, name: string): unknown;
    /**
     * 移除参数
     * @param dom -       虚拟dom
     * @param name -      参数名
     */
    removeParam(dom: RenderedDom, name: string): void;
    /**
     * 清参数cache
     * @param dom -       虚拟dom
     */
    clearParam(dom: RenderedDom): void;
}

/**
 * Nodom接口暴露类
 */
export declare class Nodom {
    /**
     * 是否为debug模式，开启后，表达式编译异常会输出到控制台
     */
    static isDebug: boolean;
    /**
     * 应用初始化
     * @param clazz -     模块类
     * @param selector -  根模块容器选择器，默认使用document.body
     */
    static app(clazz: unknown, selector?: string): void;
    /**
     * 启用debug模式
     */
    static debug(): void;
    /**
     * 设置语言
     * @param lang -  语言（zh,en），默认zh
     */
    static setLang(lang: string): void;
    /**
     * use插件（实例化）
     * @remarks
     * 插件实例化后以单例方式存在，第二次use同一个插件，将不进行任何操作，实例化后可通过Nodom['$类名']方式获取
     * @param clazz -   插件类
     * @param params -  参数
     * @returns         实例化后的插件对象
     */
    static use(clazz: unknown, params?: unknown[]): unknown;
    /**
     * 创建路由
     * @remarks
     * 配置项可以用嵌套方式
     * @example
     * ```js
     * Nodom.createRoute([{
     *   path: '/router',
     *   //直接用模块类，需import
     *   module: MdlRouteDir,
     *   routes: [
     *       {
     *           path: '/route1',
     *           module: MdlPMod1,
     *           routes: [{
     *               path: '/home',
     *               //直接用路径，实现懒加载
     *               module:'/examples/modules/route/mdlmod1.js'
     *           }, ...]
     *       }, {
     *           path: '/route2',
     *           module: MdlPMod2,
     *           //设置进入事件
     *           onEnter: function (module,path) {},
     *           //设置离开事件
     *           onLeave: function (module,path) {},
     *           ...
     *       }
     *   ]
     * }])
     * ```
     * @param config -  路由配置
     * @param parent -  父路由
     */
    static createRoute(config: RouteCfg | Array<RouteCfg>, parent?: Route): Route;
    /**
     * 创建指令
     * @param name -      指令名
     * @param priority -  优先级（1最小，1-10为框架保留优先级）
     * @param handler -   渲染时方法
     */
    static createDirective(name: string, handler: DirectiveMethod, priority?: number): void;
    /**
     * 注册模块
     * @param clazz -   模块类
     * @param name -    注册名，如果没有，则为类名
     */
    static registModule(clazz: unknown, name?: string): void;
    /**
     * ajax 请求，如果需要用第三方ajax插件替代，重载该方法
     * @param config -  object 或 string，如果为string，则表示url，直接以get方式获取资源，如果为 object，配置项如下:
     * ```
     *  参数名|类型|默认值|必填|可选值|描述
     *  -|-|-|-|-|-
     *  url|string|无|是|无|请求url
     *	method|string|GET|否|GET,POST,HEAD|请求类型
     *	params|object/FormData|空object|否|无|参数，json格式
     *	async|bool|true|否|true,false|是否异步
     *  timeout|number|0|否|无|请求超时时间
     *  type|string|text|否|json,text|
     *	withCredentials|bool|false|否|true,false|同源策略，跨域时cookie保存
     *  header|Object|无|否|无|request header 对象
     *  user|string|无|否|无|需要认证的请求对应的用户名
     *  pwd|string|无|否|无|需要认证的请求对应的密码
     *  rand|bool|无|否|无|请求随机数，设置则浏览器缓存失效
     * ```
     */
    static request(config: any): Promise<unknown>;
    /**
     * 重复请求拒绝时间间隔
     * @remarks
     * 如果设置此项，当url一致时且间隔时间小于time，则拒绝请求
     * @param time -  时间间隔（ms）
     */
    static setRejectTime(time: number): void;
}

/**
 * nodom提示消息
 */
export declare let NodomMessage: {
    TipWords: {
        application: string;
        system: string;
        module: string;
        clazz: string;
        moduleClass: string;
        model: string;
        directive: string;
        directiveType: string;
        expression: string;
        event: string;
        method: string;
        filter: string;
        filterType: string;
        data: string;
        dataItem: string;
        route: string;
        routeView: string;
        /**
         * nodom提示消息
         */
        plugin: string;
        resource: string;
        root: string;
        /**
         * Nodom接口暴露类
         */
        element: string;
    };
    ErrorMsgs: {
        unknown: string;
        uninit: string;
        paramException: string;
        invoke: string;
        invoke1: string;
        invoke2: string;
        invoke3: string;
        exist: string;
        exist1: string;
        notexist: string;
        notexist1: string;
        notupd: string;
        notremove: string;
        notremove1: string;
        namedinvalid: string;
        initial: string;
        jsonparse: string;
        timeout: string;
        config: string;
        config1: string;
        itemnotempty: string;
        itemincorrect: string;
        needEndTag: string;
        needStartTag: string;
        tagError: string;
        wrongTemplate: string;
        wrongExpression: string;
    };
    WeekDays: string[];
};

export declare const NodomMessage_en: {
    /**
     * tip words
     */
    TipWords: {
        application: string;
        system: string;
        module: string;
        clazz: string;
        moduleClass: string;
        model: string;
        directive: string;
        directiveType: string;
        expression: string;
        event: string;
        method: string;
        filter: string;
        filterType: string;
        data: string;
        dataItem: string;
        route: string;
        routeView: string;
        plugin: string;
        resource: string;
        root: string;
        element: string;
    };
    /**
     * error info
     */
    ErrorMsgs: {
        unknown: string;
        uninit: string;
        paramException: string;
        invoke: string;
        invoke1: string;
        invoke2: string;
        invoke3: string;
        exist: string;
        exist1: string;
        notexist: string;
        notexist1: string;
        notupd: string;
        notremove: string;
        notremove1: string;
        namedinvalid: string;
        initial: string;
        jsonparse: string;
        timeout: string;
        config: string;
        config1: string;
        itemnotempty: string;
        itemincorrect: string;
        needEndTag: string;
        needStartTag: string;
        tagError: string;
        wrongTemplate: string;
        wrongExpression: string;
    };
    WeekDays: string[];
};

export declare const NodomMessage_zh: {
    /**
     * 提示单词
     */
    TipWords: {
        application: string;
        system: string;
        module: string;
        clazz: string;
        moduleClass: string;
        model: string;
        directive: string;
        directiveType: string;
        expression: string;
        event: string;
        method: string;
        filter: string;
        filterType: string;
        data: string;
        dataItem: string;
        route: string;
        routeView: string;
        plugin: string;
        resource: string;
        root: string;
        element: string;
    };
    /**
     * 异常信息
     */
    ErrorMsgs: {
        unknown: string;
        uninit: string;
        paramException: string;
        invoke: string;
        invoke1: string;
        invoke2: string;
        invoke3: string;
        exist: string;
        exist1: string;
        notexist: string;
        notexist1: string;
        notupd: string;
        notremove: string;
        notremove1: string;
        namedinvalid: string;
        initial: string;
        jsonparse: string;
        timeout: string;
        config: string;
        config1: string;
        itemnotempty: string;
        itemincorrect: string;
        needEndTag: string;
        needStartTag: string;
        tagError: string;
        wrongTemplate: string;
        wrongExpression: string;
    };
    WeekDays: string[];
};

/**
 * 对象管理器
 * @remarks
 * 用于存储模块的内存变量，`$`开始的数据项可能被nodom占用，使用时禁止使用。
 *
 * 默认属性集
 *
 *  $events     事件集
 *
 *  $domparam   dom参数
 */
declare class ObjectManager {
    /**
     * NCache对象
     */
    cache: NCache;
    /**
     * 所属模块
     */
    module: Module;
    /**
     * module   模块
     * @param module - 模块
     */
    constructor(module: Module);
    /**
     * 保存到cache
     * @param key -     键，支持"."（多级数据分割）
     * @param value -   值
     */
    set(key: string, value: unknown): void;
    /**
     * 从cache读取
     * @param key - 键，支持多级数据，如"x.y.z"
     * @returns     缓存的值或undefined
     */
    get(key: string): any;
    /**
     * 从cache移除
     * @param key -   键，支持"."（多级数据分割）
     */
    remove(key: string): void;
    /**
     * 设置事件参数
     * @param id -      事件id
     * @param key -     dom key
     * @param name -    参数名
     * @param value -   参数值
     */
    setEventParam(id: number, key: number | string, name: string, value: unknown): void;
    /**
     * 获取事件参数值
     * @param id -      事件id
     * @param key -     dom key
     * @param name -    参数名
     * @returns         参数值
     */
    getEventParam(id: number, key: number | string, name: string): any;
    /**
     * 移除事件参数
     * @param id -      事件id
     * @param key -     dom key
     * @param name -    参数名
     */
    removeEventParam(id: number, key: number | string, name: string): void;
    /**
     * 清空事件参数
     * @param id -      事件id
     * @param key -     dom key
     */
    clearEventParams(id: number, key?: number | string): void;
    /**
     * 设置dom参数值
     * @param key -     dom key
     * @param name -    参数名
     * @param value -   参数值
     */
    setDomParam(key: number | string, name: string, value: unknown): void;
    /**
     * 获取dom参数值
     * @param key -     dom key
     * @param name -    参数名
     * @returns         参数值
     */
    getDomParam(key: number | string, name: string): unknown;
    /**
     * 移除dom参数值
     * @param key -     dom key
     * @param name -    参数名
     */
    removeDomParam(key: number | string, name: string): void;
    /**
     * 清除element 参数集
     * @param key -     dom key
     */
    clearDomParams(key: number | string): void;
    /**
     * 清除缓存dom对象集
     */
    clearAllDomParams(): void;
}

/**
 * 渲染后的节点接口
 */
export declare type RenderedDom = {
    /**
     * 元素名，如div
     */
    tagName?: string;
    /**
     * key:节点key，整棵渲染树唯一
     */
    key: string | number;
    /**
     * 绑定模型
     */
    model?: Model;
    /**
     * 直接属性 不是来自于attribute，而是直接作用于html element，如el.checked,el.value等
     */
    assets?: object;
    /**
     * 静态属性(attribute)集合
     */
    props?: object;
    /**
     * 事件集合
     */
    events?: NEvent[];
    /**
     * element为textnode时有效
     */
    textContent?: string;
    /**
     * 子节点数组
     */
    children?: Array<RenderedDom>;
    /**
     * 父虚拟dom
     */
    parent?: RenderedDom;
    /**
     * staticNum 静态标识数
     *  0 表示静态，不进行比较
     *  1 每次比较后-1
     *  -1 每次渲染
     */
    staticNum?: number;
    /**
     * 子模块id，模块容器时有效
     */
    moduleId?: number;
    /**
     * 源虚拟dom(vdomTree中的对应节点)
     */
    vdom?: VirtualDom;
    /**
     * 是否为svg节点
     */
    isSvg?: boolean;
    /**
     * 所属模块id
     */
    mid?: number;
    /**
     * 渲染到的模块id，当作为slot时有效
     */
    rmid?: number;
};

/**
 * 渲染器
 * @remarks
 * nodom渲染操作在渲染器中实现
 */
export declare class Renderer {
    /**
     * 应用根El
     */
    private static rootEl;
    /**
     * 等待渲染列表
     */
    private static waitList;
    /**
     * 当前渲染模块
     * @remarks
     * slot渲染时，如果未使用`innerRender`，则渲染过程中指令、表达式依赖的模块会切换成templateModuleId对应模块，但currentModule不变。
     */
    static currentModule: Module;
    /**
     * 当前模块根dom
     */
    private static currentRootDom;
    /**
     * 设置根容器
     * @param rootEl - 根html element
     */
    static setRootEl(rootEl: any): void;
    /**
     * 获取根容器
     * @returns 根 html element
     */
    static getRootEl(): HTMLElement;
    /**
     * 获取当前渲染模块
     * @returns     当前渲染模块
     */
    static getCurrentModule(): Module;
    /**
     * 添加到渲染列表
     * @param module - 模块
     */
    static add(module: Module): void;
    /**
     * 从渲染队列移除
     * @param moduleId - 模块id
     */
    static remove(module: Module): void;
    /**
     * 渲染
     * @remarks
     * 如果存在渲染队列，则从队列中取出并依次渲染
     */
    static render(): void;
    /**
     * 渲染dom
     * @remarks
     * 此过程将VirtualDom转换为RenderedDom
     *
     * @param module -      模块
     * @param src -         源dom
     * @param model -       模型
     * @param parent -      父dom
     * @param key -         key 附加key，放在domkey的后面
     * @returns             渲染后节点
     */
    static renderDom(module: Module, src: VirtualDom, model: Model, parent?: RenderedDom, key?: number | string): RenderedDom;
    /**
     * 处理指令
     * @param module -  模块
     * @param src -     编译节点
     * @param dst -     渲染节点
     * @returns         true继续执行，false不执行后续渲染代码，也不加入渲染树
     */
    private static handleDirectives;
    /**
     * 处理属性
     * @param module -  模块
     * @param src -     编译节点
     * @param dst -     渲染节点
     */
    private static handleProps;
    /**
     * 更新到html树
     * @param module -  模块
     * @param src -     渲染节点
     * @returns         渲染后的节点
     */
    static updateToHtml(module: Module, dom: RenderedDom, pEl?: any): Node;
    /**
     * 渲染到html树
     * @param module - 	        模块
     * @param src -             渲染节点
     * @param parentEl - 	    父html
     * @param isRenderChild -   是否渲染子节点
     * @returns                 渲染后的html节点
     */
    static renderToHtml(module: Module, src: RenderedDom, parentEl: Node, isRenderChild?: boolean): Node;
    /**
     * 处理更改的dom节点
     * @param module -        待处理模块
     * @param changeDoms -    修改后的dom节点数组
     */
    static handleChangedDoms(module: Module, changeDoms: ChangedDom[]): void;
    /**
     * 替换解ID那
     * @param module -  模块
     * @param src -     待替换节点
     * @param dst -     被替换节点
     */
    private static replace;
}

/**
 * 路由类
 */
export declare class Route {
    /**
     * 路由id
     */
    id: number;
    /**
     * 路由参数名数组
     */
    params: Array<string>;
    /**
     * 路由参数数据
     */
    data: object;
    /**
     * 子路由
     */
    children: Array<Route>;
    /**
     * 进入路由事件方法
     */
    onEnter: (module: Module, path: string) => void;
    /**
     * 离开路由方法
     */
    onLeave: (module: Module, path: string) => void;
    /**
     * 路由路径
     */
    path: string;
    /**
     * 完整路径
     */
    fullPath: string;
    /**
     * 路由对应模块对象或类或模块类名
     */
    module: string | UnknownClass | Module;
    /**
     * 父路由
     */
    parent: Route;
    /**
     * 构造器
     * @param config - 路由配置项
     */
    constructor(config?: RouteCfg, parent?: Route);
    /**
     * 添加子路由
     * @param child - 字路由
     */
    addChild(child: Route): void;
    /**
     * 通过路径解析路由对象
     */
    private parse;
    /**
     * 克隆
     * @returns 克隆对象
     */
    clone(): Route;
}

/**
 * 路由配置
 */
export declare type RouteCfg = {
    /**
     * 路由路径，可以带通配符*，可以带参数 /:
     */
    path?: string;
    /**
     * 路由对应模块对象或类或模块类名
     */
    module?: Module;
    /**
     * 模块路径，当module为类名时需要，默认执行延迟加载
     */
    modulePath?: string;
    /**
     * 子路由数组
     */
    routes?: Array<RouteCfg>;
    /**
     * 进入路由事件方法
     */
    onEnter?: (module: any, url: any) => void;
    /**
     * 离开路由方法
     */
    onLeave?: (module: any, url: any) => void;
    /**
     * 父路由
     */
    parent?: Route;
};

/**
 * 路由管理类
 */
export declare class Router {
    /**
     * 根路由
     */
    private root;
    /**
     * 基础路径，实际显示路径为 basePath+routePath
     */
    private basePath;
    /**
     * 当前路径
     */
    currentPath: string;
    /**
     * path等待链表
     */
    private waitList;
    /**
     * 默认路由进入事件方法
     */
    private onDefaultEnter;
    /**
     * 默认路由离开事件
     */
    private onDefaultLeave;
    /**
     * 启动方式 0:直接启动 1:popstate 启动
     */
    private startType;
    /**
     * 激活Dom map
     * key: path
     * value: object，格式为：
     * ```js
     *  {
     *      moduleId:dom所属模板模块id，
     *      model:对应model,
     *      field:激活字段名
     *  }
     * ```
     */
    private activeModelMap;
    /**
     * 绑定到module的router指令对应的key，即router容器对应的key，格式为:
     * ```js
     *  {
     *      moduleId:{
     *          mid:router所在模块id,
     *          key:routerKey(路由key),
     *          paths:active路径数组
     *          wait:{mid:待渲染的模块id,path:route.path}
     *      }
     *      ,...
     *  }
     * ```
     *  moduleId: router所属模块id（如果为slot且slot不是innerRender，则为模板对应模块id，否则为当前模块id）
     */
    private routerMap;
    /**
     * 构造器
     * @param basePath -          路由基础路径，显示的完整路径为 basePath + route.path
     * @param defaultEnter -      默认进入时事件函数，传递参数： module,离开前路径
     * @param defaultLeave -      默认离开时事件函数，传递参数： module,进入时路径
     */
    constructor(basePath?: string, defaultEnter?: (module: any, path: any) => void, defaultLeave?: (module: any, path: any) => void);
    /**
     * 跳转
     * @remarks
     * 只是添加到跳转列表，并不会立即进行跳转
     *
     * @param path -    路径
     * @param type -    启动路由类型，参考startType，默认0
     */
    go(path: string): void;
    /**
     * 启动加载
     */
    private load;
    /**
     * 切换路由
     * @param path - 	路径
     */
    private start;
    /**
     * 获取module
     * @param route - 路由对象
     * @returns     路由对应模块
     */
    private getModule;
    /**
     * 比较两个路径对应的路由链
     * @param path1 - 	第一个路径
     * @param path2 - 	第二个路径
     * @returns 		数组 [父路由或不同参数的路由，需要销毁的路由数组，需要增加的路由数组，不同参数路由的父路由]
     */
    private compare;
    /**
     * 添加激活对象
     * @param moduleId -  模块id
     * @param path -      路由路径
     * @param model -     激活字段所在model
     * @param field -     字段名
     */
    addActiveModel(moduleId: number, path: string, model: Model, field: string): void;
    /**
     * 依赖模块相关处理
     * @param module - 	模块
     * @param pm -        依赖模块
     * @param path - 		view对应的route路径
     */
    private dependHandle;
    /**
     * 设置路由元素激活属性
     * @param module -    模块
     * @param path -      路径
     * @returns
     */
    private setDomActive;
    /**
     * 获取路由数组
     * @param path - 	要解析的路径
     * @param clone - 是否clone，如果为false，则返回路由树的路由对象，否则返回克隆对象
     * @returns     路由对象数组
     */
    private getRouteList;
    /**
     * 获取根路由
     * @returns     根路由对象
     */
    getRoot(): Route;
    /**
     * 注册路由容器
     * @param moduleId -      模块id
     * @param module -        路由实际所在模块（当使用slot时，与moduleId对应模块不同）
     * @param key -           路由容器key
     */
    registRouter(moduleId: number, module: Module, dom: any): void;
    /**
     * 尝试激活路径
     * @param path -  待激活的路径
     */
    activePath(path: string): void;
}

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

/**
 * 未知类
 */
export declare type UnknownClass = () => void;

/**
 * 未知方法
 */
export declare type UnknownMethod = () => void;

/**
 * 基础服务库
 */
export declare class Util {
    /**
     * 全局id
     */
    private static generatedId;
    /**
     * js 保留字 map
     */
    static keyWordMap: Map<any, any>;
    /**
     * 唯一主键
     */
    static genId(): number;
    /**
     * 初始化保留字map
     */
    static initKeyMap(): void;
    /**
     * 是否为 js 保留关键字
     * @param name -    名字
     * @returns         如果为保留字，则返回true，否则返回false
     */
    static isKeyWord(name: string): boolean;
    /******对象相关******/
    /**
     * 对象复制
     * @param srcObj -  源对象
     * @param expKey -  不复制的键正则表达式或属性名
     * @param extra -   附加参数
     * @returns         复制的对象
     */
    static clone(srcObj: object, expKey?: RegExp | string[], extra?: object): object;
    /**
     * 比较两个对象值是否相同(只比较object和array)
     * @param src - 源对象
     * @param dst - 目标对象
     * @returns     值相同则返回true，否则返回false
     */
    static compare(src: object, dst: object): boolean;
    /**
     * 获取对象自有属性
     * @param obj - 需要获取属性的对象
     * @returns     返回属性数组
     */
    static getOwnProps(obj: any): Array<string>;
    /**************对象判断相关************/
    /**
     * 判断是否为函数
     * @param foo - 检查的对象
     * @returns     true/false
     */
    static isFunction(foo: any): boolean;
    /**
     * 判断是否为数组
     * @param obj -   检查的对象
     * @returns     true/false
     */
    static isArray(obj: any): boolean;
    /**
     * 判断是否为map
     * @param obj -   检查的对象
     */
    static isMap(obj: any): boolean;
    /**
     * 判断是否为对象
     * @param obj -   检查的对象
     * @returns     true/false
     */
    static isObject(obj: any): boolean;
    /**
     * 判断对象/字符串是否为空
     * @param obj - 检查的对象
     * @returns     true/false
     */
    static isEmpty(obj: any): boolean;
    /******日期相关******/
    /**
     * 日期格式化
     * @param timestamp -   时间戳
     * @param format -      日期格式
     * @returns             日期串
     */
    static formatDate(timeStamp: string | number, format: string): string;
    /******字符串相关*****/
    /**
     * 编译字符串，把 \{n\}替换成带入值
     * @param src -     待编译的字符串
     * @param params -  参数数组
     * @returns     转换后的消息
     */
    static compileStr(src: string, ...params: any[]): string;
}

/**
 * 虚拟dom
 * @remarks
 * 编译后的dom节点，与渲染后的dom节点(RenderedDom)不同
 */
export declare class VirtualDom {
    /**
     * 元素名，如div
     */
    tagName: string;
    /**
     * key，数字或字符串，整颗虚拟dom树唯一
     */
    key: number | string;
    /**
     * 文本内容
     * @remarks
     * element为textnode时有效
     */
    textContent: string;
    /**
     * 表达式+字符串数组，用于text node
     */
    expressions: Array<Expression | string>;
    /**
     * 指令集
     */
    directives: Directive[];
    /**
     * 直接属性
     * @remarks
     * 不是来自于attribute，而是直接作用于html element，如el.checked,el.value等
     */
    assets: Map<string, string | number | boolean>;
    /**
     * 属性(attribute)集合
     * @remarks
     * 属性值可能是值，也可能是表达式
     */
    props: Map<string, string | number | boolean | object | Expression>;
    /**
     * 事件数组
     */
    events: Array<NEvent>;
    /**
     * 子节点数组[]
     */
    children: Array<VirtualDom>;
    /**
     * 父虚拟dom
     */
    parent: VirtualDom;
    /**
     * 是否为svg节点
     */
    isSvg: boolean;
    /**
     * 静态标识数
     * @remarks
     * 用于判断是否为静态节点，默认为1，表示至少渲染1次
     *
     *  0 表示静态，不进行比较
     *
     *  1 渲染后 -1
     *
     *  -1 每次都渲染
     */
    staticNum: number;
    /**
     * @param tag -     标签名
     * @param key -     key
     * @param module - 	模块
     */
    constructor(tag?: string, key?: number | string, module?: Module);
    /**
     * 移除多个指令
     * @param directives - 	待删除的指令类型数组或指令类型
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    removeDirectives(directives: string[]): void;
    /**
     * 移除指令
     * @param directive - 	待删除的指令类型名
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    removeDirective(directive: string): void;
    /**
     * 添加指令
     * @param directive -     指令对象
     * @param sort -          是否排序
     * @returns             如果虚拟dom上的指令集不为空，且指令集中已经存在传入的指令对象，则返回void
     */
    addDirective(directive: Directive, sort?: boolean): void;
    /**
     * 指令排序
     * @returns           如果虚拟dom上指令集为空，则返回void
     */
    sortDirective(): void;
    /**
     * 是否有某个类型的指令
     * @param typeName - 	    指令类型名
     * @returns             如果指令集不为空，且含有传入的指令类型名则返回true，否则返回false
     */
    hasDirective(typeName: string): boolean;
    /**
     * 获取某个类型的指令
     * @param module -            模块
     * @param directiveType - 	指令类型名
     * @returns                 如果指令集为空，则返回void；否则返回指令类型名等于传入参数的指令对象
     */
    getDirective(directiveType: string): Directive;
    /**
     * 添加子节点
     * @param dom -       子节点
     * @param index -     指定位置，如果不传此参数，则添加到最后
     */
    add(dom: VirtualDom, index?: number): void;
    /**
     * 移除子节点
     * @param dom -   子节点
     */
    remove(dom: VirtualDom): void;
    /**
     * 是否拥有属性
     * @param propName -  属性名
     * @param isExpr -    是否只检查表达式属性
     * @returns         如果属性集含有传入的属性名返回true，否则返回false
     */
    hasProp(propName: string): boolean;
    /**
     * 获取属性值
     * @param propName -  属性名
     * @returns         传入属性名的value
     */
    getProp(propName: string): string | number | boolean | object | Expression;
    /**
     * 设置属性值
     * @param propName -  属性名
     * @param v -         属性值
     */
    setProp(propName: string, v: string | number | boolean | object | Expression): void;
    /**
     * 删除属性
     * @param props -     属性名或属性名数组
     * @returns         如果虚拟dom上的属性集为空，则返回void
     */
    delProp(props: string | string[]): void;
    /**
     * 设置asset
     * @param assetName -     asset name
     * @param value -         asset value
     */
    setAsset(assetName: string, value: string | number | boolean): void;
    /**
     * 删除asset
     * @param assetName -     asset name
     * @returns             如果虚拟dom上的直接属性集为空，则返回void
     */
    delAsset(assetName: string): void;
    /**
     * 设置cache参数
     * @param module -    模块
     * @param name -      参数名
     * @param value -     参数值
     */
    setParam(module: Module, name: string, value: string | boolean | number | object): void;
    /**
     * 获取参数值
     * @param module -    模块
     * @param name -      参数名
     * @returns         参数值
     */
    getParam(module: Module, name: string): unknown;
    /**
     * 移除参数
     * @param module -    模块
     * @param name -      参数名
     */
    removeParam(module: Module, name: string): void;
    /**
     * 设置单次静态标志
     */
    private setStaticOnce;
    /**
     * 克隆
     */
    clone(): VirtualDom;
    /**
     * 保存事件
     * @param event -     事件对象
     * @param index - 	位置
     */
    addEvent(event: NEvent, index?: number): void;
}

export { }
