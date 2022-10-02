
import { Directive } from "./directive";
import { DirectiveManager } from "./directivemanager";
import { NEvent } from "./event";
import { Expression } from "./expression";
import { Model } from "./model";
import { Module } from "./module";
import { IRenderedDom } from "./types";
import { Util } from "./util";

/**
 * 虚拟dom
 */
export class VirtualDom {
    /**
     * 元素名，如div
     */
    public tagName: string;

    /**
     * key，整颗虚拟dom树唯一
     */
    public key: string;

    /**
     * 绑定模型
     */
    public model: Model;

    /**
     * element为textnode时有效
     */
    public textContent: string;

    /**
     * 表达式+字符串数组，用于textnode
     */
    public expressions: Array<Expression | string>;

    /**
     * 指令集
     */
    public directives: Directive[];

    /**
     * 直接属性 不是来自于attribute，而是直接作用于html element，如el.checked,el.value等
     */
    public assets: Map<string, any>;

    /**
     * 属性(attribute)集合
     * {prop1:value1,...}
     * 属性值可能是值，也可能是表达式，还可能是数组，当为子模块时，存在从props传递过来的属性，如果模块模版存在相同属性，则会变成数组。
     */
    public props: Map<string, any>;

    /**
     * 删除的class名数组
     */
    removedClassMap:Map<string,boolean>;

    /**
     * 删除的style属性名map
     */
    removedStyleMap:Map<string,boolean>;

    /**
     * 事件数组
     */
    public events: Array<NEvent>;

    /**
     * 子节点数组[]
     */
    public children: Array<VirtualDom>;

    /**
     * 父虚拟dom
     */
    public parent: VirtualDom;

    /**
     * staticNum 静态标识数
     *  0 表示静态，不进行比较
     *  > 0 每次比较后-1
     *  < 0 不处理
     */
    public staticNum: number = 0;

    /**
     * 对应的所有表达式的字段都属于dom model内
     */
    public allModelField: boolean = true;

    /**
     * 未改变标志，本次不渲染
     */
    public notChange: boolean;

    /**
     * 渲染后节点，isStatic为true时保留
     */
    public renderedDom:IRenderedDom;

    /**
     * @param tag       标签名
     * @param key       key
     */
    constructor(tag?: string, key?: string, module?: Module) {
        this.key = key || ((module ? module.getDomKeyId() : Util.genId()) + '');
        if (tag) {
            this.tagName = tag;
        }
    }

    /**
     * 移除多个指令
     * @param directives 	待删除的指令类型数组或指令类型
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    public removeDirectives(directives: string[]) {
        if (!this.directives) {
            return;
        }
        //数组
        directives.forEach(d => {
            this.removeDirective(d);
        });
    }

    /**
     * 移除指令
     * @param directive 	待删除的指令类型名
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    public removeDirective(directive: string) {
        if (!this.directives) {
            return;
        }

        let ind;
        if ((ind = this.directives.findIndex(item => item.type.name === directive)) !== -1) {
            this.directives.splice(ind, 1);
        }
        if (this.directives.length === 0) {
            delete this.directives;
        }
    }

    /**
     * 添加指令
     * @param directive     指令对象
     * @param sort          是否排序
     * @returns             如果虚拟dom上的指令集不为空，且指令集中已经存在传入的指令对象，则返回void
     */
    public addDirective(directive: Directive, sort?: boolean) {
        if (!this.directives) {
            this.directives = [];
        } else if (this.directives.find(item => item.type.name === directive.type.name)) {
            return;
        }
        this.directives.push(directive);
        //指令按优先级排序
        if (sort) {
            this.sortDirective();
        }
    }

    /**
     * 指令排序
     * @returns           如果虚拟dom上指令集为空，则返回void
     */
    public sortDirective() {
        if (!this.directives) {
            return;
        }
        if (this.directives.length > 1) {
            this.directives.sort((a, b) => {
                return DirectiveManager.getType(a.type.name).prio < DirectiveManager.getType(b.type.name).prio ? -1 : 1;
            });
        }
    }

    /**
     * 是否有某个类型的指令
     * @param typeName 	    指令类型名
     * @returns             如果指令集不为空，且含有传入的指令类型名则返回true，否则返回false
     */
    public hasDirective(typeName: string): boolean {
        return this.directives && this.directives.findIndex(item => item.type.name === typeName) !== -1;
    }

    /**
     * 获取某个类型的指令
     * @param module            模块
     * @param directiveType 	指令类型名
     * @returns                 如果指令集为空，则返回void；否则返回指令类型名等于传入参数的指令对象
     */
    public getDirective(directiveType: string): Directive {
        if (!this.directives) {
            return;
        }
        return this.directives.find(item => item.type.name === directiveType);
    }

    /**
     * 添加子节点
     * @param dom       子节点 
     * @param index     指定位置，如果不传此参数，则添加到最后
     */
    public add(dom:VirtualDom,index?:number){
        if (!this.children) {
            this.children = [];
        }
        if(index){
            this.children.splice(index,0,dom);
        }else{
            this.children.push(dom);
        }
        dom.parent = this;
    }

    /**
     * 移除子节点
     * @param dom   子节点
     */
    public remove(dom:VirtualDom){
        let index = this.children.indexOf(dom);
        if(index !== -1){
            this.children.splice(index,1);
        }
    }
    
    /**
     * 添加css class
     * @param cls class名或表达式,可以多个，以“空格”分割
     */
    public addClass(cls: string|Expression) {
        this.addProp('class',cls);
        //需要从remove class map 移除
        if(this.removedClassMap && this.removedClassMap.size>0){
            let arr = (<string>cls).trim().split(/\s+/);
            for(let a of arr){
                if(a === ''){
                    continue;
                }
                this.removedClassMap.delete(a);
            }
        }
    }

    /**
     * 删除css class，因为涉及到表达式，此处只记录删除标识
     * @param cls class名,可以多个，以“空格”分割
     */
    public removeClass(cls: string) {
        let pv = this.getProp('class');
        if(!pv){
            return;
        }
        if(!this.removedClassMap){
            this.removedClassMap = new Map();
        }
        let arr = cls.trim().split(/\s+/);
        for(let a of arr){
            if(a === ''){
                continue;
            }
            this.removedClassMap.set(a,true);
        }
        this.setStaticOnce();
    }

    /**
     * 获取class串
     * @returns class 串
     */
    public getClassString(values):string{
        let clsArr = [];
        for(let pv of values){
            let arr = pv.trim().split(/\s+/);
            for (let a of arr) {
                if(!this.removedClassMap || !this.removedClassMap.has(a)){
                    if (!clsArr.includes(a)) {
                        clsArr.push(a);
                    }
                }
            }
        }
        if(clsArr.length>0){
            return clsArr.join(' ');
        }
        
    }

    /**
     * 添加style
     *  @param style style字符串或表达式
     */
    public addStyle(style: string|Expression) {
        this.addProp('style',style);
        if(typeof style === 'string'){
            //需要从remove class map 移除
            if(this.removedStyleMap && this.removedStyleMap.size>0){
                let arr = style.trim().split(/\s*;\s*/);
                for(let a of arr){
                    if(a === ''){
                        continue;
                    }
                    let sa1 = a.split(/\s*:\s*/);
                    let p = sa1[0].trim();
                    if(p !== ''){
                        this.removedClassMap.delete(sa1[0].trim());
                    }
                }
            }
        }
    }

    /**
     * 删除style
     * @param styleStr style字符串，多个style以空格' '分割
     */
    public removeStyle(styleStr: string) {
        if(!this.removedClassMap){
            this.removedClassMap = new Map();
        }
        let arr = styleStr.trim().split(/\s+/);
        for(let a of arr){
            if (a === '') {
                continue;
            }
            this.removedClassMap.set(a,true);
        }
        this.setStaticOnce();
    }

    /**
     * 获取style串
     * @returns style 串
     */
    public getStyleString(values):string{
        let map = new Map();
        for(let pv of values){
            let sa = pv.trim().split(/\s*;\s*/);
            for (let s of sa) {
                if (s === '') {
                    continue;
                }
                let sa1 = s.split(/\s*:\s*/);
                //不在移除style map才能加入
                if(!this.removedStyleMap || !this.removedStyleMap.has(sa1[0])){
                    map.set(sa1[0], sa1[1]);
                }
            }
        }

        if(map.size>0){
            return [...map].map(item => item.join(':')).join(';');
        }
    }
    /**
     * 是否拥有属性
     * @param propName  属性名
     * @param isExpr    是否只检查表达式属性
     * @returns         如果属性集含有传入的属性名返回true，否则返回false
     */
    public hasProp(propName: string) {
        if (this.props) {
            return this.props.has(propName);
        }
    }

    /**
     * 获取属性值
     * @param propName  属性名
     * @param isExpr    是否只获取表达式属性
     * @returns         传入属性名的value
     */
    public getProp(propName: string, isExpr?: boolean) {
        if (this.props) {
            return this.props.get(propName);
        }
    }

    /**
     * 设置属性值
     * @param propName  属性名
     * @param v         属性值
     */
    public setProp(propName: string, v: any) {
        if (!this.props) {
            this.props = new Map();
        }
        if(propName === 'style'){  
            if(this.removedStyleMap){ //清空removedStyleMap
                this.removedStyleMap.clear();
            }
        }else if(propName === 'class'){ 
            if(this.removedClassMap){ //清空removedClassMap
                this.removedClassMap.clear();
            }
        }
        this.props.set(propName, v);
    }

    /**
     * 添加属性，如果原来的值存在，则属性值变成数组
     * @param pName     属性名
     * @param pValue    属性值
     */
    public addProp(pName,pValue):boolean{
        let pv = this.getProp(pName);
        if(!pv){
            this.setProp(pName,pValue);
        }else if(Array.isArray(pv)){
            if(pv.includes(pValue)){
                return false;
            }
            pv.push(pValue);
        }else if(pv !== pValue){
            this.setProp(pName,[pv,pValue]);
        }else{
            return false;
        }
        this.setStaticOnce();
        return true;
    }

    /**
     * 删除属性
     * @param props     属性名或属性名数组
     * @returns         如果虚拟dom上的属性集为空，则返回void
     */
    public delProp(props: string | string[]) {
        if (!this.props) {
            return;
        }
        if (Util.isArray(props)) {
            for (let p of <string[]>props) {
                this.props.delete(p);
            }
        } else {
            this.props.delete(<string>props);
        }
        //设置静态标志，至少要比较一次
        this.setStaticOnce();
    }

    /**
     * 设置asset
     * @param assetName     asset name
     * @param value         asset value
     */
    public setAsset(assetName: string, value: any) {
        if (!this.assets) {
            this.assets = new Map();
        }
        this.assets.set(assetName, value);
    }

    /**
     * 删除asset
     * @param assetName     asset name
     * @returns             如果虚拟dom上的直接属性集为空，则返回void
     */
    public delAsset(assetName: string) {
        if (!this.assets) {
            return;
        }
        this.assets.delete(assetName);
    }

    /**
     * 获取html dom
     * @param module    模块 
     * @returns         对应的html dom
     */
    public getEl(module: Module): Node {
        return module.getElement(this.key);
    }

    /**
     * 查找子孙节点
     * @param key 	element key
     * @returns		虚拟dom/undefined
     */
    public query(key: string) {
        if (this.key === key) {
            return this;
        }
        if (this.children) {
            for (let i = 0; i < this.children.length; i++) {
                let dom = this.children[i].query(key);
                if (dom) {
                    return dom;
                }
            }
        }
    }

    /**
     * 设置cache参数
     * @param module    模块
     * @param name      参数名
     * @param value     参数值
     */
    public setParam(module: Module, name: string, value: any) {
        module.objectManager.setDomParam(this.key, name, value);
    }

    /**
     * 获取参数值
     * @param module    模块 
     * @param name      参数名
     * @returns         参数值
     */
    public getParam(module: Module, name: string) {
        return module.objectManager.getDomParam(this.key, name);
    }

    /**
     * 移除参数
     * @param module    模块
     * @param name      参数名
     */
    public removeParam(module: Module, name: string) {
        module.objectManager.removeDomParam(this.key, name);
    }

    /**
     * 设置单次静态标志
     */
    private setStaticOnce() {
        if (this.staticNum !== -1) {
            this.staticNum = 1;
        }
    }

    /**
     * 克隆
     */
    public clone(): VirtualDom {
        let dst: VirtualDom = new VirtualDom(this.tagName, this.key);
        if (this.tagName) {
            //属性
            if (this.props && this.props.size > 0) {
                for (let p of this.props) {
                    dst.setProp(p[0], p[1]);
                }
            }

            if (this.assets && this.assets.size > 0) {
                for (let p of this.assets) {
                    dst.setAsset(p[0], p[1]);
                }
            }

            if (this.directives && this.directives.length > 0) {
                dst.directives = [];
                for (let d of this.directives) {
                    dst.directives.push(d.clone());
                }
            }
            //复制事件
            dst.events = this.events;

            //子节点clone
            if (this.children) {
                for (let c of this.children) {
                    dst.add(c.clone());
                }
            }
        } else {
            dst.expressions = this.expressions;
            dst.textContent = this.textContent;
        }
        dst.staticNum = this.staticNum;
        return dst;
    }

    /**
     * 保存事件
     * @param key       dom key 
     * @param event     事件对象
     */
    public addEvent(event: NEvent) {
        if (!this.events) {
            this.events = [];
        }
        this.events.push(event);
    }
}
