nodom是一款基于数据驱动的web mvvm框架。用于搭建单页应用(SPA)。  

## 源码
1. gitee:  https://gitee.com/weblabsw/nodom  
2. github: https://github.com/nodomjs/nodom

## 目录结构
1. 核心库目录：./core  
2. 扩展目录：./extend
3. 示例目录：./examples
4. 发布目录：./dist  

## 示例运行方式
以vscode为例，使用Live Server插件启动在./examples目录下的html文件即可  

## 编译
安装依赖包后，执行“npm run build”，编译结果在“./dist”目录中。  
结果文件包括：
1. nodom.esm.js: es module方式，examples所有代码采用该方式；
2. nodom.global.js: 采用script src引入时使用。

## 在线体验Nodom

你可以在[CodePen](https://codepen.io/pen/?template=wvqPeJQ)平台在线体验Nodom。

### CDN

对于CDN引入的方式，可以这样引入：

```html
<script src="https://unpkg.com/nodom3"></script>
```

以确保使用最新版本。

### 下载引入

在生产环境下，建议引入完整的**nodom.js**文件，Nodom建议使用ES Module实现模块化，无需构建工具即可完成模块化开发，引入方式如下：

```html
<script type="module">
    import{nodom,Module} from '../dist/nodom.esm.js'
	class Module1 extends Module{
		template(){
			return `
				<div>
					{{msg}}
				</div>
			`
		}
		data(){
			return {
				msg:'Hello World'
			}
		}
	}
	nodom(Module1,'div');
</script>
```

## 基础

### 起步

Nodom是一款基于数据驱动，用于构建用户界面的前端`MVVM`模式框架。内置路由，提供数据管理功能，支持模块化开发。在不使用第三方工具的情况下可独立开发完整的单页应用。

<!--假设你已经掌握一定的Html，Css,JavaScript基础，如果没有，那么阅读文档将会有些困难。-->

一个简单的Hello World例子如下：
```js
<script type='module'>
	import{nodom,Module} from '../dist/nodom.esm.js'
	class HelloWorld extends Module {
		template() {
			return `
				<div>
					Hello World!
				</div>
			`;
	}
	}
	nodom(HelloWorld, "div");
</script>
```
> @code:base_Start

#### 引入方式

Nodom支持以普通JavaScript文件的形式引入至HTML文件，比如：

```html
<script src="./nodom.global.js"></script>
```

但是我们建议以ES Module的形式引入script文件，利于模块化开发。与普通的script文件引入不同的是，ES Module的引入在标签内需要配置**type="module"**浏览器才能识别。比如：

```html
<script type='module'>
	import{nodom,Module} from 'your path/nodom.esm.js'
</script>
```

#### 渲染元素

Nodom支持渐进式开发，框架内部会将传入的容器作为框架处理的入口。所以，传入你的元素选择器作为渲染的容器，将该容器完全交给Nodom托管。

例如有一节点：

```html
<div id="app">   
</div>
```

我们将其称为根节点，如果需要将一个Nodom模块渲染到根节点，只需要编写元素选择器，依序传入`nodom(module:Module,selector:string)`方法内，该方法接收两个参数:第一个参数为需要渲染的模块类，第二个参数为容器对应的元素选择器。

```js
nodom(HelloWorld, "#app");
```

Nodom会将传入模块渲染至传入的选择器。

### 模块基础

Nodom以模块为单位进行应用构建，一个应用由单个或多个模块组成。

#### 模块定义

模块定义需要继承Nodom提供的模块基类`Module`。

```javascript
class Module1 extends Module{
	//your code
}
```

##### 模版
定义模块时，为提升模块重用性，通过`template()`方法返回字符串形式（建议使用模板字符串）的模板代码，作为模块的视图描述。

```javascript
template(){
	return `
		<div>
			Hello,Nodom
		</div>
	`;
}
```

##### 模型
通过`data()`方法返回模块所需的数据对象，Nodom再对其做响应式处理，响应式处理后的数据对象，Nodom称为`Model`对象，并存储在模块实例中。

```javascript
data(){
	return {
		name:'nodom'
	}
}	
```

> 为了描述方便，随后的章节中，我们将响应式处理后的对象称为`Model`。一个`Model`中还可能包含其它`Model`对象。`Model`实际是对原始数据对象进行代理拦截的`Proxy`对象。
>

##### 方法
可以在模块中定义方法，用于逻辑处理。

> 应用于事件的方法
模板中的事件定义，通常以模块方法名传入（参考event），默认参数依次为：`Model`,`事件触发的虚拟Dom`,`Nodom封装事件NEvent`,`原生事件对象Event`。  
this 指向模块实例。

```javascript
change(model,Vdom,Nevent,event){
   model.name='nodom3';
}   
```

示例代码如下：

```javascript
		class Module1 extends Module{
            //Nodom会将模板代码编译成虚拟 DOM树 ，再渲染至真实DOM上
			template(){
				return `
                    <div>
					    <span class='name'>Hello,{{ name}}</span>
					    <button e-click='change'>change</button>
                    </div>
				`
			}
            //定义模块需要的数据
			data(){
				return {
					name:'nodom',
				}
			}	
            //自定义模块方法,有以下四个参数：Model,虚拟Dom,Nodom封装事件，原生事件
			change(model,Vdom,Nevent,event){
				model.name='nodom3';
			}    
		}
	
	nodom(Module1,"#app");
```

#### 模块事件

开发者可以在模块定义时提供一些特殊的方法（这些方法Nodom在执行时会传入一个参数：模块实例的根`Model`。`this`指向为模块实例），模块在特定的时刻Nodom就会去执行这些方法，下表包含所有的生命周期钩子函数：

|            事件名            |       描述       |   参数  | this指向 |
| :-----------------------: | :------------: | :---: | :----: |
|onBeforeRender|渲染前执行事件| 模块model | 当前模块实例 |
|onBeforeFirstRender|首次渲染前执行事件(只执行1次)   | 模块model | 当前模块实例 |
|onFirstRender|执行首次渲染后事件（只执行1次）   | 模块model | 当前模块实例 |
|onRender|执行每次渲染后事件   | 模块model | 当前模块实例 |
|onMount|挂载到html dom后执行事件  | 模块model | 当前模块实例 |
|unUnmount | 从html卸载后执行事件 | 模块model | 当前模块实例 |
|onCompile | 编译后执行事件 | 模块model | 当前模块实例 |

具体用法如下：

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
            //模块在首次渲染前会在控制台输出 onBeforeFirstRender
            onBeforeFirstRender(model){
                console.log("onBeforeFirstRender");
            }
		}
    	nodom(Hello,'div');
```

> @code:base_Modulebase_ModuleLifeCycle

#### 生命周期图示

![Life cycle of Nodom][Life cycle of Nodom ]

### 模板语法

Nodom采用基于HTML的模板语法。

#### 基础写法

模板的写法遵循两个基本的原则：

- 所有的标签都应该闭合，没有内容的标签可以写成自闭合标签；
  ```html
  <!-- 闭合标签 -->
  <div>Something</div>
  <!-- 自闭合标签 -->
  <ModuleA />
  ```
- 所有模块的模板都应该有一个根节点。
  ```html
  <!-- 外层div作为该模块的根 -->
    <div> 
        <!-- 模板代码 -->
        template code...
    </div>
  ```

Nodom支持原生的HTML语法，如：

```html
<span>hello</span>

<div class="cls1 cls2"> 
    <p> Something </p> 
</div>

......
```

在原生HTML语法的基础上，Nodom扩展了模块，表达式，事件，指令等语法。

#### 模块写法

在模板里使用之前已经定义好的模块是一个常见的需求，在模板中有两种方式使用已经定义好的模块:

- 使用modules属性注册模块，然后直接使用模块的类名；

  ```js
  class Main extends Module{
      template(){
      	return `
    	<div>
    		<span>This is Main</span>
    		<!-- 直接使用类名引入子模块 -->
    		  <ModuleA />
    	</div>
    	`
      }
    	// 使用modules注册子模块
      modules = [ModuleA];
  }
  
  // 定义模块A
  class ModuleA extends Module{
  	template(){
      	return `
    	<div>
    		<span>This is ModuleA</span>
    	</div>
    	`
      }
  }
  
  ```

nodom(Main,"#app");

````

> @code:Base_TemplateSyntax_ModuleOfWriting

- 使用`registModule`API注册模块，并且使用`registModule`注册模块时的提供的别名。

```js
class Main extends Module{
      template(){
    	return `
  		<div>
  		   <span>This is Main</span>
  		<!-- 使用模块A注册时使用的别名 -->
  			<mod-a />
  		</div>
  	`
  }
}

// 定义模块A
class ModuleA extends Module{
   template(){
    	return `
  		<div>
  			<span>This is ModuleA</span>
  		</div>
  	`
  }
}
// 模块A注册
registModule(ModuleA,'mod-a');

nodom(Main,"#app");

````

两种写法的效果完全一样。

#### 表达式写法

表达式是实现数据绑定的方式之一。

如在构建用户欢迎界面的案例中：

```js
......
class Hello extends Module{
	template(){
		return `
			<div>
				<h1>Hello,Bob!</h1>
			</div>
		`
	}
}

nodom(Hello,'#app');
```

页面会显示用户Bob的的欢迎信息`Hello，Bob！`，但这样的页面不能针对不同的用户进行欢迎界面的展示，所有的用户都只会显示`Hello,Bob!`，使得模块`Hello`的重用度很低，为了提高这个模块的重用度，我们可以使用**表达式**来重构上面的代码。
重构后的代码如下：

```js
class Hello extends Module{
	template(){
		return `
			<div>
				<h1>Hello,{{userName}}!</h1>
			</div>
		`
	}
	
	data(){
		return {
			userName:'Bob'
		}
	}
}

nodom(Hello,'#app');
```

对比重构之前的代码，可以看到在模板中使用了`{{ userName }}`来代替直接书写用户名`Bob`，并且将`Bob`作为响应式数据`userName`的值传入模块中。这样当用户切换时，只需改变`userName`的值Nodom就会自动更新界面，从而做到展示不同用户的欢迎界面，使得该模块的重用度提高。

在模板代码中使用双大括号`{{}}`包裹响应式数据的模板写法就称为**表达式**，使用模板表达式可以使得模板代码更加简洁，灵活且强大。

关于表达式的详细信息可以阅读本章的[表达式](#表达式)章节。

> 默认标签的属性值需要使用引号包裹（单引号`'`或者双引号`"`均可），但如果将表达式作为属性值，可以不写引号。
> 如：`<div class="cls1 cls2" name={{userName}}></div>`

#### 指令写法

Nodom的指令以`x-`开头，指令用来增强模板代码的功能，比如，`x-show`指令用于控制一个元素是否渲染。

```js
class Main extends Module{
	template(){
		return `
			<div>
				<p>Click the button to switch display and hide</p>
				<button e-click='switchShow'>switchShow</button>
				<p x-show={{ isShow }}> Hello,nodom!</p>
			</div>
		`
	}
	
	data(){
		return {
			isShow:true,
		}
	}
	
	switchShow(model){
            model.isShow = !model.isShow
	}
}
nodom(Main,'#app');
```

`x-show`指令接收`true`或者`false`，可以使用表达式为其传值，如果表达式的值为`true`，则会渲染该元素，如果为`false`则不会渲染该元素。

关于指令的详细信息可以阅读本章的[指令](#指令(Directive))章节。

#### 事件写法

Nodom的事件命名为`e-`+`原生事件名`，例如：

```html
<!-- click事件 在nodom中的写法为e-click -->
<button e-click="confirm">确定</button>
```

事件接收一个模块实例上的方法名，当事件触发时，Nodom会执行该方法。

关于事件绑定的详细信息可以阅读本章的[事件绑定](#事件绑定)章节。

### 表达式

> 为描述方便,接下来将模块实例中对data函数返回的数据对象做响应式处理后的对象，称为Model，
> 也就是说data函数返回的数据会存在于Model内。

在Nodom中，与视图进行数据绑定的最常用形式就是使用双大括号`{{}}`。Nodom将其称为**表达式**，灵感追溯至Mustache库，用来与对应模块实例的Model内的属性值进行替换。比如：

```js
class Main extends Module{
	template(){
		return `
		<div>{{msg}}，I'm Coming</div>
		`
	}
	
	data(){
		return {
			msg:'HelloWorld'
		}
	}
}

nodom(Main,"#app");
```

最终在页面上会变为：

```html
HelloWorld,I'm Coming
```

不仅如此，Nodom的**表达式**对原生的JavaScript表达式实现了支持。所以确保双大括号内传入的是**单个JavaScript表达式**。也就是其需要返回一个计算结果。

```js
class Main extends Module{
	template(){
		return `
			<div>
				<p>表达式取响应式数据：</p>
				<p>userName is : {{user.userName}}</p>
				<p>三目运算符：</p>
				<p>
				Is the age older than 15 years old? : {{user.userAge > 15 ? true : false}}
				</p>
				<p>一些原生函数：</p>
				<p>
				userName toUpperCase : {{user.userName.toUpperCase()}}
				</p>
			</div>
		`
	}
	
	data(){
		return {
			user:{
				userName:'Jack',
				age:18
			}
		}
	}
}

nodom(Main,"#app");
```

在表达式内，JavaScript常见的内置对象是可用的，比如：Math、Object、Date等。由于表达式的执行环境是一个沙盒，请勿在内部使用用户定义的全局变量。

> Nodom表达式并不支持所有的**Javascript表达式**，对于某些原生函数
> 如`Array.prototype.map()`等，这些原生函数接收一个`callback`作为回调函数，Nodom无法处理这些回调函数，因为这些回调函数的参数由内部传入。
> 还有一些情况是函数内接收字面量形式的正则表达式时，如`String.prototype.replace()`等，Nodom会将正则表达式解析为Model内部的变量，导致这些函数执行异常。
>
> 一个可行的解决方案是将这些操作使用函数封装，在表达式内部调用封装好的函数即可。如下代码所示：

```js
class Main extends Module{
		template() {
		return `
			<div>
			   <div x-repeat={{ getRows(rows) }}>
				 name is : {{name}}
			   </div>

				<span>{{ handleStr(str) }}</span>
			</div>
				`;
	}

	getRows(rows) {
		return rows.map((item) => {
			item.name = "name" + item.id;
			return item;
		});
	}

	handleStr(str) {
		return str.replace(/str/, "nodom");
	}

	//定义模块需要的数据
	data() {
		return {
			str: "this is str",
			rows: [
				{
					id: 1,
				},
				{
					id: 2,
				},
			],
		};
	}
}
nodom(Main,'#app');
```

一些常见非表达式写法包括：赋值，流程控制。**避免**使用他们：

```js
{{ let a = 1 }}
{{ if (true) { return 'HelloWorld!' } }}
```

#### 表达式用法

表达式功能强大，在表达式内，可以访问模块实例与表达式所在节点对应的Model，赋予了表达式较高的灵活性，常见的用法包括：

- 获取实例数据
- 调用模块方法
- 访问模块属性

例如模块部分代码定义如下：

```js

class Hello extends Module{
	name='Hello';
	getData(){
		return ['星期一','星期二','星期三','星期四','星期五']
	}
    
	template(){
		return `
			<div>
<!-- 表达式语法内，普通的属性名对应当前节点对应的Model对象内的同名属性值，this指向的即是对应模块实例 -->
				<p>获取模块实例数据：{{title}}</p>
				<p>调用模块方法：{{getData()}}</p>
				<p>访问模块属性：{{this.name}}</p>
			</div>
		`
	}
	
    data(){
        return {
            title:'helloWorld'
        }
    }
}
nodom(Hello,"#app")
```

在视图模板内，表达式用途广泛，包括：

- 指令取值
- 数据预处理
- 展示数据
- 编写动态属性值（style，class等）

```html
<div>
    <!-- 展示数据-->
    <h1>{{title}}</h1>
    <!-- 属性、指令赋值 -->
    <div style={{getCss}} x-if={{flag}}>
</div>
```

如果表达式内的计算结果产生不可预知的错误，默认的，会返回空字符串，确保程序运行时不会出错。

```html
<div>
    <!-- 如果对应Model内无该字段，默认会返回空字符串 -->
    <!-- 页面显示''-->
    {{age}} 
</div>
```

> @code:RwZOeZq

### 事件绑定

Nodom使用了专门的事件类`NEvent`来处理Dom的事件操作，在模板中以`e-`开头，如：`e-click`、`e-mouseup`等。事件支持所有HTML元素标准事件，接收一个模块实例上的方法名作为事件处理方法，如：`e-click="methodName"`，当事件触发的时，Nodom会执行该方法。具体用法如下：

```js
class ModuleA extends Module{
	template(){
		return `
		<div>
			<button e-click="addCount">addCount</button>
			<span> {{ count }} </span>
		</div>
		`;
	}
	// model
	data(){
		return {
			count:0
		}
	}
	//  button onclick事件触发回调。
	addCount(model){
		model.count++;
	}
}
nodom(ModuleA,"#app");
```

> @code:qBXwQBQ

#### 回调函数的参数

与原生事件使用不同，Nodom中不需要指定事件参数，事件方法会自带四个参数。参数如下所示：

|  序号 |   参数名  |      描述      |
| :-: | :----: | :----------: |
|  1  |  model |  dom对应的model |
|  2  |  vdom  | 事件对象对应的虚拟dom |
|  3  | nEvent |   Nodom事件对象  |
|  4  |  event |  html原生事件对象  |

代码如下：

```js
	//  事件触发回调。
	addCount(model,vdom,nEvnet,event){
		......
	}
```

#### 事件修饰符

在传入事件处理方法的时，允许以`:`分隔的形式传入指定事件修饰符。
事件处理支持三种修饰符：

|   名字   |    作用    |
| :----: | :------: |
|  once  |  事件只执行一次 |
| nopopo |   禁止冒泡   |
|  delg  | 事件代理到父对象 |

```js
class Main extends Module{
	template(){
		return `
<div>
			
	<h3>只触发一次</h3>
	<button e-click="tiggerOnce:once">addNum</button>
	<p>{{num}}</p>
				
				
	<h3>禁止冒泡</h3>
	<div 
		e-click="outer" 
		style="width:200px;height:200px;background-color: #777777;"
	>
		<div 
			e-click="inner:nopopo" 
			style="width:100px;height:100px;background-color: #cccccc;"
		></div>
	</div>


	<h3>代理事件到父对象</h3>
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
nodom(Main,"#app");
```

### 指令(Directive)

指令用于增强元素的表现能力，以"x-"开头，以设置元素属性(attribute)的形式来使用。指令具有优先级，按照数字从小到大，数字越小，优先级越高。优先级高的指令优先执行。

// TODO: 不应该放在这里，这应该是自定义标签
自定义标签经过编译之后默认为`div标签`，若想使用其它标签包裹，可通过tag属性指定。

```html
//使用tag属性之后，通过repeat指令生成的元素被`p标签`包裹
<FOR cond={{rows}} tag="p">

<span>{{age}}</span>

</FOR>
```

目前NoDom支持以下几个指令:

|   指令名  | 指令优先级 |        指令描述       |
| :----: | :---: | :---------------: |
|  model |   1   |        绑定数据       |
| repeat |   2   | 按照绑定的数组数据生成多个相同节点 |
|  recur |   2   |       递归结构      |
|   if   |   5   |        条件判断       |
|  else  |   5   |        条件判断       |
| elseif |   5   |        条件判断       |
|  endif |   5   |        结束判断       |
|  show  |   5   |        显示视图       |
|  slot  |   5   |         插槽        |
| module |   8   |        加载模块       |
|  field |   10  |       双向数据绑定      |
|  route |   10  |        路由跳转       |
| router |   10  |        路由占位       |

#### Model 指令

model指令用于给view绑定数据，数据采用层级关系，如:需要使用数据项data1.data2.data3，可以直接使用data1.data2.data3，也可以分2层设置分别设置x-model='data1'，x-model='data2'，然后使用数据项data3。下面的例子中描述了x-model的几种用法。
模板代码

```js
class Main extends Module{
	template(){
		return `
			<div>
				<div x-model="user">
					<p>{{name.firstName}} {{name.lastName}}</p>
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
			name: { firstName: 'Xiaoming', lastName: 'Zhang' } 
			} 
		}
	}
}
nodom(Main,"#app");
```

> @code:QWMPJyp

#### Repeat 指令

Repeat指令用于给按照绑定的数组数据生成多个dom节点，每个dom由指定的数据对象进行渲染。使用方式为`x-repeat={{items}}`，其中items为数组对象。

数据索引

索引数据项为$index，为避免不必要的二次渲染,index需要单独配置。

模板代码

```js
class Main extends Module{
	template(){
		return `
			<div>
				<div x-repeat={{rows}}>
					name:{{name}},age:{{age}}
				</div>
				<div x-repeat={{rows}} $index="$index">
					$index:{{$index}},name:{{name}},age:{{age}}
				</div>
			</div>	
		`
	}
	
	data(){
		return {
			rows:[
				{name:"Tom",age:18},
				{name:"Jerry",age:19},
				{name:"Bob",age:20},
				{name:"Jack",age:21},
				{name:"Ryan",age:25},
			]
		}
	}
}

nodom(Main,"#app");
```

#### Recur 指令

recur指令生成树形节点，能够实现嵌套结构，在使用时，注意数据中的层次关系即可。recur也可以通过使用recur元素来实现嵌套结构。

```js
class Main extends Module{
	template(){
		return `
			<div>
				<div x-recur='ritem'>
					<span class={{cls}}>{{title}}</span>
					<recur ref />
				</div>
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
						}// end of '第三层'
					}// end of '第二层'
				}// end of 第一层
			};
	}
}

nodom(Main,"#app");
```

#### If/Elseif/Else/Endif 指令

指令用法

- 指令说明：if/else指令用于条件渲染，当if指令条件为true时，则渲染该节点。当if指令条件为false时，则进行后续的elseif指令及else指令判断，如果某个节点判断条件为true，则渲染该节点，最后通过endif指令结束上一个if条件判断。

模板代码

```js
class Main extends Module{
	template(){
		return `
			<div>
				<p>如果discount<0.8，显示价格</p>
				<!-- 使用if指令判断discount是否小于0.6 -->
				<p x-if={{discount<0.6}}>价格：{{price}}</p>
				<!-- if指令条件为false，进行elseif指令判断 -->
				<p x-elseif={{discount<0.7}}>discount:{{discount}}</p>
				<!-- elseif指令为false，进行else判断 -->
				<p x-else={{discount<0.8}}>价格：{{price}}</p>
    			<p x-endif></p>
				
			</div>
		`
	}
	data(){
		return {
			discount: 0.7,
        	price: 200
		}
	}
}

nodom(Main,"#app");
```

标签用法

- 需要设置cond属性用于添加判断条件。

模板代码

```js
class Main extends Module{
	template(){
		return `
			<div>
				<div>
					<!-- 单个if指令 -->
					<div>如果discount<0.8，显示价格</div>
					<!-- 判断discount是否小于0.8 -->
					<if cond={{discount < 0.8}}>价格：{{price}}</if>
					<endif/>
				</div>

				<div>
					<!-- 完整的if/else指令 -->
					<div>如果age<18，显示未成年，否则显示成年</div>
					<!-- 判断age是否小于18 -->
					<if cond={{age<18}}>年龄：{{age}}，未成年</if>
					<!-- if条件为false，进入else判断 -->
					<else>年龄：{{age}}，成年</else>
					<endif/>
				</div>

				<div>
					<!-- 判断grade是否小于60 -->
					<if cond={{grade<60}}>不及格</if>
					<!-- if条件为false，进入elseif判断 -->
					<elseif cond={{grade>60 && grade<70}}> 及格 </elseif>
					<!-- 上一个elseif条件为false，进入该elseif判断 -->
					<elseif cond={{grade>70 && grade<80}}> 中等 </elseif>
					<!-- 上一个elseif条件为true，渲染该节点，结束判断 -->
					<elseif cond={{grade>80 && grade<90}}> 良好 </elseif>
					<else> 优秀 </else>
					<endif/>
				</div>
			</div>
		`
	}
	
	data(){
		return {
			discount: 0.7,
			price: 200,
			age: 20,
			grade: 73,
		}
	}
}

nodom(Main,"#app");
```

#### Show 指令

show指令用于显示或隐藏视图，如果指令对应的条件为true，则显示该视图，否则隐藏。使用方式为x-show='condition'。

模板代码

```js
class Main extends Module{
	template(){
		return `
			<div>
				<span x-show={{show}}>价格：{{price}}</span>
			</div>
		`
	}
	data(){
		return {
			show:true,
			price:200
		}
	}
}

nodom(Main,"#app");
```

#### Module 指令 应该不需要介绍了

module指令用于表示该元素为一个模块容器，module指令数据对应的模块会被渲染至该元素内。使用方式为x-module='模块类名'，Nodom会自动创建实例并将其渲染。

模版代码

```
<!-- 这里的Title为一个完整的Nodom模块-->
import Title from './src/dist';
class ModuleA extends Module{
	template(){ 
        return `
        <!-- 将Title模块渲染至当前div-->
        <div x-module='Title'></div>
        `
    }

```

#### Field 指令

- 指令说明：field指令用于实现输入类型元素，如input、select、textarea等输入元素与数据项之间的双向绑定。

配置说明

- 绑定单选框radio：多个radio的x-field值必须设置为同一个数据项，同时需要设置value属性，该属性与数据项可能选值保持一致。
- 绑定复选框checkbox：除了设置x-field绑定数据项外，还需要设置yes-value和no-value两个属性，分别对应选中和未选中时所绑定数据项的值。
- 绑定select：多个option选项可以使用x-repeat指令生成，同时使用x-field给select绑定初始数据即可。
- 绑定textarea：直接使用x-field绑定数据项即可。

模板代码

```js
class Main extends Module{
	template(){
		return `
<div>
	<!-- 绑定name数据项 -->
    姓名：<input x-field="name" />
    <!-- 绑定sexy数据项 -->
    性别：<input type="radio" x-field="sexy" value="M" />男
    	  <input type="radio" x-field="sexy" value="F" />女
    <!-- 绑定married数据项 -->
    已婚：<input type="checkbox" x-field="married" yes-value="1" no-value="0" />
    <!-- 绑定edu数据项，并使用x-field指令生成多个option -->
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
    birth: '2017-05-11',
    edus: [
        { eduId: 1, eduName: "高中" },
        { eduId: 2, eduName: "本科" },
        { eduId: 3, eduName: "硕士研究生" },
        { eduId: 4, eduName: "博士研究生" },
        ]
    }
} 
	
}

nodom(Main,"#app");
```

> 在对使用了`x-field`指令的输入元素绑定`onChange`事件时，绑定的事件会失效。

### 列表

在日常开发中，渲染一个`列表`是十分常见的应用场景。接下来看看，在`Nodom`中是如何来实现`列表`的渲染的。

#### 基础使用

在`Nodom`中，提供了两种方式来实现`列表`的渲染。

第一种是通过内置指令`x-reapet`的方式。将列表数据直接传递给该指令。

第二种方式通过`Nodom`实现的`<for>`内置标签。该标签含有一个`cond`属性，用来传入需要渲染的列表数据。

```js
class Main extends Module{
	template(){
		return `
			<div>
				<!-- x-repeat 指令 -->
				<div class="code">
    				菜单：
    				<div x-repeat={{foods}} >
        				<span>菜名：{{name}}，价格：{{price}}</span>
    				</div>
				</div>

				<!-- <for>标签 -->
				<div class="code">
					菜单：
					<for cond={{foods}} >
						<span>菜名：{{name}}，价格：{{price}}</span>
					</for>
				</div>
			</div>
		`
	}
	data(){
		return {
			foods:[
				{
					name:'青椒肉丝',
					price:15,
				},
				{
					name:'回锅肉',
					price:20,
				},
				{
					name:'宫爆鸡丁',
					price:15,
				},
				{
					name:'红烧肉',
					price:25,
				},
				{
					name:'红烧猪蹄',
					price:30,
				},
			]
		}
	}
}

nodom(Main,"#app");
```

#### `x-repeat` 指令与 `<for>`标签

`x-reapt`指令和`<for>`标签有什么不同呢？二者并无什么不同，`<for>`标签其实就是封装了`x-repeat`指令的一个标签。所以，`<for>`标签和`x-repeat`指令可以在任何时候互换。

> `x-repeat`指令和`<for>`标签中均只能使用对象数组作为数据。不要将`<for>`标签和`x-repeat`指令一起使用。

#### 访问`Model`中的数据

`x-repeat`指令会为生成出来的节点绑定对应的`model`，如果需要访问外层`model`中的数据，可以在表达式中使用`this.model`，这样表达式就会从模块的根`model`开始解析数据。

```js
class Main extends Module{
	template(){
		return `
			<div>
				<div x-repeat={{rows}}>
					<p>内部数据：{{name}}</p>
					<p>{{this.model.outerName}}</p>
				</div>
			</div>
		`
	}
	
	data(){
		return {
			outerName:"outer",
			rows:[
			{name:'name1'},
			{name:'name2'},
			{name:'name3'},
			{name:'name4'},
			]
		}
	}
}
nodom(Main,"#app")
```

#### 索引号的使用（编号从0开始）

`$index`这一变量，是用来获取当前索引的。但在使用之前，需要指定索引的名字。

```js

class Main extends Module{
	template(){
		return `
			<div>
				<!-- x-repeat 指令 -->
				<div class="code">
    				菜单：
    				<div x-repeat={{foods}} $index='idx'>
        				<span>{{idx}}:菜名：{{name}}，价格：{{price}}</span>
    				</div>
				</div>

				<!-- <for>标签 -->
				<div class="code">
					菜单：
					<for cond={{foods}} $index='idx'>
						<span>{{idx}}:菜名：{{name}}，价格：{{price}}</span>
					</for>
				</div>
			</div>
		`
	}
	data(){
		return {
			foods:[
				{
					name:'青椒肉丝',
					price:15,
				},
				{
					name:'回锅肉',
					price:20,
				},
				{
					name:'宫爆鸡丁',
					price:15,
				},
				{
					name:'红烧肉',
					price:25,
				},
				{
					name:'红烧猪蹄',
					price:30,
				},
			]
		}
	}
}

nodom(Main,"#app");
```

#### 自定义过滤数组

如果你只想看到`22`元以上的菜，那么，你可以使用一个自定义函数来为你自己筛选这些菜。

```js
class Main extends Module{
	template(){
		return `
			<div>
				<!-- 使用函数筛选列表 -->
				<div x-repeat={{getFood(foods)}} >
        			菜名：{{name}}，价格：{{price}}
    			</div>
				
				<for cond={{getFood(foods)}} >
        			菜名：{{name}}，价格：{{price}}
    			</for>
			</div>
		`
	}
	getFood(arr) {
    return arr.filter(item => item.price > 22);
}
	data(){
		return {
			foods:[
					{
						name:'青椒肉丝',
						price:15,
					},
					{
						name:'回锅肉',
						price:20,
					},
					{
						name:'宫爆鸡丁',
						price:15,
					},
					{
						name:'红烧肉',
						price:25,
					},
					{
						name:'红烧猪蹄',
						price:30,
					},
				]
		}
	}
}

nodom(Main,"#app");
```

或者，你需要将所有的数据排序展示，那么你可以将`getFood`方法修改如下：

```js
getFood(arr) {
	return arr.sort((a,b) => a.price - b.price);
}
```

> **注意**：自定义函数中传入的数据已经不是原来`data`中的初始数据了，而是做了响应式处理的响应式数据。

#### 嵌套列表

有时候，我们会遇到复杂一点的嵌套列表。对于嵌套列表，可以使用`x-recur`指令。

```js
class Main extends Module{
	template(){
		return `
			<div>
				<div x-recur='ritem'>
					<span class={{cls}}>{{title}}</span>
					<recur ref/>
				</div>
				
				<recur cond={{ritem}}>
					<span class={{cls}}>{{title}}</span>
					<recur ref/>
				</recur>
			</div>
		`
	}
	data(){
		return {
			ritem: {
				title: "第一层",
				cls: "cls1",
				ritem: {
					title: "第二层",
					cls: "cls2",
					ritem: {
						title: "第三层",
						cls: "cls3",
					},
				},
			},
		}
	}
}

nodom(Main,"#app");
```

> 使用`x-recur`指令与`recur`标签没有什么区别，`recur`标签本质上就是封装了带有`x-recur`指令的一个div标签。

#### `x-repeat`指令和`x-recur`指令

`x-recur`指令可以和`x-repeat`指令一起使用，更快速的解析`树形结构`的数据。现在有一个数据格式是这样的：

```js
class Main extends Module{
	template(){
		return `
		<div>
			<h3>递归带repeat</h3>
			<div x-model='ritem2'>
				<recur cond='items' name='r1' class='secondct'>
					<for cond={{items}} >
						<div class='second'>id is:{{id}}-{{title}}</div>
						<recur ref='r1' />
					</for>
				</recur>
			</div>
		</div>
		`
	}

data(){
	return {
		ritem2:{
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
						id:20,
						items:[
							{title:'bbb21',id:201},
							{title:'bbb22',id:202}
						]}
					]
				}
			]
		}
	}// end of teturn
}

}

nodom(Main,"#app");
```

十分简洁的代码就搞定了树形结构。

### 虚拟DOM

虚拟dom相较于真实dom很大的提高了开发效率，优化了用户的体验，同时提升了页面渲染的性能。

#### Nodom中的虚拟dom的结构如下：

```typescript
{
/**
 * 元素名，例如<div></div>标签，tagName为div；<span></span>的tagName为span
 */
tagName: string;
    
/**
 * Nodom中虚拟DOM的key是唯一的标识，对节点进行操作时提供正确的位置，获取对应的真实dom
 */
key: string

/**
 * 绑定事件模型，在方法中可以传入model参数来获得模型中的值
 */
model: Model;
	
/**
 * 存放虚拟dom的属性
 */
props:Object

/**
* 当前虚拟dom节点的父虚拟dom节点
*/
parent:IRenderedDom
    
/**
* 当前虚拟dom节点对应的VirtualDom
*/
vdom:VirtualDom
```

#### 属性

| **属性**  | **类型**       | **定义**                         |
| :------ | ------------ | :----------------------------- |
| tagName | string       | 标签名如<div></div>的他给Name为'div'   |
| key     | string       | 是唯一的标识符，也可以通过key来获取虚拟dom的值     |
| model   | Model        | 绑定Model                        |
| props   | Object       | 存放当前节点的属性                      |
| parent  | IRenderedDom | 当前节点的父虚拟dom节点                  |
| vdom    | VirtualDom   | 当前节点对应的VirtualDom，管理该节点的指令，事件等 |

#### 虚拟dom的加速器“Diff”

在虚拟dom的操作中，diff算法起到了关键的作用，而Nodom通过DiffTool中的比较节点方法（**compare**）来得出需要修改的最小单位，再更新视图，减少了dom操作，达到提高性能的目的。

#### compare

在原始的diff算法中需要循环递归遍历节点依次进行比较，虽然比起没有diff算法之前有所优化，依旧效率比较低，**compare**方法对此做了一些改变。

在**compare**方法中有三个参数分别是**src**（待比较节点）、**dst**（被比较节点）、**changeArr**（增删改的节点数组）三个参数。**compare**方法在节点开始比较前根据节点类型的不同有不同的策略。相应方法解决相应类型问题,在子节点的对比中也有子节点对比策略。在进行新旧节点的**compare**操作后，若节点会提前移动，则跳过这个节点从而减少移动操作，然后**sameKey**方法会确定一遍**src**和**dst**是否有相同key来确定是否还能减少不必要的移动次数。当有新增节点或删除节点时则对**children**数组进行相应操作，最后进行真实dom的渲染结束。

#### 总结

虚拟dom通过找出最小差异，达到最小次数操作dom目的。同时虚拟DOM是JS的对象，有利于进行跨平台操作。

## 深入

<!--本章节建议先阅读完模块基础，再来了解核心-->

#### 模块注册

根模块的注册除外，Nodom为其余模块提供两种注册方式：

- 模块modules数组注册

```js
<!--待注册模块A -->
class ModuleA extends Module{
    template(){
    return `
		<div>this is ModuleA</div>
 		`
 }
}
<!--待注册模块B -->
class ModuleB extends Module{
    template(){
    return `
		<div>this is ModuleB</div>
 		`
 }
}
<!--注册使用模块A，B -->
class Main extends Module{
    modules=[ModuleA,ModuleB]//或者在构造函数内指定
	template(){
		return `
		<div>
			<!-- 使用模块A-->
			<ModuleA></ModuleA>
			<!-- 使用模块B-->
			<ModuleB></ModuleB>
		</div>
	 `
	 }
}

nodom(Main,"#app");// 根模块
```

- `registModule`方法
  `registModule`方法可以给待注册模块设置**别名**，在模板代码中使用模块时，既可以使用模块类名作为标签名引入，也可以使用注册的别名作为标签名引入。

```js
<!--待注册模块A -->
class ModuleA extends Module{
    template(){
    return `
		<div>this is ModuleA</div>
 		`
 }
}
registModule(ModuleA,'User');
class Main extends Module{
    template(){
        return `
		<div>
			<!--两种方式均可-->
			<ModuleA></ModuleA>
			<User></User>
		</div>
		`
    }
}
nodom(Main,"#app");
```

### 模块传值&Props

为了加强模块之间的联系，Nodom在模块之间提供Props来传递数据。除根模块外，每个模块在进行模板代码解析，执行模块实例的template方法时，会将父模块通过dom节点传递的属性以对象的形式作为参数传入，也就是说，子模块可以在自己的template函数内，依据传入的props**动态创建模板**。

```js
//模块A  功能：根据父模块依据标签传入props的值展示不同的视图代码
class ModuleA extends Module{
      template(props){
          //在template函数内可以进行模板预处理
		let str;
		if(props.name=='add'){
			str  = `<h1>add<h1>`
		}else{
			str = `<h2>none</h2>` 
		}
		return `
			<div>
				${str}
			</div>
		`
    }
}
registModule(ModuleA,'User');
// 根模块 
class Main extends Module{
    template(){
        return `
		<div>
			<ModuleA name='add'></ModuleA>
		</div>
		`
    }
}
nodom(Main,"#app");
```

借助模板字符串的加持，可以使用包含特定语法（`${expression}`）的占位符，很大程度的拓展了模板代码的灵活度。在占位符内可以插入原生的JavaScript表达式。

#### 数据传递

Nodom数据传递为单向数据流，Props可以实现父模块向子模块的数据传递，但是这是被动的传递方式，如果需要将其保存至子模块内的代理数据对象，可以在传递的属性名前，加上`$`前缀，Nodom会将其传入子模块的根Model内，实现响应式监听。

> 注意：以$前缀开头的Props属性，如果对应的是一个Model对象，该Model对象存在于两个模块内，Model内数据的改变会造成两个模块的渲染。

```js
//模块A  功能：父模块主动传值，将其保存至模块A的代理对象Model内-
class ModuleA extends Module{
      template(props){
              return `<div><h1>{{name}}<h1></div>`
    }
}
registModule(ModuleA,'user');
//根模块
class Main extends Module{
    template(){
        return `
      	 <div>
        	<ModuleA $name={{name}}></ModuleA>
		</div>
    `
    }
    data(){
        return {
            name:'Nodom',
        }
    }
}
nodom(Main,"#app");
```

#### 反向传递

由于Props的存在，父模块可以暴露外部接口，将其通过Props传递给子模块，子模块调用该方法即可实现反向传递的功能。例如:

```js
//模块A  功能：点击按钮使父模块的数据改变
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
registModule(ModuleA,'user');
//根模块 
class Main extends Module{
    template(){
        return `
		<div>
			count={{sum}}
			<user add={{this.add}}></user>
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
nodom(Main,"#app");
```

以此方法可以实现子模块向父模块的数据传递功能。

#### 深层数据传递

对于跨越多个模块层次的数据传递。

Nodom提供一个`GlobalCache`来管理共享数据。

`GlobalCache`内置`get`、`set`、`remove`、`subscribe`方法以便操作数据。

```js
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
		data.msg++;
		GlobalCache.set("globalData", data);
	}
}

class Main extends Module {
	modules = [ModuleA];
	template() {
		return `
			<div>
				{{msg}}
				<ModuleA />
			</div>
		`;
	}

	onBeforeFirstRender(model) {
		let data = GlobalCache.get("globalData");
		console.log(data);
		model.msg = data.msg;
		GlobalCache.subscribe(this, "globalData", (val) => {
			model.msg = val.msg;
		});
	}

	data() {
		return {
			msg: 0,
		};
	}
}

nodom(Main, "#app");

```

也可使用第三方**数据发布-订阅**库。

在开发大型项目时，可以使用数据管理库帮助我们管理数据，使数据以可预测的方式发生变化，我们推荐使用Nodom团队开发的**kayaks**库，或者其他优秀的数据管理库均可。

#### Props中的template

若子模块中的模板生成依赖父模块中的某些字符串，可使用以下方式传递：

```js
//子模块从props中的template属性中取出对应字符串生成模板
class ModuleA extends Module {
	template(props) {
		return `<div>${props.template}</div>`;
	}
}
registModule(ModuleA, "User");
class Main extends Module {
	template() {
		return `
        <div>
            <!-- 需要传递的template值由template标签包裹-->
            <ModuleA $name={{name}}>
                <template>
                    <span style="width: 100px">{{name}}</span>
                </template>
            </ModuleA>
        </div>
    `;
	}
	data() {
		return {
			name: "Nodom",
		};
	}
}
nodom(Main, "#app");
```

### 插槽

在实际开发中，插槽功能会较大程度的降低应用开发难度，插槽作为模板暴露的外部接口，增大了模板的灵活度，更利于模块化开发。Nodom以指令和自定义元素的方式实现插槽功能，两者的功能类似。

```html
<!--自定义元素的方式使用插槽 -->
<slot>
    <h1>
    title
    </h1>
</slot>
<!-- 指令的形式使用插槽-->
<div x-slot='title'></div>
```

#### 默认插槽

在模块标签内的模板代码会作为待插入的节点，如果子模块内有默认的插入位置`<slot></slot>`,将会将节点插入该位置。如果没有待插入的内容，子模块内`slot`标签将会正常显示。

```js
<!--模块A  父模块待插入的内容，与slot标签进行替换 最终的模板代码为`<button>我是父模块</button>`-->
class ModuleA extends Module{
      template(props){
		 return `
			<div>
				<slot>
					我是默认内容
				</slot>
			</div>	
		`
    }
}
registModule(ModuleA,'User');
<!-- 根模块  User标签内的所有内容作为待插入的内容-->
class Main extends Module{
    template(){
        return `
			<div>
  				<User>
					<button>我是父模块</button>
				 </User>
			</div>
`
    }
}
nodom(Main,"#app");
```

#### 命名插槽

在使用插槽的场景下，很多时候默认插槽不足以完成全部功能。在内置多个插槽的时候，就需要使用命名插槽了。命名插槽就是给插槽定义插槽名，传入的标签需要与插槽名一致才可发生替换。

```js
/*
模块A  父模块待插入的内容，依据name属性与与slot标签进行替换 最终的模板代码为：
`<button>我是父模块的title</button>
<button>我是父模块的footer</button>`
 */
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
				</div>`
    }
}
registModule(ModuleA,'User');
// 根模块  User标签内的slot标签内容作为待插入的内容
class Main extends Module{
    template(){
        return `
		<div>
 		 	<User>
				<slot name='title'>
				<button>我是父模块的title</button>
				<slot>
				<slot name='footer'>
				<button>我是父模块的footer</button>
				<slot>
 			</User>
		</div>	
`
    }
}

nodom(Main,"#app");
```

#### 内部渲染插槽

在某些场景中，可能需要将插槽内容在子模块渲染，也就是相当于**传递模板代码**,而不在父模块内渲染。对于这种情况，只需要在子模块的插槽定义处，附加`innerRender`属性即可。

```js
/*
模块A  由于子模块插槽具有innerRender属性，父模块待替换的模板区域不会在父模块内进行渲染，在本模块渲染
*/

// [[2022-01-07]]测试innerRender没有效果
class ModuleA extends Module{
      template(props){
             return `
			 	<div>
					<!--最终页面会显示'child' -->
                    <slot innerRender>
                        我是默认内容
                    </slot>
				</div>
				`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'User');
//根模块  User标签内的所有内容作为待插入的内容
class Main extends Module{
    template(){
        return `
			<div>
				<User>
					{{title}}
				</User>
			</div>
        `;
    }
    data(){
        return {
            title:'parent'
        }
    }
}
nodom(Main,"#app");
```

### 数据模型(Model)

`Model`作为模块数据的提供者，绑定到模块的数据模型都由`Model`管理。`Model`是一个由`Proxy`代理的对象，`Model`的数据来源有两个：

- 模块实例的`data()`函数返回的对象;
- 父模块通过`$data`方式传入的值。

每一个模块都有独立的`Model`，但可以通过在使用子模块时传入属性`useDomModel`的方式与子模块共享`Model`，使用方式如下

```js
class ModuleA extends Module{
      template(props){
              return `<div>{{name}}</div>`;
    }
}
registModule(ModuleA,'User');
//根模块
class Main extends Module{
    template(){
        return `
		<div>
        	<ModuleA useDomModel></ModuleA>
		</div>`
		;
    }
    data(){
        return {
            name:'Nodom',
        }
    }
}
nodom(Main,"#app");
```

`Model`会深层代理内部的`object`类型数据。

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
			count:0,
			obj:{
				arr:[1,2,3]
			}
		}
	}

	// 在其他地方使用model
	changeCount(model){
		model.count++;
	}
}

nodom(Main,"#app");
```

> Model在管理数据的时候会新增部分以`$`开头的数据项和方法，所以在定义方法和数据时，尽量避免使用`$`开头的数据项和方法名。

#### Model与模块渲染

每个`Model`存有一个模块列表，当`Model`内部的数据变化时，会引起该`Model`的模块列表中所有模块的渲染。一个`Model`的模块列表中默认只有初始化该`Model`的模块，如果需要该`Model`触发多个模块的渲染，则要将`需要触发渲染的模块`添加到该`Model`对应的模块列表中(`Model`与模块的绑定请查看API ModelManager.bindToModule)。

#### $set()

Nodom在提供了一个`$set()`方法，该方法可以往`Model`上设置一个深层次的对象。
##### 参数说明
model: Model, key: string, value:any
参数名|类型|参数说明
-|-|-
model | Model | 模型
key | string或string[] | 属性
value | any | 值

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
	$set(model,"data1.data2.data3",{a:'a'});
}
```

#### $get()
Nodom在提供了一个`$get()`方法，可以从`Model`上获取一个深层次的对象值，当不知道对象具体层次时有效。
##### 参数说明
model: Model, key: string, value:any
参数名|类型|参数说明
-|-|-
model | Model | 模型
key | string或string[] | 属性


```js
data(){
	return {
		data:{
			a:1,
			b:'b'
		}
	}
}

getValue(model){
	// 等同于 model.data.a
	console.log($get(model,"data.a"));
}

#### watch()

Nodom提供了`watch`方法来监视`Model`里的数据变化，当数据变化时执行指定的操作。  
##### 参数说明
model: Model, key: string|string[], operate: Function,module?:Module,deep?:boolean
参数名|类型|参数说明
-|-|-
model | Model | 监听对象
key | string或string[] | 监听属性
operate | Function | 监听触发方法，默认参数为(model,key,oldValue,newValue)，其中model为被监听的model，key为监听的键，oldValue为旧值，newValue为新值
module | Module | 监听模块，如果设置，则触发时，只针对该模块进行操作，否则如果model绑定了多个模块，则每个模块都会触发operate方法
deep | boolean | 如果设置为true，当key对应项为对象时，对象的所有属性、子孙对象所有属性都会watch，慎重使用该参数，避免watch过多造成性能缺陷。

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
				<div>{{count}}</div>
			</div>
		`
	}
	data(){
	return {
			count:1
		}
	}
	
	watch(model){
		//m 被监听为model,key为监听属性,oldVal为旧值,newVal为新值
		watch(model,'count',(m,key,oldVal,newVal)=>{
			console.log('检测到数据变化');
			console.log('oldVal：',oldVal);
			console.log('newVal：',newVal);
			})
	}
	change(model){
		model.count++;
		// 执行完成之后会看到打印值。
	}
}

nodom(Main,"#app");
```
#### getmkey()
该方法用于获取model key
##### 参数说明
model: Model

参数名|类型|参数说明
-|-|-
model | Model | 模型对象
 
 ##### 返回值
 模型 key（全局唯一）

### 渲染
Nodom的渲染是基于数据驱动的，也就是说只有Model内的数据发生了改变，当前模块才会进行重新渲染的操作。渲染时，Nodom将新旧两次渲染产生的虚拟Dom树进行对比，找到变化的节点，实现最小操作真实Dom的目的。

```js
//模块A  由于父模块传入的Props未发生改变，那么父模块的更新不会影响子模块
class ModuleA extends Module{
      template(props){
             return `
			 	<div>
					<!--最终页面会显示'child' -->
   					${props.title}  {{title}}
			 	</div>
				`;
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'User');
// 根模块 点击按钮后，由于改变了响应式数据，触发了根模块的渲染
class Main extends Module{
    template(){
        return `
			<div>
  				<button e-click='change'>改变title</button>
				父模块：{{title}}
				<ModuleA title={{title}}></ModuleA>
			</div>
`
    }
    data(){
        return {
            title:'parent'
        }
    }
    change(model){
        model.title='none';
    }
}

nodom(Main,"#app");
```

#### Props的副作用

在使用props的场景下，如果我们传递的属性值发生改变，那么子模块会先触发编译模板的过程,再进行渲染操作，也就是模块重新激活。

特殊的，在Props中，对于传递`Object`类型的数据，每次渲染,Nodom会将该模块默认为**数据改变**。

```js
//模块A  由于父模块传入的Props数据发生了改变，ModuleA重新激活，触发template函数进行编译，再进行渲染
class ModuleA extends Module{
      template(props){
             return `
			 <div>
		<!--父模块按钮点击后,最终页面会显示’nonechild' -->
   					${props.title} {{title}}
			</div>
			`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'user');
//根模块  点击按钮后，由于改变了响应式数据，触发了根模块的渲染-
class Main extends Module{
    template(){
        return `
			<div>
  				<button e-click='change'>改变title</button>
				<user title={{title}}></user>
			</div>		
		`
    }
    data(){
        return {
            title:'parent'
        }
    }
    change(model){
        model.title='none';
    }
}

nodom(Main,'#app');
```

#### 单次渲染模块

如果想要摒弃Props带来的渲染副作用，Nodom提供单次渲染模块。单次渲染模块只有在首次渲染时才会接收Props，随后无论Props如何变化，都不会影响到模块本身。使用方式为在模块标签内附加`renderOnce`属性。

```js
//模块A  由于renderOnce属性，Props的改变不会影响到模块A本身
class ModuleA extends Module{
      template(props){
             return `
			 	<div>
					<!--父模块按钮点击后,最终页面会显示’nonechild' -->
   					${props.title}{{title}}
				</div>		
			`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'user');
//根模块  点击按钮后，由于改变了响应式数据，触发了根模块的渲染
class Main extends Module{
    template(){
        return `
			<div>
  				<button e-click='change'>改变title</button>
				<user renderOnce title={{title}}></user>
			</div>
		`
    }
    data(){
        return {
            title:'parent'
        }
    }
    change(model){
        model.title='none';
    }
}

nodom(Main,"#app");
```

### CSS支持

​	**Nodom对CSS提供额外的支持。**

- 在模板代码中的 `<style></style>` 标签中直接写入CSS样式，示例代码如下：

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

nodom(Module1,"#app");
```

- 在模板代码中的 `<style></style>` 标签中通过表达式调用函数返回CSS样式代码串，示例代码如下：

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
nodom(Module1,"#app");
```

- 在模板代码中的 `<style></style>` 标签中通过@import url('CSS url路径')引入CSS样式文件，示例代码如下：

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

- 对模板代码中需要样式的节点直接写行内样式，示例代码如下：

```js
class Module1 extends Module {
     template() {
            return `
				<div>
                    <h1 style="color: red;" class="test">Hello nodom!</h1>
                </div>
			`;
     }
}	
nodom(Module1,"#app");

```

**scope属性**

​	给节点添加该属性后，Nodom会自动在CSS选择器前加前置名。使CSS样式的作用域限定在当前模块内，不会污染其它模块。

​	示例代码如下：

```js
 template() {
	   return  `
			<div>
				<h1 class="test">Hello nodom!</h1>
				<style scope="this">
					@import url('./style.css')
				</style>
			</div>
		`;
 }
```

### Cache

Nodom提供了缓存功能，缓存空间是一个Object，以key-value的形式存储在内存中；

- key的类型是string，支持多级数据分割，例如：China.captial；
- value支持任意类型的数据。

用户可以自行选择将常用的内容存储在缓存空间，例子如下：

```javascript
GlobalCache.set("China.captial","北京")
```

根据键名从缓存中读取数据，例子如下：

```javascript
GlobalCache.get("China.captial")
```

根据键名从缓存中移除，例子如下：

```javascript
GlobalCache.remove("China.captial")
```

另外，还提供对以下对象在内存中进行存储、获取和移除等操作。

- 指令实例

- 指令参数

- 表达式实例

- 事件实例

- 事件参数

- 虚拟dom

- html节点

- dom参数

具体使用参考API文档。

### 自定义

#### 自定义指令

Nodom提供`createDirective`接口来自定义指令。

```javascript
createDirective(
	'directiveName', 
	function(module, dom, src){
		
		......
		
		return true;
	},
	11 
)

```

`createDirective`接收的参数列表如下：

|  序号 |    参数名   |    类型    |                  描述                  |
| :-: | :------: | :------: | :----------------------------------: |
|  1  |   name   |  string  |         指令的名字，使用时需要在前面加上`x-`         |
|  2  |  handler | Function |  处理指令逻辑的方法，接收三个参数，参数列表见`handler`参数列表 |
|  3  | priority |  number  | 指令优先级，默认为10，可以不传，1-10为保留字段，数字越大优先级越低 |

`handler`函数接收的参数列表如下:

|  序号 |   参数名  |     类型     |           描述          |
| :-: | :----: | :--------: | :-------------------: |
|  1  | module |   Module   |        当前模块的实例        |
|  2  |   dom  | VirtualDom |       本次渲染的虚拟dom      |
|  3  |   src  | VirtualDom | 该节点在originTree中的虚拟dom |

#### 自定义元素

自定义元素需要继承`DefineElement`类，且需要在`DefineElementManager`中注册。

```javascript
// 定义自定义元素
class MYELEMENT extends DefineElement{
	constructor(node,module){
        super(node,module);
        
		......
    }
}
	
// 注册自定义元素
// add 接收一个自定义类或者自定义类数组
DefineElementManager.add(MYELEMENT);
```

定义自定义元素的构造器接收的参数列表如下：

|  序号 |   参数名  |       描述       |
| :-: | :----: | :------------: |
|  1  |  node  | 该自定义元素的虚拟Dom节点 |
|  2  | module |     当前模块实例     |

### 动画与过渡

Nodom使用`x-animation`指令管理动画和过渡，该指令接收一个存在于`Model`上的对象，其中包括`tigger`属性和`name`属性。

- `name`属性的值就是过渡或者动画的类名；
- `tigger`为过渡的触发条件。

过渡分为`enter`和`leave`，触发`enter`还是`leave`由`tigger`的值决定

- `tigger`为`true`，触发`enter`；
- `tigger`为`false`,触发`leave`。

对于`enter`过渡，需要提供以`-enter-active`、`-enter-from`、`-enter-to`为后缀的一组类名。在传入给`x-animation`指令的对象中只需要将名字传入给`name`属性，而不必添加后缀，`x-animation`在工作时会自动的加上这些后缀。这些规则对于`leave`过渡同理。

`tigger`为`true`时，指令首先会在元素上添加`-enter-from`和`-enter-active`的类名，然后再下一帧开始的时候添加`-enter-to`的类名，同时移除掉`-enter-from`的类名。

`tigger`为`false`时，处理流程完全一样，只不过添加的是以`-leave-from`、`-leave-active`、`-leave-to`为后缀的类名。

下面是一个过渡的例子和一个动画的例子：

- `x-animation`管理过渡

```html
<style>
	.myfade-enter-active,
	.myfade-leave-active {
		transition: all 1s ease;
	}
	.myfade-enter-from,
	.myfade-leave-to {
		opacity: 0;
	}
	.myfade-enter-to,
	.myfade-leave-from {
		opacity: 1;
	}
</style>
```

```js
class Module1 extends Module {
	template() {
		return `
	<div>
		<button e-click="tiggerTransition">tiggerTransition</button>
		<div 
		x-animation={{transition}} 
		style='width:100px;height:100px;background-color: cornflowerblue'
		>
		</div>
	</div>
		`;
	}
	data() {
		return {
			transition: {
				name: "myfade",
				tigger: true,
			},
		};
	}
	tiggerTransition(model){
		model.transition.tigger = !model.transition.tigger
	}
}
nodom(Module1,"#app");
```

- `x-animation`管理动画

> 对于动画，后缀为`-from`和`-to`的类名没有那么重要，如果对元素在执行动画前后的状态没有要求，那么可以不用提供以这两个后缀结尾的类名，尽管如此，x-animation指令还是会添加这些后缀结尾的类名，以防止其他因素触发了模块的更新导致动画异常触发的情况。（x-animation检测这些类名来判断该元素动画或者过渡的执行状态）

```html
<style>
.myfade-enter-active {
	animation-name: myfade;
	animation-duration: 1s;
}
.myfade-leave-active {
	animation-name: myfade;
	animation-duration: 1s;
	animation-direction: reverse;
}
@keyframes myfade {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
```

```js
class Module1 extends Module {
	template() {
		return `
		<div>
			<button e-click="tiggerAnimation">tiggerAnimation</button>
			<div 
			x-animation={{animation}}
			style='width:100px;height:100px;background-color: cornflowerblue'
			>
			</div>
		</div>
		`;
	}
	data() {
		return {
			animation: {
				name: "myfade",
				tigger: true,
				// type的值默认为'transition'，如果是动画则需要指明
				type:'aniamtion',
			},
		};
	}
		tiggerAnimation(model){
		model.animation.tigger = !model.animation.tigger
	}
}
nodom(Module1,"#app");
```

对于部分常用的过渡效果，我们已经将其封装进入了nodomui.css文件，你只需要全局引入该css文件即可。
提供的过渡效果见下表：

|       name       |       效果       |
| :--------------: | :------------: |
|       fade       |      渐入渐出      |
|   scale-fixtop   |     固定上面缩放     |
|   scale-fixleft  |     固定左边缩放     |
|  scale-fixbottom |     固定底边缩放     |
|  scale-fixright  |     固定右边缩放     |
| scale-fixcenterX | 固定以X轴为对称轴往中间缩放 |
| scale-fixcenterY | 固定以Y轴为对称轴往中间缩放 |
|    fold-height   |      折叠高度      |
|    fold-width    |      折叠宽度      |

#### 进入/离开动画

在传入`x-aniamtion`指令的对象属性中设置`isAppear`（默认值为`true`）属性，可以配置当前的过渡/动画是否是进入离开过渡/动画。

- 若为`true`，则表示在离开动画播放完成之后会隐藏该元素（dispaly：none);
- 若为`false`,则表示在离开动画播放完成之后不会隐藏该元素。

#### 钩子函数

在传入`x-aniamtion`指令的对象里中设置`hooks`属性，可以配置过渡/动画执行前后的钩子函数。且这两个函数名字固定，分别为`before`和`after`。
他们的触发时机为:

- `before`触发动画/过渡之前。
- `after`触发动画/过渡之后。

```js
class Module1 extends Module {
	template() {
		return `
	<div>
		<button e-click="tiggerTransition">tiggerTransition</button>
		<div 
			x-animation={{transition}}
			style='width:100px;height:100px;background-color: cornflowerblue'
		>
			</div>
	</div>
		`;
	}
	data() {
		return {
			transition: {
				name: "fade",
				tigger: true,
				hooks:{
					// 钩子函数的this指向model,第一个参数为module
					// 过渡执行前钩子函数
					before(module){
						console.log(module)
					},
					// 过渡执行后钩子函数
					after(module){
						console.log(module)
					}
				}
			},
		};
	}
	tiggerTransition(model){
		model.transition.tigger = !model.transition.tigger
	}
}
nodom(Module1,"#app");
```

#### 过渡/动画控制参数

传入`x-animation`指令的对象不止上述提到的这些，还有一些控制参数，下表是所有可以传入的属性所示：

|      name      |              作用             |              可选值              |      默认值     |  必填 |
| :------------: | :-------------------------: | :---------------------------: | :----------: | :-: |
|     tigger     |             触发动画            |           true/false          |     true     |  是  |
|      name      | 过渡/动画名（不包含-enter-active等后缀） |               -               |       无      |  是  |
|    isAppear    |         是否是进入离开过渡/动画        |           true/false          |     true     |  否  |
|      type      |           是过渡还是动画           |    'aniamtion'/'transition'   | 'transition' |  否  |
|    duration    |          过渡/动画的执行时间         |       同css的duration的可选值       |      ''      |  否  |
|      delay     |          过渡/动画的延时时间         |         同css的delay的可选值        |     '0s'     |  否  |
| timingFunction |          过渡/动画的时间函数         |    同css的timingFunction的可选值    |    'ease'    |  否  |
|      hooks     |        过渡/动画执行前后钩子函数        | before/after函数或者enter/leave对象 |       无      |  否  |

#### 分别配置`enter`/`leave`

对于一个元素的过渡/动画可以分开配置不同的效果。
例如：

```js
class Module1 extends Module {
	template() {
		return `
	<div>
		<button e-click="tiggerTransition">tiggerTransition</button>
		<div 
			x-animation={{transition}}
			style='width:100px;height:100px;background-color: cornflowerblue'
		>
	</div>
		`;
	}
	data() {
		return {
	transition: {
				tigger: true, // 必填
				name: {
					enter: "scale-fixtop",
					leave: "scale-fixleft",
				},
				duration: {
					enter: "0.5s",
					leave: "0.5s",
				},
				delay: {
					enter: "0.5s",
					leave: "0.5s",
				},
				timingFunction: {
					enter: "ease-in-out",
					leave: "cubic-bezier(0.55, 0, 0.1, 1)",
				},
				hooks: {
					enter: {
						before(module) {
							console.log("scale-fixtop前", module);
						},
						after(module) {
							console.log("scale-fixtop后", module);
						},
					},
					leave: {
						before(module) {
							console.log("scale-fixleft前", module);
						},
						after(module) {
							console.log("scale-fixleft后", module);
						},
					},
				},
			},
		};
	}
	tiggerTransition(model){
		model.transition.tigger = !model.transition.tigger
	}
}

nodom(Module1,"#app");

```

## 路由

Nodom内置了路由功能，可以配合构建单页应用，用于模块间的切换。你需要做的是将模块映射到路由 。并指定最终在哪里渲染它们。

#### 创建路由

Nodom提供`createRoute`方法，用于注册路由。以`Object`配置的形式指定路由的路径、对应的模块、子路由等。

以下是一个简单的路由示例：

```html
<!-- 点击触发路由跳转-->
<div x-route='/main'>page1</div>
<!-- 指定路由模块渲染的位置-->
<div x-router>
```

```js
import {createRoute} from './nodom.esm.js';
//这里默认Hello为一个完整的模块
import Hello from'./route/hello.js';
//创建路由
createRoute({
    path:'/main',
    //指定路由对应的模块
    module:Hello
});
```

这样就可以实现简单的路由功能了。

#### 嵌套路由

在实际应用中，通常由多层嵌套的模块组合而成。配置对象内`routes`属性，以数组的方式注册子路由。例如：

```js
import {createRoute} from './nodom.esm.js';
//这里默认Hello为一个完整的模块
import Main from'./route/hello.js';
import MTop from'./route/top.js';
import MBottom from'./route/bottom.js';
createRoute({
    path:'/main',
    //指定路由对应的模块
    module:Module，
    routes:[
    {
     path:'/top',
    //指定路由对应的模块
    module:MTop， 
	},{
     path:'/bottom',
    //指定路由对应的模块
    module:MBottom，
}
    ]
});
```

可以发现，每个配置对象内均可设置子路由，那么就可以实现嵌套多层路由了。

#### 路由跳转

借助`x-route`指令，用户无需手动控制路由跳转。但在一些情况下，需要手动控制路由跳转，Nodom提供两种方式手动跳转：

- `Router.go`
- `Router.redirect`

用来切换路由，实现路由的跳转。

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

- `onEnter`事件 ，`onEnter`事件在路由进入时执行,

- `onLeave`事件，`onLeave`事件在路由离开时执行。

执行时传入第一个参数：当前模块的根Model。

如：从/r1/r2/r3 切换到 /r1/r4/r5。
则`onLeave`响应顺序为r3 `onLeave`、r2 `onLeave`。
`onEnter`事件则从上往下执行执行顺序为 r4 `onEnter`、 r5 `onEnter`。

例如：

```js
import {createRoute} from './nodom.esm.js';
//这里默认Hello为一个完整的模块
import Hello from'./route/hello.js';
//创建路由
createRoute({
    path:'/main',
    module:Hello,
    onLeave:function(model){
        console.log('我执行了onleave函数');
    },
    onEnter:function(model){
         console.log('我执行了onEnter函数');
    }
});
```

##### 全局路由事件

通过设置 `Router.onDefaultEnter` 和`Router.onDefaultLeave` 事件作为全局路由事件，执行方式与单个路由事件执行方式相同，只是会作用于每个路由。

#### 默认路由

浏览器刷新时，会从服务器请求资源，nodom路由在服务器没有匹配的资源，则会返回404。通常的做法是: 在服务器拦截资源请求，如果确认为路由，则做特殊处理。
假设主应用所在页面是/web/index.html，当前路由对应路径为/webroute/member/center。刷新时会自动跳转到/member/center路由。相应浏览器和服务器代码如下：

##### 浏览器代码

```js
import {Router,Module} from './nodom.esm.js';
class Main extends Module{
    ...
    //在根模块中增加onFirstRender事件代码
    onFirstRender:function(module){
        let path;
        if(location.hash){
            path = location.hash.substr(1);
        }
        //默认home ，如果存在hash值，则把hash值作为路由进行跳转，否则跳转到默认路由
        path = path || '/home';
       Router.go(path);
   	}
	...
}

```

##### 服务器代码

服务器代码为[noomi框架](http://www.nodom.cn/webroute/tutorial/www.noomi.cn)示例代码，其它如java、express做法相似。
如果Nodom路由以'/webroute'开头,服务器拦截到请求后，分析资源路径开始地址是否以'/webroute/'开头，如果是，则表示是nodom路由，直接执行重定向到应用首页，hash值设定为路由路径(去掉‘/webroute’)。

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
            response.redirect('/web/index.html#' + path.substr(9));
            return false;
        }
        return true;
    }
}

export{RouteFilter};
```

### 生态

#### NodomUI

#### Kayaks

数据管理库，用于开发大型项目。

#### Nodom VsCode插件

提供模板代码高亮功能，以及其他多种辅助功能。
