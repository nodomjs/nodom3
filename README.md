nodom是一款基于数据驱动的web mvvm框架。用于搭建单页应用(SPA)。内置路由，提供数据管理功能，支持模块化开发。在不使用第三方工具的情况下可独立开发完整的单页应用。

## 开始
### 源码
1. gitee:  https://gitee.com/weblabsw/nodom3  
2. github: https://github.com/nodomjs/nodom3

### npm包
1. nodom3: https://www.npmjs.com/package/nodom3
2. nodom3-cli(脚手架):https://www.npmjs.com/package/nodom3-cli

### 目录结构
1. 核心库目录./core：核心框架源码
2. 扩展目录./extend：预定义指令、自定义element和事件
3. 示例目录./examples：示例
4. 发布目录./dist：发布包，所有示例从该目录引入编译后的nodom文件 

#### dist目录文件说明
1. nodom.esm.js：es module模式的开发包
2. nodom.esm.min.js: es module模式的生产包

### 示例
以vscode为例，使用Live Server插件启动./examples目录下的html文件即可，示例目录总入口在`index.html`文件。

### 编译
先运行`npm i`安装依赖，具体依赖包参考`package.json文件“devDependencies”配置项`，安装依赖包后，执行“npm run build”，编译结果在“/dist”目录中。

### 调试模式
使用`Nodom.debug()`启动调试模式，调试模式会对表达式的异常进行输出，启动调试模式示例如下：
```javascript
import{Nodom} from '/dist/nodom.esm.js'
Nodom.debug();
```

### 国际化

使用`Nodom.setLang(language)`设置语言，默认为中文，Nodom支持语言包括：

| 设置项 | 描述 |
| - | - |
|zh|中文|
|en|英文|

设置语言方法示例如下：

```javascript
import{Nodom} from '/dist/nodom.esm.js'
//设置语言为英文
Nodom.setLang('en');
```

### 实例化单例模式

使用`Nodom.Use(clazz)`以单例模式实例化类，实例化后，可以通过Nodom['$'+类名]方式进行使用，便于用户在代码中当作静态类使用。示例如下：

```javascript
import{Nodom,Router} from '/dist/nodom.esm.js'
//启用Router功能
const router = Nodom.use(Router);
//以下两种方式使用，foo为Router类的成员方法
router.foo();
//或
Nodom['$Router'].foo();
```
### CDN
下列代码引入`nodom.esm.min.js`文件，即es module模式的nodom生产环境包。

```js
import{nodom,Module} from "https://unpkg.com/nodom3"
```

### 下载引入
Nodom使用ES Module实现模块化，无需构建工具即可完成模块化开发，引入方式如下：
```html
<script type="module">
	//引入nodom和Module
    import{nodom,Module} from '/dist/nodom.esm.js'
	//定义模块类
	class Module1 extends Module{
		...
	}
	//启动应用，把Module1渲染到document.body
	nodom(Module1);
</script>
```

### 第一个例子

此例子在页面中输出"Hello Nodom"。

***假设你已经掌握一定的Html,Css,JavaScript基础，如果没有，那么阅读文档将会有些困难。***
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<title>nodom examples - first</title>
	</head>
	<body>
	</body>
	<script type='module'>
		import{Nodom,Module} from '/dist/nodom.esm.min.js'
		class MHello extends Module {
			//模板函数，返回模板串
			template() {
				return `
					<div>
						Hello {{name}}
					</div>
				`;
			}
			data(){
				return{
					name:'Nodom'
				}
			}
		}
		//把MHello模块渲染到document.body下
		nodom(MHello);
	</script>
</html>
```
> 后续示例代码主要阐述各类用法，主要对各示例的模块类进行描述，完整的使用需要参考上面代码结构。

## 核心概念

### 模块(Module)

Nodom以模块为单位进行应用构建，一个应用由单个或多个模块组成。模块定义需要继承Nodom提供的模块基类`Module`。

```javascript
class Module1 extends Module{
	//your code
}
```
### 模板(Template)

模板是模块必不可少的组成元素，通过`template()`方法返回字符串形式（建议使用模板字符串）的模板代码，Nodom采用基于HTML的模板语法。

```javascript
template(){
	return `
		<div>
			Hello,Nodom
		</div>
	`;
}
```

### 模型(Model)
模型是模块必不可少的组成元素，通过`data()`方法返回模块所需的数据对象，类型为`object`，Nodom对数据对象做响应式处理，响应式处理后的数据对象，Nodom称为`Model`对象，并存储在模块实例中。

***注：如果data方法不存在，则会创建一个空模型***

```javascript
data(){
	return {
		name:'nodom'
	}
}	
```

> 为了描述方便，随后的章节中，我们将响应式处理后的对象称为`Model`。一个`Model`中还可能包含其它`Model`对象。`Model`实际是对原始数据对象进行代理拦截的`Proxy`对象。

### 指令(Directive)

为增强dom节点的使用，增加了指令功能，指令用于模板串中，指令以“x-”开头，作为属性放置于标签头中，见下面代码的`x-repeat`，目前NoDom支持指令:module,model,repeat,class,if,else,show,field,route,router，详情见[指令](#指令)。

```javascript
class M1 extends Module{
	template(props){
		return `
			<div>
				<!-- x-repeat指令 -->
				<div x-repeat={{rows}}>
					{{name}}
				</div>
			</div>
		`
	}
	data(){
		return{
			rows:[
				{name:nodom},
				{name:noomi}
			]
		}
	}
}
```

### 表达式(Expression)
表达式用于数据，以`{{expr}}`表示，其中**expr**为你自己的表达式串，表达式可以作为元素属性值、文本节点值使用，支持属性运算、JS内置对象操作、模块方法操作及其组合操作，示例如下，详情见[表达式](#表达式)。

```javascript
class M1 extends Module{
	template(props){
		return `
			<div>
				<div x-repeat={{getRows()}}>
					<!-- 直接返回name的值 -->
					{{name}}
				</div>
			</div>
		`
	}
	getRows(){
		return [
			{name:nodom},
			{name:noomi}
		]
	}
}
```

### 事件(NEvent)
事件和元素的事件相对应，以"e-"开头，覆盖html标准事件类型和nodom自定义事件类型，模板中事件定义不能带参数，NoDom会自动传递约定的参数，共四个，依次为：
序号| 参数 | 类型
-|-|-
 1| 事件对应dom的model | Model
 2| 事件对应的虚拟dom | IRenderedDom
 3| nodom event对象 | NEvent
 4| Html Event对象 | Html Event
 
 示例如下，更多详情见[事件](#事件)。
```javascript
class M1 extends Module{
	template(props){
		return `
			<div>
				<!-- click 事件 -->
				<button e-click='click'>点击</button>
				...					
			</div>
		`
	}
	//事件方法
	click(model,dom,evObj,event){
		...
	}
}
```

### 虚拟Dom、编译及渲染
1. 模板串经过编译后，形成虚拟dom树，树中节点为虚拟Dom(VirtualDom)；
2. 虚拟dom树经过`renderDom`方法渲染后，形成渲染树，树中节点为渲染节点(IRenderedDom)；
3. 渲染树经过`renderToHtml`方法渲染后，渲染到html document，渲染方式分为首次渲染和增量渲染。

## 详细介绍

### 模块(Module)
> 定义模块类时，类名必须全局唯一（ModuleA和modulea是两个合法且不同的类名，但在nodom中会当作一个模块类）。

用户在编写模块时，主要用到5个部分，`模块声明，模板，模型，方法和事件`。

#### 模块声明
当模块中需要引入其它模块时，需要在该模块中声明，声明方式为：`modules=[子模块类1,子模块类2,...]`。当然，如果该模块已在其他地方声明或采用`Nodom.registModule`方法注册，此模块中可以不再声明。示例如下：

引用模块M1(文件名为m1.js)定义如下，需要在class前用export修饰（es module方式）。
```javascript
import{Module} from '/dist/nodom.esm.js'
export class M1 extends Module{
	...
}
```

主模块定义如下：
```javascript
import{Module} from '/dist/nodom.esm.js'
import{M1} from './m1.js'
class Main extends Module{
	//声明子模块，此处需区分大小写
	modules=[M1];
	//模板
	template(props){
		return `
			<div>
				<!--此处直接用类名使用子模块，不区分大小写-->
				<m1/>
			</div>
		`
	}
	...
}
```
#### 模板(Template)
模板在模块中用`template()`进行声明，参数为props，props为从父模块(如果该模块为子模块)对应标签传递的属性(attribute)，改写上例：

M1模块类定义
```js
export class M1 extends Module{
	template(props){
		//根据不同的type生成不同的模板串
		if(props.type===1){
			return `
				<div>
					type为1的模板
				</div>
			`
		}else{
			return `
				<div>
					type不为1的模板
				</div>
			`
		}
	}
}
```

主模块类定义
```javascript
import{Module} from '/dist/nodom.esm.js'
import{M1} from './m1.js'
class Main extends Module{
	modules=[M1];
	template(props){
		return `
			<div>
				<button e-click='changeType'>修改type</button>
				<m1 type={{mytype}}/>
			</div>
		`
	}
	data(){
		return{
			mytype:1
		}
	}
	//点击按钮修改mytype
	changeType(){
		this.model.mytype = this.model.mytype===1?0:1;
	}
}
```
模板的写法遵循两个基本原则：
1. 所有的标签都应该闭合，没有内容的标签可以写成自闭合标签；
  ```html
  <!-- 闭合标签 -->
  <div>do something</div>
  <!-- 自闭合标签 -->
  <ModuleA />
  ```
2. 所有模块的模板都应该有一个根节点。
  ```html
  <!-- 外层div作为该模块的根 -->
    <div> 
        <!-- 模板代码 -->
        template code...
    </div>
  ```

#### 模型(Model)

模型通过`data()`方法返回模块所需的数据对象，如果data方法不存在，则会创建一个空模型，在模块方法中，根模型通过`this.model`访问。  
model进行分层提取，子节点自动继承父节点model对象，x-model指令可以修改节点对应的model对象
```javascript
class Main extends Module{
	template(){
		return `
			<div p1={{data}}>
				<span>{{data}}</span>
			</div>
		`
	}
	data(){
		return{
			data:'nodom'
		}
	}
}
```
渲染后的结果为：
```html
	<div p1='nodom'>
		<span>nodom</span>
	</div>
```
可以看到div节点和span节点都使用了根model。
> 下例通过x-model修改dom节点model对象
```javascript
class Main extends Module{
	template(){
		return `
			<div>
				<div x-model='date'>{{year}}-{{month}}-{{day}}</div>
				<!-- 等价于 -->
				<div>{{date.year}}-{{date.month}}-{{date.day}}</div>
			</div>
		`
	}
	data(){
		return{
			date:{
				year:2017,
				month:11,
				day:15
			}
		}
	}
}
```
渲染后的结果为：
```html
<div>
	<div>2017-11-15</div>
	<div>2017-11-15</div>
</div>
```
通过上例可以看到，`x-model指令`设置了第一个div节点的model对象为`this.model.date`，更多详情见[指令](#指令)。

#### 方法(Method)

模块类和通常的JavaScript类一致，模块内的方法可以使用在模板中，主要用于事件和表达式，也可以像普通方法那样使用，对于所有方法，this都指向模块实例（与普通JavaScript类一致）。示例如下：
```javascript
class Module1 extends Module{
	template(){
		return `
			<div>
				<button e-click='change'>change</button>
				<div class={{genClass(type)}}>Hello {{name}}</div>
				<!-- style -->
				<style>
					.class1{
						color:red;
					}
					.class2{
						color:blue;
					}
				</style>
			</div>
		`
	}
	//定义模块需要的数据
	data(){
		return {
			name:'Nodom'
		}
	}	
	//此方法用于事件，参数无法手动传递
	//有以下四个默认参数：Model,虚拟Dom, NEvent对象,HtmlEvent对象
	change(model,dom,nevent,event){
		model.name='Nodom3';
		this.model.type = this.model.type === 1?0:1;
	}
	//此方法用于表达式，参数type可以手动传递，也可以通过this.model获取
	genClass(type){
		if(type === 1){
			return 'class1';	
		}else{
			return 'class2';
		}
	}
}
```

#### 模块事件(Module Event)
模块事件是在Module不同工作环节被调用的方法，定义方式与普通方法一致，参数为`model`，当然也可以通过this.model操作。Nodom提供的模块事件如下，注意区分大小写：
|  事件名 |  描述  | 前置事件 | 后置事件 |
| - | - | - | - |
|onInit|初始化后（constructor后，已经有model对象，但是尚未编译，只执行1次）| 无 | onCompile |
|onCompile | 模板编译后执行事件，如果模板串有改动，则会重新编译，此时已存在VirtualDom树 | onInit | onBeforeFirstRender 或 onBeforeRender |
|onBeforeFirstRender|首次渲染前执行（只执行1次）|onCompile | onRender |
|onBeforeRender|每次渲染前执行 | onBeforeRender或无 | onFirstRender或onRender |
|onFirstRender|首次渲染后执行（只执行1次），此时已有RenderedTree| onBeforeRender | onRender |
|onRender|每次渲染后执行，此时已有RenderedTree，如果为增量渲染，尚未执行Diff（新旧渲染树对比）运算 | onFirstRender或onBeforeRender | onBeforeMount |
|onBeforeMount | 挂载到document前执行 | onRender | onMount |
|onMount|挂载到document后执行  | onBeforeMount | 无 |
|onBeforeUnMount|从document脱离前执行  | 无 | onUnMount |
|onUnMount|从document脱离后执行  | onBeforeUnMount | 无 |
|onBeforeUpdate | 更新到document前，增量渲染师时有效 | onRender | onUpdate |
|onUpdate | 更新到document后，增量渲染时有效 | onBeforeUpdate | 无 |

> 其中 onInit,onBeforeFirstRender,onFirstRender只执行1次；onBeforeRender,onRender每次执行，其它事件则满足条件时执行。

示例代码如下：

```javascript
class Hello extends Module{
	template(){
		return `
			<div>
				Hello World
			</div>
		`
	}
	//模块在渲染前会在控制台输出 onBeforeRender
	onBeforeRender(model){
		console.log("onBeforeRender");
	}
	//模块在初始化后执行
	onInit(model){
		console.log("oninit");
	}
	onRender(model){

	}
	...
}
```

#### 模块状态
模块分为三个状态，包括：
| 状态名  | 描述 |
| - | - |
|INIT|已初始化|
|UNMOUNTED|未挂载到document|
|MOUNTED|挂载到document|

#### 模块注册和别名
使用`Nodom.registModule`API注册模块，注册的同时可提供别名。

```js
// 定义模块A
export class ModuleA extends Module{
   template(){
    	return `
  		<div>
  			<span>This is ModuleA</span>
  		</div>
  	`
  }
}
// 模块A注册并设置别名（别名不区分大小写）
Nodom.registModule(ModuleA,'mod-a');

class Main extends Module{
    template(){
    	return `
  		<div>
  		   <span>This is Main</span>
  			<!-- 使用模块A注册时使用的别名 -->
  			<mod-a />
			<!-- 以下两种写法效果与上面一样 -->
			<modulea />
			<ModuleA />
  		</div>
  	`
  }
}
```

### <a id='表达式'>表达式(Expression)</a>

表达式是一段可执行代码，代码以`{{}}`包裹，并可返回一个结果，如：Math.round(x),x+y*z等。其中变量由model提供，支持标准js运算符、js内置对象如：Math、Object、Date等。
#### 注意事项
1. 由于表达式的执行环境是一个沙盒，请勿在内部使用用户定义的全局变量。
2. Nodom表达式并不支持所有的**Javascript表达式**，对于某些原生函数如`Array.prototype.map()`等，这些原生函数接收一个`callback`作为回调函数，Nodom无法处理这些回调函数，因为这些回调函数的参数由内部传入。
3. 还有一些情况是函数内接收字面量形式的正则表达式时，如`String.prototype.replace()`等，Nodom会将正则表达式解析为Model内部的变量，导致这些函数执行异常。
4. 一个可行的解决方案是将这些操作使用模块方法封装，在表达式内部调用封装好的模块方法即可。
5. 一些常见非表达式写法包括：赋值，流程控制。**避免**使用它们，如：

```js
{{ let a = 1 }}
{{ if (true) { return 'HelloWorld!' } }}
```

#### 保留字
表达式提供了两个保留字：this和$model，其中：
- this: 模块实例，可以通过它访问模块所有方法、属性和模型，如：this.name,this.model.age等。
- \$model: 当前节点对应的model，如：\$model.age。

#### 表达式示例
```html
<div>
    {{20*((price+2)*discount)}}
	<div>{{year + '年' + month + '月'}}</div>
	<div>多级数据：{{ac.age.as}}</div>
	<h2>数据计算</h2>
	<div>价格：{{Math.round(price * discount) + 'hello'}}</div>
	<--需在模块中提供cacDis方法-->
	<div>折扣：{{cacDis(price*discount)}}</div>
	<--需在模块中提供addStr方法-->
	<div>描述：{{30 + addStr('hello' + desc) + 20}}</div>
	<div>随机折扣:{{(Math.random()*price).toFixed(1)}}</div>
	<--需在模块中提供genDate方法-->
	<div>当前日期是:{{genDate(date1)}}</div>
	<div>当前日期时间是:{{genDate(date1,1)}}</div>
	<div>当前时间是:{{genDate(date1,2)}}</div>
	<div x-if={{Object.keys(goods).length>0}}>商品列表存在则显示</div>
	<div>路径：{{'/'+'path'+'/'+url}}</div>
	<div>{{!true}}</div>
	<div>转换为小写字母:{{name.toLowerCase()}}</div>
	<div>转换为大写字母:{{name.toUpperCase()}}</div>
	<div>数组求和:{{sum(...arr)}}</div>
	<div>判断数组中有没有‘num’: <span x-if={{new Set(arr).has(num)}}>true</span></div>
	<div>价格求和: {{sum(1,2)+price}}</div>
	<div>{{genDate(new Date().getTime())}} 是否为工作日：<span x-if={{new Date().getDay()<6}}>true</span></div>
	<div>货币：¥{{(price*discount).toFixed(1)}}</div>
	<div x-if={{price>30 && discount !== undefined}}>是低价商品并且还有折扣</div>
	<div>计算：{{cac(1,2)+ (Math.round((price * discount))).toFixed(1) + 1}}</div>
	<div>instanceof用法:{{arr instanceof Array}}</div>
	<div>{{num+1}}</div>
	<div>三目运算：{{num>0?1:0}}</div>
	<div>对象判断：{{{x:1,yyy:2}.constructor.name === 'Object'}}</div>
	<div>数组方法：{{arr.join(',')}}</div>
	<div>使用this：{{desc + ' ' + this.state}}</div>
	<div>扩展运算-数组求和：{{sum(...arr)}}</div> 
	<div>typeof：{{typeof arr}}</div>
</div>
```
#### 表达式值

表达式都应该有一个返回值，如果表达式内的计算结果产生不可预知的错误，默认会返回空字符串，确保程序运行时不会出错。
> 如果在调试模式，出现计算异常时，会在控制台输出表达式计算异常相关信息。


### <a id='事件'>事件(NEvent)</a>

可以通过两种方式定义事件：
1. 在模板中使用`e-事件名='事件方法名'`在模板中定义；
2. 在js代码中使用`new NEvent(module,eventName,eventString|handler)`方法定义。

> 绝大部分场景，采用第1种方式定义，后续示例采用第1种方式。

示例如下：
```js
class Main extends Module{
	template(){
		return `
			<div>
				<button e-click="add">addNum</button>
				<div e-mouseenter="enter">mouseenter test</div>
			</div>
		`
	}

	add(model,dom,nevent,event){
		...
	}
	enter(model,dom,nevent,event){
		...
	}
```

#### 事件参数
在模板配置事件时，只需要事件名，而不能携带参数，Nodom会传递给事件方法4个参数，见上例中click和enter方法，参数如下：
 序号 | 说明  | 类型 
 -|-|-
 1 | 事件对象对应虚拟dom的model| Model 
 2 | 事件对象对应虚拟dom | IRenderedDom
 3 | nodom event对象| NEvent
 4 | HtmlEvent对象 | Html Event

#### 事件修饰符

在传入事件处理方法的时，允许以`:`分隔的形式传入指定事件修饰符，多个修饰符可混合使用。
事件处理支持4种修饰符：

|   名字   |    作用    |
| - | - |
|  once  |  事件只执行一次 |
| nopopo |   禁止冒泡   |
|  delg  | 事件代理到父对象 |
| capture| 使用useCapture模式 |

示例如下：
```js
class Main extends Module{
	template(){
		return `
			<div>
				<h3>只触发一次</h3>
				<button e-click="tiggerOnce:once">addNum</button>
				<div> num is:{{num}} </div>
				<h3>禁止冒泡</h3>
				<!--点击内部框时，outer不会执行 -->
				<div e-click="outer" 
					style="width:200px;height:200px;background-color: #777777;">
					<div 
						e-click="inner:nopopo" 
						style="width:100px;height:100px;background-color: #cccccc;">
					</div>
				</div>
				<h3>代理事件到父对象</h3>
				<p>代理到ul元素</p>
				<ul>
					<li x-repeat={{rows}} e-click="check:delg">{{name}}</li>
				</ul>
			</div>
		`
	}
	data(){
		return {
			num:1,
			rows:[
				{name:"name1"},
				{name:"name2"},
				{name:"name3"},
			]
		}
	}
	tiggerOnce(model){
		model.num++;
	}
	outer(model){
		console.log("outer");
	}
	inner(model){
		console.log("inner");
	}
	check(model,dom,NEvent,e){
		console.log(model,dom,NEvent,e);
	}
}
```

### <a id='指令'>指令(Directive)</a>

指令用于增强元素的表现能力，以"x-"开头，以设置元素属性(attribute)的形式来使用。指令具有优先级，数字越小，优先级越高。优先级高的指令优先执行。

#### 指令简写方式
Nodom提供了指令简写方式，可以通过自定义标签方式简写指令。将在后续每个指令单独讲解。  
自定义标签经过编译之后默认为`div标签`，若想使用其它标签，可通过tag属性指定，下面是repeat指令简写的一个示例：
```html
<!-- 未指定tag，默认为div -->
<for cond={{rows}}>
	<span>{{name}}</span>
</for>
<!-- 等价于 -->
<div x-repeat={{rows}}>
	<span>{{name}}</span>
</div>
<!-- 指定tagName为p -->
<for cond={{rows}} tag="p">
	<span>{{name}}</span>
</for>
<!--等价于 -->
<p x-repeat={{rows}}>
	<span>{{name}}</span>
</p>
```
#### 指令列表

目前NoDom支持以下几个指令:

|   指令名  | 指令优先级 |        指令描述       |
| - | - | - |
|  model |   1   |        绑定数据       |
| repeat |   2   | 按照绑定的数组数据生成多个相同节点 |
|  recur |   2   |       递归      |
|   if   |   5   |        条件判断       |
|  else  |   5   |        条件判断       |
| elseif |   5   |        条件判断       |
|  endif |   5   |        结束判断       |
|  show  |   5   |        显示/隐藏       |
|  slot  |   5   |         插槽        |
| module |   8   |        模块（表明节点为模块）       |
|  field |   10  |       双向数据绑定      |
|  route |   10  |        路由       |
| router |   10  |        路由容器       |

#### 自定义指令
除了Nodom自带的指令，用户可以通过`Nodom.createDirective()`方法创建指令，参数如下：

|  序号  | 说明 | 类型 | 备注 |
| - | - | - | - |
|  1 | 指令名 | string | 无 |
|  2 | 指令执行方法 | Function | 执行方法默认传递两个参数：1 module（dom所属模块）, 2 dom（所属渲染节点，类型IRenderedDom）。方法中的this指向指令|
|  3 | 优先级 | Number | 1-10，如果设置优先级<5，需慎重 |

指令执行方法返回true/false，当返回false时，不再进行当前节点的后续渲染，包括子节点渲染，同时该dom节点不加入到渲染树中，也就是说，不会渲染到document中，更多详情参考源码 /extend/directiveinit.ts。 

```javascript
Nodom.createDirective(
	'directive name',
	function (module: Module, dom: IRenderedDom){
		//your code
	},
	10
)
```

#### model 指令
model指令用于给view绑定数据，数据采用层级关系，如:需要使用数据项data1.data2.data3，可以直接使用data1.data2.data3，也可以分2层设置分别设置x-model='data1'，x-model='data2'，然后使用数据项data3。下面的例子中描述了x-model的几种用法。

```js
class Main extends Module{
	template(){
		return `
			<div>
				<!-- 设置div节点的model为this.model.user -->
				<div x-model="user">
					<p>{{name.firstName}} {{name.lastName}}</p>
					<!-- 设置div节点的model为this.model.user.name -->
					<div x-model="name">
					 	<p>{{firstName}} {{lastName}}</p>
					</div>
				</div>
			</div>
		`
	}
	data(){
		return {
			user: { 
				name: { firstName: 'Nodom', lastName: 'Yang' } 
			} 
		}
	}
}
```

#### repeat 指令

repeat指令为循环指令，用于渲染数组数据。

> 可通过index属性设置索引名，以便在渲染时使用索引，如`index='idx'`，模板中可直接用idx。  
> 如果数组元素不是object类型，则用`$model`放在表达式中渲染数据，此时`index`属性无效。

```js
class Main extends Module{
	template(){
		return `
			<div>
				<h3>常规用法</h3>
				<div x-repeat={{rows}}>
					name:{{name}},age:{{age}}
				</div>
				<h3>使用index属性</h3>
				<div x-repeat={{rows}} index="idx">
					index:{{idx}},name:{{name}},age:{{age}}
				</div>
				<h3>数组元素不为object时的用法-使用$model作为表达式</h3>
				<div x-repeat={{rows1}} index='idx'>
					name:{{$model}}
				</div>
			</div>	
		`
	}
	
	data(){
		return {
			rows:[
				{name:"Nodom",age:6},
				{name:"Noomi",age:4},
				{name:"Relaen",age:3},
				{name:"React",age:12},
				{name:"Vue",age:12}
			],
			rows1:['Nodom','Noomi','Relaen','React','Vue']
		}
	}
}
```
**简写方式**  
repeat指令可以用`for`标签进行简写，指令值用cond属性进行配置，改写上面的模板如下：
```js
class Main extends Module{
	template(){
		return `
			<div>
				<for cond={{rows}}>
					name:{{name}},age:{{age}}
				</for>
			</div>	
		`
	}
	...
}
```
#### recur 指令

recur指令为递归指令，用于渲染递归格式的数据类型，如树形结构，菜单结构等，模板中递归由两部分组成：
1. 递归定义，定义递归节点内容，见下例第一个带`x-recur`属性的div，定义时可以通过`name`属性设置名称，在引用时指定，默认为`default`。
2. 递归引用，引用必须包含`ref`属性，如果定义时为匿名，则ref的值为空，否则应与定义中的`name`属性保持一致，见下例第二个带`x-recur`属性的div。  
```js
class Main extends Module{
	template(){
		return `
			<div>
				<h3>匿名递归</h3>
				<!--定义recur，通过x-recur指令设置递归数据属性名，与data中数据项保持一致-->
				<div x-recur='ritem'>
					<div e-click='itemClick'>
						<span class={{cls}}>{{title}}</span>
					</div>
					<!-- 引用default -->
					<div x-recur ref/>
				</div>

				<h3>命名递归-增加name属性</h3>
				<div x-recur='ritem' name='r1'>
					<p e-click='itemClick'>
						<span class={{cls}}>{{title}}</span>
					</p>
					<!-- 引用r1 -->
					<div x-recur ref='r1'/>
				</div>

				<style>
					.cls1{
						background-color:red;
					}
					.cls2{
						background-color:green;
					}
					.cls3{
						background-color:blue;
					}
				</style>
			</div>
		`
	}
	data(){
		return {
			ritem:{
				title:"第一层",
				cls:'cls1',
				ritem:{
					title:"第二层",
					cls:"cls2",
					ritem:{
						title:"第三层",
						cls:"cls3"
					}
				}
			}
		};
	}
}
```
在实际使用中，通常数据项由数组构成，如树、菜单等，下面是数据项为数组的结构示例：

```js
class Main extends Module{
	template(){
		return `
			<div>
				<!--定义recur，并设置了name属性-->
				<recur cond='items' name='r1' class='secondct'>
					<for cond={{items}} >
						<div class='second' e-click='itemClick'>id is:{{id}}-{{title}}</div>
						<!--ref指向了recur定义的name-->
						<recur ref='r1' />
					</for>
				</recur>
				<style>
					.secondct{
						background:#ff9900;
						padding:5px 20px;
						margin:5px 0;
						border:1px solid;
					}
					.second{
						padding:5px;
						background-color:beige;
					}
				</style>
			</div>
		`
	}
	data(){
		return{
			items:[
				{
					title:'aaa',
					id:1,
					items:[{
						id:1,
						title:'aaa1',
						items:[
							{title:'aaa12',id:12},
							{title:'aaa11',id:11,items:[
								{title:'aaa111',id:111},
								{title:'aaa112',id:112}
							]},
							{title:'aaa13',id:13}
						]},{
						title:'aaa2',
						id:2,
						items:[
							{title:'aaa21',id:21,items:[
									{title:'aaa211',id:211,items:[
									{title:'aaa2111',id:111},
									{title:'aaa2112',id:112}
								]},
								{title:'aaa212',id:212},
							]},
							{title:'aaa22',id:22}
						]}
					]
				},{
					title:'bbb',
					id:2,
					items:[{
						title:'bbb1',
						id:10,
						items:[
							{title:'bbb11',id:1011},
							{title:'bbb12',id:1012}
						]},{
						title:'bbb2',
						id:20
					}]
				}
			]
		}
	}
}
```
**简写方式**

recur指令可以用`recur`标签进行简写，指令值用cond属性进行配置，从上面的例子可以看到`recur`标签的用法。

#### if/elseif/else/endif 指令

与javascript的if/else/else if逻辑一致，当if指令条件为true时，则渲染该节点。当if指令条件为false时，则进行后续的elseif指令或else指令判断，如果某个节点判断条件为true，则渲染该节点，最后通过endif指令结束上一个if条件判断。示例如下：
```js
class Main extends Module{
	template(){
		return `
			<div>
				<button e-click='change'>修改分数为90</button>
				<p x-if={{score<60}}>不及格，分数为：{{score}}</p>
				<p x-elseif={{score<70}}>及格，分数为：{{score}}</p>
				<p x-elseif={{score<80}}>中等，分数为：{{score}}</p>
				<p x-elseif={{score<90}}>良好，分数为：{{score}}</p>
				<p x-else>优秀，分数为：{{score}}</p>
				<p x-endif />
			</div>
		`
	}
	data(){
		return {
			score:75
		}
	}
	change(){
		this.model.score=90;
	}
}
```
**简写方式**  

使用对应名称的标签即可，改写上例的模板如下：
```js
class Main extends Module{
	template(){
		return `
			<div>
				<if cond={{score<60}}>不及格，分数为：{{score}}</if>
				<elseif cond={{score<70}}>及格，分数为：{{score}}</elseif>
				<elseif cond={{score<80}}>中等，分数为：{{score}}</elseif>
				<elseif cond={{score<90}}>良好，分数为：{{score}}</elseif>
				<else>优秀，分数为：{{score}}</else>
				<endif/>
			</div>
		`
	}
	...
}
```

#### show 指令

show指令用于显示或隐藏dom节点，如果指令对应的表达式返回为true，则显示该视图，否则隐藏（display='none'），示例如下：

```js
class Main extends Module{
	template(){
		return `
			<div>
				<button e-click='toggle'>{{show?'隐藏':'显示'}}</button>
				<div x-show={{show}}>价格：{{price}}</div>
			</div>
		`
	}
	data(){
		return {
			show:true,
			price:200
		}
	}
	toggle(){
		this.model.show = !this.model.show;
	}
}
```
**简写方式**

使用show标签即可，改写上例的模板如下：
```js
class Main extends Module{
	template(){
		return `
			<div>
				<show cond={{show}}>价格：{{price}}</show>
			</div>
		`
	}
	...
}
```

#### module 指令
module指令用于表示该元素是一个子模块，module指令对应的模块会被渲染至该元素所在位置。使用方式为x-module='模块类名'，子模块需要通过父模块的`modules`属性进行声明。示例如下：

modulea.js文件
```js
//需使用export
export class ModuleA extends Module{
	...
}
```
main.js 文件
```js
import {ModuleA} from './modulea.js' 
class Main extends Module{
	//声明 MmoduleA
	modules=[ModuleA]
	template(){
		<div>
			<div x-module='modulea' />
			...
		</div>
	}
	...
}
```
**简写方式**

使用module标签或module类名两种方式进行简写，改写上例的模板如下：
```js
class Main extends Module{
	<!--声明 MmoduleA-->
	modules=[ModuleA]
	template(){
		<div>
			<!--方式1，用name指定module类名，名字不区分大小写一-->
			<module name='modulea' />
			<!--方式2，直接使用模块类名，名字不区分大小写-->
			<modulea/>
			...
		</div>
	}
	...
}
```

#### field 指令

field指令用于实现input、select、textarea等输入元素与数据项之间的双向绑定。

**配置说明**

- 单选框radio：多个radio的x-field值必须设置为同一个model属性名，同时需要设置value属性，选中值为value属性对应的值。
- 复选框checkbox：除了设置x-field绑定数据项外，还需要设置yes-value和no-value两个属性，分别对应选中和未选中的值。

示例如下：

```js
class Main extends Module{
	template(){
		return `
			<div>
				<!-- 绑定name数据项 -->
				姓名：<input x-field="name" />
				<!-- radio，绑定sexy数据项 -->
				性别：<input type="radio" x-field="sexy" value="M" />男
					<input type="radio" x-field="sexy" value="F" />女
				<!-- checkbox，绑定married数据项 -->
				已婚：<input type="checkbox" x-field="married" yes-value="1" no-value="0" />
				<!-- select，绑定edu数据项，并使用x-field指令生成多个option -->
				学历：<select x-field="edu">
					<option x-repeat={{edus}} value="{{eduId}}">{{eduName}}</option>
				</select>
			</div>
		`
	}
	data(){
		return{
			name: 'nodom',
			sexy: 'F',
			married: 1,
			edu: 2,
			//下拉列表option数据
			edus: [
				{ eduId: 1, eduName: "高中" },
				{ eduId: 2, eduName: "本科" },
				{ eduId: 3, eduName: "硕士研究生" },
				{ eduId: 4, eduName: "博士研究生" },
			]
		}
	} 
}
```
#### slot 指令
slot指令为插槽指令，表示该dom节点是一个插槽，插槽作为模板暴露的外部接口，增大了模板的灵活度，更利于模块化开发。详细使用见[插槽](#插槽)。

#### route 指令
route将当前dom设定路有节点，点击dom将跳进行路由跳转。使用方式如下：
```html
<a x-route='path'>跳转到path</a>
```
可使用`route`标签进行替代，route指令的值由path代替。默认标签为`a`,如果修改，则设置`tag`属性。
改写上例代码如下：
```html
<route path='path'>跳转到path</route>
<!-- dom设置为button标签 -->
<route path='path' tag='button'>跳转到path</route>
```
`path`值为定义的路由路径，更多详情参考[路由](#路由)。

#### router 指令
router指令用于定义路由模块的容器，如果使用了`route`指令，必须在模版中使用`router`指令，示例如下：
```html
<a x-route='path'>跳转到path</a>
...
<div x-router />
```
同样，可以用`router`标签代替，修改如下：
```html
<route path='path'>跳转到path</route>
...
<router/>
```

### ajax请求
通过`Nodom.request`方法进行ajax请求，请求参数为object或string，如果为string，则直接以get方式获取参数指定的url资源，我们建议传递object，object 各项配置如下:

参数名|类型|默认值|必填|可选值|描述
-|-|-|-|-|-
url|string|无|是|无|请求url
method|string|GET|否|GET,POST,HEAD|请求类型
params|Object/FormData|{}|否|无|参数，json格式
async|bool|true|否|true,false|是否异步
timeout|number|0|否|无|请求超时时间
type|string|text|否|json,text|
withCredentials|bool|false|否|true,false|同源策略，跨域时cookie保存
header|Object|无|否|无|request header 对象
user|string|无|否|无|需要认证的请求对应的用户名
pwd|string|无|否|无|需要认证的请求对应的密码
rand|bool|无|否|无|请求随机数，设置则浏览器缓存失效

为避免重复请求，可以通过`Nodom.setRejectTime(time)`方法设置重复请求拒绝的间隔时间，单位为ms。
> 如果需要使用其它的ajax库，需重写`Nodom.request`方法，且返回类型为Promise。

## 深入

> 本章节建议先阅读完前面内容。

### 模块

#### 模块注册

Nodom为模块提供两种注册方式：

1. 模块modules数组注册

```js
// 待注册模块A
export class ModuleA extends Module{
    template(){
    	return `
			<div>this is ModuleA</div>
 		`
 	}
}
// 待注册模块B
export class ModuleB extends Module{
    template(){
		return `
			<div>this is ModuleB</div>
			`
		}
}
// 注册使用模块A，B
class Main extends Module{
    modules=[ModuleA,ModuleB]
	template(){
		return `
		<div>
			<!-- 使用模块A-->
			<ModuleA />
			<!-- 使用模块B-->
			<ModuleB />
		</div>
	 `
	 }
}

```

2. `Nodom.registModule`方法注册
  `Nodom.registModule`方法可以给待注册模块设置**别名**，在模板代码中使用模块时，既可以使用模块类名作为标签名引入，也可以使用注册的别名作为标签名引入。

```js
<!--待注册模块A -->
export class ModuleA extends Module{
    template(){
    return `
		<div>this is ModuleA</div>
 		`
 	}
}
//注册ModuleA并设置别名为 user
Nodom.registModule(ModuleA,'user');
export class Main extends Module{
    template(){
        return `
		<div>
			<user />
		</div>
		`
    }
}
```

#### 属性传递

为了加强模块之间的联系，Nodom在父子（如果为插槽，则是模板所在模块和内部模块，下同）模块之间提供props来传递数据。除根模块外，每个模块在执行template方法时，会将子模块对应的节点属性以对象的形式作为参数传入，也就是说，子模块可以在自己的template函数内，依据传入的props来**动态创建模板**。

```js
//模块A 
class ModuleA extends Module{
    template(props){
       	let str;
	   	//根据传递的name属性生成不同模板串
		if(props.name=='add'){
			return `<h1>add<h1>`
		}else{
			return `<h2>none</h2>` 
		}
    }
}
Nodom.registModule(ModuleA,'user');
// 根模块 
class Main extends Module{
    template(){
        return `
			<div>
			<!-- 传递name属性给user模块 -->
				<user name='add' />
			</div>
		`
    }
}
```

#### 模块传值

props实现了属性传递，也可以实现父模块向子模块的数据传递，但是这是被动的传递方式，需要手动进行转换，如果需要将值传递至子模块的model，可以在传递的属性名前，加上`$`前缀，Nodom会将其传入子模块的根model内，实现响应式监听。

> 注意：如果传值是一个对象，则该对象存在于两个模块内，对象内数据的改变会造成两个模块的渲染，建议传值时，尽量使用非对象数据。

```js
//模块A
class ModuleA extends Module{
    template(props){
        return `<div><h1>{{name}}<h1></div>`
    }
}
//根模块
class Main extends Module{
	modules = [ModuleA]
    template(){
        return `
      	 <div>
		 	<!-- name项将直接存放于ModuleA的model中 -->
        	<ModuleA $name={{name}} />
		</div>
    `
    }
    data(){
        return {
            name:'Nodom',
        }
    }
}
```

#### 反向传递

由于Props的存在，父模块可以暴露外部接口，将其通过Props传递给子模块，子模块调用该方法即可实现反向传递的功能。例如:

```js
//模块A
class ModuleA extends Module{
    template(props){
        this.parentChange=props.add;
        return `
			 <div>
			 	<button e-click='change'>父模块+1</button>
			 </div>
		`
    }
    change(){
        this.parentChange(1);
    }
}
Nodom.registModule(ModuleA,'user');
//根模块 
class Main extends Module{
    template(){
        return `
		<div>
			count={{sum}}
			<user add={{this.add}} />
		</div>
        `
    }
    data(){
        return {
           sum:0,
        }
    }
    //这里需要使用箭头函数，来使该函数的this始终指向根模块，或者使用bind函数绑定this指向
    add=(num)=>{
        this.model.sum++;
    }
}
```

#### 多模块数据共享

上述的值或属性传递，只能存在于父子之间，不能解决兄弟节点或不同父模块之间的传递问题，Nodom提供了`GlobalCache`来管理共享数据，实现多个模块的数据共享。

`GlobalCache`内置`get(获取)`、`set(设置)`、`remove(移除)`、`subscribe(订阅)`方法以便操作数据。

```js
import{nodom,Nodom,Module,GlobalCache} from '/dist/nodom.esm.js'
//无论数据是否存在，都可以订阅
GlobalCache.set("globalData", {
	msg: 0,
});

class ModuleA extends Module {
	template() {
		return ` 
			<div>
				<button e-click="change">change</button>
			</div>
		`;
	}
	change() {
		let data = GlobalCache.get("globalData");
		if(!data){
			data = {msg:0}
		}else{
			data.msg++;
		}
		GlobalCache.set("globalData",data);
	}
}

class ModuleB extends Module {
	template() {
		return ` 
			<div>
				moduleb global data is:{{msg}}
			</div>
		`;
	}
	onInit(model) {
		//订阅数据
		GlobalCache.subscribe(this, "globalData", (val) => {
			model.msg = val.msg;
		});
	}
}

class Main extends Module {
	modules = [ModuleA,ModuleB];
	template() {
		return `
			<div>
				main global data is:{{msg}}
				<ModuleA />
				<ModuleB />
			</div>
		`;
	}
	onInit(model) {
		//订阅数据
		GlobalCache.subscribe(this, "globalData", (val) => {
			model.msg = val.msg;
		});
	}
}
```

也可使用第三方**数据发布-订阅**库。
在开发大型项目时，可以使用数据管理库帮助我们管理数据，使数据以可预测的方式发生变化，我们推荐使用Nodom团队开发的**kayaks**库，或者其他优秀的数据管理库均可。

### <a id='插槽'>插槽</a>

在实际开发中，插槽功能会较大程度的降低应用开发难度，插槽作为模板暴露的外部接口，增大了模板的灵活度，更利于模块化开发。Nodom以指令和自定义元素的方式实现插槽功能。

```html
<!--自定义元素的方式使用插槽，命名插槽 -->
<slot name='title'>
    ...
</slot>
<!-- 指令的形式使用插槽，命名插槽-->
<div x-slot='title'>
	...
</div>
<!-- 匿名插槽-->
<slot>
	...
</slot>
```

#### innerRender
插槽内的节点渲染时的默认数据来源于所属模板的模块的model，而某些时候，需要用子模块内部的数据进行渲染，Nodom提供innerRender属性支持。
> 注意：添加innerRender后，插槽内元素表达式依赖的数据项、方法，定义的事件方法都来源于子模块，否则都来源于模板所在模块。

下面的例子中，渲染数据name来源于模块Main。
```js
class ModuleA extends Module{
    template(props){
		 return `
			<div>
				<slot/>
			</div>	
		`
    }
}
class Main extends Module{
	template(props){
		return `
			<div>
				<modulea>
					<!--name来源于Main-->
					<span>my name is : {{name}}</span>
				</modulea>
			</div>	
		`
    }
}	
```
下面的例子中，渲染数据name来源于模块ModuleA。
```js
class ModuleA extends Module{
    template(props){
		 return `
			<div>
				<!--增加innerRender设置-->
				<slot innerRender/>
			</div>	
		`
    }
}
class Main extends Module{
	template(props){
		return `
			<div>
				<modulea>
					<!--name来源于ModuleA-->
					<span>my name is : {{name}}</span>
				</modulea>
			</div>	
		`
    }
}	
```

#### 匿名插槽

如果子模块内`slot`标签无`name`属性，则模块(如下面的`modulea`)标签内的元素会替换子模块的`slot`标签。

```js
//模块A 
class ModuleA extends Module{
      template(props){
		 return `
			<div>
				<!--slot标签会被Main模块modulea标签内的内容代替-->
				<slot>
					我是默认内容
				</slot>
			</div>	
		`
    }
}
<!-- 根模块  User标签内的所有内容作为待插入的内容-->
class Main extends Module{
	modules=[ModuleA];
    template(){
        return `
			<div>
  				<modulea>
					<!--下面的p和button标签会替换ModuleA的slot标签-->
					<p>我是父模块的P标签</p>
					<button>我是父模块</button>
				 </modulea>
			</div>
		`
    }
}
```

#### 命名插槽

在实际使用中，可能需要多个插槽，就需要使用命名插槽，通过插槽的`name`属性设置插槽名字。命名插槽就是给插槽定义插槽名，传入的标签需要与插槽名一致才可发生替换。

```js
//模块A
class ModuleA extends Module{
    template(props){
		return `
			<div>
				<slot name='title'>
					我是title
				</slot>
				<slot name='footer'>
					我是footer
				</slot>
			</div>
		`
    }
}
// 根模块  modulea标签内的slot标签内容作为待插入的内容
class Main extends Module{
	modules=[ModuleA];
    template(){
        return `
		<div>
 		 	<modulea>
				<slot name='title'>
					<!--替换ModuleA<slot name='title'>标签-->
					<button>我是父模块的title</button>
				<slot>
				<slot name='footer'>
					<!--替换ModuleA<slot name='name'>标签-->
					<button>我是父模块的footer</button>
				<slot>
 			</modulea>
		</div>	
`
    }
}
```
> 详细使用见`examples/slot.html`。

### 模型(Model)

`Model`作为模块数据的提供者，绑定到模块的数据模型都由`Model`管理。`Model`是一个由`Proxy`代理的对象，`Model`的数据来源有两个：

- 模块实例的`data()`函数返回的对象;
- 父模块通过`$data`方式传入的值。

每一个模块都有独立的`Model`，使用方式如下：

```js
class ModuleA extends Module{
    template(props){
        return `<div>{{name}}</div>`;
    }
}
//根模块
class Main extends Module{
	modules=[ModuleA];
    template(){
        return `
		<div>
        	<ModuleA $name={{name}}/>
		</div>`
		;
    }
    data(){
        return {
            name:'Nodom'
        }
    }
}
```

`Model`会深层代理内部的`object`类型数据。`Model`分层结构与所代理的数据对象结构一样，即父Model和子孙Model的关系。

基于`Proxy`，Nodom可以实现数据劫持和数据监听，来做到数据改变时候的响应式更新渲染。

> 关于`Proxy`的详细信息请参照[Proxy-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。

在使用的时，可以直接把`Model`当作对象来操作：

```js
class Main extends Module{
	template(){
		return `
		<div>
			{{count}}
			<button e-click="changeCount">click</button>
		</div>
		`
	}
	// 模块的数据来源
	data(){
		return {
			title:'Hello',
			count:0
		}
	}
	changeCount(model){
		model.count++;
	}
}
```

#### 保留属性

**Model提供了4个保留属性，用户在定义数据项时应避免。**

数据项 | 说明 | 类型 | 备注
 -|-|-|- 
__source| 源数据对象 | object| 通过此属性可以获取被代理的数据对象
__key| model key(全局唯一) | number | -
__module| 所属模块 | Module | -
__parent| 父Model | Model | 可通过此属性获取祖先model
__name|在父模型中的属性名 | string | -

#### Model与模块渲染

每个`Model`存有一个模块列表，当`Model`内部的数据变化时，会引起该`Model`的模块列表中所有模块的渲染。一个`Model`的模块列表中默认只有初始化该`Model`的模块，当存在slot或模块传值为对象时，将会导致Model绑定到多个模块，当然也可以通过`ModelManager的bindToModule`方法绑定。

#### set方法
在module中提供了一个`set()`方法，该方法可以往`model`上设置一个深层次的对象或值。当model缺省，则表示模块根model。
##### 参数说明
序号|说明 |类型
-|-|-
1|模型 | Model
2|属性名| string 
3|属性值 | any 
> 如果第一个参数为属性名，则第二个参数为属性值，默认model为根模型
```js
data(){
	return {
		data:{
			a:1,
			b:'b'
		}
	}
}
change(model){
	// 会报错，因为data1为undefined
	model.data1.data2.data3 = { a:'a' };
	// 使用$set可以避免该问题，如果不存在这么深层次的对象$set会帮你创建。
	this.set("data1.data2.data3",{a:'a'});
}
```

#### get方法
Module中提供了一个`get()`方法，可以从`Model`上获取一个深层次的对象值，当不知道对象具体层次时有效。
##### 参数说明
model: Model, key: string, value:any
序号| 说明|类型
-|-|-
1 | model | Model
2 | 属性名 | string
> 如果第一个参数为属性名，则默认model为根模型
```js
data(){
	return {
		data:{
			a:1,
			b:'b'
		}
	}
}

getValue(){
	// 等同于 this.model.data.a
	console.log(this.get("data.a"));
}
``` 

#### watch方法
module的`watch`方法用来检测`Model`里的数据变化，当数据变化时执行配置的钩子函数。 

##### 参数说明
model: Model, key: string|string[], operate: Function,module?:Module,deep?:boolean
参数名|类型|参数说明
-|-|-
model | Model | 监听对象，如果省略，则表示module的根model
key | string或string[] | 监听属性
operate | Function | 监听触发方法，默认参数为(model,key,oldValue,newValue)，其中model为被监听的model，key为监听的键，oldValue为旧值，newValue为新值
deep | boolean | 如果设置为true，当key对应项为对象时，对象的所有属性、子孙对象所有属性都会watch，慎重使用该参数，避免watch过多造成性能损失。

##### 取消watch
watch 方法会返回一个函数，当不需要watch时，执行该函数即可取消watch。

##### 示例
详细使用请参考 examples/model.html。

```js
class Main extends Module{
	template(){
		return `
			<div>
				<button e-click='change'>change</button>
				<button e-click='watch'>watch</button>
				<button e-click='cancelWatch'>cancel watch</button>
				<div>{{count}}</div>
			</div>
		`
	}
	data(){
		return {
			count:1,
			user:{
				name:{
					first:'nodom',
					last:'noomi'
				}
			},
			hobbies:[{name:'健身'},{name:'游戏'}]
		}
	}
	//激活watch，通常情况下，我们把watch放置在onBeforeFirstRender事件中
	watch(model){
		//当被监听的model为根model时，可以省略
		this.watcher = this.watch('count',(model,key,oldVal,newVal)=>{
			console.log('检测到数据变化');
			console.log('oldVal：',oldVal);
			console.log('newVal：',newVal);
		})
		//等价于
		// this.watcher = this.watch(this.model,'count',(m,key,oldVal,newVal)=>{
		// 	console.log('检测到数据变化');
		// 	console.log('oldVal：',oldVal);
		// 	console.log('newVal：',newVal);
		// })
		//watch多个，并设置deep为true
		this.watch(['user.name','hobbies'],(model,key,oldVal,newVal)=>{
			console.log(model,key,oldVal,newVal);
		},true);
	}
	//修改数据
	change(){
		this.model.count++;
		this.model.hobbies[1].name='旅游';
		this.model.user.name.last = 'relaen';
	}
	//取消监听
	cancelWatch(){
		//cancel count数据项的watch
		this.watcher();
	}
}
```

### 编译
当首次渲染或`tempate()`返回的模板串发生改变时，会触发模板重新编译，所以在构造模板串时，尽量避免用可变的props值或model项来构造，而是采用指令、表达式或插槽的方式来保持渲染的动态性。

下面的模板是不建议的
```js
//子模块 ModuleA
template(props){
	return `
		<div>
			<div class='${props.type===1?'clsa':'clsb'}>
				hello world
			</div>
		</div>
	`
}

//父模块 Main
template(props){
	return `
		<div>
			<modulea type={{type}}/>
		</div>
	`
}
```
当模块Main的数据type发生改变时，会导致ModuleA重新编译，改进方式如下：

```js
//子模块 ModuleA
template(props){
	return `
		<div>
			<!--通过表达式获取-->
			<div class={{genClass(type)}}>
				hello world
			</div>
		</div>
	`
}

genClass(type){
	return type===1?'clsa':'clsb';
}

//父模块 Main
template(props){
	return `
		<div>
			<!--通过数据传递-->
			<modulea $type={{type}}/>
		</div>
	`
}
```
当模块Main的type发生改变时，ModuleA会渲染，但不会重新编译。

### 渲染
#### 渲染时机
Nodom的渲染是基于数据驱动的，也就是说只有Model内的数据发生了改变，当前模块才会进行重新渲染的操作。  
子模块渲染依赖：
1. Model数据改变；
2. 父模块传属性(props)发生改变；
3. 父模块传值发生改变。
#### 手动触发
如果需要手动渲染，则需调用`module.active()`进行触发。

### CSS支持

​	Nodom对CSS提供额外的支持。在模板中使用`<style></style>` 标签中直接写入CSS样式，示例代码如下：

```js
class Module1 extends Module {
    template() {
        return `
			<div>
				<h1 class="test">Hello nodom!</h1>
				<style>
					.test {
						color: red;
					}
				</style>
			</div>`;
       }
}
```

在模板代码中的 `<style></style>` 标签中通过表达式调用函数返回CSS样式代码串，示例代码如下：

```js
class Module1 extends Module {
     template() {
         return `
			<div>
                <h1 class="test">Hello nodom!</h1>
                <style>{{css()}}</style>
            </div>`;
     }
     css() {
         return `
			.test {
				color: red;
			}`;
     }
}
```

在模板代码中的 `<style></style>` 标签中通过@import url('CSS url路径')引入CSS样式文件，示例代码如下：

```js
template() {
	return `
		<div>
			<h1 class="test">Hello nodom!</h1>
			<style>
				@import url('./style.css')
			</style>
		</div>
	`;
}
```

对模板代码中需要样式的节点直接写行内样式，示例代码如下：

```js
template() {
	return `
		<div>
			<h1 style="color: red;" class="test">Hello nodom!</h1>
		</div>
	`;
}
```

**scope属性**

​	给节点添加该属性后，Nodom会自动在CSS选择器前加前置名。使CSS样式的作用域限定在当前模块及其子模块，不会污染其它模块。

​	示例代码如下：

```js
 template() {
	return  `
		<div>
			<h1 class="test">Hello nodom!</h1>
			<style scope="this">
				.test {
					color: red;
				}`;
			</style>
		</div>
	`;
 }
```
此例中， `.test` css class只对当前模块及其子模块有效。

### 自定义元素

自定义元素需要继承`DefineElement`类，且需要在`DefineElementManager`中注册。

```js
// 定义自定义元素
class MYELEMENT extends DefineElement{
	/**
	 * @param node 		VirtualDom
	 * @param module	所属模块
	 */ 
	constructor(node,module){
        super(node,module);
        
		......
    }
}
	
// 注册自定义元素
DefineElementManager.add(MYELEMENT);

```
更多使用参考`/extend/elementinit.ts`文件。

### <a id='路由'>路由</a>

Nodom内置了路由功能，可以配合构建单页应用，用于模块间的切换。

#### <a id='路由初始话'>路由初始话</a>
如果需要使用路由，则需要在创建路由前引入路由模块，引入方式使用`Nodom.use()`方法。引入路由初始化参数如下：
|序号|说明|类型|备注|
| - | - | - | - |
| 1 | 路由基础路径 | String | 可选，如果配置此项，则浏览器显示的路径以此路径开始|
| 2 | 路由进入方法 | Function | 可选，每个路由进入时都将执行此方法，传递参数为 1:module，2:进入时路径 |
| 3 | 路由离开时方法 | Function | 可选，每个路由离开时都将执行此方法，传递参数同上 |
初始化示例如下：
```js
//启用路由
import {Nodom,Router} from '/dist/nodom.esm.js'
Nodom.use(Router,['/router',function(mdl,path){
    console.log('enter',mdl,path)
},function(mdl,path){
    console.log('leave',mdl,path)
}]);
```
初始化后，可以在任意模块中使用 `Nodom['$Router']`访问路由对象。
#### 创建路由
Nodom提供`Nodom.createRoute`方法，用于注册路由。以`Object`配置的形式指定路由的路径、对应的模块、子路由等。
以下是一个简单的路由示例：

1. 主模块
```js
class Main extends Module{
	template(){
		return `
			<div>
				<!-- 点击触发路由跳转-->
				<div x-route='/hello'>hello</div>
				<!-- 指定路由模块渲染的位置-->
				<div x-router />
			</div>
		`
	}
}
```
2. 创建路由
```js
import {Nodom} from '/dist/nodom.esm.js';
//这里默认Hello为一个完整的模块
import Hello from'./route/hello.js';
//创建路由
Nodom.createRoute({
    path:'/hello',
    //指定路由对应的模块
    module:Hello
});
```
当点击hello时，浏览器路径会跳转到 `/hello`，router指令处会显示为Hello模块的内容。

上述方式会导致模块提前加载，nodom提供了通过模块路径实现懒加载，修改上例代码如下：
```js
Nodom.createRoute({
    path:'/hello',
    // 此处设置模块路径，当执行路由时再加载Hello模块
    module:'./route/hello.js'
});
```

#### 注意事项
1. 一个模板中，只能有一个节点带`router`指令。
2. 实现多级路由，需要在不同模块的模板中配置`router`指令。

#### 嵌套路由

在实际应用中，通常由多层嵌套的模块组合而成。配置对象内`routes`属性，以数组的方式注册子路由。例如：

```js
import {Nodom} from '/dist/nodom.esm.js';
import {Main} from './route/main.js';
Nodom.createRoute({
    path:'/main',
    //指定路由对应的模块
    module:Main，
    routes:[
    {
     	path:'/m1',
    	//指定路由对应的模块
    	module:'./route/m1.js' 
	},{
     	path:'/m2',
    	//指定路由对应的模块
    	module:'./route/m2.js'
	}]
});
```
当访问`/main/r1`时，先加载Main模块，再加载M1模块。

#### 路由跳转

借助`x-route`指令，用户无需手动控制路由跳转。但在一些情况下，需要手动控制路由跳转，跳转方式为：
`js
//path为需要跳转的路径
Nodom['$Router'].go(path);
`

#### 路由传值

如果想要实现路由传值，只需在路径内以`:params`配置。例如：

```js
import {createRoute} from './nodom.esm.js';
//这里默认Hello为一个完整的模块
import Hello from'./route/hello.js';
//创建路由
createRoute({
    path:'/main/:id',
    //指定路由对应的模块
    module:Hello
});
```

Nodom将通过路由传的值放入模块根Model的`$route`中。

路由模块中可以通过`$route.data`获取path传入的值。

```html
<!--跳转模块 -->
<div>
<div x-route='/main/1'>跳转至模块Hello</div>
    <div x-router></div>
</div>
<!-- 路由模块Hello-->
<div>
    <!-- 值为1-->
   {{$route.data.id}} 
</div>

```

#### 路由事件

##### 单路由事件

每个路由可设置：
- `onEnter`事件，在路由进入时执行
- `onLeave`事件，在路由离开时执行

执行时传入参数：
- module（路由绑定的模块）
- 当前路径

如：从/r1/r2/r3 切换到 /r1/r4/r5。
则`onLeave`响应顺序为r3 `onLeave`、r2 `onLeave`。
`onEnter`事件则从上往下执行执行顺序为 r4 `onEnter`、 r5 `onEnter`。

例如：

```js
import {Nodom} from '/dist/nodom.esm.js';
//这里默认Hello为一个完整的模块
import Hello from'./route/hello.js';
//创建路由
createRoute({
    path:'/main',
    module:Hello,
    onLeave:function(module,path){
        console.log('我执行了onleave函数');
    },
    onEnter:function(module,path){
         console.log('我执行了onEnter函数');
    }
});
```

##### 全局路由事件
通过路由初始化时设置，见[路由初始化](#路由初始化)，全局事件针对所有路由有效。

#### 浏览器刷新

浏览器刷新时，会从服务器请求资源，nodom路由在服务器没有匹配的资源，则会返回404。通常的做法是: 在服务器拦截资源请求，如果确认为路由，则做特殊处理。
假设主应用所在页面是/web/index.html，当前路由对应路径为/webroute/member/center。刷新时会自动跳转到/member/center路由。相应浏览器和服务器代码如下：

##### 浏览器代码

```js
import {Nodom,Module} from './nodom.esm.js';

class Main extends Module{
    ...
    //在根模块中增加onFirstRender事件代码
    onFirstRender:function(module){
        let path;
        if(location.hash){
            path = location.hash.substr(1);
        }
        //默认home ，如果存在hash值，则把hash值作为路由进行跳转，否则跳转到默认路由
        path ||= '/home';
       	Nodom['$Router'].go(path);
   	}
	...
}
```

##### 服务器代码

服务器代码为[noomi框架](http://www.nodom.cn/webroute/tutorial/www.noomi.cn)示例代码，其它如java、express做法相似。
如果Nodom路由以'/webroute'开头，服务器拦截到请求后，分析资源路径开始地址是否以'/webroute/'开头，如果是，则表示是nodom路由，直接执行重定向到应用首页，hash值设定为路由路径(去掉‘/webroute’)。

```js
@Instance({
    name:'routeFilter'
})
class RouteFilter{
    @WebFilter('/*',2)
    do(request:HttpRequest,response:HttpResponse){
        const url = require("url");
        let path = url.parse(request.url).pathname;
        //拦截资源
        if(path.startsWith('/webroute/')){
			//去掉/webrouter
            response.redirect('/web/index.html#' + path.substr(9));
            return false;
        }
        return true;
    }
}
export{RouteFilter};
```
页面路由初始化代码如下：
```js
//设置路由基础路径为`/webroute`，此处的onEnber和onLeave可选填
Nodom.use(Router,['/webroute',onEnter,onLeave]);
```
更多示例参考/examples/route.html,/exampls/modules/route目录

## 生态

### NodomUI 
nodomui npm库，快速搭建应用，http://www.npmjs.com/package/nodomui。

#### Kayaks
数据管理库，用于开发大型项目。

#### Nodom VsCode插件
提供模板代码高亮功能，以及其他多种辅助功能。
