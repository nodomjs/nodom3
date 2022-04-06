import { DefineElementManager } from "./defineelementmanager";
import { Directive } from "./directive";
import { VirtualDom } from "./virtualdom";
import { NError } from "./error";
import { NEvent } from "./event";
import { Expression } from "./expression";
import { Module } from "./module";
import { ModuleFactory } from "./modulefactory";

export class Compiler {
    /**
     * 模块
     */
    private module:Module;

    /**
     * 根结点
     */
    private root:VirtualDom;
    /**
     * 构造器
     * @param module 
     */
    constructor(module:Module){
        this.module = module;
    }
    /**
    * 编译
    * @param elementStr     待编译html串
    * @returns              虚拟dom
    */
    public compile(elementStr: string): VirtualDom {
        return this.compileTemplate(elementStr);
    }

    /**
     * 编译模版串
     * @param srcStr    源串
     * @returns         
     */
    private compileTemplate(srcStr:string):VirtualDom{
        const me = this;
        // 清理comment
        srcStr = srcStr.replace(/\<\!\-\-[\s\S]*?\-\-\>/g,'');
        // 正则式分解标签和属性
        // const regWhole = /((?<!\\)'[\s\S]*?(?<!\\)')|((?<!\\)"[\s\S]*?(?<!\\)")|((?<!\\)`[\s\S]*?(?<!\\)`)|({{{*)|(}*}})|([\w$-]+(\s*=)?)|(<\s*[a-zA-Z][a-zA-Z0-9-_]*)|(\/?>)|(<\/\s*[a-zA-Z][a-zA-Z0-9-_]*>)/g;
        const regWhole = /('[\s\S]*?')|("[\s\S]*?")|(`[\s\S]*?`)|({{{*)|(}*}})|([\w$-]+(\s*=)?)|(<\s*[a-zA-Z][a-zA-Z0-9-_]*)|(\/?>)|(<\/\s*[a-zA-Z][a-zA-Z0-9-_]*>)/g;
        //属性名正则式
        const propReg = /^[a-zA-Z_$][$-\w]*?\s*?=?$/;
        //不可见字符正则式
        const regSpace = /^[\s\n\r\t\v]+$/;
        //dom数组
        let domArr = [];
        //已闭合的tag，与domArr对应
        let closedTag = [];
        //文本开始index
        let txtStartIndex = 0;
        //属性值
        let propName:string;
        //pre标签标志
        let isPreTag:boolean = false;
        //当前标签名
        let tagName:string;
        //表达式开始index
        let exprStartIndex = 0;
        //表达式计数器
        let exprCount = 0;
        //当前dom节点
        let dom;
        //正则式匹配结果
        let result;
        while((result = regWhole.exec(srcStr)) !== null){
            let re = result[0];
            if(re.startsWith('{{')){  //表达式开始符号
                //整除2个数
                if(exprCount === 0){ //表达式开始
                    exprStartIndex = result.index;
                }
                exprCount += re.length/2 | 0;  
            }else if(re.endsWith('}}')){  //表达式结束
                exprCount -= re.length/2 | 0;
                if(exprCount === 0){
                    handleExpr();
                }
            }
            
            //不在表达式中
            if(exprCount === 0){
                if(re[0] === '<'){ //标签
                    //处理文本
                    handleText(srcStr.substring(txtStartIndex,result.index));
                    if(re[1] === '/'){ //标签结束
                        finishTag(re);
                    }else{ //标签开始
                        tagName = re.substring(1).trim().toLowerCase();
                        txtStartIndex = undefined;
                        isPreTag = (tagName === 'pre');
                        //新建dom节点
                        dom = new VirtualDom(tagName,this.genKey());
                        //第一个dom为root
                        if(!me.root){
                            me.root = dom;
                        }
                        domArr.push(dom);
                        closedTag.push(false);
                    }
                }else if(re === '>'){ //标签头结束
                    finishTagHead();
                }else if(re === '/>'){ //标签结束
                    finishTag();
                }else if(dom&&dom.tagName){ //属性
                    if(propReg.test(re)){
                        if(propName){ //propName=无值 情况，当无值处理
                            handleProp();
                        }
                        if(re.endsWith('=')){ //属性带=，表示后续可能有值
                            propName = re.substring(0,re.length-1).trim();
                        }else{ //只有属性，无属性值
                            propName = re;
                            handleProp();
                        }
                    }else if(propName){ //属性值
                        handleProp(re);
                    }
                }
            }
        }

        //异常情况
        if(domArr.length>1 || exprCount!==0){
            throw new NError('wrongTemplate');
        }
        return domArr[0];

        /**
         * 标签结束
         * @param ftag      结束标签
         */
        function finishTag(ftag?:string){
            if(ftag){
                let finded = false;
                const tag = ftag.substring(2,ftag.length-1).trim().toLowerCase();
                //反向查找
                for(let i=domArr.length-1;i>=0;i--){
                    if(!closedTag[i] && domArr[i].tagName === tag){
                        domArr[i].children = domArr.slice(i+1);
                        //设置parent
                        for(let d of domArr[i].children){
                            d.parent = domArr[i];
                            extraHandle(d);
                        }
                        //删除后续节点
                        domArr.splice(i+1);
                        //标注该节点已闭合
                        closedTag.splice(i+1);
                        finded = true;
                        break;
                    }
                }
                if(!finded){
                    throw new NError('wrongTemplate');
                }
            }
            
            //设置标签关闭
            let ele = domArr[domArr.length-1];
            if(ele === me.root){
                extraHandle(ele);
            }
            closedTag[closedTag.length-1] = true;
            dom = undefined;
            propName = undefined;
            txtStartIndex = regWhole.lastIndex;
            exprCount = 0;
            exprStartIndex = 0;
            // ele.allModelField = allModelField;    
        }

        /**
         * 特殊处理
         * @param dom   待处理节点 
         */
        function extraHandle(dom:VirtualDom){
            //文本不处理
            if(!dom.tagName){
                return;
            }
            me.postHandleNode(dom);
            dom.sortDirective();
            me.handleSlot(dom);
        }

        /**
         * 标签头结束
         */
        function finishTagHead(){
            if(dom){
                txtStartIndex = regWhole.lastIndex;
            }
            dom = undefined;
            propName = undefined;
            exprCount = 0;
            exprStartIndex = 0;
        }

        /**
         * 处理属性
         * @param value     属性值
         */
        function handleProp(value?:any){
            if(!dom || !propName){
                return;
            }
            if(value){
                let r;
                //去掉字符串两端
                if(['"',"'",'`'].includes(value[0]) && ['"',"'",'`'].includes(value[value.length-1])){
                    value = value.substring(1,value.length-1).trim();
                }
            }
            //指令
            if (propName.startsWith("x-")) {
                //不排序
                dom.addDirective(new Directive(propName.substring(2), value));
            } else if (propName.startsWith("e-")) { //事件
                dom.addEvent(new NEvent(me.module,propName.substring(2), value));
            } else { //普通属性
                dom.setProp(propName, value);
            }
            propName = undefined;
            
        }

        /**
         * 处理表达式
         */
        function handleExpr(){
            //处理表达式前的文本
            if(txtStartIndex>0 && exprStartIndex>txtStartIndex){
                handleText(srcStr.substring(txtStartIndex,exprStartIndex));
            }
            const s = srcStr.substring(exprStartIndex+2,regWhole.lastIndex-2);
            exprCount = 0;
            exprStartIndex = 0;
            //新建表达式
            let expr = new Expression(s);
            if(dom && dom.tagName){ //标签
                handleProp(expr);
            }else{ //文本节点
                setTxtDom(expr);
                //文本节点，移动txt节点开始位置
                txtStartIndex = regWhole.lastIndex;
            }
            //设置所有字段都在model内标识
            dom.allModelField = expr.allModelField;
        }

        /**
         * 处理txt为文本节点
         * @param txt 文本串
         */
        function handleText(txt:string):VirtualDom {
            if(txt === '' || !isPreTag && regSpace.test(txt)){ //非pre 标签且全为不可见字符，不处理
                return;
            }
            txt = me.preHandleText(txt);
            setTxtDom(txt);
        }

        /**
         * 新建文本节点
         * @param txt   文本串
         */
        function setTxtDom(txt){
            if(!dom){
                dom = new VirtualDom(null,me.genKey());
                domArr.push(dom);
                closedTag.push(false);
            }
            if(dom.expressions){
                dom.expressions.push(txt);
            }else{
                if(typeof txt === 'string'){ //字符串
                    dom.textContent = txt;
                }else{ //表达式
                    if(dom.textContent){ //之前的文本进数组
                        dom.expressions = [dom.textContent,txt];
                        delete dom.textContent;
                    }else{
                        dom.expressions = [txt];
                    }
                }  
            }
        }
    }
    
    
    /**
     * 处理模块子节点为slot节点
     * @param dom   dom节点
     */
    private handleSlot(dom:VirtualDom){
        if(!dom.children || dom.children.length === 0 || !dom.hasDirective('module')){
            return;
        }
        let slotCt:VirtualDom;
        for(let j=0;j<dom.children.length;j++){
            let c = dom.children[j];
            if(c.hasDirective('slot')){ //带slot的不处理
                continue;
            }
            if(!slotCt){//第一个直接被slotCt替换
                slotCt = new VirtualDom('div',this.genKey());
                slotCt.addDirective(new Directive('slot',null));
                //当前位置，用slot替代
                dom.children.splice(j,1,slotCt);
            }else{
                //直接删除
                dom.children.splice(j--,1);
            }
            slotCt.add(c);
        }
    }

    /**
     * 后置处理
     * 包括：模块类元素、自定义元素
     * @param node  虚拟dom节点
     */
    private postHandleNode(node:VirtualDom){
        // 自定义元素判断
        let clazz = DefineElementManager.get(node.tagName);
        if(clazz){ //自定义元素
            Reflect.construct(clazz,[node,this.module]);
        }
        // 模块类判断
        if (ModuleFactory.hasClass(node.tagName)) {
            const dir:Directive = new Directive('module',node.tagName);
            dir.params = {srcId:this.module.id};
            node.addDirective(dir);
            node.tagName = 'div';
        }
    }

    /**
     * 预处理html保留字符 如 &nbsp;,&lt;等
     * @param str   待处理的字符串
     * @returns     解析之后的串
     */
    private preHandleText(str: string): string {
        let reg = /&[a-z]+;/;
        if(reg.test(str)){
            let div = document.createElement('div');
            div.innerHTML = str;
            return div.textContent;
        }
        return str;
    }

    /**
     * 产生dom key
     * @returns   dom key
     */
    private genKey():string{
        return this.module.getDomKeyId() + '';
    }
}
