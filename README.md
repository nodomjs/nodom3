nodom

nodom是一款基于数据驱动的web mvvm框架。
用于搭建单页应用(SPA)，目前发展到3.3版本。
插件也在同步更新中。

详情请点击官网[nodom](http://www.nodom.cn/webroute/home)  
```js
源码所在目录：./core  
示例所在目录：./examples  
示例运行方式:  
clone后在根目录执行  
npm install  
安装依赖包  
再执行  
npm run build  
即可编译出可运行的nodom.js
使用Live Server启动在./examples目录下的html文件即可  
```
# 文档

## 安装

Nodom是一款用于构建用户界面的前端`MVVM`模式框架，Nodom支持按需、渐进式引入。不论是体验Nodom还是构建复杂的单页应用，Nodom均完全支持。

在项目内可引入的方式如下：

1. 下载JavaScript文件，以ES Module的形式引入。

2. 在页面以CDN包的方式引入。

### 最新的Nodom

最新的版本可在[GitHub](https://github.com/fieldyang/nodom3)上获取，内有官方发布的重要信息，包括详细的更新日志，及之前的版本。

### 体验Nodom

你可以在[CodePen](https://codepen.io/pen/?template=wvqPeJQ)平台在线体验Nodom。
也可前往GitHub平台下载源码，运行./examples目录内提供的示例代码。

### CDN

对于CDN引入的方式，可以这样引入：

```html
<script src="https://unpkg.com/nodomjs"></script>
```

以确保使用最新版本。

### 下载引入

在生产环境下，建议引入完整的**nodom.js**文件，Nodom建议使用ES Module实现模块化，无需构建工具即可完成模块化开发，引入方式如下：

```html
<script type="module">
    import{nodom,Module} from '../dist/nodom.js'
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

 Nodom是一款基于数据驱动，用于构建用户界面的前端`MVVM`模式框架。内置路由，提供数据管理功能，支持模块化、组件化开发。在不使用第三方工具的情况下可独立开发完整的单页应用。

<!--假设你已经掌握一定的Html，Css,JavaScript基础，如果没有，那么阅读文档将会有些困难。-->

一个简单的Hello World例子如下：

```js
<script type='module'>
import{nodom,Module} from '../dist/nodom.js'
class HelloWorld extends Module {
 template() {
  return `
  	<div>
 		Hello World!
  	</div>`;
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
import{nodom,Module} from '../dist/nodom.js'
</script>
```

 #### 渲染元素

Nodom支持渐进式开发，框架内部会将传入的容器作为框架处理的入口。所以，传入你的元素选择器作为渲染的容器，将该容器完全交给Nodom托管。

例如有一节点：

```html
<div id="app">   
</div>
```

我们将其称为根节点，如果需要将一个Nodom模块渲染到根节点，只需要编写元素选择器，依序传入Nodom方法内，第一个参数为定义的模块类，第二个参数为Dom选择器。

```js
nodom(HelloWorld, "#app");
```

Nodom会将传入模块渲染至传入的选择器。

### 模块基础

Nodom以模块为单位进行应用构建，一个应用由单个或多个模块组成。

#### 模块定义

模块定义需要继承Nodom提供的模块基类`Module`。

```javascript
class Module1 extends Nodom.Module
```

定义模块时，为提升模块重用性，通过`template()`方法返回字符串形式（建议使用模板字符串）的模板代码，作为模块的视图描述。

```javascript
template(){
	return `<div>Hello,Nodom
    		</div>`
}
```

通过`data()`方法返回模块所需的数据对象，Nodom再对其做响应式处理，响应式处理后的数据对象，Nodom称为`Model`对象，并存储在模块实例中。

```javascript
data(){
	return {
		name:'nodom',
		}
}	
```



> 为了描述方便，随后的章节中，我们将响应式处理后的对象称为`Model`。一个`Model`中还可能包含其它`Model`对象。`Model`实际是对原始数据对象进行代理拦截的`Proxy`对象。
>
> <!-- Proxy对象由ES6提出，用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。-->

还可以自定义模块方法，经过Nodom事件处理机制的模块方法，其this指向当前模块实例。  

方法参数由Nodom自动传入，依次为：`Model`,`事件触发的虚拟Dom`,`Nodom封装事件NEvent`,`原生事件对象Event`。  

```javascript
change(model,Vdom,Nevent,event){
   Mmodel.name='nodom3';
}   
```

不由Nodom事件触发的模块方法则不会受影响。

  示例代码如下：

```javascript
		class Module1 extends Nodom.Module{
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
```

#### 模块生命周期

组件从创建到卸载它会经历一些特定的阶段，Nodom模块中包含一系列生命周期钩子函数，方便开发者在模块生命周期的各个阶段做特定的工作。

开发者可以在模块定义时提供一些特殊的方法（这些方法Nodom在执行时会传入一个参数：模块实例的根`Model`。this指向为模块实例），模块在特定的时刻Nodom就会去执行这些方法，下表包含所有的生命周期钩子函数：

|          事件名           |           描述           | 参数  |   this指向   |
| :-----------------------: | :----------------------: | :---: | :----------: |
|      onBeforeRender       |      渲染前执行事件      | Model | 当前模块实例 |
|    onBeforeFirstRender    |    首次渲染前执行事件    | Model | 当前模块实例 |
| onBeforeFirstRenderToHTML |  首次渲染到html执行事件  | Model | 当前模块实例 |
|       onFirstRender       |    执行首次渲染后事件    | Model | 当前模块实例 |
|   onBeforeRenderToHtml    | 增量渲染到html前执行事件 | Model | 当前模块实例 |
|         onRender          |    执行每次渲染后事件    | Model | 当前模块实例 |
|      beforeUnActive       |  模块取消激活前执行事件  | Model | 当前模块实例 |
|         unActive          | 模块从HTML卸载前执行事件 | Model | 当前模块实例 |

具体用法如下：

```javascript
<script type="module">
    import{nodom,Module} from '../dist/nodom.js'
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
</script>
```

> @code:base_Modulebase_ModuleLifeCycle

#### 生命周期图示

![][Life cycle of Nodom ]



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
  import {ModuleA} from "moduleA.js"
  class Main extends Module{
	  template(){
	  	return `
		<div>
			<!-- 直接使用类名 -->
			  <ModuleA />
		</div>
		`
	  }
      ......
		// 使用modules注册子模块
      modules = [ModuleA];
  }
  ```
  
  > @code:Base_TemplateSyntax_ModuleOfWriting
  
- 使用`registModule`API注册模块，并且使用`registModule`注册模块时的提供的别名。
  
  ```js
  import {registModule} from "nodom.js"
	import {ModuleA} from "modulea.js"
  // 给ModuleA起了一个别名mod-a
  registModule(ModuleA,'mod-a');
  class Main extends Module{
	    template(){
	  	return `
			<div>
			<!-- 使用别名 -->
				<mod-a />
			</div>
		`
    }
  }
  ```
  两种写法的效果完全一样。

#### 表达式写法

表达式是实现数据绑定的方式之一。

比如在构建用户欢迎界面的时候：

```html
......

<h1>Hello,Bob!</h1>

......
```

页面会显示用户Bob的的欢迎信息`Hello，Bob！`，当切换用户时，页面还是显示用户Bob的欢迎信息，这显然是不合理的。如果希望根据用户名来显示不同的欢迎信息，需要将用户名`userName`绑定到模板中，实现动态渲染用户名：

```HTML
<h1>Hello,{{ userName }}!</h1>

// model.userName = 'Joe';
```

这样Nodom就会去当前模块实例的`Model`里去寻找为`userName`的值，并且用它替换`{{ userName }}`。这样就能够通过操作`userName`的值来显示不同用户的欢迎信息。



> 默认标签的属性值需要使用引号包裹（单引号`'`或者双引号`"`均可），但如果将表达式作为属性值，可以不写引号。
>  如：`<div class="cls1 cls2" name={{userName}}></div>`

关于表达式的详细信息可以阅读本章的表达式章节。

#### 指令写法

Nodom的指令以`x-`开头，指令用来增强模板的功能，比如，`x-show`指令用于控制一个元素是否渲染。

```html
<span x-show={{ isShow }}> Hello,nodom!</span>
```

`x-show`指令接收`true`或者`false`，可以使用表达式为其传值，如果表达式的值为`true`，则会渲染该元素，如果为`false`则不会渲染该元素。

关于指令的详细信息可以阅读本章的指令与自定义元素章节。

#### 事件写法

Nodom的事件命名为`e-`+`原生事件名`，例如：

```html
<!-- click事件 在nodom中的写法为e-click -->
<button e-click="confirm">确定</button>
```

事件接收一个模块实例上的方法名，当事件触发时，Nodom会执行该方法。

关于事件绑定的详细信息可以阅读本章的事件绑定章节。


### 表达式
> 为描述方便,接下来将模块实例中对data函数返回的数据对象做响应式处理后的对象，称为Model，  
> 也就是说data函数返回的数据会存在于Model内。 

在Nodom中，与视图进行数据绑定的最常用形式就是使用双大括号。Nodom将其称为表达式，灵感追溯至Mustache库，用来与对应模块实例的Model内的属性值进行替换。比如：

```html
<div>{{msg}}，I'm Coming</div>
```

模块实例中对应的data函数为：

```js
data(){
    return {
        msg:'HelloWorld'
    }
}
```

最终在页面上会变为：

```html
HelloWorld,I'm Coming
```

当然，Nodom对原生的JavaScript表达式实现了支持。所以确保双大括号内传入的是**单个JavaScript表达式**。也就是其需要返回一个计算结果。

```js
<!-- 取值 -->
{{student.age}}
<!-- 三目运算-->
{{num>0?1:0}}
<!-- 调取JavaScript内置函数-->
{{name.toUpperCase()}}
```

在表达式内，JavaScript常见的内置对象是可用的，比如：Math、Object、Date等。由于表达式的执行环境是一个沙盒，请勿在内部使用用户定义的全局变量。

一些常见非表达式写法包括：赋值，流程控制。**避免**使用他们：

```js
{{ let a = 1 }}
{{ if (true) { return 'HelloWorld!' } }}
```

#### 表达式用法
表达式功能强大，在表达式内，可以访问模块实例与表达式所在节点对应的Model，赋予了表达式较高的灵活性，常见的用法包括：

* 获取实例数据
* 调用模块方法
* 访问模块属性

```js
例如模块部分代码定义如下：
class Hello extends Module{
    constructor(){
        this.name='hello';
        this.getData=function(){
            return ['星期一'，'星期二'，'星期三'，'星期四','星期五']
        }
    }
    data=()=>{
        return {
            title:'helloWorld'
        }
    }
}
<!-- 表达式语法内，普通的属性名对应当前节点对应的Model对象内的同名属性值，this指向的即是对应模块实例 -->
获取模块实例数据：{{title}}//'helloWorld'
调用模块方法：{{this.getData()}} //['星期一'，'星期二'，'星期三'，'星期四''星期五']
访问模块属性：{{this.name}} //'hello'
```

在视图模板内，表达式用途广泛，包括：

* 指令取值
* 数据预处理
* 展示数据
* 编写CSS样式(详见CSS支持章节)

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
export class ModuleA extends Module{
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
```

> @code:qBXwQBQ

#### 回调函数的参数

与原生事件使用不同，Nodom中不需要指定事件参数，事件方法会自带四个参数。参数如下所示：


| 序号 | 参数名 |         描述          |
|:----:|:------:|:---------------------:|
|  1   | model  |    dom对应的model     |
|  2   |  dom   | 事件对象对应的虚拟dom |
|  3   | nEvent |     Nodom事件对象     |
|  4   | event  |   html原生事件对象    |

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

|  名字  |       作用       |
|:------:|:----------------:|
|  once  |  事件只执行一次  |
| nopopo |     禁止冒泡     |
|  delg  | 事件代理到父对象 |

```html
<!-- 事件只执行一次 -->
<button e-click="tiggerClick:once">do something</button>

<!--禁止冒泡-->
<div e-click="outer">
	<div e-click='inner:nopopo'></div>
</div>

<!-- 事件代理到ul -->
<ul>
	<li x-repeat={{rows}} e-click="check:delg">...</li>
</ul>
```



### 指令(Directive)

指令用于增强元素的表现能力，以"x-"开头，以设置元素属性(attribute)的形式来使用。指令具有优先级，按照数字从小到大，数字越小，优先级越高。优先级高的指令优先执行。

含有指令的标签经过编译之后默认为`div标签`，若想使用其它标签包裹，可通过tag属性指定。

```html
//使用tag属性之后，通过repeat指令生成的元素被`span标签`包裹
<div x-repeat={{food}} tag="span">
    {{foodName}}
</div>
```

目前NoDom支持以下几个指令:

| 指令名 | 指令优先级 |              指令描述              |
| :----: | :--------: | :--------------------------------: |
| model  |     1      |              绑定数据              |
| repeat |     2      | 按照绑定的数组数据生成多个相同节点 |
| recur  |     2      |            生成嵌套结构            |
|   if   |     5      |              条件判断              |
|  else  |     5      |              条件判断              |
| elseif |     5      |              条件判断              |
| endif  |     5      |              结束判断              |
|  show  |     5      |              显示视图              |
|  slot  |     5      |                插槽                |
| module |     8      |              加载模块              |
| field  |     10     |            双向数据绑定            |
| route  |     10     |              路由跳转              |
| router |     10     |              路由占位              |



#### Model 指令

model指令用于给view绑定数据，数据采用层级关系，如:需要使用数据项data1.data2.data3，可以直接使用data1.data2.data3，也可以分2层设置分别设置x-model='data1'，x-model='data2'，然后使用数据项data3。下面的例子中描述了x-model的几种用法。
model指令改变了数据层级，则如何用外层的数据呢，Nodom支持从根向下查找数据功能，当需要从根数据向下找数据项时，需要使用"$$"

模板代码

```html
<div x-model="user"> <!-- 绑定数据 --!>
    顾客信息：
    <div x-model="name">
        <div>姓氏：{{lastName}}</div>
        <div>名字：{{firstName}}</div>
     </div>
</div>
```

```javascript
data(){ 
	return{ 
		user: { 
			name: { firstName: 'Xiaoming', lastName: 'Zhang' } 
		} 
	}
}
```

> @code:QWMPJyp

#### Repeat 指令

Repeat指令用于给按照绑定的数组数据生成多个dom节点，每个dom由指定的数据对象进行渲染。使用方式为x-repeat={{item}}，其中items为数组对象。

数据索引

索引数据项为$index，为避免不必要的二次渲染,index需要单独配置。

模板代码

```html
<!-- 绑定数组数据 --!>
<div x-repeat={{foods1}}>
    编号：{{$index+1}}，菜名：{{name}}，价格：{{price}}
    <p>配料列表：</p>
    <ol>
        <li x-repeat={{rows}}>食材：{{title}}，重量：{{weight}}</li>
    </ol>                  
</div>
```

```javascript
data(){
 	return{
        foods1:[
            {name: '夫妻肺片',price: 25,rows:[
                 {title:'芹菜',weight:100},
                 {title:'猪头肉',weight:200}
             ]}, 
             {name: '京酱肉丝',price: 22,rows:[
                 {title:'瘦肉',weight:100},
                 {title:'葱',weight:200}
             ]},
             {name: '糖醋里脊',price: 20,rows:[
                 {title:'排骨',weight:200}
             ]}
        ]}
    }
}
```

#### Recur 指令

recur指令生成树形节点，能够实现嵌套结构，在使用时，注意数据中的层次关系即可。recur也可以通过使用recur元素来实现嵌套结构。

```html
<!-- 绑定数组数据 --!>
<div x-recur='ritem'>
    <span class="{{cls}}">{{title}}</span>
    <recur ref/>
</div>
<recur cond='items' name='r1' class='secondct'>
    <for cond={{items}} >
        <div class='second'>id is:{{id}}-{{title}}</div>
        <recur ref='r1' />
    </for>
</recur>
```

```javascript
data(){
    return{
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
        ritem1: {
            cls: "cls1",
            items: [{ title: "数据11" }, { title: "数据12" }],
            ritem1: {
                cls: "cls2",
                items: [{ title: "数据21" }, { title: "数据22" }],
                ritem1: {
                    cls: "cls3",
                    items: [{ title: "数据31" }, { title: "数据32" }, { title: "数据33" }],
                },
            },
        },
    }
}
```

#### If/Elseif/Else/Endif 指令

指令用法

- 指令说明：if/else指令用于条件渲染，当if指令条件为true时，则渲染该节点。当if指令条件为false时，则进行后续的elseif指令及else指令判断，如果某个节点判断条件为true，则渲染该节点，最后通过endif指令结束上一个if条件判断。

模板代码

```html
<div>
	<!--  --!>
    <div>如果discount<0.8，显示价格</div>
    <!-- 使用if指令判断discount是否小于0.6 --!>
    <div x-if={{discount<0.6}}>价格：{{price}}</div>
    <!-- if指令条件为false，进行elseif指令判断 --!>
    <div x-elseif={{discount<0.7}}>价格：{{price}}</div>
    <!-- elseif指令为false，进行else判断 --!>
    <div x-else={{discount<0.8}}>价格：{{price}}</div>
    <div x-endif></div>
</div>
```

```javascript
data(){
    return {
        discount: 0.7,
        price: 200
    }
}
```

标签用法

- 需要设置cond属性用于添加判断条件。

模板代码

```html
<div>
	<!-- 单个if指令 --!>
    <div>如果discount<0.8，显示价格</div>
    <!-- 判断discount是否小于0.8 --!>
    <if cond={{discount < 0.8}}>价格：{{price}}</if>
    <endif/>
</div>

<div>
	<!-- 完整的if/else指令 --!>
    <div>如果age<18，显示未成年，否则显示成年</div>
    <!-- 判断age是否小于18 --!>
    <if cond={{age<18}}>年龄：{{age}}，未成年</if>
    <!-- if条件为false，进入else判断 --!>
    <else>年龄：{{age}}，成年</else>
    <endif/>
</div>

<div>
	<!-- if elseif else --!>
    根据不同分数显示不同等级，<60不及格，60-69及格，70-79中等，80-89良好，>=90优秀
    <!-- 判断grade是否小于60 --!>
    <if cond={{grade<60}}>不及格</if>
    <!-- if条件为false，进入elseif判断 --!>
    <elseif cond={{grade>60 && grade<70}}> 及格 </elseif>
    <!-- 上一个elseif条件为false，进入该elseif判断 --!>
    <elseif cond={{grade>70 && grade<80}}> 中等 </elseif>
    <!-- 上一个elseif条件为true，渲染该节点，结束判断 --!>
    <elseif cond={{grade>80 && grade<90}}> 良好 </elseif>
    <else> 优秀 </else>
    <endif/>
</div>
```

```javascript
data(){
    return {
        discount: 0.7,
        price: 200,
        age: 20,
        grade: 73,
    }
}
```

#### Show 指令

show指令用于显示或隐藏视图，如果指令对应的条件为true，则显示该视图，否则隐藏。使用方式为x-show='condition'。

模板代码

```html
<div>
    <div x-show={{show}}>价格：{{price}}</div>
</div>
```

```javascript
data(){
    return{
        show:true,
        price:2000
    }
}
```

#### Module 指令

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

```html
<div>
	<!-- 绑定name数据项 --!>
    姓名：<input x-field="name" />
    <!-- 绑定sexy数据项 --!>
    性别：<input type="radio" x-field="sexy" value="M" />男
    	 <input x-field="sexy" type="radio" value="F" />女
    <!-- 绑定married数据项 --!>
    已婚：<input type="checkbox" x-field="married" yes-value="1" no-value="0" />
    <!-- 绑定edu数据项，并使用x-field指令生成多个option --!>
    学历：<select x-field="edu">
    		<option x-repeat={{edus}} value="{{eduId}}">{{eduName}}</option>
    	 </select>
</div>
```

```javascript
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
```

### 列表

在日常开发中，渲染一个`列表`是十分常见的应用场景。接下来看看，在`Nodom`中是如何来实现`列表`的渲染的。

#### 基础使用

在`Nodom`中，提供了两种方式来实现`列表`的渲染。

第一种是通过内置指令`x-reapet`的方式。将列表数据直接传递给该指令。

第二种方式通过`Nodom`实现的`<for>`内置标签。该标签含有一个`cond`属性，用来传入需要渲染的列表数据。

并且都需要通过`$index`属性指定索引名。

```html
<!-- x-repeat 指令 -->
<div class="code">
    菜单：
    <div x-repeat={{foods}} $index='idx'>
        <span>菜名：{{name}}，价格：{{price}}</span>
    </div>
</div>

<!-- <for>标签 -->
<div class="code">
    菜单：
    <for cond="{{foods}}" $index='idx'}}>
        <span>菜名：{{name}}，价格：{{price}}</span>
    </for>
</div>
```

**结果**:

#### 访问`Model`中的数据

如果需要访问`model`中的数据，直接访问是不行的。因为每一个`x-repeat`复制出来的`module`拥有独立的`model`，与基础`module`指向的全局`model`不同。这类`module`会指向自己的独立`model`，所以仅能访问`cond`里对象的值。只有在当前`module`中通过`this.model`调用全局`model`来访问`model`中的数据。

```html
<div class=tip>访问 Model 中的数据</div>
<div class="code">
    菜单：
    <for cond={{foods}} $index='idx'>
        data中的show: {{this.model.show}}
    </for>
</div>
```

#### 索引号的使用（编号从0开始）

`$index`这一变量，是用来获取当前索引的。但在使用之前，需要指定索引的名字。

```html
<div class=tip>索引号的使用（编号从0开始）</div> 
<!-- x-repeat 指令 -->
<div class=code>
    菜单：
    <div x-repeat={{foods}} $index='idx'>
        编号：{{idx}}，菜名：{{name}}，价格：{{price}}
    </div>
</div>

<!-- <for>标签 -->
<div class=code>
    菜单：
    <for cond={{foods}} $index='idx'>
        编号：{{idx}}，菜名：{{name}}，价格：{{price}}
    </for>
</div>
```

**结果**：

**注意**：不论是否使用，都建议指定`$index`的索引名，否则将造成不可预知的错误。

#### 自定义过滤数组

如果你只想看到`22`元以上的菜，那么，你可以使用一个自定义函数来为你自己筛选这些菜。

```html
<div class=tip>自定义过滤数组</div>
<!-- x-repeat 指令 -->
<div class="code">
    菜单：
    <div x-repeat={{getFood(foods)}} $index='idx'>
        菜名：{{name}}，价格：{{price}}
    </div>
</div>
<!-- <for>标签 -->
<div class="code">
    菜单：
    <for cond={{getFood(foods)}} $index='idx'>
        菜名：{{name}}，价格：{{price}}
    </for>
</div>
```

```js
getFood(arr) {
    return arr.filter(item => item.price > 22);
}
```

**结果**：

或者，你需要将所有的数据排序展示，那么你可以将`getFood`方法修改如下：

```js
getFood(arr) {
	return arr.sort((a,b) => a.price - b.price);
}
```

**结果**：

**注意**：自定义函数中传入的数据已经不是原来`data`中的初始数据了，而是做了响应式处理的响应式数据。`Nodom`响应式数组数据中，支持的`js`原生方法有很多，例如：

- `push()`
- `pop()`
- `unshift()`
- `shift()`
- `splice()`
- `sort()`
- `reverse()`
- `filter()`
- `map()`

#### 嵌套列表

有时候，我们会遇到复杂一点的嵌套列表。

```html
<div class=tip>repeat 嵌套</div>
<div class=code>
    菜单：
    <div x-repeat={{foods1}} $index='idx'>
        编号：{{idx+1}}，菜名：{{name}}，价格：{{price}}
        <p>配料列表：</p>
        <ol>
            <li x-repeat={{rows}} $index='idx'>食材：{{title}}，重量：{{weight}}</li>
        </ol>
    </div>
</div>
```

**结果**：

#### `x-repeat` 指令与 `<for>`标签

`x-reapt`指令和`<for>`标签有什么不同呢？二者并无什么不同，`<for>`标签其实就是封装了`x-repeat`指令的一个标签。所以，`<for>`标签和`x-repeat`指令可以在任何时候互换。

#### `x-repeat`指令和`x-recur`指令

`x-recur`指令可以和`x-repeat`指令一起使用，更快速的解析`树形结构`的数据。现在有一个数据格式是这样的：

```js
{
  ritem2: {
    items: [
      {
        title: "aaa",
        id: 1,
        items: [
          {
            id: 1,
            title: "aaa1",
            items: [
              { title: "aaa12", id: 12 },
              {
                title: "aaa11",
                id: 11,
                items: [
                  { title: "aaa111", id: 111 },
                  { title: "aaa112", id: 112 },
                ],
              },
              { title: "aaa13", id: 13 },
            ],
          },
          {
            title: "aaa2",
            id: 2,
            items: [
              {
                title: "aaa21",
                id: 21,
                items: [
                  {
                    title: "aaa211",
                    id: 211,
                    items: [
                      { title: "aaa2111", id: 111 },
                      { title: "aaa2112", id: 112 },
                    ],
                  },
                  { title: "aaa212", id: 212 },
                ],
              },
              { title: "aaa22", id: 22 },
            ],
          },
        ],
      },
      {
        title: "bbb",
        id: 2,
        items: [
          {
            title: "bbb1",
            id: 10,
            items: [
              { title: "bbb11", id: 1011 },
              { title: "bbb12", id: 1012 },
            ],
          },
          {
            title: "bbb2",
            id: 20,
            items: [
              { title: "bbb21", id: 201 },
              { title: "bbb22", id: 202 },
            ],
          },
        ],
      },
    ],
  },
};

```

如果仅仅使用`x-repeat`指令，很难去生成一个`树形结构`，现在将`x-recur`指令加入进来。

```html
<h3>递归带repeat</h3>
<div x-model='ritem2'>
    <recur cond='items' name='r1' class='secondct'>
        <for cond={{items}} $index='idx'>
            <div class='second'>id is:{{id}}-{{title}}</div>
            <recur ref='r1' />
        </for>
    </recur>
</div>
```

十分简洁的代码就搞定了树形结构。

**结果**:

#### 注意

+ `x-repeat`指令和`<for>`标签中均只能使用对象数组作为数据。
+ 不要将`<for>`标签和`x-repeat`指令一起使用。

### 虚拟DOM

虚拟dom相较于真实dom很大的提高了开发效率，优化了用户的体验，同时提升了页面渲染的性能。

#### Nodom中的虚拟dom的结构如下：

```typescript
{
/**
 * 元素名，例如<div></div>标签，tagName为div；<span></span>的tagName为span
 */
public tagName: string;
    
/**
 * Nodom中虚拟DOM的key是唯一的标识，对节点进行操作时提供正确的位置，获取对应的真实dom
 */
public key: string

/**
 * 绑定事件模型，在方法中可以传入model参数来获得模型中的值
 */
public model: Model;
    
/**
 * 移除多个指令
 * @param directives 	待删除的指令类型数组或指令类型
 */
public removeDirectives(directives: string[]) {
   	
}
```

#### 属性

| **属性**   | **类型**              | **定义**                                                     |
| :--------- | --------------------- | :----------------------------------------------------------- |
| tagName    | string                | 标签名如<div></div>的他给Name为'div'                         |
| key        | string                | 是唯一的标识符，也可以通过key来获取虚拟dom的值               |
| model      | Model                 | 绑定Model                                                    |
| directives | Directive[]           | 指令集合，是一个数组用来存放各个指令                         |
| events     | Map<string, number[]> | 事件的集合，同时一个事件可以绑定多个事件方法对象             |
| staticNum  | number                | 静态标识数，初始为0，大于0时每次做比较都减一直到等于0，当小于0时不进行处理 |
| children   | Array<VirtualDom>     | 子节点数组，在进行对子节点的操作，如add()，会将子节点加到子节点数组中 |
| ......     |                       |                                                              |

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

* 模块modules数组注册

```js
<!--待注册模块A -->
class ModuleA extends Module{
    ...
}
<!--待注册模块B -->
class ModuleB extends Module{
    ...
}
<!--注册使用模块A，B -->
class Module extends Module{
    ...
    modules=[ModuleA,ModuleB]//或者在构造函数内指定
    ...
template(){
    return `
 	<!-- 使用模块A-->
	<ModuleA></ModuleA>
	<!-- 使用模块B-->
	<ModuleB></ModuleB>
 `
 }
}
```

* *registModule*方法  
  registModule方法可以给待注册模块设置**别名**，在模板代码中使用模块时，既可以使用模块类名作为标签名引入，也可以使用注册的别名作为标签名引入。


```js
<!--待注册模块A -->
class ModuleA extends Module{
    ...
}
registModule(ModuleA,'User');
class Main extends Module{
    template(){
        return `
<!--两种方式均可-->
<ModuleA></ModuleA>
<User></User>
`
    }
}
```
### 模块传值&Props

为了加强模块之间的联系，Nodom在模块之间提供Props来传递数据。除根模块外，每个模块在进行模板代码解析，执行模块实例的template方法时，会将父模块通过dom节点传递的属性以对象的形式作为参数传入，也就是说，子模块可以在自己的template函数内，依据传入的props**动态创建模板**。

```js
<!--模块A  功能：根据父模块依据标签传入props的值展示不同的视图代码-->
class ModuleA extends Module{
      template(props){
          //在template函数内可以进行模板预处理
          if(props.name=='add'){
              return `<h1>${props.name}<h1>`
          }else{
              return `<h1>none</h1>` 
       }  
    }
}
registModule(ModuleA,'User');
<!-- 根模块 -->
class Main extends Module{
    template(){
        return `
        <!-- 展示<h1>add</h1>-->
        <ModuleA name='add'></ModuleA>
`
    }
}
```

借助模板字符串的加持，可以使用包含特定语法（`${expression}`）的占位符，很大程度的拓展了模板代码的灵活度。在占位符内可以插入原生的JavaScript表达式。

#### 数据传递

Nodom数据传递为单向数据流，Props可以实现父模块向子模块的数据传递，但是这是被动的传递方式，如果需要将其保存至子模块内的代理数据对象，可以在传递的属性名前，加上`$`前缀，Nodom会将其传入子模块的根Model内，实现响应式监听。
> 注意：以$前缀开头的Props属性，如果对应的是一个Model对象，该Model对象存在于两个模块内，Model内数据的改变会造成两个模块的渲染。

```js
<!--模块A  功能：父模块主动传值，将其保存至模块A的代理对象Model内-->
class ModuleA extends Module{
      template(props){
              return `<h1>{{name}}<h1>`
    }
}
registModule(ModuleA,'User');
<!-- 根模块 -->
class Main extends Module{
    template(){
        return `
        <!-- 展示<h1>Nodom</h1>-->
        <ModuleA $name={{name}}></ModuleA>
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
<!--模块A  功能：点击按钮使父模块的数据改变-->
class ModuleA extends Module{
      template(props){
        this.parentChange=props.add;
             return `<button e-click='change'>点击改变父模块的数据<button>`
    }
    change(){
        this.parentChange(1);
    }
}
registModule(ModuleA,'User');
<!-- 根模块 -->
class Main extends Module{
    template(){
        return `
        count={{sum}}
        <User add={{this.add}}></User>
        `
    }
    data(){
        return {
           sum:0,
        }
    }
    //这里需要使用箭头函数，来使该函数的this始终指向根模块，或者使用bind函数绑定this指向
    add=(num)=>{
        this.model.sum+=num;
    }
}
//当点击ModuleA内的按钮，根模块Model对象内的sum值会加一。
```

以此方法可以实现子模块向父模块的数据传递功能。

#### 深层数据传递

对于跨越多个模块层次的数据传递。

可使用第三方**数据发布-订阅**库。

在开发大型项目时，可以使用数据管理库帮助我们管理数据，使数据以可预测的方式发生变化，我们推荐使用Nodom团队开发的**kayaks**库，或者其他优秀的数据管理库均可。

#### Props中的template

若子模块中的模板生成依赖父模块中的某些字符串，可使用以下方式传递：

```js
//子模块从props中的template属性中取出对应字符串生成模板
class ModuleA extends Module{
      template(props){
              return `<div>${props.template}</div>`
    }
}
registModule(ModuleA,'User');
<!-- 根模块 -->
class Main extends Module{
    template(){
        return `
        <!-- 需要传递的template值由template标签包裹-->
        <ModuleA $name={{name}}>
        	<template>
				<span style="width: 100px">{{name}}</span>
			</template>
        </ModuleA>
    `
    }
    data(){
        return {
            name:'Nodom',
        }
    }
}
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

在模块标签内的模板代码会作为待插入的节点，如果子模块内有默认的插入位置```<slot></slot>```,将会将节点插入该位置。如果没有待插入的内容，子模块内```slot```标签将会正常显示。

```js
<!--模块A  父模块待插入的内容，与slot标签进行替换 最终的模板代码为`<button>我是父模块</button>`-->
class ModuleA extends Module{
      template(props){
             return `
                    <slot>
                        我是默认内容
                    </slot>`
    }
}
registModule(ModuleA,'User');
<!-- 根模块  User标签内的所有内容作为待插入的内容-->
class Main extends Module{
    template(){
        return `
  				<User>
					<button>我是父模块</button>
				 </User>
`
    }
}
```

#### 命名插槽

在使用插槽的场景下，很多时候默认插槽不足以完成全部功能。在内置多个插槽的时候，就需要使用命名插槽了。命名插槽就是给插槽定义插槽名，传入的标签需要与插槽名一致才可发生替换。

```js
<!--模块A  父模块待插入的内容，依据name属性与与slot标签进行替换 最终的模板代码为：
`<button>我是父模块的title</button>
<button>我是父模块的footer</button>`
    -->
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
<!-- 根模块  User标签内的slot标签内容作为待插入的内容-->
class Main extends Module{
    template(){
        return `
 		 	<User>
				<slot name='title'>
				<button>我是父模块的title</button>
				<slot>
				<slot name='footer'>
				<button>我是父模块的footer</button>
				<slot>
 			</User>
`
    }
}
```

#### 内部渲染插槽

在某些场景中，可能需要将插槽内容在子模块渲染，也就是相当于**传递模板代码**,而不在父模块内渲染。对于这种情况，只需要在子模块的插槽定义处，附加`innerRender`属性即可。

```js
<!--模块A  由于子模块插槽具有innerRender属性，父模块待替换的模板区域不会在父模块内进行渲染，在本模块渲染
    -->
class ModuleA extends Module{
      template(props){
             return `
					<!--最终页面会显示'child' -->
                    <slot innerRender>
                        我是默认内容
                    </slot>`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'User');
<!-- 根模块  User标签内的所有内容作为待插入的内容-->
class Main extends Module{
    template(){
        return `
  			<User>
				{{title}}
			</User>
        `;
    }
    data(){
        return {
            title:'parent'
        }
    }
}
```

### 数据模型(Model)

`Model`作为模块数据的提供者，绑定到模块的数据模型都由`Model`管理。`Model`是一个由`Proxy`代理的对象，`Model`的数据来源有两个：

- 模块实例的`data()`函数返回的对象;
- 父模块通过`$data`方式传入的值。

每一个模块都有独立的`Model`，但可以通过在使用子模块时传入属性”useDomModel“的方式与子模块共享`Model`，使用方式如下

```js
class ModuleA extends Module{
      template(props){
              return `<div>{{name}}</div>`;
    }
}
registModule(ModuleA,'User');
<!-- 根模块 -->
class Main extends Module{
    template(){
        return `
        <ModuleA useDomModel></ModuleA>`;
    }
    data(){
        return {
            name:'Nodom',
        }
    }
}
```

`Model`会深层代理内部的`object`类型数据。

基于`Proxy`，Nodom可以实现数据劫持和数据监听，来做到数据改变时候的响应式更新渲染。
> 关于`Proxy`的详细信息请参照[Proxy-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。

在使用的时，可以直接把`Model`当作对象来操作：

```js
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
changeTitle(model){
	model.count++;
}

```
> Model在管理数据的时候会新增部分以`$`开头的数据项和方法，所以在定义方法和数据时，尽量避免使用`$`开头的数据项和方法名。
#### Model与模块渲染

每个`Model`存有一个模块列表，当`Model`内部的数据变化时，会引起该`Model`的模块列表中所有模块的渲染。一个`Model`的模块列表中默认只有初始化该`Model`的模块，如果需要该`Model`触发多个模块的渲染，则要将`需要触发渲染的模块`添加到该`Model`对应的模块列表中(`Model`与模块的绑定请查看API ModelManager.bindToModule)。

#### $set()

Nodom在`Model`上提供了一个`$set()`方法，来应对一些特殊情况。例如,需要往`Model`上设置一个深层次的对象。

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
	model.$set("data1.data2.data3",{a:'a'});
}
```

#### $watch()

Nodom在`Model`里提供了`$watch`方法来监视`Model`里的数据变化，当数据变化时执行指定的操作。

```js
data(){
	return {
		obj:{
			arr:[1,2,3];
		}
	}
}

watch(model){
	model.$watch('obj.arr',(oldVal,newVal)=>{
		console.log('检测到数据变化');
		console.log('oldVal：',oldVal);
		console.log('newVal：',newVal);
	})
}

changArr(model){
	model.obj.arr = [3,2,1];
	// 执行完成之后会看到打印值。
}

unwatch(model){
	// 第三个参数为true表示取消监视，取消监视可以将第二个参数设置为undefined
	model.$watch('obj.arr',undefined,true);
}

```




### 渲染

Nodom的渲染是基于数据驱动的，也就是说只有Model内的数据发生了改变，当前模块才会进行重新渲染的操作。渲染时，Nodom将新旧两次渲染产生的虚拟Dom树进行对比，找到变化的节点，实现最小操作真实Dom的目的。

```js
<!--模块A  由于父模块传入的Props未发生改变，那么父模块的更新不会影响子模块-->
class ModuleA extends Module{
      template(props){
             return `
					<!--最终页面会显示'child' -->
   					${props.title}{{title}}`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'User');
<!-- 根模块 点击按钮后，由于改变了响应式数据，触发了根模块的渲染-->
class Main extends Module{
    template(){
        return `
  				<button e-click='change'>改变title</button>
				<User title={{title}}></User>
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
```



#### Props的副作用

在使用props的场景下，如果我们传递的属性值发生改变，那么子模块会先触发编译模板的过程,再进行渲染操作，也就是模块重新激活。

特殊的，在Props中，对于传递`Object`类型的数据，每次渲染,Nodom会将该模块默认为**数据改变**。

```js
<!--模块A  由于父模块传入的Props数据发生了改变，ModuleA重新激活，触发template函数进行编译，再进行渲染-->
class ModuleA extends Module{
      template(props){
             return `
					<!--父模块按钮点击后,最终页面会显示’nonechild' -->
   					${props.title}{{title}}`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'User');
<!-- 根模块  点击按钮后，由于改变了响应式数据，触发了根模块的渲染-->
class Main extends Module{
    template(){
        return `
  				<button e-click='change'>改变title</button>
				<User title={{title}}></User>`
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
```

#### 单次渲染模块

如果想要摒弃Props带来的渲染副作用，Nodom提供单次渲染模块。单次渲染模块只有在首次渲染时才会接收Props，随后无论Props如何变化，都不会影响到模块本身。使用方式为在模块标签内附加`renderOnce`属性。

```js
<!--模块A  由于renderOnce属性，Props的改变不会影响到模块A本身-->
class ModuleA extends Module{
      template(props){
             return `
					<!--父模块按钮点击后,最终页面会显示’nonechild' -->
   					${props.title}{{title}}`
    }
    data(){
        return {
            title:'child'
        }
    }
}
registModule(ModuleA,'User');
<!-- 根模块  点击按钮后，由于改变了响应式数据，触发了根模块的渲染-->
class Main extends Module{
    template(){
        return `
  				<button e-click='change'>改变title</button>
				<User renderOnce title={{title}}></User>`
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
```

### CSS支持

​	**Nodom对CSS提供额外的支持。**

* 在模板代码中的 `<style></style>` 标签中直接写入CSS样式，示例代码如下：

```js
class Module1 extends Module {
    template() {
        return plate = `
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

* 在模板代码中的 `<style></style>` 标签中通过表达式调用函数返回CSS样式代码串，示例代码如下：

```js
class Module1 extends Module {
     template() {
         let plate = `
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

* 在模板代码中的 `<style></style>` 标签中通过@import url('CSS url路径')引入CSS样式文件，示例代码如下：

```js
class Module1 extends Module {
     template() {
            let plate = `
				<div>
                    <h1 class="test">Hello nodom!</h1>
                    <style>
                        @import url('./style.css')
                    </style>
                </div>
			`;
     }
}
```

* 对模板代码中需要样式的节点直接写行内样式，示例代码如下：

```js
class Module1 extends Module {
     template() {
            let plate = `
				<div>
                    <h1 style="color: red;" class="test">Hello nodom!</h1>
                </div>
			`;
     }
}	
```

**scope属性** 

​	给节点添加该属性后，Nodom会自动在CSS选择器前加前置名。使CSS样式的作用域限定在当前模块内，不会污染其它模块。

​	示例代码如下：

```js
class Module1 extends Module {
     template() {
            let plate = `
				<div>
                    <h1 class="test">Hello nodom!</h1>
                    <style scope="this">
                        @import url('./style.css')
                    </style>
                </div>
			`;
     }
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

+ 指令实例

+ 指令参数

+ 表达式实例

+ 事件实例

+ 事件参数

+ 虚拟dom

+ html节点

+ dom参数

具体使用参考API文档。

对虚拟dom的操作如下所示：

将虚拟dom存储在内存中，例子如下：

```javascript
// 引入模块
import { ObjectManager } from '../dist/nodom.js'
let om = new ObjectManager(module)
```

```javascript
om.saveElement(dom)
```

根据提供的键名获取内存中对应的虚拟dom，例子如下：

```javascript
om.getElement(key)
```

根据提供的键名将对应的虚拟dom从内存中移除，例子如下：

```javascript
om.removeElement(key)
```

### 自定义

#### 自定义指令

Nodom提供`createDirective`接口来自定义指令。

```javascript
createDirective(
	'directiveName', 
	function(module, dom, src){
		......
	},
	11 
)

```

`createDirective`接收的参数列表如下：

| 序号 |  参数名  |   类型   |                                描述                                |
|:----:|:--------:|:--------:|:------------------------------------------------------------------:|
|  1   |   name   |  string  |                指令的名字，使用时需要在前面加上`x-`                |
|  2   | handler  | Function |   处理指令逻辑的方法，接收三个参数，参数列表见`handler`参数列表    |
|  3   | priority |  number  | 指令优先级，默认为10，可以不传，1-10为保留字段，数字越大优先级越低 |

`handler`函数接收的参数列表如下:

| 序号 | 参数名 |    类型    |             描述              |
|:----:|:------:|:----------:|:-----------------------------:|
|  1   | module |   Module   |        当前模块的实例         |
|  2   |  dom   | VirtualDom |       本次渲染的虚拟dom       |
|  3   |  src   | VirtualDom | 该节点在originTree中的虚拟dom |

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

| 序号 | 参数名 |           描述            |
|:----:|:------:|:-------------------------:|
|  1   |  node  | 该自定义元素的虚拟Dom节点 |
|  2   | module |       当前模块实例        |



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
	.shape-enter-active,
	.shape-leave-active {
		transition: all 1s ease;
	}
	.shape-enter-from,
	.shape-leave-to {
		height: 100px;
		width: 100px;
	}
	.shape-enter-to,
	.shape-leave-from {
		height: 200px;
		width: 200px;
	}
</style>
```
```js
class Module1 extends Module {
	template() {
		return `
	<div>
		<button e-click="tiggerTransition">tiggerTransition</button>
		<div x-aniamtion={{transition}}>
			......
		</div>
	</div>
		`;
	}
	data() {
		return {
			transition: {
				name: "shape",
				tigger: true,
			},
		};
	}
}
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
			<div x-aniamtion={{animation}}>
				......
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
}
```

对于部分常用的过渡效果，我们已经将其封装进入了nodomui.css文件，你只需要全局引入该css文件即可。
提供的过渡效果见下表：

|       name       |            效果             |
|:----------------:|:---------------------------:|
|       fade       |          渐入渐出           |
|   scale-fixtop   |        固定上面缩放         |
|  scale-fixleft   |        固定左边缩放         |
| scale-fixbottom  |        固定底边缩放         |
|  scale-fixright  |        固定右边缩放         |
| scale-fixcenterX | 固定以X轴为对称轴往中间缩放 |
| scale-fixcenterY | 固定以Y轴为对称轴往中间缩放 |
|   fold-height    |          折叠高度           |
|    fold-width    |          折叠宽度           |

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
		<div x-aniamtion={{transition}}>
			......
		</div>
	</div>
		`;
	}
	data() {
		return {
			transition: {
				name: "shape",
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
}
```

#### 过渡/动画控制参数

传入`x-animation`指令的对象不止上述提到的这些，还有一些控制参数，下表是所有可以传入的属性所示：

|      name      |                   作用                   |               可选值                |    默认值    | 必填 |
|:--------------:|:----------------------------------------:|:-----------------------------------:|:------------:|:----:|
|     tigger     |                 触发动画                 |             true/false              |     true     |  是  |
|      name      | 过渡/动画名（不包含-enter-active等后缀） |                  -                  |      无      |  是  |
|    isAppear    |         是否是进入离开过渡/动画          |             true/false              |     true     |  否  |
|      type      |              是过渡还是动画              |      'aniamtion'/'transition'       | 'transition' |  否  |
|    duration    |           过渡/动画的执行时间            |       同css的duration的可选值       |      ''      |  否  |
|     delay      |           过渡/动画的延时时间            |        同css的delay的可选值         |     '0s'     |  否  |
| timingFunction |           过渡/动画的时间函数            |    同css的timingFunction的可选值    |    'ease'    |  否  |
|     hooks      |        过渡/动画执行前后钩子函数         | before/after函数或者enter/leave对象 |      无      |  否  |

#### 分别配置`enter`/`leave`

对于一个元素的过渡/动画可以分开配置不同的效果。
例如：

```js
class Module1 extends Module {
	template() {
		return `
	<div>
		<button e-click="tiggerTransition">tiggerTransition</button>
		<div x-aniamtion={{transition}}>
			......
		</div>
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
}
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
import {createRoute} from './nodom.js';
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
import {createRoute} from './nodom.js';
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

* `Router.go`
* `Router.redirect`

用来切换路由，实现路由的跳转。

#### 路由传值

如果想要实现路由传值，只需在路径内以`:params`配置。例如：

```js
import {createRoute} from './nodom.js';
//这里默认Hello为一个完整的模块
import Hello from'./route/hello.js';
//创建路由
createRoute({
    path:'/main：id',
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

* `onEnter`事件 ，`onEnter`事件在路由进入时执行,

* `onLeave`事件，`onLeave`事件在路由离开时执行。 

执行时传入第一个参数：当前模块的根Model。

如：从/r1/r2/r3 切换到 /r1/r4/r5。
则`onLeave`响应顺序为r3 `onLeave`、r2 `onLeave`。
`onEnter`事件则从上往下执行执行顺序为 r4 `onEnter`、 r5 `onEnter`。

例如：

```js
import {createRoute} from './nodom.js';
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
import {Router,Module} from './nodom.js';
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

[Life cycle of Nodom ]:data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAa3BwUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9RaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAClVS3AGaVVLMAK8n+KnxjfQrifRNBIF5GdtxeEA+We6qO7ep7fXp04fD1MTPkpo8vMcyw+V0HXxDsui6t9kep3V1a6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WOSJUUPtWTYcL5oXYGzxjdnPHXij4YeMYI/h/wCBo9Y1CWXVNYtgkLz75XnkCFmy+DzgE5Y1msRTc+RNff6K34nTLLsTCj7acGr2smnqrN3XlZHodFZs/iLTrbXrXRZLjbqd1C9xDBsY7o0IDHdjAwSOCc1xXwj8RN/wgup6lrWpsYrfU74PdX05IjjWZgAWY8KBwPSrdWKmoev4W/zMY4WpKk6ttrW8732+49Horj/B/wAXvCHj6/mstC1qK9u4l3tCYpImK+qh1XcB3xnHGetdhVwnGouaDuvIxrUKuHn7OtBxl2aaf4h05FfUXwl8Xt4w8Hxm4k8zUbE+ROW6sP4WP1H6g18u16b+z/rh0/xq1gx/dahAyY/21G8H8gw/GvLzSgq2Hcusdf8AM+q4Vx8sFmUIX92p7r+e34/mz6FopWG1iKSvgz+ggooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAp8XMi/WmVJD/rFoA+VPitetffEPXJG/hn8ofRAE/wDZa5St7x9u/wCE48Qbuv8AaE//AKMbFYNfplBctKCXZfkfy3j5OeLrSe7lL82cP8cP+SR+K/8ArwkrmfiZodjbfBnRY4LWOBLKbT5LcRqB5TebGCV9Mhj+Zr1e+sbbVLOW0vLeK7tZl2SQToHR19Cp4I+tMutLsr6zFpc2dvcWq7SIJYlZBtIK/KRjggY9MVnVo+0cn3VvzOnC476vGlGz92fN66JW/B/eeU2muaJ4S+NviefxPc22m3d5a27aZfX7COM26riSNJGwoO/kjOTx1xxzmst/wkcvxa1Pwiv2nTrjS4rc3NnzFc3ShzKYyOGIRgCR1Jr3LWvDuleJLdINX0yz1SGNt6R3tukyq2MZAYHBwTz71ZsNPtdKs4rSytobO1hG2OC3jCIg9Ao4ArJ4aUrxb0u3563/AMzrhmlOnapGDc7Ri037touL2315Vp5tng/xC8eeAL74By6bpt/ps5axVLPTYSrTRSAZBMf3kK4YliB35551YdU0rwx8WNL1HxNNBZW1xoEEWlX15hYYpFyZlDn5VYgjqeQcZ5wfT4/AvhuKS9kTw9pSSXqst0y2UQM4Y5YOdvzAnk56mrupaDpmtaeLHUNOtL6xXaRbXMCyRjHT5WBHHap+r1G+ZtXVraaaX/z+Rp/aWGjB0YxlyycrttX97l208te6vtc8u0/UNM8SfFzXNV8OyQ3thFoRt9Qv7Ng0Es5bMa7xwzBAehOBgVz1lpNlH+yC4W1iAbTGuj8o/wBbvJD/AO9kDn2r3TTdF0/RdPFjp9ha2NkucW1tCscYycn5VAHOTTRoOmLo/wDZI060Gl7PK+w+QvkbP7uzG3Htin9Vbu21dqX42/yM/wC1IRcFCL5Yyg1rq1C+/m76dloeW/ErS7Sx+HfgdYLeOEW2raYYdgxsLOAxHucnPrk10/gttvxC8epJ/r/PtXXI/wCWZgAXHtkNXX3Wk2N9bw29zZW9xBC6yRRSxKyoy8qygjAI7EdKw7zwzdweObTxBprQATQfY9ShmYp5kYJaORSFOXUkjBwCGPIxV+xcZqa8vya/UxjjI1qEqEtG1LV+coyt/wCSv5s8z0/TZpfAeu6xYx79T0LxJe6lbgAZbZIfMQf70ZdfxFM1+6/4Sz4U/EDxkwcRapaNDYLIpUpaRcLwf7zl2/Eele22mm2mnxyx2trDbRyu0siQxhQ7tyzEAck9z3qNtF06TSv7LawtW03y/K+xmFTDs/u7MYx7YqPqrta/T8dr/czdZtFT5+TXmT/7dum4/ek18+55PrOo6X4c+LnhvVPErxW2nPovkabfXYxBBc7syAuflRimME9sjPPKzalZ+K/i9NqHhGaHUGt9BuIb6+sXDwtKxUwIXXhmGGPXgV6vqWi6frWnmx1Cwtb6ybGba5hWSM4OR8rAjjAo0nRdO0CzFppdha6bahiwgtIViTJ6naoAzVfV5Xtf3b38/wCv00M1mNJQUuV86i47+7bvbfrt318jxHwX428DaX8CxpN9e2EV4lnJBfaTPg3Ml10cGE/M7F++D+nFGx1G30HwZ8EtXv5VttNtZSk91IcJEXgdVLHsM9+gr3JvCGgtq0mqHRNOOpyAh702kfnMCu0gvjccrx16cVNJ4d0qbRxpL6ZZvpQUILFrdDAFByBsxtwD2xWX1WpZJtaKy07NPX7jqea4fmlKMJe/Jyldr7UZRaWn97RvfqeZDxVpXij4+eHzpN7DqMFvpF2r3NqwkhLFoztVx8rEDGQDxkZrgtUiu3+B08kNw1pZw+KZ5L24W3FwIoRctl2iP31VtpK98V9EWPhnR9La2az0mxtGtUaKBoLZEMSMcsqYHygnkgdasWelWWm2z29pZ29rbyMzvFDEqIzMcsSAMEkk5PeqlhZTvzPe/wCNv8iKea0qDh7KDtHl3t9lyfa2vN2dvM8T8O6b/b3jvwzeXnxc0zxZdWMkkttY2em26SEGMhwWiclVx/eGMgd8V7dY6laapAZrK6hu4Q7RmSCQOu5SQy5B6gggjsRWdpfg3RPDwuH0TR9N0e4mTYZrOzjiJ9M7QMgHnGad4R8Ox+E/DdhpMcpuPs0e15iu0yuSSzkZOCWJPXvW1CnKlo+u+rfbu2zhx2Kp4u0ov4bJK0Vpq3pFJb/PVs2K6D4fXjaf440KZeP9MiQ/RmCn9Ca5+tLwzuPiTSdv3vtcOPrvFb1VzU5J9mcOFk4YinJbqS/M+xJv9YajqSf/AFhqOvzE/qgKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKfGcSL9aZS9KAPln4sWJ0/wCImtxn+KbzR/wNQ3/s1clXrn7RWh/Ztf0/VkX93eQ+W5/20P8A8Sw/KvI6/RsFUVTDwku35aH80Z5h3hcyr0n/ADN/J6r8GFFFFdp4YUUUUAFcz8QLjWrXRrVtCaVbtr+1SQxQiU+S0qiXgqcDYSSccYzxXTUVEo80Wr2NqVRU6kZtXt0ezOE8f/EJPD95pum2w1GO+uL6FHeHSriZTEPnkCMsTK52KRhckZJ4xVfwr8UbO/s/Emq6hNew6XZzzSRyTaZcRRxW8YCt8xiG5twclclhnGOKoeMdNvZPHQnHibVLW303TbjUgsUdoRbk4RVXdAcgqJPvbj6EVm6n4du9B/Z91w3WrXl+9xojzNBcJCEhkdC77Skascsx+8WrzpVKqnJ9Ff8ABep9LTwuElQpQfxTcVvrq9be52S69X8+/wBJ+JHhrXLzULWy1eGaXT4VuLskMiQxsMgs7AKOOozkd8Vk6H8cvAviTXF0jT/EVvNfsxRI2jkjV2BxhXZQrEnpgnPbNc14/wBHW1+AVhbWFmf7Pghspru1tk5a3DI0wAHXIyT+NVPil4w8HeKvhzBpHh+/0/VNSuJLdNJsNPkRpopdwKERr80e1Qc5AwMg0TxFSG7V0r+vktfx19BUcuw1ZrljNqUnG6a921vel7uzve2lkviZ6N4z+JHhr4ewwyeINWh0/wA44jjKtJI/uEQFse+MCqLfF7wpN4Mu/E9rrMNzpVv8rzIjsUcnCq6Bd6kkjqBwc9Oa5G31nR/CPxs1u58VXNvp91d6fbDTNQvmEcXlKCJY1kbCg7zkjqcin+Fbqw174l+ONX8PlLjR5NNht57y1IMFxdjcSVI4YhCoJGetV9Ym5WTW7VuqtfXf8PxIWX0IUlOcZO0YycrpRd2rxXu6PW17vVP3SPw/8YLn4j/Cy9u9AuQPF1rBG1xb2dm7CF2fGFDqwb5Qem6uxn1y/wBB8e2FjfXX2jStahZbXzFRWguY13MgKqCVdMtzkgqecECsX9nnWtP1D4WaDZ2t9b3F5Z2wS5t45VaSFtzYDqDlenetH4lMv9r+B4wR57a5GyL3IEUhbH4daKcpujGq5Xen9fiGIhSjjauEhS5Ypz31e2mtlomrrybV3q302keJdN1681O1sbnz59Nn+zXS+Wy+XJgHbkgA8EcjIrUqta6laX0tzFbXUNxJbP5U6RSBjE+AdrAH5Tgg4PqKs16Eb21Z85Uspe6mvX/hkFFFFUZhRRRQAV0Xw7sTqHjrQoR/z+Rufop3H9Aa52vUf2fND/tDxhNqLj93p8BYH/bfKj/x3f8AlXJi6ipUJzfY9fKMO8VmFCiusl9y1f4H0JMcyGmUrHcxNJX5uf04FFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHPfEPwmPGnhG6sEVTeR/vrYnj94O2fcZH418ozQvbzPFKjRyRsVZGGCpBwQRX2grFWBFeafFL4QJ4rkk1bRgsWqn/XQMQqT++ezfof1r6DK8dGg/ZVX7r69j864ryGpmCWMwqvOKs13Xl5r8V6HzvRV7VtD1DQbprfUbOazmX+GVCM+4Pce4qjX2KkpK6Z+KThKnJxmrNdwoooqiAooooAKgvLK31K0mtbuCK6tplKSQzIHR1PUMp4I9jU9FIabTuhkMKW8SRRIscSKFVEGAoHAAHYVlaZ4N0DRdQkvtP0PTbC+kDB7m1tI45GBOSCygE5PWtiik4p2uti41JxTUW1ffzM/WfD+l+IrZbfVtNs9Ut1besV5AkyBsYyAwIzyefep9P0200izitLG1hsrSIYjgt4xHGg9AoGBVmijlV721D2k+Xkvp26Gdpnh3SdFuLqfTtLs7Ce6bfcSWtukbTNknLlQCxyT19TWU/hu71LxzFrN+8IstOhaPT7eJ2Zi7jEksgIABwNqgZ4JOecDpqKlwi0l0RpGvUi3K921a/W235aehheEfC6+FbK8iNx9ruLu8mvZpzGE3NI5IGMnhV2r/wABrdooqoxUVyozqVJVZuc3dsKKKKozCiirml6Pfa1dLb2FpNeTMcBIULH9OlJtRV2XGMpyUYq7ZUVWkZVVSzMcBQMkn0r6m+FvhBvBfhCGCdNmoXR8+5HdSei/gMD65rl/hf8ABn/hH54dY14K1/Gd0FmpDLEezMRwW9McD3PT1VmLMSa+PzTHRrfuaTulu+5+zcJ5BUwV8bio2m1aK6pd35v8F6jaKKK+dP0oKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAClBI6cUlFAD2k3qVdVdT1DDOaqf2Xpx5Om2hP8A1xX/AAqxRTUmtmRKEZfErlf+ytN/6Btp/wB+V/wo/srTf+gbaf8Aflf8KsUVXPLuR7Gn/KvuK/8AZWm/9A20/wC/K/4Uf2Vpv/QNtP8Avyv+FWKKOeXcPY0/5V9xX/srTf8AoG2n/flf8KP7K03/AKBtp/35X/CrFFHPLuHsaf8AKvuK/wDZWm/9A20/78r/AIVW1K00+xsJ510uzZo0LAGFcHH4Vo1Q17/kC3v/AFyb+VXTlJzSbIqUqag2or7iLR4bDUtNhuX0qzjaTPyiFccEj09quf2Xp3/QNtP+/K/4VU8M/wDIBs/90/zNadOrJxqSSfVipU4Spxbitl0K/wDZenf9A20/78r/AIUf2Xp3/QNtP+/K/wCFWKKz55dzX2NP+VfcV/7L07/oG2n/AH5X/Cj+y9O/6Btp/wB+V/wqxRRzy7h7Gn/KvuK/9l6d/wBA20/78r/hR/Zenf8AQNtP+/K/4VYoo55dw9jT/lX3Ff8AsvTv+gbaf9+V/wAKtpJ5aBI0WNR0VRgCmUVLk3uyowjH4VYUktyeaSiikWFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABVDXv+QLe/wDXJv5Vfqhr3/IFvf8Ark38q0p/HH1M6nwS9CPwz/yAbP8A3T/M1p1meGf+QDZ/7p/ma06qt/El6smj/Dj6IKKKKxNgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACud1nxJp8+n3duk5MrIyhSjDn06V0Ved+LLH7FrEpAwk37wfj1/XNd+DpwqVLS6ao4MZUnTp3jtsze0HxJp9ppdtbyzFZVGCuxj3PtXTV5p4dsvt2sW6fwq3mN9BzXpdPG04U6nu7vViwVSdSn72y0QUUUV556AUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFV9U1D+yNGvr4RiY28Zk2E4zgdM9q88/4Xc//AEBY/wDwI/8Asa8XHZzgctmqeKnytq60b/JM9LC5dicbFzoRul5pfmz0uivNP+F3P/0BY/8AwI/+xo/4Xc//AEBY/wDwI/8Asa8z/WvKP+f3/ksv8jt/sHMP+ff4r/M9LorzT/hdz/8AQFj/APAj/wCxo/4Xc/8A0BY//Aj/AOxo/wBa8o/5/f8Aksv8g/sHMP8An3+K/wAz0uivNP8Ahdz/APQFj/8AAj/7Gj/hdz/9AWP/AMCP/saP9a8o/wCf3/ksv8g/sHMP+ff4r/M9LrnPHFj5+nJcqPmhbn/dPH88Vy//AAu5/wDoCx/+BH/2NQ3nxk+2WssD6KmyRSp/0j1HX7tbUeLsop1FP22392X+RjW4ezCpTcPZ7+a/zOn8C2Oy3nu2HLnYv0HX9f5V1VeWaf8AGAabZxWsejo6RjAYz4Lep+73qx/wu5/+gLH/AOBH/wBjVYji7KKlWUvbf+Sy/wAicPw9mFOlGPs/xX+Z6XRXmn/C7n/6Asf/AIEf/Y0f8Luf/oCx/wDgR/8AY1z/AOteUf8AP7/yWX+R0f2DmH/Pv8V/mel0V5p/wu5/+gLH/wCBH/2NH/C7n/6Asf8A4Ef/AGNH+teUf8/v/JZf5B/YOYf8+/xX+Z6XRXmn/C7n/wCgLH/4Ef8A2NH/AAu5/wDoCx/+BH/2NH+teUf8/v8AyWX+Qf2DmH/Pv8V/mel0V5p/wu5/+gLH/wCBH/2NegaHq39vaDZ6gYRAZwW8sHOOSOuPavSwOdYHMqjpYWfM0r7NafNI48VluKwcFOvGyem6f5Mt0UUV7Z5gUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBl+Lv+RR1n/r2f+VfPNfQ3i7/AJFHWf8Ar2f+VfPNfjXHH+90f8P6s/RuGP8Ad6nr+gUUUV+bn2QUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFe/+Av8AkR9J/wBw/wDoTV4BXv8A4C/5EfSf9w/+hNX6JwR/v9T/AAP84nyHE3+6w/xfozbooor9pPzYKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAy/F3/Io6z/17P/Kvnmvobxd/yKOs/wDXs/8AKvnmvxrjj/e6P+H9Wfo3DH+71PX9Aooor83PsgooooAKKKKAMr+3v+Km/sb+zr//AI9ftX9oeR/on3tvl+Zn/Wd9uOnNatcA3ijUx8cD4fFz/wASj+wPtv2fy1/13n7N27G77vGM49q800HWfix42+Gsviaw8V2WlSae920dq2mxTtqKxyNgSNgCIYXaAik8ZJyePZhl0qiUnOMF7urb+1e2yfb5elzzZYxQbjyuT12t0tfqu57rqWvf2bq+lWH9nX919vd1+1W0G+C32ruzM2fkB6Drk1bh1SzuL64soruCS9t1VprdJFMkatnaWXOQDg4z1xXllv8AE7VdcvfhJdW7rZWviWKWa+tVRWDYt94UMQSAG9CPeuX8AeFvF8X7QHi95vHHnxW32OW9i/smFftsLK5jiyD+72DjcvJ71ostXs5urNQcYt9XdqfL0Tt2+7ztLxnvxVOLkm7dNPd5ur/rXyv9C0UUV4R6gUUUUAFFFFABXv8A4C/5EfSf9w/+hNXgFe/+Av8AkR9J/wBw/wDoTV+icEf7/U/wP84nyHE3+6w/xfozbooor9pPzYKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAy/F3/Io6z/ANez/wAq+ea+hvF3/Io6z/17P/Kvnmvxrjj/AHuj/h/Vn6Nwx/u9T1/QKKKK/Nz7IKKKKACiiigDi28F3zfF0+KfNt/7P/sX+zfL3N5vmedvzjbjbj3zntVb4d+AdQ8I/DKTw7eTW0l632vEkDMY/wB7I7LyVB6MM8evWu9ortljKsoKm9vd/wDJb2/NnMsPBS5+uv42v+R5Pofwn1fTIPhWktzZMfCsDxXux3PmFoPLHlfJyM/3tvFXW8E+LNH+MN34k0a70eTQNXit4tTt75ZR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UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFUNe/wCQLe/9cm/lV+qGvf8AIFvf+uTfyrSn8cfUzqfBL0I/DP8AyAbP/dP8zWnWZ4Z/5ANn/un+ZrTqq38SXqyaP8OPogooorE2CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK8y16zOn6rcQ87N25f908j/PtXptcl48sdyW94o6fu3/mP6/nXo4GpyVeV9TzsdT56XMuhzWk2zXuo20AyQzjP06n9K9SrjPAlj5lxPdsOEGxfqev6fzrs6rMKnNU5V0Jy+ny0uZ9QooorzD0wooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAbPcQWdpNc3MnlQQrud8E4HrxWH/wALB8M/9BVf+/b/APxNWvF3/Io6z/17P/KvnmvgeIuIMTk9eFKhGLUlfW/fyaPq8nymjmFKU6smmnbS3+TPfP8AhYPhn/oKr/37f/4mj/hYPhn/AKCq/wDft/8A4mvA6K+T/wBd8f8A8+4fdL/5I9//AFZwn88vw/yPfP8AhYPhn/oKr/37f/4mj/hYPhn/AKCq/wDft/8A4mvA6KP9d8f/AM+4fdL/AOSD/VnCfzy/D/I98/4WD4Z/6Cq/9+3/APiaP+Fg+Gf+gqv/AH7f/wCJrwOij/XfH/8APuH3S/8Akg/1Zwn88vw/yPfP+Fg+Gf8AoKr/AN+3/wDiap6x408M6jptxbjVELsvy5jf7w5H8PrXh9FVHjjMItSVOGnlL/5ImXC+EknFzlr6f5HtmgeMPDel6XDBJqirN96QBHPzHqPu9un4Vof8LB8M/wDQVX/v2/8A8TXgdFOfHOYTk5OnDXyl/wDJChwvhIRUVOWnp/ke+f8ACwfDP/QVX/v2/wD8TR/wsHwz/wBBVf8Av2//AMTXgdFR/rvj/wDn3D7pf/JF/wCrOE/nl+H+R75/wsHwz/0FV/79v/8AE0f8LB8M/wDQVX/v2/8A8TXgdFH+u+P/AOfcPul/8kH+rOE/nl+H+R75/wALB8M/9BVf+/b/APxNH/CwfDP/AEFV/wC/b/8AxNeB0Uf674//AJ9w+6X/AMkH+rOE/nl+H+R75/wsHwz/ANBVf+/b/wDxNbdnd22pWMV3aS+dby8o+CM8kdx7V80V7/4C/wCRH0n/AHD/AOhNX1PDvEOJzfEzo14xSUb6X7pdW+54WcZRQy+jGpSk227a27PyNuiiiv0E+SCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMvxd/yKOs/9ez/AMq+ea+hvF3/ACKOs/8AXs/8q+ea/GuOP97o/wCH9Wfo3DH+71PX9Aooor83PsgooooAKKhvLyDT7Wa5uZo7e2hQySTSsFVFAyWJPQAVw/g348eA/iBrZ0jQfEMV7qO1nEDQSxFwOu0uihj3wCeMnpW9PD1qsJVKcG4x3aTaXq+hlKtTpyUJySb2V9/Q76iuH8dfGzwR8Nb6Gy8R6/DYXkq71t1ikmkC+rLGrFQe2cZwcdK43xt+0/4W8H+PNF0iXVrX+y5bd59Quvs08rRBo1e3KFFwwbdzgN+FddDLcZiLezpSaabWj1S3tpr29bI56mNw9G/PUSs0nqtL9z2qiuCuvF3hvw/4m8Q6rd+ItRLWelwXV5p7iWS1tbclisyRhPvNzuwS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xMxynGYCEvb02lbfdfejY8M/8gGz/wB0/wAzWnWZ4Z/5ANn/ALp/ma066a38SXqzx6P8OPogooorE2CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKiuruCxhaa5mjt4V6ySsFUfiao3nifSrHQptakvon0uFS73UBMqYB2nGzOcHjj0pNpbmkac525U3fT59jTornNC8f6T4o8O32s6Q8l9aWhkVtsZRmZEDFQGx2I6+tUfh38Qn8fx30p0W80iK3KBGu1I84MG5HAHG3sT1FR7SLaSe50SwdeMZzlCyhZO+lr+W52NFcN4G1rxxqmuXq+I9EtNL0pI2+zywuC7vuAGRvJxjJ6Cl0nQfGkPju5v9Q1+3uPDm+XyNPjQBwhzsBIQcjPcnp3pKpdJpPU0lg/ZylGdSN4q+97+StdXO4qrdarZWMqR3N5b28khARJZVUsScAAE881yN98M5r74gR+Jm8QX6RRujppqk+SNqBSOvQ4ycDqateJ/hXoHi/xFaa1qUU0l5axpHHslKLhWZgSB1OWP5CjmnZ2j+IRpYVSjz1W01d2js+2rV/U0vE3jfQ/BwhOs6jFYecGMYkBJfGM4AB6ZH51X8ZfEDSfA+iW+rai8rWdxIscbW6byzMpYd+4U81d17wjovilrZtX0231A227yvtCbgm7G7j32j8qvvp9rJbxQPbRPDDjy42QEJgYGAemBQ+fW1vImMsLFU3JSb15tUl5W/W5zmpf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FF1/ZkTZg0kAmPBj2sG5x1JI4J6c8V3FFHs7/E763D65yNuhBQvHlfW/d63s35GLP4L0K618a3PpdtPqoChbqVNzLt+6RngEeo5raoorRJLZHHKpOpZTbdtF5BRRRTMwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKV9sMTSyusMSjLPIcAD1NedeLPjx4b8Ob4rBm1y8XjFucRA+79D/wEGurD4WvipctGDkzlxGKoYWPNWmoo9HWNn6DiuU8V/FHw14N3peXwurxf+XS0xJJn0POF/Eivnzxd8ZvE3izfE13/AGdZNx9mssoCP9pvvH88e1cLX2WD4ZeksXL5L/P+vU+NxnEy1jhI/N/5f16Hq3iz9obXdaDwaTGmi2p43Id8xH+8RgfgM+9eXXV1PfXDz3M0lxO5y0krFmY+pJ61FRX2eHwdDCR5aEEv677nxmIxlfFy5q82/wCu2xJBcS2sySwyPDKhyskbFWU+oIr03wl+0F4g0LZDqW3W7QcfvjtmA9nHX/gQP1ry6iniMJQxUeWtBP8AruLD4uvhZc1Gbj/XY+t/Cnxa8MeMNkcF79gvW/5dbzCMT6Kc4b8Dn2rsWjZOo49a+F67Xwj8X/EvhDZHBem8s14+y3mZEA9Aeq/gce1fG4zhneWEl8n/AJ/16n2WD4m2ji4/Nf5f16H1hRXm3hX4/eHdf2Q6mraJdtxmQ7oSfZx0/wCBAfWvSYWS5hSa3lS4hcZWSNgysPUEda+MxGEr4SXLWg1/Xc+zw+LoYuPNQmn/AF2CiiiuQ6wooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKyfFXiiw8G6HPq2pu8dpDgMY4y5yTgDA9SQOeOaTairsuEJVJKEFdvZGtVfUNStdJspby9uIrS1iG6SaZwqqOnJNcpb+J734hfD2bU/CrtpuoXAZbZr2MZRlfHzDkcgdeeoqfwv4R1BfBs2jeLNQXxBLcmQTvhgNj9UznJwc4IxjjAGKz5+b4V036HZ9WVJN15WalZx+15vt+JYt/Gtt4i8L6jqvhhk1l7cSJHGNyCSVBnZyM85GPXIqh4NbxP4k8NalF4vsYdMnui8cUdo+GWFkxjhjhgc85zz2xXSaLoOneHLJbTS7KCwthz5cCBQT6n1Pueav0KMnZyf+QSr0oKUKMNG7pv4lb00/A5P4e/DXS/hvZ3EGnSXM73JVppbmTcXIzg4AAHU9Bn1JrrFUKoAGAOABRRVxioLlitDmrVqmIqOrVleT3YUUUVRiFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRXnX7QfxA1j4X/CXWvEegQWNzrFq0CW8eoq7QFpJkj+cIytj5+xqX4J/FL/haXhOSe9tV0vxLpdw2na3pQzm0u04YDPJRuGQ91YUAegUV5r+z78TNT+K3w5PiDWIbO1uxqV9aFbNGSPZBcyRKcMzHJVATzjOenSuk8M/FDwZ411GfT/D3i7Qtev4FLy2umalDcyxqDgllRiQMkDJ7mgDpqKKKACiiigAooooAKKKKACiinKpboM0ANpQC3AGaxvEvjTQvB0W/V9RigkxlbdTulb6KOfx6V474s/aSvLjfB4dslsYuguroB5D7hfuj8d1erhMrxWN1pQ07vRf16HlYvNMLgtKs9ey1f8AXqe56pqdjoNobrU72Gxtx/HM4XPsM9T7CvJ/Fn7R+n2G+Dw7Zm/l6C6ugUi+oX7x/HbXg+sa5qHiC7N1qV5Nezn+OZyxHsPQewqjX22D4boUrSxD5322X+b/AK0PicZxJXq3jh1yLvu/8l/Wp0Hijx9r3jKQtqmoSTRZytuvyRL9FHH4nmufoor6ynThSioU1ZeR8nUqTqyc6jbfmFFV77ULXS7V7m9uYbO2TG6aeQIi5OBkngckVYBzyORV3V7EWdrhRSMyxqWYhVUZLE4AFQ2OoW2qWcV3ZXMN3ayjdHPA4dHHqGHBFF1ewWdrk9FFFMQUUUUAFbnhnxtrfhCbzNK1Ga2XOWhzujb6oeD9etYdFZzpwqRcJq68zSFSdOSlB2fkfQPhT9pK0utkHiOxNs/Q3loCyfUp1H4E/SvWtH1jTvEVoLrSr6G+g7tE4JHsR2Psa+JKt6Xq17ot2t1YXc1ncL0khcqfpx29q+UxnDmHrXlh3yP71/wP60Pq8HxHiKNo4hc6+5/8H+tT7bKleoxSV8/+E/2kNRsQkHiCzXU4Rx9ogASYe5H3W/8AHa9k8L+OtA8Zxg6VqMbz4ybWX5JR/wABPJ+oyK+JxeV4vBa1Iad1qv8AgfM+2wmaYXG6U5a9no/+D8jcopzIydRTa8k9YKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKRmCKWYhVAySeAK5nx742bwb4ej1K10y41uSaRYoYbTnczAlSSMnbx1APUVMpKKuzajRnXmqdNXb0OnrnfHHjW38E+G31iS1n1CLciIlqAxJbhSTnhScDPPUcGsrWvDt38UvANjb6hJeeGrqfy5rmGIncMZDRkZ5U8kZ6cEjjFdH4Z8O23hXQbPSbR5pba1TZG1w+98ZJ5OB6/hUXlLRaK2/8AwDqVOhRtKo+aSlZx8l/e8/I528j1b4lfDuBrWa88IaldhXYMGEkQDYZT90kEZIxjqPcVr+GPCEHh/wAK22h3E76xBCCC98qsXyxbkY6A9M56Dmt+imoK/M9XsZzxU3B0oe7Dm5kuz9d9PUFUKoAGAOABRRRWhxhRRRQA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+S3X7HeElforjkfiD9a+2wfEeHrWjXXI/vX9f1c+JxnDmIo3lQfOvuf9f1Y8Bora8SeDda8I3Hlarp81pzhZGGY3/wB1hwfzrFr6qE41IqUHdPsfKzhOnJxmrNdwoorW8PeE9X8V3PkaVp814+cMyLhF/wB5jwPxNOc404uU3ZIUISqSUYK7fYyasWOn3WqXSW1nby3Vw5wsUKF2P0Ar3Hwn+zYseyfxJf57/Y7I/ozkfyH4169oXh3SfC9r9n0jT4bGPuUX5m/3mPJ/EmvlcZxFhqN40Fzv7l9/9ep9Vg+HcTWtKu+Rfe/u/r0PBfCX7Omsapsn1udNItjz5S4kmI+g4X8ST7V7N4V+HHhvwXtbTtPWS6H/AC93H7yX6gnp/wABAro2YtyTmkr4nGZti8ZdTlaPZaL/AIPzPtsHlOEwdnCN5d3q/wDgfIc0jN1NNoorxz2AooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACs6LXLLULy+0+xvreXUrVAZYd24xE527gD6jpXMeH/AIlN4l8danoNto14tlYKyTahKu1RKD90g9AR07n0xzV7wb8MtB8C3V7daZbN9runZnuJm3uFLZ2Keyjj3OBkmsVNztybdT0ZYeOHUlibqdk4pWe/fXTTpuU/hvpfjC2XU7rxdqEFxJdyZisoVBW3AyOCOMEY456ZJyTXZW1rDZ28cFvEkEEY2pHGoVVHoAOgqSirjFRVjmr15Yio5tJX6JWX3BRRRVnOFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUVDqN8dM0i/vFQSNbwPKFbodqk4/SvNf+F2XX/QKg/wC/h/wrxMwznBZZKMMVKzeq0b/I9PCZbicbFyoRul5pHqFFeX/8Lsuv+gVB/wB/D/hR/wALsuv+gVB/38P+FeV/rZlH/Px/+Ay/yO7+wMw/k/Ff5nqFFeX/APC7Lr/oFQf9/D/hR/wuy6/6BUH/AH8P+FH+tmUf8/H/AOAy/wAg/sDMP5PxX+Z6hRXl/wDwuy6/6BUH/fw/4Uf8Lsuv+gVB/wB/D/hR/rZlH/Px/wDgMv8AIP7AzD+T8V/md/4gsf7Q0m4iAy4Xen1HP/1vxrlvBFj9o1J7hhlYF44/iPH8s1k/8Lsuv+gVB/38P+FU9M+Kz6THKkGlQkSSGQ7pDxnt06Cu6nxnlMKE6ftXr/dl8+hxVOGcfOtCpybea+XU9cory/8A4XZdf9AqD/v4f8KP+F2XX/QKg/7+H/CuH/WzKP8An4//AAGX+R2/2BmH8n4r/M9Qory//hdl1/0CoP8Av4f8KP8Ahdl1/wBAqD/v4f8ACj/WzKP+fj/8Bl/kH9gZh/J+K/zPUKK8v/4XZdf9AqD/AL+H/Cj/AIXZdf8AQKg/7+H/AAo/1syj/n4//AZf5B/YGYfyfiv8z1CivL/+F2XX/QKg/wC/h/wrqPAvjybxhdXcUtnFbLDGHBRiSSTiuvC8RZbjK0cPQm3KW2j/AMjCvk+Mw1N1asbRXmjqKKKK+lPFCiiigAooooAKKKKACiiigAooooAKKKKAClpKKACdI7u3eC5hjuYHGHjlUMrD0IPWvM/Fn7P/AIe1zfPpcraJdHnao3wk/wC6Tx+B/CvTKyPFv/Iv3f8AwD/0Na78Hia+HqL2M3G7/rTZnBjMNQxFN+3gpWX9a7o4Xwn+z1oWjhJ9ZnbWbkc+UuUhB+gOW/E49q9PtYINPtktrO3itLdBhYoUCqPoBVPQ/wDkDWX/AFxX+VXqMXi8Ripv203K33fdsPCYTD4WC9hBRv8Af9+4tJRRXAdwUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRXGePvidaeBb3S7E2F3qeoahIFit7VDnbkBmBxgkf3Rz64BzUykoK8jehQqYmap0lds6a+1zT9NvLO1uryG3ubx/Lt4pHAaVsZwB3/8A1etcn/YXjC6+Jn9ozaxDb+GLaPENlCvM+5cEOPUEZ3Z9MDk1d1L4Z6FrXjG28TXsElxfQRqscUjkxBlOVfaf4h+XfGea6yo5XN+90en/AATpVWnh4r2OrlG0rpaN/wAu/TqIqhSxAALHJwOvaloorU88KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKHiT/kVdb/685f/AEBq+dK+i/En/Iq63/15y/8AoDV86V+O8cf7zR/wv8z9E4Y/g1PX9Aooor80PtAooooAKKKKACiiigAooooAKKKKACiiigAr0n4J/wDIR1T/AK4r/M15tXpPwT/5COqf9cV/ma+m4a/5G1D1f5M8TOv+RfV+X5o9Rooor+hz8iCiiigAooooAKKKKACiiigAooooAKKKKACiiigArJ8WLu8P3Y9lP/jwrWrK8Uf8gG7+g/8AQhW1H+LH1RjW/hS9GT6H/wAgay/64r/Kr1UdD/5A1l/1xX+VXqmp8cvUqn8EfQKKKKzNAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKOnJqO6uobK3kuLiVIII1LvJIwVVUdSSegrhry/wBP+NXgnU7TQNams1Mpge4jUqeCCQQcEow9xkH6iolLl0W/Y6aNB1PelpBNJys2lct/Ei68UXHh+2TwatvNcXcgR7tpB+5jI++ueCPfnHYHt02n2s32OybUfIuNRhjAeeOPA3kAOUzyAaqeE/DNr4P8P2ekWbzSW9su1Wncsxyck+3JPA4Fa9KMXfmf3F1a0eVUaaVk371rSd+/y6BRRRWhxhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAUPEn/Iq63/15y/8AoDV86V9F+JP+RV1v/rzl/wDQGr50r8d44/3mj/hf5n6Jwx/Bqev6BRRRX5ofaBRXJ/FDxtJ4B8G3Wq29st7fGSO2tLeRtqyTyuEjDHsuWBPsDXP+FdG+IHheaXWfFvjWz1zTlt5JbrS4NKSBbYhS37qVTucKRt+ccg561208K50fbOSXRJ3vJrdKyfdb2RyyrqNT2ai332sl53a/C56ZRXhOhn4s/EXw/B4y07xfp3h22vI/tVh4dGlx3ETxdY1mnY7wXGN23pnjHQLqXxb8T694d+GGoaGtvp2oa/qD2l7aTqGhDLHIHBJBbarIWwpBOMZ5zXd/ZNTm5Y1ItptPV+60m7O68nqrrTc5vr8Lczg0nqttVdLTXzW9n5HutFeDpqPxQ0bxxJ4En8VWGrXOrWLX9p4hk0xIn09EbbIPs6nbIcldu49SSSQMUwePvGnhfwv8UdI1fWYdV13wzYi8stcis44TIskTOu6EAoCpXHQg980/7JqO3JUi72atfVNqN9YrS7s0/e8rah9fivihJb9t0r237a9vM97rKk1/y/EiaR/Z2oNutWuv7QWD/RFwwXyzJnhznO3HSvG9cv8A4rab4Lg8ep4l00Q2tjHez+F/7PQxTRhdz7rr7+8qS3yqq5wBxyetsfHd/rHxU0awgnKaHf8Aho6n9laNc+YZFCsWxu4VsYzj2rN5dKEXNSjJJSvZvRrdbLXta6fcr64pNR5XF6b21T+f/BXY67wT4ysvHvh6LWdPiuIbWSSSIJcqqvlHZDwpIxlTjnpW9XzZ4f8AiePhX+zrp2oJJBBd3eqXFnBPdRu8MJa5kLSOqAswVQxwOSQBUfws+O0918RtG8Pn4iW/xEtNXEkbMdCfTJrKRELqV+UK6sAwOeRgY757auSV5e2q0V7kHK2ktVHfVJpWX8zV+lzmp5nSXs4VH70ku2720vf7k7dT6Xooor5o9oK9J+Cf/IR1T/riv8zXm1ek/BP/AJCOqf8AXFf5mvpuGv8AkbUPV/kzxM6/5F9X5fmj1Giiiv6HPyIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACsrxR/yAbv6D/wBCFatZXij/AJAN39B/6EK2o/xY+qMa38KXoyfQ/wDkDWX/AFxX+VXqo6H/AMgay/64r/Kr1TU+OXqVT+CPoFFFFZmgUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUE4BOM01pEjZAzKpc7VBOMnBOB+AP5VxFha+Nrr4lXVzd3FtZ+FbeMxw28fzm53chj3VgepPTGADkmolLltpc6aNH2qk3JR5VfXr5LuyHwZ4zn+Jdx4hs73w7JbaBExto5bsYM3VXR1Pfr06dDzXYaFoOn+GdLh07TLWOzs4RhI4x+ZJ6knuTyav0Uoxt8Tu+5VeuqjapR5Iae7dtaK1/UKKKK0OQKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAoeJP+RV1v8A685f/QGr50r6L8Sf8irrf/XnL/6A1fOlfjvHH+80f8L/ADP0Thj+DU9f0CiiivzQ+0OY+JHgaD4i+EbvRZrqSwkkKSwXkIy9vMjBo5AMjOGA4yM1z3g/SfiZNeGy8aX3hm80JYHiZtLhmF1dkrtHmb/kUEEsdo68DivSKK7KeLqU6To2TW6utU3u0+myOaWHhKp7TVP139TxHTfh78VvB+nf8Iv4c8ReHZPC0YMNrf6pBM2o2cLcbVVf3blB90secc4HA3G+DbaTb/Dix0e4jNj4XvWuLiS8dvNnBidWYYUgsXfJBwOTXqVFdU8zrzd9E9b2SV201d93Zv7zGOBpRVtXta72Sadl9yOKvvBd9dfF7SvFSS240+10ieweNmbzTI8qOCBtxtwp759q4b4reDL3SdD+MHiGaW3ay1bQ0jgjRmMimKJw24EYHUYwT+Fe3VQ17Q7HxNot7pOpQfadPvImgnh3sm9GGCMqQRx6Gpw+PnSqQlLZWXyUlL77odbCxqQklu7v5tWPFh4B+I/jHwfpnhqfxDoqeCryyt1uL1beQas0BRS0WP8AVcj5NwAOOcZ4PfR/D+5tfifp+v2726aTaaG2lLCWbzQ3mKynG3G3avXOfauzsrOHT7OC1t08u3gjWKNMk7VUYAyeTwKnp1cxq1LqKSWuyS+Ldu3XYVPB042bu3p1vtsvQ8esvgjqP/CqbDw/JqsOn+IdN1CTU7DUrUGWOGbzndMhgNwKvtII7nrXQeCbX4oSawknjG+8MRabChxb6DDO0lwxGBvaX7oHX5RyfQV6DRUVMwq1YyjUSfM29Urq+9u36dNSo4SnTcXBtWst97bXCiiivNO0K9J+Cf8AyEdU/wCuK/zNebV6T8E/+Qjqn/XFf5mvpuGv+RtQ9X+TPEzr/kX1fl+aPUaKKK/oc/IgooooAKKKKACiiigAooooAKKKKACiiigAooooAKyvFH/IBu/oP/QhWrWV4o/5AN39B/6EK2o/xY+qMa38KXozwP4o5+Cvjnwp8XrWLZoV1BFoXi0JwBbuwFvdt6mJztJ/utVr4W6rYeOfFHiz4665ceV4cs4ZtO8OST52QadDkz3agjgzOrcjqir613Xxk0e48Qfs7+LdNtLGTUrq50GeOG0hiMryuYjtVUAJZs4wAM5rN1D4Z3fjX9lZfA0af2Pf33hiOwWOaIp5EvkKArrwRhhgjqOamp8cvUqn8EfQ5aH9qbxNZy2Gu698I9Y0H4a380UcHiibUreS4RJiFhlmsV/eRISwzljtBB5zitbxX+0N4oXx9rXhzwF8L7zx7D4feKLWr5dYt7AW8kiCQJEkvMx2HPGOePevm7wJ8FPhxLfaL4f1T9l/xxb+Mo5YoLy+N3dLoySKw8ydbw3WwoFBcAKcnCjOQa9H/aHig1Hx1qUeg/CT4gwfE63gFrofjbwrH5FnLuVTH590JVTy8jY6zI21QRwDmszQ+uLeb7RbxS+W8XmKG8uQYZcjOCOxqSs3w0upx+HdLXWnjl1hbWIXjxY2NNsG8jAAxuz0FaVABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVm+IfEem+FdLl1HVbpLO0jwDI+TknoAByT7Cl8ReILLwtot3quoSGO0tk3uVXJPOAAPUkgfjXJ2Nvofxy8I6bqOp6TPFAk/mxQ3BKnKnBwR95GHHv9RWUpfZj8R3YfDqSVesn7JOza++yv1/Id4g+H8HjzxRoHiFtank0qzQTRWlu+Ed8hkkVl6Z7nqQBgiu7psMKW8SRRIscaKFVEGAoHAAHYU6qjFRba3ZlWxE60Ywk/djovJXuFFFFWcwUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAUPEn/ACKut/8AXnL/AOgNXzpX0xcW0V9Y3NpPu8q4jMT7eDtIIP8AOuU/4VP4c9Lr/v7/APWr8+4myLF5tWpzw9rRVtXbr6H1uS5pQwFOca17t9DxKivbf+FT+HPS6/7+/wD1qP8AhU/hz0uv+/v/ANavjf8AUzM+8fv/AOAfRf6x4L+993/BPEqK9t/4VP4c9Lr/AL+//Wo/4VP4c9Lr/v7/APWo/wBTMz7x+/8A4Af6x4L+993/AATxKivbf+FT+HPS6/7+/wD1qP8AhU/hz0uv+/v/ANaj/UzM+8fv/wCAH+seC/vfd/wTxKivbf8AhU/hz0uv+/v/ANaqmm/DvwtqkcjwC8wjbTukxz+VV/qXmjTa5dPN/wCQv9ZcCmk76+X/AATx2ivbf+FT+HPS6/7+/wD1qP8AhU/hz0uv+/v/ANap/wBTMz7x+/8A4A/9Y8F/e+7/AIJ4lRXtv/Cp/Dnpdf8Af3/61H/Cp/Dnpdf9/f8A61H+pmZ94/f/AMAP9Y8F/e+7/gniVFe2/wDCp/Dnpdf9/f8A61H/AAqfw56XX/f3/wCtR/qZmfeP3/8AAD/WPBf3vu/4J4lXpPwT/wCQjqn/AFxX+ZrpP+FT+HPS6/7+/wD1q1/DvhDS/C808tj5waZNjeY+4dc+le1k/C+PwOPpYmry8sb3s/JrsedmOd4XFYWdGne78vP1Naiiiv1k+BCiiigAooooAKKKKACiiigAooooAKKKKACiiigArK8Uf8gG7+g/9CFatZXij/kA3f0H/oQraj/Fj6oxrfwpejJ9D/5A1l/1xX+VXqo6H/yBrL/riv8AKr1TU+OXqVT+CPoFFFFZmgUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFMuLiK1heaeRIYYxueSRgqqPUk9K46b40eCbeQo3iK0JH9zcw/MAiolOMfidjopYetXv7KDlbsm/yO0orh/+F3eB/wDoYbf/AL4f/wCJo/4Xd4H/AOhht/8Avh//AImp9tT/AJl950f2fjP+fMv/AAF/5HcUVw//AAu7wP8A9DDb/wDfD/8AxNH/AAu7wP8A9DDb/wDfD/8AxNHtqf8AMvvD+z8Z/wA+Zf8AgL/yO4orh/8Ahd3gf/oYbf8A74f/AOJo/wCF3eB/+hht/wDvh/8A4mj21P8AmX3h/Z+M/wCfMv8AwF/5HcUVw/8Awu7wP/0MNv8A98P/APE0f8Lu8D/9DDb/APfD/wDxNHtqf8y+8P7Pxn/PmX/gL/yO4orh/wDhd3gf/oYbf/vh/wD4mj/hd3gf/oYbf/vh/wD4mj21P+ZfeH9n4z/nzL/wF/5HcUVw/wDwu7wP/wBDDb/98P8A/E0f8Lu8D/8AQw2//fD/APxNHtqf8y+8P7Pxn/PmX/gL/wAjuKK4f/hd3gf/AKGG3/74f/4mj/hd3gf/AKGG3/74f/4mj21P+ZfeH9n4z/nzL/wF/wCR3FFcP/wu7wP/ANDDb/8AfD//ABNH/C7vA/8A0MNv/wB8P/8AE0e2p/zL7w/s/Gf8+Zf+Av8AyO4orh/+F3eB/wDoYbf/AL4f/wCJo/4Xd4H/AOhht/8Avh//AImj21P+ZfeH9n4z/nzL/wABf+R3FFcP/wALu8D/APQw2/8A3w//AMTR/wALu8D/APQw2/8A3w//AMTR7an/ADL7w/s/Gf8APmX/AIC/8juKK4f/AIXd4H/6GG3/AO+H/wDiaP8Ahd3gf/oYbf8A74f/AOJo9tT/AJl94f2fjP8AnzL/AMBf+R3FFcP/AMLu8D/9DDb/APfD/wDxNH/C7vA//Qw2/wD3w/8A8TR7an/MvvD+z8Z/z5l/4C/8juKK4f8A4Xd4H/6GG3/74f8A+Jo/4Xd4H/6GG3/74f8A+Jo9tT/mX3h/Z+M/58y/8Bf+R3FFcP8A8Lu8D/8AQw2//fD/APxNH/C7vA//AEMNv/3w/wD8TR7an/MvvD+z8Z/z5l/4C/8AI7iisDw/4+8O+KpjDpOsWt7OBu8lHw+PXacHH4Vv1opKSumcdSnOjLlqRafZ6BRRRTMwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKRmKqSFLEDO0dTS1wxsvGd58UBcPcw2fhK1gwsUZDG5LDkMDyGDDOegAAGcmolLltpc6KNFVea8lGyb16+S82N8A+JNc8cNro1zw+um6OJWgto7kfvJFGVdXU8MOOT05I5xmu5hhS3iSKJFjjRQqogwFA4AA7CnUURi4qzdx16sas3KEeWPZXt+IUUUVZzBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXOeCf+PS8/67n+Qro65e38M6nZ7xb6isKs24qoPWuujyuE4Sdr2OStzKcJxje1zqKK5z+xda/wCgt+ho/sXWv+gt+hpexh/z8X4/5D9tP/n2/wAP8zo6K5z+xda/6C36Gj+xda/6C36Gj2MP+fi/H/IPbT/59v8AD/M6Oiuc/sXWv+gt+ho/sXWv+gt+ho9jD/n4vx/yD20/+fb/AA/zOjornP7F1r/oLfoaP7F1r/oLfoaPYw/5+L8f8g9tP/n2/wAP8zo6K5z+xda/6C36Gj+xda/6C36Gj2MP+fi/H/IPbT/59v8AD/M6Oiuc/sXWv+gt+ho/sXWv+gt+ho9jD/n4vx/yD20/+fb/AA/zOjornP7F1r/oLfoaP7F1r/oLfoaPYw/5+L8f8g9tP/n2/wAP8zo6K5z+xda/6C36Gj+xda/6C36Gj2MP+fi/H/IPbT/59v8AD/M6Oiuc/sXWv+gt+ho/sXWv+gt+ho9jD/n4vx/yD20/+fb/AA/zOjornP7F1r/oLfoaP7F1r/oLfoaPYw/5+L8f8g9tP/n2/wAP8zo6K5z+xda/6C36Gj+xda/6C36Gj2MP+fi/H/IPbT/59v8AD/M6Oiuc/sXWv+gt+ho/sXWv+gt+ho9jD/n4vx/yD20/+fb/AA/zOjrK8Uf8gG7+g/8AQhVH+xda/wCgt+hqDUtP1Cz0e+a7vftSGMALzwdy81pTpxjOLU09V37mdSrKVOScGtH2NzQ/+QNZf9cV/lV6qOh/8gay/wCuK/yq9XLU+OXqdVP4I+gUUUVmaBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB45+0JJNqt74M8LiZ4bTWdRCXBTgkB41H5eYT9QK7y0+C/gizt0hTw3ZOqjG6ZC7H3JJJNcH8av+SlfCz/ALCf/tW3r3GuOMYyqzclfb8j6TEV6uHwGFjRm4pqTdna75mtbeSOP/4VD4K/6FnTf+/Ao/4VD4K/6FnTf+/ArsKK6PZw/lR5H13Ff8/Zfezj/wDhUPgr/oWdN/78Cj/hUPgr/oWdN/78Cuwoo9nD+VB9dxX/AD9l97OP/wCFQ+Cv+hZ03/vwKP8AhUPgr/oWdN/78Cuwoo9nD+VB9dxX/P2X3s4//hUPgr/oWdN/78Cj/hUPgr/oWdN/78Cuwoo9nD+VB9dxX/P2X3s4/wD4VD4K/wChZ03/AL8Cj/hUPgr/AKFnTf8AvwK7Cij2cP5UH13Ff8/Zfezj/wDhUPgr/oWdN/78Cj/hUPgr/oWdN/78Cuwoo9nD+VB9dxX/AD9l97OP/wCFQ+Cv+hZ03/vwKP8AhUPgr/oWdN/78Cuwoo9nD+VB9dxX/P2X3s4//hUPgr/oWdN/78Cj/hUPgr/oWdN/78Cuwoo9nD+VB9dxX/P2X3s4/wD4VD4K/wChZ03/AL8Cj/hUPgr/AKFnTf8AvwK7Cij2cP5UH13Ff8/Zfezj/wDhUPgr/oWdN/78Cj/hUPgr/oWdN/78Cuwoo9nD+VB9dxX/AD9l97OP/wCFQ+Cv+hZ03/vwKP8AhUPgr/oWdN/78Cuwoo9nD+VB9dxX/P2X3s4//hUPgr/oWdN/78Cj/hUPgr/oWdN/78Cuwoo9nD+VB9dxX/P2X3s4/wD4VD4K/wChZ03/AL8Cj/hUPgr/AKFnTf8AvwK7Cij2cP5UH13Ff8/Zfezj/wDhUPgr/oWdN/78Cj/hUPgr/oWdN/78Cuwoo9nD+VB9dxX/AD9l97Pn748fD3RvA+gWPifw3Zpo+p2V7H89sSFYHOPlzjIIHTtmvbNPuvt1jbXGNvnRrJj0yAa86/ae/wCSWy/9fcP8zXe+H/8AkA6b/wBe0f8A6AKwppRrSUdrL9T08XUnXy6hUqu8lKau9Xb3XYv0UUV1nz4UUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUkkixozuwRFGSzHAA9TS1xmsX2g/E601/wnbau6XUK+Xc/ZWwycjoejLn5WH1BxUyly+p0UaTqyu78qtdpXsr2uVPHXhO5+KFvoMml+IRbaIs4uJzatkzKOVZHH8QIx6DOeqgV3sa+WiqCSFGMscn8TWV4U8L2Pg3QbXSdOQpbW64yxyzseWYn1J5rWqYxt7z3e5piK/OlRg7wi3y6JPV7u3UKKKK0OMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArK8Uf8gG7+g/8AQhWrWV4qONAu8+i/+hCtqP8AFj6oxrfwpejJ9D/5A1l/1xX+VXqytAvoX0GGQMdsMe1+OhUc1Z03VrbVlkNs5cIQGypHX606kJc0nbZipzjyxV90XKKo2Gt2mpTPFbyFnQZYFSO+KIdbtJtQaySQm4UkFdpxx15qPZzTaa2L9pBpNPcvUVRm1u0h1BbJ5CLhiAF2nHPTmi/1u002ZIriQq7jKgKT3xR7ObaSW4e0gk23sXqKp6lq1tpKxm5coHJC4Unp9KW61W2srNLqVysL4w20nqMjikqcnZpbjdSCum9i3RVT+1bb+zvt28/ZsZ3bTnrjpRa6rbXtm91E5aFM5baR0GTxRyStewc8b2uW6Kp6bq1tqyyG2cuEIDZUjr9abYa3aalM8VvIWdBlgVI74punNXuttxKpB2s99i9RVGHW7SbUGskkJuFJBXaccdeaJtbtIdQWyeQi4YgBdpxz05o9nO9reYe0ha9/IvUVRv8AW7TTZkiuJCruMqApPfFO1LVrbSVjNy5QOSFwpPT6UKnN2st9gdSCvd7blyiql1qttZWaXUrlYXxhtpPUZHFH9q239nfbt5+zYzu2nPXHSlySte3kPnje1y3RVS11W2vbN7qJy0KZy20joMnik03VrbVlkNs5cIQGypHX60OnNXbWwKpF2Se5coqjYa3aalM8VvIWdBlgVI74oh1u0m1BrJJCbhSQV2nHHXmn7OabTWwvaQaTT3L1FUZtbtIdQWyeQi4YgBdpxz05ov8AW7TTZkiuJCruMqApPfFHs5tpJbh7SCTbexeoqnqWrW2krGblygckLhSen0pbrVbays0upXKwvjDbSeoyOKSpydmluN1IK6b2LdFVP7Vtv7O+3bz9mxndtOeuOlFrqtte2b3UTloUzltpHQZPFHJK17Bzxva5boqnpurW2rLIbZy4QgNlSOv1pthrdpqUzxW8hZ0GWBUjvim6c1e623EqkHaz32L1FUYdbtJtQaySQm4UkFdpxx15om1u0h1BbJ5CLhiAF2nHPTmj2c72t5h7SFr38i9RVG/1u002ZIriQq7jKgKT3xTtS1a20lYzcuUDkhcKT0+lCpzdrLfYHUgr3e25coqpdarbWVml1K5WF8YbaT1GRxR/att/Z327efs2M7tpz1x0pckrXt5D543tct0VUtdVtr2ze6ictCmcttI6DJ4pNN1a21ZZDbOXCEBsqR1+tDpzV21sCqRdknuXKKo2Gt2mpTPFbyFnQZYFSO+KIdbtJtQaySQm4UkFdpxx15p+zmm01sL2kGk09y9mivNNQu57PWr14JXibz35U4/iNaNj43vLfC3CJcr6/db/AA/Su+WAqcqlB3OCOPp8zjNWOW+NX/JSvhZ/2E//AGrb17jXhXxGeXxR44+Hl9ZW8hg0/Ula6LEDyw0sJB68j5T9MV7pnPI5FeOqU6dWfOrbfkfU4mvSrYLCqnJOyle3T3m9ewtFFFankhRRRQAUVn694h0rwrpM+qa1qdno+mW4Bmvb+dIIYwSANzuQBkkDk96reF/Gnh/xxpr6h4c13TfEFgjmJrrS7yO5iDgAlS6EjIBHGe4oA2aK5K6+L3gSwt9PnufGvh23h1GR4bKSXVYFW5dW2MkZL/Owb5SFyQeK4j9ob4jeOfBl94E0X4fweHpdc8TapJYB/EqTm2jVLd5s5hYMD8hHQ9enegD2SivDfhT8UfiQvxSu/h78T9H8Orqz6X/bNlqvhOWc2jQiQRNFIk/zhwxzu6EEDHBNem6x8TPB/h7xFbaBqvivQ9M1262eRpd5qMMV1LvJVNkTMGbcQQMDkigDpaK+dP2nvjpL4R8QeE/A3h74geHvAus61dP/AGjreqNBO+k2yRGRXMMrhQZCAoMnBycc4I9XHjjRPh34M0Kfxr470YPNBHH/AG5qVxb2EWoS7ATIgLBBuHzbVJAB44oA7SishfF+hP4Z/wCEjXWtObw95Buv7WF3H9k8kDJk83OzZj+LOKTS/GWga5qdxpum65puoajbxRzzWlrdxyyxRyDMbsiklVYHIJGCOlAGxRXN+G/iX4Q8Y6nd6boHirRNc1G0BNxaabqMNxLCAdp3ojErg8cjrXhU3xI+Pvjb4gePtO8AW3w5TQ/DWq/2Yn/CRJfrdSt5EcucxMUP+sxn5fp3oA+maK87+BPxWl+MHgEa1e6UdC1W1vLjTNRsPOEqQ3UDlJAjjhlyMg+/410Hhn4leEPGt/d2Ph7xVomvXtoM3Ftpmow3MkIzjLqjErzxz3oA6SiuU1b4seCNAs5bzU/GXh/TbSK7awkuLvVIIo0uVGWgLM4AkA5KdR6V0Fxq1jZ6XJqc95bw6bHCbh7ySVVhWIDcXLk4C45znGKALdFeEePPjpb6h40+FMHgTxdpWsaPrHiOTTdWbSbi3vY3QWskgiZ13bDkK3ykHp2Nep+LPiV4R8BzWsPibxTovh2W7DG3j1bUYbVpsEA7BIw3YJGceooA6Sis3UfE2kaPNYRX+q2NjLqDmKzS4uEja5cKWKxgn5ztBOBngE0eHvE2j+LtLj1LQtVsda06RmRLzT7lJ4WZSVYB0JBIIIPPBFAGlRRRQAUUUUAeS/tPf8ktl/6+4f5mu98P/wDIB03/AK9o/wD0AVwX7T3/ACS2X/r7h/ma73w//wAgHTf+vaP/ANAFcsf48vRfqe5W/wCRXR/xz/KJfooorqPDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK5b4kePIPh34Yl1WWBrqUuIoIFyN8hzgE44GATn29amUlFOUtjajRniKkaVNXk9EN1v4laRovjDS/DUnnXGpX/8Fum8Q5+6XxyM8/QDJwOau+FPA2i+CUvF0izW1F3KZpTksSewyedo5wO2TUmkWNnqzWXiGfR1sdXltgpM6L58StglCR/n6citqoim3zS+R0VakacFRpXWnva6NpvtpZdAooorU4QooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArK8U/8gG7+i/+hCtU5wccmuH1jxc99Zz2b2flM3yk+ZnBB9Me1deGpTqVE4rZo5MTVhTptSe6Z1GhRINFtFCKA0Slhjrkc5q5DbxW+fKiSLPX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AcdCSMmsp3fua69ex3YVKF8Q3F8lnyv7Wu1vzOq0OG/t9Hso9UnS61FYlFxNGm1WfHJA9M/5FXqKK0Wisccpc0nLuFFFFMkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopQC3AGaAEoqtq2raf4ftDdapew2MA/imcDPsPU+wrybxZ+0jZWYeDw5ZG7k6fa7sFI/qE+8fxxXoYXAYnGO1GF136feefisfhsGr1p2fbr9x7HJst4XmnkSCFBlpJGCgD1JPSvM/Gnx08M6Tb3FnYhtcuWUofJO2EZH989f+Ag/WvA/E3jrXPGExfVdRmuUzlYc7Yl+iDj8etYNfa4PhqnTtPEyu+y0X37/kfFYziWpUvDCxsu71f3bfmfS/hD4/eHdYjittTibQ7gAKGY74T/wIDI/EfjXp0Dx3luk9tNHcwOMpJEwZWHqCOtfDVbXhvxlrXhG483StQmtMnLRqcxv/ALyng/lTxnDVOpeWGlyvs9V9+/5iwfEtWnaOJjzLutH9235H2ZSV4x4T/aSguNkHiOw8lun2yzBK/UoeR+BP0r1zRdb0zxJa/adJv4b6Hv5TglfYjqD7HFfFYrL8Tg3++hZd+n3n2uFzDDYxfuZ3fbr9xbopWUrwRikrzj0QooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDK8TeF9N8YaPLpmq2wubSTnbkgqw6MpHQivMP+GZdJhytr4g1m3h6iMSpx+SivZKKxnRp1HeSPRw2Y4vBxcKFRpPp0/E8b/4Zqsv+hn1r/v4v+FH/AAzVZf8AQz61/wB/F/wr2Sio+rUf5Ts/tzMP+fv4L/I8b/4Zqsv+hn1r/v4v+FH/AAzVZf8AQz61/wB/F/wr2Sij6tR/lD+3Mw/5+/gv8jxv/hmqy/6GfWv+/i/4Uf8ADNVl/wBDPrX/AH8X/CvZ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sSzkDkn6n8qykueVmtFr8z0KVT6vRc6c/eleLVvs6a389tDSooorU88KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPFP2yrOLUP2d/EtrOu+CeWzikXJGVa6iBGR7Gq/wH8R33gXxFf8Awe8S3bXGoaRALzw/fzMS2o6UThASeskJ/dt3ICt3rb/al0XUfEHwT1mx0qwutSvZLizKW1nC0sjBbqJmIVQScAEn0ANR/tCfDLUvGXhfT/EHhXbb+P8AwtL/AGjok/TzGA/eWz+qSplSD3xQB5t8Afiho/wf/ZeuvEmtJdT28XiDU4IbSwh824uppNQlWOGJMjc7McDkD3rotN/aa8XaDrWjR/En4R6h4C0DWLqOxs9aTWLfUUS4kP7tbiOMBoQ3TJzhsDHUjzPwH8NvHOufsp+G7208M3Fj400PxVN4mg8OawrWjz7byVzCTIqlSyOdrEAE47Gum8Y+OvE37UGn6T4K0v4Y+MPB0DalZ32r6x4u01bO2toIJVlYQEsTNIzIFAAHBycDoAfVNFFFABRRRQAUUUUAFFKqlugzVLW9e0vwza/adW1CCxi7eY3zN7KOpP0BqoxlNqMVdkylGC5pOyLtNuJIrK3e4up47WBBlpZnCqo9yeleL+LP2kood8Hhuw8w9Ptl4MD6qgOT+JH0rxvxH4v1nxZcedq2oTXhByqMcIn+6o4H4CvqcHw7ia9pVvcX4/d/mfLYziLDULxo++/w+/8AyPf/ABZ+0JoOh74dIibWboceYDshB/3iMn8Bj3rxfxd8VvEfjLel5fNBaN/y6WuY48eh5y34k1yFFfbYPKMJg7OEby7vV/8AA+R8TjM3xeMupytHstF/wfmFFFc38SNXu9A8A+INSsJfIvbWyllhl2htrBSQcEEH8RXrVJqnBzey1PJpwdSagt27HSUV5Ne+MfEngnwHdeL9e1S2u/tNrbi10tbULFbSvgBnlX5nBzuYADGCF7VynhT40TJ4u0e2/wCE8tvGEOpXK201iNGeyNtu6PG+35gDgYbt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R/whGnf3pv8Avsf4UclD+d/d/wAEOev/ACL7/wDgG750f99fzFHnR/31/MVhf8IRp396b/vsf4VneIPC9npmlyXEJkMilQNzAjk49KqNKjOSipvXy/4JMqtaEXJwWnn/AMA7EHPI5FFV9N/5B1r/ANcl/kKsVyNWdjri7pMKKKKQwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooACwUZJwK4nwv8PJ9F8feIvEt5qP26XUgqQIFKeVGP4SMkHACAH2PTNWvih4S1Dxx4QuNI06/TT5ZnUu8ikq6g52EjkZODnnpjHNdBo2mJouk2dhG7yx2sKwiSQ5ZtoAyT6msmuaeq2PQhU9jh26c9Z3TVuis9/N9F2LlFFFannhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXOeCf+PS8/67n+Qro65zwT/x6Xn/AF3P8hXVT/gz+Ry1P40Pn+h0dFFFcp1BRRRQAUUUUAFFFFABRRRQAUUUUAFPWRl46j0NMooA4vxZ8G/DHizfL9l/sq9bn7RZgICf9pfun8gfevGPF3wF8R+Gw81mi61ZrzvtQfMA94+v/fOa+m6csjL0Ne7g86xeDslLmj2ev/BPCxmS4TGXk48su60/4B8NSRvDIyOrI6nDKwwQfQim19leKPAugeM4yNV06OSfGBdR/JKv/AhyfocivG/Fn7N+o2Iefw/eLqcI5+zzkJMPYH7rf+O19tg+IMLiLRq+5Lz2+/8AzsfE4zh/FYe8qXvx8t/u/wArnjNFW9U0m90W7a1v7SazuF6xzoVP157e9VK+mjJSV07o+ZlFxdmrMKKKKokhvryP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rWp0I89WSS8zalRqV5clKLb8jkK2PDng/WfFtx5Ok6fNdkHDOowif7zHgfia9/8ACf7Pmg6Hsm1eVtauhz5ZGyEH/dByfxOPavTbeOKyt0t7WGO1gQYWKFAqqPYDpXyGM4lpU7xwseZ93ov83+B9fg+GqtS0sVLlXZav/JfieL+FP2bIYdk/iS/8w9fsdmcD6M5GT+AH1r13RdC0vwza/ZtJ0+Cxi7+WvzN7sepP1Jq7SV8ViswxOMf76d126fcfa4XL8Ngl+5hZ9+v3isxbqc0lFFeceiFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABWL4w/wCQDN/vL/6EK2qxfGH/ACAZv95f/QhW+H/iw9Uc+I/gz9GaWm/8g61/65L/ACFWKr6b/wAg61/65L/IVYrKXxM1h8KCiiipLCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuG1jw34k1D4oaRqcd/9m8N2luyyW8M7K0r8nDrjBBO314Xtmu1umlW1ma3RZJwhMaOcBmxwCewzXIfCnSvEuleG5V8VXkl1qcly7hXkEnlx8AAMPUgnrwCBxisp+81Frz+49DDSdGnUrRkr/DZ7vmvdr07+Z2dFFFannhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVzngn/j0vP8Aruf5CsfxtZfZ9SWdRhZ1yf8AeHB/TFc+is7BVGWY4Ar26OEU6LtL4rdOx4tbFuFZXj8N+vc9boqCxt/sllbw9441U/gKnrxXvoeytVqFFFFIYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA9ZGToePSuP8V/CXwx4w3yT2X2C9b/l6s8IxPqwxhvxGfeutorejXq4eXPSk4vyMK1CliI8lWKkvM+a/Fn7PviDQt82mFdbtBz+5G2YD3Q9f+Ak/SvMri3ltZnimjeGVDho5FKsp9CDX3GrFehxWP4k8H6H4wh2avpsNy+MLOBtlX6MOfw6V9fg+JakLRxUeZd1v9235HyGM4apzvLCy5X2e337/AJnxlFE80ixxo0kjHCqoySfQCvSvCPwD8ReItk18q6JZtzuuRmUj2j6/99Yr3/wz4I0DwbGF0nTo4psYa5k+eVv+BHn8BgVuM7N1OarGcTTleOFjbze/3bfmTg+GYRtLFSu+y2+/f8jivCfwd8MeEdkq2n9p3q8/aLzD4P8Asr90fln3rtmlZu+B6CmUV8fWxFXES560nJ+Z9jRw9LDx5KMVFeQUUUVzm4UUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVi+MP+QDN/vL/6EK2JI1ljZGGVYEEexryu+tWsbyaBusbFfr716GDoqpPmva1mefjazpw5bXvoenab/wAg61/65L/IVYrznwram71qDjKxfvG/Dp+uK9GrLFUVRny3ua4Ws60L2tYKKKK5DrCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAOI+KreLW03TIvCKtHdPeL9ouV2Hyo+nKt1GSCcA8LXbIpVVBbcQMFj3964fRNW8U3nxQ1u0urZ7bwxbwKbZpIMea/yglX787yRzjA6Zruayh7zctf+GPQxN6cKdFqOivdbvms7N9126BRRRWp54UUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRUOo6lZ6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FFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBzHxQ/5Ea7/AOukf/oQrwyvc/ih/wAiNd/9dI//AEIV4ZX4fxp/yMo/4F+cj9N4b/3OX+J/kgooor4I+rCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK7D4T/8jra/9c5P/QTXH12Hwn/5HW1/65yf+gmvYyb/AJGWH/xx/NHnZl/uVb/C/wAj2x/vN9abTn+831ptf0qfjAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXlHxq/5GCx/69R/6G1er15R8av+Rgsf+vUf+htXxfF//Iql6x/M+k4f/wB/j6P8jzyiiivwY/VAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD2H4M/wDItX//AF9f+yLXc1w3wZ/5Fq//AOvr/wBkWu5r+iuHf+RVQ9P1Z+P5x/v9X1/QKKKK+jPHCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuOh+IkN58TLjwfHYtK9vbC5luxINqHAOCuP9pOc967GuQ+H/jDRfiAt7rGmae0EsMptJLqaFFeTGDgMCSVxtPPtWUnqknY7sPBezqVJwckla97Wb2b+56HX0UUVqcIUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBzHxQ/5Ea7/wCukf8A6EK8Mr3P4of8iNd/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o9ov7g9rTW8l95qUVz03jazB2wRTXD9gFwD/AF/So2m13WV2pCunQN/Ex+fH8/0Fa/VprWfurzMvrMHpD3n5FzXNeFji2tR599JwqLzt9z/hUnh3RzpNqTLhrqU7pG6/hmnaT4fttJ+dQZbg/emfr+HpWnROpGMfZ09ur7/8AcKcpS9pU36Lt/wQooorlOkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArjvil8RF+Gfh2HVDYf2iZblbYQ+d5XJVmzna3ZD2rsa5Px/wCMtG8Jx6XHrFlLfR31yIIVjiSQK/qQxGOvUZrOo7QbTt5nbgoKpiIRlDnX8qdr/M6uMsyKWXa2OVznB9M0tFFaHEFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHJ/Fj/kmviX/rxk/lTfgV/wAkl8Of9cW/9GNTvix/yTXxL/14yfypvwK/5JL4c/64t/6Maub/AJf/AC/U9xf8il/9fF/6SzvKKKK6TwwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK8N/Zj/5FnX/APsKP/6Ale5V4b+zH/yLOv8A/YUf/wBASuaf8aHz/Q93C/8AIuxXrD82eyUUUV0nhBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAjKHUqwDKeoIyKxbzwhp91lo0a2f1iPH5Vt0VpCpOm7wdjOdOFRWmrnN/8I5qdt/x7avIR2WTOP5ml/s/xGv3dRgP1Uf8AxNdHRW31mb3SfyRj9Wgtm182c59h8S/9BC2/75H/AMRR/Zevv9/VIx/uj/7Gujoo+sS6RX3IPq8esn97Oc/4RnUJv9frExHdUzj+dKvgm1Zt01xcTN7sB/Suioo+tVejt9wfVaXVX9bmRD4T0uHn7PvPq7E/1q/Bp1ra48q2ijPqqAGrFFZSqzl8UmzaNOEfhikFFFFZGgUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA2VPMjdAxUsCNy9R715c9xd2N5NieSKfcVdlcgk55yfrXqdcB4ysvsusGUDCTqH/Hof8+9etl8lzuD6nlZhF8imuhkTXlzdOhlnlmZT8u9yxH0r1CzR47OBJWLyLGoZj1Jxya8+8L2P27WIQRlI/wB434dP1xXo9PMJK8aa6E5fF2lUfUKKKK8g9cKKKKACiiigAooooAKKKKACiiigAooooAKiktYJuZIY3P8AtKDUtFNNrYTSe5SfRdPk62UH4RgVEfDemH/lzj/WtKitFVqLaT+8j2cHvFfcZn/CM6X/AM+afmf8akTQdOj5FlD+K5/nV+ij2tR7yf3i9lTW0V9wyKCOAYjjWMeiqBT6KKz3NdgooopAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFcn46vPCkNxosHiZYnlnucWCyRO/73KjjaDg8rycV1lcn4z0Hw3rGseHZddvIre8tbnzNPhkuVi86TchwFJ+fkIMD+971nUvy6W+Z2YPlVZObklr8O+z2/XyudZRRRWhxhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBR17SIvEGh6hpkzFIry3kt2ZRyoZSuR7jNeLeFPFXjr4P6WPDl34NufENjau32a7sC2NjMW6qjZ5J64Izivd6KwqU+ZqUXZnqYXHKhTlRq01ODadndarqmrM8h/wCF/wDiT/omGs/nL/8AGaP+F/8AiT/omGs/nL/8Zr16io9nV/5+fgjp+u4H/oEX/gc/8zyH/hf/AIk/6JhrP5y//GaP+F/+JP8AomGs/nL/APGa9eoo9nV/5+fgg+u4H/oEX/gc/wDM8h/4X/4k/wCiYaz+cv8A8Zo/4X/4k/6JhrP5y/8AxmvXqKPZ1f8An5+CD67gf+gRf+Bz/wAzyH/hf/iT/omGs/nL/wDGaP8Ahf8A4k/6JhrP5y//ABmvXqKPZ1f+fn4IPruB/wCgRf8Agc/8zyH/AIX/AOJP+iYaz+cv/wAZo/4X/wCJP+iYaz+cv/xmvXqKPZ1f+fn4IPruB/6BF/4HP/M8h/4X/wCJP+iYaz+cv/xmj/hf/iT/AKJhrP5y/wDxmvXqKPZ1f+fn4IPruB/6BF/4HP8AzPIf+F/+JP8AomGs/nL/APGaP+F/+JP+iYaz+cv/AMZr16ij2dX/AJ+fgg+u4H/oEX/gc/8AM8h/4X/4k/6JhrP5y/8Axmj/AIX/AOJP+iYaz+cv/wAZr16ij2dX/n5+CD67gf8AoEX/AIHP/M8h/wCF/wDiT/omGs/nL/8AGaP+F/8AiT/omGs/nL/8Zr16ij2dX/n5+CD67gf+gRf+Bz/zPIf+F/8AiT/omGs/nL/8Zo/4X/4k/wCiYaz+cv8A8Zr16ij2dX/n5+CD67gf+gRf+Bz/AMzyH/hf/iT/AKJhrP5y/wDxmj/hf/iT/omGs/nL/wDGa9eoo9nV/wCfn4IPruB/6BF/4HP/ADPIf+F/+JP+iYaz+cv/AMZo/wCF/wDiT/omGs/nL/8AGa9eoo9nV/5+fgg+u4H/AKBF/wCBz/zPIf8Ahf8A4k/6JhrP5y//ABmj/hf/AIk/6JhrP5y//Ga9eoo9nV/5+fgg+u4H/oEX/gc/8zyH/hf/AIk/6JhrP5y//GaP+F/+JP8AomGs/nL/APGa9eoo9nV/5+fgg+u4H/oEX/gc/wDM8bvPjZ431a1ktdJ+HOpWd5IpVLi58wpGTwDgxqPzIFdZ8HPAc/w98GR2F26vfzytc3Gw5CuwA2g98BR+Oa7iiqjSalzzldmOIx8J0Xh6FJU4tpuzbbttq3srhRRRXQeQFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVyupePItMvJYJbdRscoGaYLuwfpXVV4n8Rv8AkLS/9d5P51xZhjFl2ArYzk5nBLRtreSXT1NsNh3jMXSwyly8zeu+yb6+h3H/AAs61/54x/8AgSP8KP8AhZ1r/wA8Y/8AwJH+FeM0V+a/6+z/AOgWP/gUj7P/AFT/AOoh/wDgKPZv+FnWv/PGP/wJH+FH/CzrX/njH/4Ej/CvGaKP9fZ/9Asf/ApB/qn/ANRD/wDAUezf8LOtf+eMf/gSP8KP+FnWv/PGP/wJH+FeM0Uf6+z/AOgWP/gUg/1T/wCoh/8AgKPZv+FnWv8Azxj/APAkf4Uf8LOtf+eMf/gSP8K8Zoo/19n/ANAsf/ApB/qn/wBRD/8AAUezf8LOtf8AnjH/AOBI/wAKytf8Y2euQxJiOF42yG88HgjkdPp+VeXUVcPECrTkpRwsb/4pET4QjUi4yxDt/hR6doPiu00LzSwjlkkx83nBcD8q2P8AhZ1r/wA8Y/8AwJH+FeM0VVTxBqVJOTwsf/ApCp8IRpxUY4h/+Ao9m/4Wda/88Y//AAJH+FH/AAs61/54x/8AgSP8K8ZorL/X2f8A0Cx/8Ckaf6p/9RD/APAUezf8LOtf+eMf/gSP8KP+FnWv/PGP/wACR/hXjNFH+vs/+gWP/gUg/wBU/wDqIf8A4Cj2b/hZ1r/zxj/8CR/hR/ws61/54x/+BI/wrxmij/X2f/QLH/wKQf6p/wDUQ/8AwFHs3/CzrX/njH/4Ej/Cj/hZ1r/zxj/8CR/hXjNFH+vs/wDoFj/4FIP9U/8AqIf/AICj26x+IEN/dRwx26sXdVJWYNjJxnpXWV4X4D/5Cyf9dY//AEKvdK/SMtxyzPAUcbycjnzaJt7Sa6+h8bi8M8Fi6uFc+ZRtra26T6BRRRXeYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXJ+Mvh7b+Mtd8N6nNdy28miXP2mOONQRId0bYOen+rH511lcP8QPh7ceMvEvhHU4buK3j0S7+0yRyKSZBvibAx0/1Z/OsqivG1rndgZcldS9pyaPW1+j0t57fM7iiiitThCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK8T+I3/IWl/67yfzr2yvE/iN/yFpf+u8n868DiP8A5EmL9I/+lxPSyn/kaYf1l/6SzkaKKK/nE/ZgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDpvAf/IWT/rrH/wChV7pXhfgP/kLJ/wBdY/8A0KvdK/onhj/kR4b/ALf/APS2fjmc/wDI1xH/AG7/AOkoKKKK+kPKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuG+I2g+JdX1bwxcaBeS2sNnd+ZfKly0SyR7kOGUHD8K3B9T613NcP8AFC68V2q6IfC6ytuvAt6Iokc+Vxn7wOO/IrKrbkd7/I9DAc31mPI4p6/Fts9/08zuKKKK1PPCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK8T+I3/IWl/wCu8n869srxP4jf8haX/rvJ/OvA4j/5EmL9I/8ApcT0sp/5GmH9Zf8ApLORooor+cT9mCuS8e/E3Rvhu2kf2z56R6lcNbRSQoGCMEL/ADDIPOMAKCSSBjmutryr4xRrJ46+FSuocf265wwzyLeQg/nXfgaUK1dQqrS0n90W/wBDlxVSVOk5Q3uvxaRp3nxq0vTfCtjrF7oviC0u7+Z4LPQZdOb+07h0JyFgBPGAWySBjHril8P/ABr0XxBomu3zWGraTeaLA1ze6Pqlp9nvUjClgwQtghgDg7vrivPv2jNGFr428L+JdV1XxFonhi3tZ7K61Tw3KyT2TuylXk2qxEbY2nA6hfYHJ8Lad4T1Dwn8Qdf8NeKfFni8/wBgzWcmpeIHd4cbXby42eJGLLjJHQBx619BDL8JUwsa/LL3nurtJ81uVu1tu+vXY8iWLxEK7pXWnpd6Xvbff5Het+0x4XSTSpW07Xl0bUBEBr32AnT4ZJOkbzBsbgflO3cAcjPBx0fj/wCLmkfD+8srCSy1TXtYvFMkOk6Ha/aroxDrIUyMKOmSfpnBxw3jC1h/4ZJjjESiNNCtGVQMAECMg/nVfXPGenfCH4wXPiDxWs1roWtaPa2lnqyWzTRwyRb2eFtgLAtu3DA5x7ZGccDhqzvSpttOa5b6yceW1tL3s22l0WhcsVWpq1SaSfK72+G9/Py0v3LHwv8AGVj4y+OHi/VbWO6skXRLKOe11CEwT20ivLujlQ/dYd+o7gkVsr+0l4abUYlbS/EEegyzLBH4nk0xl0p2Y7VImJztLfLu24z7c1xGk6m3xU+IPxQbRLe6shqPhmC3sZryJrdrgHzQkoVgGCMTwSASADXn+h2fgjVNGs/Cut+O/ibbeImRLO48Ii4lciQYHlqnkGPZxuGWwFwa9N5fh69STrRl7sYLlV24rlV27Lp3ei6nCsZWpQSpyWrlq9E3zbav8tex9F+K/jhovhPxJe6A2m6xqus29tFdJZaVaC4luUcsP3ahsnaFJYkAAY5ycVyGpeEbz4mfGDxNay+L/Fnh2ysLGxkhtdF1NrVQ0iuW3Jhhn5R0x3ra8L2qW/7RXipQN5i8P2Eau3LY3yd/fA/Kuf1T4teFPhf8dPGJ8T6r/Zn2yxsPI/0eWXftWTd/q0bHUda87D0XTlKGCg3U9mn/ADNtuD0Vu1ztq1FNKWJklDna7bc27v6G5ot14h+FXjjRPDer69ceKPDeueZBp17qKqb20nRN/lSyLjzQyhjuIzkY+trXf2iNC0vWL6w03Q/EnipdPcxXt5oGmm5t7WQfeR33AZA5OMgfXIrLsdUm+OHjvw7q+mafe2Xg/wAPvJeQ6rewNCdRneMonkI2GMQVi28gZPGK5/4d/F7w78FdCl8HeMhd6Jr1ldTlFNlLKNSV5WZJomjUht2QOT1GO1U8Iq3vTpc9ZJc0I6PVy1aS3SUbpLd3etyfrDp+7Gpy023aT16LRNvq729LLoem6r8aPC2l+DtJ8Ui8a80LUrmO2iu4FACFyRucOVKhSDnuMdKxrP8AaL8NS31/ZX+na9od3BF51tBqumPDJqKb9gNsnLOWYqApAJ3Djrjzi48P3ulfC3wt/amnHTW1LxtDqKadMvzW8Utwzojr2bGCR2zivRfiJBHJ8bvhczxq7KdRKllBIPkDpWf1LBQbg05fxLPm6QV10s77N/NF/WcTJc10vg0t/Np3+dje+Hnxa0v4iXWoWMOn6toerWAVp9M1u0+zXKow+WTbk/Kfr/MZ7evLLNVX9pfUmCgMfDMOTjk/6Q1ep14eNp06dSLpKylFO29rruenhpznBqbu02vuCiiiuA6zpvAf/IWT/rrH/wChV7pXhfgP/kLJ/wBdY/8A0KvdK/onhj/kR4b/ALf/APS2fjmc/wDI1xH/AG7/AOkoKKKK+kPKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuJ+LnizW/BvhmG+0Gyjv7x7pYWjkieXCFXOQqkHOQvtzXbVzXxF8YN4D8I3mtrZfb/s5QGHzPL+84XOcHoWHas6nwPWx24JXxNNKHPdpcr0vfodHG4kjVwCAwBwwwadVDw/qg1zQdN1IKEF5bR3AUHIG9A2M/jV+rTurnJKLhJxe6CiiimSFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFF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/wAH6s/Fcx/5GOJ/xfogooor2ThCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqpq2l2+taXd6fdJ5ltdRNDIvqrAg/zq3RRvoVGTi1Jbo5XwZD4e8Jqng/StQE11ZRGZrWSbzJUUsCS3YcuDjj73Tmuqrjda8K+HtF8Xf8J1f3jadcQW/kSO0oSF+CuWGMs2CABnsOMiuutriK8t4p4XWWGVA6OpyGUjII/CsoXXuvp+R2Yrlm1Wi2+bdv8Am669SSiiitThCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDzD4rf65/8AcT+ZrzSvTPiope4cKCx2JwB7mvN/s03/ADyf/vk1+Pcc0qlTMaThFv8Adx6ecj7/AIVqQjhKik0vff5RI6Kk+zTf88n/AO+TR9mm/wCeT/8AfJr87+r1v5H9zPs/bUv5l95HRUn2ab/nk/8A3yaPs03/ADyf/vk0fV638j+5h7al/MvvI6Kk+zTf88n/AO+TR9mm/wCeT/8AfJo+r1v5H9zD21L+ZfeR0VJ9mm/55P8A98mj7NN/zyf/AL5NH1et/I/uYe2pfzL7yOipPs03/PJ/++TR9mm/55P/AN8mj6vW/kf3MPbUv5l95HRUn2ab/nk//fJo+zTf88n/AO+TR9XrfyP7mHtqX8y+8joqT7NN/wA8n/75NH2ab/nk/wD3yaPq9b+R/cw9tS/mX3kdFSfZpv8Ank//AHyaPs03/PJ/++TR9XrfyP7mHtqX8y+8joqT7NN/zyf/AL5NH2ab/nk//fJo+r1v5H9zD21L+ZfeR1o+H/8AkKR/Rv5VS+zTf88n/wC+TWhoMMkepRlo2UYPJBHavf4foVY5vhW4O3tI9H3R4+cVaby7EJSXwS6+R79p/wDyD7b/AK5L/IVYqvp//IPtv+uS/wAhViv6Il8TPyOPwoKKKKkoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvAPFn/ACEF/wB3+pr3+vAPFn/IQX/d/qa+V4r/AORJW/xQ/M9rIv8Aka0vSX5GJRRRX8+H68FFFFABRRRQAUUUUAFIeRg9KWigDL8N+GdN8IaTHpmkW32Sxjd5Fi8xnwzsWY5Yk8kk9a1KKKqUpTk5Sd2yYxUUoxVkgoooqSgooooAKKKKACiiigDufhf/AMhKH/rq3/oFew1498L/APkJQ/8AXVv/AECvYa/pTI/+RRhP8H6s/Fcx/wCRjif8X6IKKKK9k4QooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMnxZ4ZtfGHh2+0e9yLe6TaWUDKEHKsM9wQD+FVvCcelaFZxeGbDUvts+mQqrRyzK8yJk7d2MY9Bx0xW/XF3nhHQ/DfjK78c3OoHTWa2EM6vIscD9tzZ6kgLgZ6r3rKSs1NL19Dvoy9pTlQnJ23ikr3lovxR2lFMhmjuYY5onWSKRQ6OpyGBGQRT61ODYKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMzUPDtnqlx506uz4C8Njiq3/CG6Z/zzk/77NblFbqvVirKTMHQpSd3FGH/AMIbpn/POT/vs0f8Ibpn/POT/vs1uUU/rFb+Zi+r0f5UYf8Awhumf885P++zR/whumf885P++zW5RR9YrfzMPq9H+VGH/wAIbpn/ADzk/wC+zR/whumf885P++zW5RR9YrfzMPq9H+VGH/whumf885P++zR/whumf885P++zW5RR9YrfzMPq9H+V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pfePPDV3qF/FbwzRald2arbKyrsilZFJyx5IHPPXsK6auCq0YucrWVtpKW97axbXRmFPE06jUY3u77pra3dLudpRRRXCdQUUUUAFFFFABRRXBL8QL5PiR4p0KS3t30/SdIg1GJlDLK7uZNys2SMfIMYXv3relRnW5uTor/il+plUqRp25uun6/od7RXiWg/HLx5rOi2WvH4R3knh+4hW5+02Gt29zOYSM7kg2qztjovBNeo+DfGWl+PNAg1jSJmltZSyMsiFJIpFOGjdTyrKeCP6V0YjA18Kr1ErJ20lGVn2fK3Z+TMaOKpV3aDffVNad1dK/wAjcooorgOsKKKKACiiigAooooAmsv+PyD/AK6L/Ovpm4/1n4V8zWX/AB+Qf9dF/nX0zcf6z8K/WuBfgxH/AG7/AO3HwPFHxUf+3v0IqKKK/Uz4UKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBskSS7d6K+07huGcEdCPeuI8O+NNbu/iJrfh7VNGa2tYEE1neQBmjaPoN7dMtzjGMFWHOM13NUdcXUG0e9GlPDHqRib7O1wCUD44z7Z/yaiSejT2/E6qE4LmhOKfMrJv7LutS9RXK/DPUvEGpeE7d/E1i1lqsbNE+7AMwHAkKj7pPPHtkcEV1VOMuZJmdak6NSVNtOzto7r5MKKKKoxCiiigAooooAKKKKACiiigAooooA8h+AX/I+fFH/sKD/wBG3Fe2V4n8Av8AkfPij/2FB/6NuK9srmw38JfP82e7nf8Av0vSH/pEQooorpPCCiiigAr5u+NHh2L4zftCeHvhl4k1C9tvBC6DNrVzpFpdNbLrMwmEYikZCrMkY+fap6kE4wK+ka86+MHwJ8N/GiDTZNUm1LR9a0qQy6br+hXZtNQsWbAfypQDgMBgggjv1AIAPH/Cvw+0n9nf9o3QvB/gW4u9P8JeJdBvru88Ny3s1zBbzwGPbcx+YzFC+4qeedo9OPMvht+zT4a+JX7J0XijXbrU7vxNptrq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cgfMcZwOu3oRngnFdhatJ5MS3Bj+07FMixE7d2OcZ5xnOM1LXEXXw9ux8TrfxVZaxNbwNB5V5ZOS6ygDCqoPCr3PoRkdTWTTjLmir3PQpzjXpKjVko8qbTtq32bX4djt6KqaXrFjrUMk2n3kN7FHI0TPA4cB16qSO4/rVutN9jhlFxfLJWYUUUUyQooooAKKKKACiiigAooooA8h+AX/ACPnxR/7Cg/9G3Fe2V4j8C5FtfiV8TrOVgtxJfiZUzyUEs2SP++1/MV7dXLhv4a+f5s93O/99k/KH/pEQooorqPCCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDxGT/k6OT/sFD/0EV7BXjlvKl/+1FfmBhILXTNspU52nagx+bCvY65qH2vVnu5to6C/6dw/UKKKK6TwgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK5zwT/AMel5/13P8hXR1zngn/j0vP+u5/kK6qf8GfyOWp/Gh8/0OjooorlOoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMvxd/yKOs/wDXs/8AKvnmvobxd/yKOs/9ez/yr55r8a44/wB7o/4f1Z+jcMf7vU9f0Ciiivzc+yCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAJrL/j8g/66L/Ovpm4/1n4V8zWX/H5B/wBdF/nX0zcf6z8K/WuBfgxH/bv/ALcfA8UfFR/7e/Qiooor9TPhQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApGUOpVgGUjBBGQaWigDz+y8NeHPgrZ+INfWa5gsLhlle2B3Rx84CRoO5Y4GegwMgZrstD1yx8SaXb6jp1wt1ZzruSRP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fS//ABNdHRR9arfzB9Vo/wApzn/CC2H/AD2uf++l/wDiaP8AhBbD/ntc/wDfS/8AxNdHRR9arfzB9Vo/ynOf8ILYf89rn/vpf/iaP+EFsP8Antc/99L/APE10dFH1qt/MH1Wj/Kc5/wgth/z2uf++l/+Jo/4QWw/57XP/fS//E10dFH1qt/MH1Wj/Kc5/wAILYf89rn/AL6X/wCJo/4QWw/57XP/AH0v/wATXR0UfWq38wfVaP8AKMghFvDHEuSqKFGevAxT6KK5Tq20CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKiurWK+tZraeMSwTI0ckbdGUjBB/CpaKBptO6PPtL0HRfgT4V1u+W4vp9OMv2jyWJfy8/KqIOnUgbj14yeK6/w74i0/xVpMGpaZcrc2kwyrL1B7qR2I7g1euLeK8t5IJ41mhkUo8cigqykYIIPUVxHjbUrz4YeEbZ/C3h+K6s7WUefbxZAihzlmAHJJPfnGSTmsP4SuvhR6if9oS5ZXdaUt20k1br5/md3RVXSr5tT021u2tprNp41kNvcKBJHkZ2sATgirVb7nlyTi2n0CiiigQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAc542/wCPSz/67j+Rro65zxt/x6Wf/XcfyNdHXVU/gw+f6HLT/jT+QUUUVynUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFcT8YfHU3w+8FT6jaorXssi21uXGVV2BO4jvgKxx64qJSUIuT2R0YehPE1Y0afxSdkdtRXjVh8EfGWtWcN5q/xE1O1vZlDvb2+8pETyVBEij8gBU//AAz5r3/RSta/KT/47WHtaj1VP8Ues8Dgou0sWr+UZP8AGx69RXkP/DPmvf8ARSta/KT/AOO0f8M+a9/0UrWvyk/+O0/aVf8An3+KF9TwP/QWv/AJf5Hr1FeQ/wDDPmvf9FK1r8pP/jtH/DPmvf8ARSta/KT/AOO0e0q/8+/xQfU8D/0Fr/wCX+R69RXkP/DPmvf9FK1r8pP/AI7R/wAM+a9/0UrWvyk/+O0e0q/8+/xQfU8D/wBBa/8AAJf5Hr1FeQ/8M+a9/wBFK1r8pP8A47R/wz5r3/RSta/KT/47R7Sr/wA+/wAUH1PA/wDQWv8AwCX+R69RXkP/AAz5r3/RSta/KT/47R/wz5r3/RSta/KT/wCO0e0q/wDPv8UH1PA/9Ba/8Al/kevUV5D/AMM+a9/0UrWvyk/+O0f8M+a9/wBFK1r8pP8A47R7Sr/z7/FB9TwP/QWv/AJf5Hr1FeQ/8M+a9/0UrWvyk/8AjtH/AAz5r3/RSta/KT/47R7Sr/z7/FB9TwP/AEFr/wAAl/kevUV5D/wz5r3/AEUrWvyk/wDjtH/DPmvf9FK1r8pP/jtHtKv/AD7/ABQfU8D/ANBa/wDAJf5Hr1FeQ/8ADPmvf9FK1r8pP/jtH/DPmvf9FK1r8pP/AI7R7Sr/AM+/xQfU8D/0Fr/wCX+R69RXkP8Awz5r3/RSta/KT/47R/wz5r3/AEUrWvyk/wDjtHtKv/Pv8UH1PA/9Ba/8Al/kevUV5D/wz5r3/RSta/KT/wCO0f8ADPmvf9FK1r8pP/jtHtKv/Pv8UH1PA/8AQWv/AACX+R69RXkP/DPmvf8ARSta/KT/AOO0f8M+a9/0UrWvyk/+O0e0q/8APv8AFB9TwP8A0Fr/AMAl/kevUV5D/wAM+a9/0UrWvyk/+O0f8M+a9/0UrWvyk/8AjtHtKv8Az7/FB9TwP/QWv/AJf5Hr1FeQ/wDDPmvf9FK1r8pP/jtY3izwZ43+Eekv4j07xpd65bWjKbizvgxUoSFzhnYHkjpgjrmpdacVeUNPVFwy7C1pKnRxScnok4yV32vY93orO8N61H4k8P6dqsSGOO8t0nCE5K7lB2n6dPwrRrqTuro8KUZQk4S3QUUUUyAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDiPiB4e8V6lqujah4Z1lLL7LJtns5wfJkVj8zNj72B/D+RBrrF1ay/tP8As03cJ1ERecbbeA+zON23rjNW65HWfhfouteMNO8TOk1vqlmwYvbyFBPgYUPj09sZHByOKycXFuUep6EKtOtGNKu+VRTs0le+6T2uvyuddRXGab8UtOvvH174Tltrq0v4f9S80ZCXAC5YrxwBzgnggZB7V2dXGUZfCzmrUKuHaVWNrpNej2YUUUVRgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAc542/49LP8A67j+Rro65zxt/wAeln/13H8jXR11VP4MPn+hy0/40/kFFFFcp1BRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXjX7Uv/IjaV/2FI//AEVLXsteNftS/wDIjaV/2FI//RUtc2J/gyPdyP8A5GVH1Pc6KKK6TwgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK4f42/8AJKfEn/Xt/wCzLXcVw/xt/wCSU+JP+vb/ANmWsqv8OXozvy//AHyj/ij+aIfg/wD8kx8N/wDXov8AWuwrj/g//wAkx8N/9ei/1rsKKX8OPohY7/e6v+KX5sKKKK1OEKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi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4+iFjv8Ae6v+KX5sKKKK1OEKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArE1vR7qHw7qlv4b+y6XqdwGeOYxgJ5rYy7AD7xHfB5x16Vt0Umro0hUdOSa/4GndHJ+DdW1ux8IfavG5tNOvIGZZJhIoQoCFV3OdoJPoccjp0rq45FmjV0YOjDcrKcgg9CDWZ4m8M6f4u0afS9Uh8+zmxuUMVIIOQQR3B5rlb1V+Cvw6jTSdPvddjs3GYy+X2liXdiBwAM9Bjpx1NZXdPfZLfqd3JDGO9PSpKWkUrRs+zb016M76isrwr4ih8WeH7HV7eGa3gu4/MSO4Xa4Gccj8OD3GDWrWqaaujgnCVOThJWa0YUUUUyAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDnPG3/HpZ/8AXcfyNdHXOeNv+PSz/wCu4/ka6Ouqp/Bh8/0OWn/Gn8gooorlOoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArz3WPgf4d8SeML3xDqwnvZbkxkWpk2RLsRU/h5OduetehUVEoRnpJXOnD4qthZOVCTi2rXXb+kUdI0PTvD9qLbTbG3sIB/yzt4wgPucdT715R+1L/yI2lf9hSP/ANFS17LXjX7Uv/IjaV/2FI//AEVLWGI0oySPWyWUp5nRlJ3dz3Oiiiuo8AKKKKACiiigAooooAK8T+K3wl8b/wDCwrb4h/C3WtH03xS1kNM1HTfEUUjadqNuGLIXaL94rxliQR1zjIGc+2UUAeIfDv4PeMpfEWueOPiPq+kah42v9MbR7Sz0GOWPTdOtsliEMn7x2dtrMzDjoMgVY8Ff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UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUVDeXS2NrJO6syRjcQoycU0m3ZCbSV2YXjb/AI9LP/ruP5Gujrh/EXiS11aCBIVlBjkDneoHGPrXQ6b4otNUult4UmDsCcsoAGB9a9CpRqKjG8drnBTrU3WlaW9jXooorzj0AooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK5T4gfDXSPiPZwQ6n58ctvuMFxbyFWjJxng5U5wOo7dq6uiplFTXLJXRtRrVMPUVWlK0l1RxPj3WvEHgvSdNbw1oP9tW1v8tzFvJdYlUBQozuJPqA3TpzXRSeIrTTbHT5tXmh0ma82osNxKBiUruMe44yRgj8K1K53xp4B0Xx/YR2usWzSiIlopI3KPET1II+g65FQ4yjdxfy6HTTqUKnJTrxsk3eS1k7+TdtPlodECGAIOQaK4rxpb+JvD3hvTLfwRaWsxsSqNbXBGWhVdoRc4z27g8cda0bvxpbeGPDOm6l4pli0ia4EccqDcypMy5KDGTxg8+1PnSbUtLfcT9VlKMZUnzczaSXxfOO50lFQWN/bapZxXdnPHdW0q7o5oWDKw9QRU9aHG04uzCiiigQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABTZI1mjeNxlWBUj2NOooA8pvrVrK8mgbrGxX6+9dN4EscyXF2w4A8tf5n+n51B44sfJvorpR8sy7W/3h/8AWx+VdRoNj/Z+k28JGH27n/3jya97EYjmwya3l/TPCw+H5cS09o/0i/RRRXgnuhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABWfrnh7TfEtibPVbGC/tic+XMgbB9R6H3FaFFJpNWZUZShJSi7NHJeK/CepSeD7fSPCWoJ4fltTGIWwxHloDhM8kZOMkg5wcg5qG98UX3w++HtvqfibfqmowhVujYxj5mZuSAMABV78A47Zrs6OvBrNw1bi7P8AD7jsjirxjCtFSipXfST7rm31Mfwt4qsfF+gW2sWJkWznztM6bG4JB/UEccVsVieJvCNj4n8M3WhSmSzsrhQrfYyIyPmDccEdR6c1j6T4X1L4f+ALrT9Fnl13VIhI9r9ukwCxPyry2AqjHGQDg9M0c0o7q+m//AG6dConKnLlblZRfZ9XLbTrp5nZ0VyPg/xZq114VvNU8V6WugTWZk81dxIMaKGMgB6Dr3PTrWt4Y8YaN4ys2utGv4r6JCA+zIZCegZSAR+IqozjK3mZVMLVpc11dRdm1qvvWhsUUUVZyhRRRQAUUUUAFFRXl5Bp9pNdXU8dtbQoZJZpnCJGoGSzMeAAOcmmabqVprGn299YXUN9ZXEayw3NtIJI5UIyGVgSCCOhFAFiiiigAooooAKKZNPHawyTTSLFFGpd5HICqoGSST0AFV9I1iw8QaZbalpd9balp9ygkgu7OVZYpVPRldSQw9waALdFFFABRRRQAUUVR0rXtM137X/Zuo2mofZJ2tbj7LOsvkzL96N9pO1xkZU8jNAF6iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKbc3EFjaS3V3MlvaxLueWQ4CipI1DNycKOSa+bPi18SJfGGrPZWUrLots22NVOBMw/wCWh/p7fWu/B4SWMqcq0S3Z89necUsnw/tZK8npFd3/AJLqd94g/aG0uwmMWkadJqQHBuJn8pPwGCSPriucb9pDWdx26VYKvYHeT/OvI6K+vhlmFgrct/U/Gq3FWbVpOSq8q7JK35X+9nrf/DR+t/8AQL0//wAf/wDiqP8Aho/W/wDoF6f/AOP/APxVeSUVp/Z+F/kRz/6yZt/z/f4f5Hrf/DR+t/8AQL0//wAf/wDiqP8Aho/W/wDoF6f/AOP/APxVeSUUf2fhf5EH+smbf8/3+H+R63/w0frf/QL0/wD8f/8AiqP+Gj9b/wCgXp//AI//APFV5JRR/Z+F/kQf6yZt/wA/3+H+R6jffHzUtUSNLnSrErG4kXbv+8OgPzdPWrX/AA0frf8A0C9P/wDH/wD4qvJKKf1DDWtyC/1jzW9/bv8AD/I9b/4aP1v/AKBen/8Aj/8A8VR/w0frf/QL0/8A8f8A/iq8kopf2fhf5EP/AFkzb/n+/wAP8j1v/ho/W/8AoF6f/wCP/wDxVH/DR+t/9AvT/wDx/wD+KrySij+z8L/Ig/1kzb/n+/w/yPW/+Gj9b/6Ben/+P/8AxVH/AA0frf8A0C9P/wDH/wD4qvJKKP7Pwv8AIg/1kzb/AJ/v8P8AI9jtP2kr5W/0vRLWZf8ApjK0f8w1ej+DfiboXjhhBayNZ6ht3G0uBgnHXaejfhz7V8q0+GeS2mSWGRopUIZZEJDKR0II6GuatlOHqR9xcrPTwPF2ZYaonXl7SPVNK/ya/W59oMpU4IwaSuL+E/j4eONBMN03/E3slCzE/wDLVezj6459/qK7SvjK1KVGbpz3R+34PF0sdQhiKLvGX9W9UFFFFYnYFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAEdxbxXcEkE8STQyKVeORQysD1BB6isrS/CWmeHbG+t9FtYtJ+1FnZrdcAOV2hgOgxgcDitmilypu5pGpOMXFPR9On3HF/DfwXrXgtb6DU/Ec+v2rFBa+eDuiAzuzkk85HfHFdpRRSjFQXKi69eeIqOrU3fZJfgtAoooqjA8Fhh/4QD9sSYgGHTvHmgb+vyPfWTYPGPvGGT8Qp9K8r0/xPqh/bKj+ID3TnwnqGqT/D6GLBwJIoBKJOoGGnWRehxjrzx6/wDtVaTrVr4c8OeNfC+i3mveI/CeqpewWGnxtJPPDIrQzRqqglsq4OMfw55xXL6x8HdZ0v8AZD0zTLWye68baQsHiRYooi0supJMLqVQvUuzF1x3zigCj4wjHjr4ufGbXiQ9l4Q8IPoFscA/6RPE885B7EL5a468msTwH+01rnw2+CPgDVD8MtU1H4dWml2NtqHiw30UJgOFjd0tCDK8at/GdqtyRkYY9x8L/CuvH9m3xrqWr6ReWfivxcNU1e40yWFxcI8yusMJjI3BhGsa7cZzUPijwnrN1+wbJ4eTRr6bXf8AhEYrcaUtq7XXnCJf3flY3bwR0xnIoA7n4m/G3UPDOsWHh7wT4PuviF4su7T+0f7Nt72Kyht7TdtEs1xL8qbjwq4JbB6Yrmp/2pn0v4UeNfEmseDrrRfFHg9449W8M3V4p2M5Uo0dyissiMrZDBecEY6E+TftAfA3TJPidpPjfxf8Mdc+J/ha80O202az8OtN/aGmXUWSH8mKWNpEcNg5PylfoC+b4U6JD+zB8ST8PfhF4l8DvrBt0g0vVTPPqN+sciHebZpJWiwTIAM5IG7oRQB6fN+1JrOk+LPDi698M9V0PwH4iuobHTfFVxexMzzSqPK820A8yFWPAMhDdMqDlR7/ADTJbwvLIwSNFLMzdAByTXi/7R3h3Ute+GnhS20/TLrUbq38R6LcPDbW7SvGiXUZkchQSFVcknoBnNeteItLbXPD+qaaspga8tZbcSjqhdCu78M0AfOWr/tQeJvF/hzXNX8PfCTWNX+GTQXMI8WRahCs8kYRkaeOwYebJHu7g5KgtjI21ofBfxh4g8G/slfDKfwv4Nu/HGtXGmwQw6bb3cVpGBtZmeWeT5Y1AU4ODlio71x3gf4leP8AwP8ACQfCaX4O+K73xfo+myaRBqUFuv8AYlxGke1J/tZYdU+bYqsxI2j5jgZsmn+MvCXwM+B9vqHhbxtqXhSz057fxL4f8KGe21UyNFthWSONo5jGCX3KGUdN3YEA9W0P9obxb4h0XxppUnwyudK+JXh6CG5PhaXWoGS4gmyEmjvAvlnADkjHBXHU8YX7JfxW8fa58Dzqfirwfql5BYWTXFjqy6tHqF5rjeZJuRYuHjZcBRvbnIxgCub/AGXfhT/whPxc8fz6L8O9U+H/AIW1XQLNtOtdSkmmdmLS5Esjs4WXoWiV22ArnnIql4D1L4iWP7LOveAdE8G+LfDvjbwzB5TXUtsLZL6NrlzKLC4yd7+UGwyjgspUk4oA9S8J/tDeLl8faF4a+Inwsuvh+mvvJBpOoLrdvqcc86IXMTiJR5ZKAkEk5Ix717N4i8Qaf4T0HUNa1a6Sy0zT4Hubm4k+7HGgJZj+Ar4j8P8Aw7ste+N/wy8ceFvhF438MFdbdda1rxfLeTX0x+zOAzxyyy7Yh8o85ymWIUA84+svjp4Cu/ih8IPFvhWxuFtb3VdPkt4JX+6HIyob2JAB9iaAOJ+Hfx68cfEDX9OuB8HdW0rwFqTkWviS81S3Fx5Zz5cslj/rEVj3ycAhuRXlfwz+K3irwa/xXtvBXw5vviDf2/jTUri/WO/i0+G2iIUriSQHzZDt/wBXGrEDk4yob0z4VfHrxNrF9ong/XvhF4z0HX4lW21DUJrNP7GhKLhnS73kOpA+UKDknAJ61p/s26DqWh/8LLGp6ddaeLzxjqF1b/a4Gi86Ftm2RNwG5Dg4YcHFAF7TfjpceMPgvpPjnwZ4Q1HxRqGqAR2+gpNHbuk2WWRJpn+WNUZGBc57YHNUPhr8fda8SeINf8M+NPAVx4C8V6Zp41WLT31KK/hu7U5Xek8ahQQ4KlcHGQcnkDxcaX448GfAvwQsfhzxhNolr4m1CXxDovhjzrTV5bR7icw+WEKSlCzKxCMuVIOQuSG/Af4VxeGfjVruteGvhjrvgLwtqvhCXyItXa4muZZzMM+fveQRStjiLeW2gEgEkAA6yH9s7xBffDbSfiDp/wAIdUv/AAWbfz9Z1SPVIk+wYfbIIYnQSXIQclwqLkEZwCR6J8TP2hh4Wbwtpng/wxeePvFfia2N9pmkWtwlon2VQrNNNO4KxLhhjI5bjjrXJfDnwnrFr+wpB4eu9Gvodb/4Ra6tzpU1q63PmlJMR+URu3EkYGM8isDUofF3we8RfDb4hW/gzWvFujr4Sh8PavpWjW5l1Kxk+SRJEtzgv8wKsOMYySMYIB6D8Pf2htW8UfE6LwJ4k8B3ngvXI9Hk1W8W8vknji2yKoWKRF2TIQ2d4YYIKlQRWBqn7VXiRYbrxLonwl1bXPhhZs5m8VpqdvFM8MbFZZ4bJv3ksYwSrZG4Aniuc8O69q3xU/ajS51Dw7feErK+8CXMVpZ6qAuoJE9wqmS4iBIiJbO1NxOBk4JwPEvDfwB8EeCbJPCfjP8AZu8a+K/Glq7Wya3oM902lalk/upmuBcrHAG43Ar8nU+gAPqzxx+0Vq1v4msPDvw48B3HxH1ibS4tauE/tSHTIYLOUkRP5kwO5mIPygcDv2r1vwzq1zrnh/T9QvdMuNFvLiFZJtOuirSWzkfNGxUkHByMjg9RXzV8d9L8LaRL4c0S8+DXjzVbzSdNjXQPEXgWN5Z9NYIyCI3SSq6GM4I8zepzuwea9y+Cdv4ss/hT4ah8cuz+K0tFF8XkSRw+TgO6DazhdoZhwSCeetAHbVi+I/GuheEYfM1fVLex4yEkfMjfRBlj+Aqp408K6j4nsJILDxJf6G7DGbVU29O5wH/JxXzX4w/Z88Y6RNLcxoNfjY5M1s5aU+7I3zE/TNcdetUpr3IXPo8qy/B4yVsTiFDy2f3vT8z0DxV+1TY22+Lw/pkl444FxeHy4/qFHzEfUrXd/BPxnqXjvwdJqeqNG1z9rkjHlJsUKApAx+Jr41urSexnaC5hkt5l4aOVCrD6g19CfCLwjqXjD4Rw22meIrrw5LFqksjXFoG3OuxRtO114yc9e1cGHxFWpV1102Pr83ybL8HgV7P3byXvO7fXt+iPoSiuT1Twbqd/4Dg0GHxJd2moxxxo2sRhvOcqQSxw4PzY5+bv3o0vwbqdh4Dn0GbxJd3eoyRyIusSBvOQsSQwy5Py54+bt2r1+aV/h6f0j859jR5b+1V+a1rPb+bbby3Osork/Avg3U/Cmj3tnqPiS78QTzyF0uroNuiBUDaNzseoz1HWq3w78B6v4Nmvn1TxZfeJVuFQRrdh8RYJyRukbrkenSkpS0vHf8CpUaEVU5aqfLa2j97000t52O1orhvC/wAP9Z0Hxde6veeL77VrKfzdmmTh/Li3MCMZkI+UcD5R+FH/AAr/AFn/AIWB/wAJB/wl99/Znmb/AOxcP5ONm3b/AKzHX5vu9fzo5p2+H8vvKdDD8zSrKyV72lq/5dvx2O5orhvFHw/1nXvF1lq9n4vvtJsoPK36ZAH8uXaxJziQD5hwflP41J8RPAer+MprF9L8WX3hpbdXEi2gfEuSME7ZF6YPr1ocpWdo/lqEaFCUoKVZJNa6S93y21+R2tFcn468G6n4r0eys9O8SXfh+eCQO91aht0oCkbTtdT1Oep6Uap4N1O/8BwaDD4ku7TUY440bWIw3nOVIJY4cH5sc/N3703KV37pnGjRcYN1Um3Zqz0XfbX0Wp1lFcnpfg3U7DwHPoM3iS7u9RkjkRdYkDechYkhhlyflzx83btR4F8G6n4U0e9s9R8SXfiCeeQul1dBt0QKgbRudj1Geo60KUrr3Ryo0VGbVVNp2Ss9V3209HqdZRXFfDvwHq/g2a+fVPFl94lW4VBGt2HxFgnJG6RuuR6dKj8L/D/WdB8XXur3ni++1ayn83Zpk4fy4tzAjGZCPlHA+UfhSUpWV4/loXKhQjKajWTSWmkve8ttPmdzRXDf8K/1n/hYH/CQf8Jfff2Z5m/+xcP5ONm3b/rMdfm+71/OjxR8P9Z17xdZavZ+Lr7SbKDyt+mQB/Ll2sSc4kA+YcH5T+NHNO3w/l94LD4fmSdZWave0tH/AC7fjsT/ABh8SP4a8C3Pktsur5vsqEdQCDuP/fIP4kV8v17D+0hqRfWNH04N8sNu05Uertt/9k/WvHq+/wAqpKnhlLrLU/nHi7FvE5nKnfSmkl+b/F/gQ3V3BYWstzczR29vEpeSaVgqIo5JJPAHvVDRPFWieJfN/sjWLDVfJx5n2G6SbZnpnaTjOD19K8/1DRbb4n/FLVNN1tWutC8Ow27RaazkRTXMgL+ZIo++FUAAHjlsjmusj8G+E/BskuvWmiafpEtnbS77iyt1g/d4DMCFADfdHXp2613xqTk20lyr79Nz5+eHoUoKE3J1Gk0klZXV0t7u6a9PM6mivH7fxx8TtZ0n/hJtM8PaHF4fZPtMOmXk8o1GaEDOQyjy1ZhyARxnv30NX+LV/cQ+Brjw9p0V8niQSYhuCVZCI9wy4OFAb7xw3AOBmp+tU7X1+7e+mho8qxHNypxe97SWjSbafbRPy03PUKK8hs/H/wAQY9avPCd5o2iS+KWhW7tLy3klXThAchmkzmTIYbcDklh0AJp8XxW8QWfgrxtLqthYQ+J/DIPmC33taTZUOjKCQ2CD0zn6dAfWqfW/Xp26eo3lOI2Ti722aekmkn6XaXqet1m/8JFp/wDwkH9ifaP+Jp9m+1+Rsb/Vbtu7djb14xnNeaax8QviBo2kQ+KptB0geFo4knubHzpP7SWIj5pP+eYxndtyxxxnPS8upW7fG5dQ8wC0Phfz/MPQJ527P5UniE2lHut+z6jjls4qUptNWlblaeqto/v/AMmen0V4DcftCatJC+vWdz4OGgIS40i41XGryxA4yFB2K5HzBCMjp1qfx1qHjPVPip4Pu9AbQTBcWk82li/8/wC60SGTztnfkbdv41DxtO14Jvb8epvHI8Qp8tZqGknq+sVdr1/4O9j3eivJfHXxc1DTfEUnh/Rb/wALadf2cUct7d+Jb4wwbmBIiiRSGY4wxboAQOprpvhX4/b4gaDczzraLf2Ny1nctp84mtpHUA74nB5RgQRnkZx2reOIpyn7NPU4amW4ijh1iZL3Xb1s9n8ztKzYPEWnXOvXWix3G7U7WFLiaDYw2xuSFO7GDkg8A5ryL4lN44/4XJ4YXRjoO3yLk6cL7z8Y8tPN87b3/u7fxqe7vPEUPxq8RweH7OyuNXm0Wz/f37stpDhnyW25c5zgAD6kYrGWKak1y7O34X0O2nlSlTU3UXvQ5lra3vKOvlb8dOmvtFFeWaH8X7vT/Cfim78WWVva6v4cnMFzHYuRDOzAGLyy5JG7cByeOvHQYWkfHDWbfXtLGsXvg2/0zUrlLVbbQdU869tGkPyGQE7XAOFbaOpz04qni6Std7/h01+ZjHJ8XLnsl7vnvpfTvo0/mj3Ciiiu08Q6n4ZeJn8K+M9Pu9223kcW847GNiASfocN/wABr6smXbIfzr4qr7A8K6kdY8J6NfM26Sa1jLt/tbRu/XNfKZ1SScKq9D9d4FxcnGthJPRWkvyf6GlRRRXy5+rBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFeb+H/wBoLwbr03lNfSaXLnAXUI/LB/4ECVH4mvRLe6hvIVmt5Y54m5WSNgyn6EVnGpCprF3OvEYTEYV8teDj6okooorQ5AooooAoa54h0rwvp5v9Z1Oz0mxDrGbm+nSGMMzBVXcxAyWIAHckCpdU1ax0PTbnUdSvbfT9PtozLPd3UqxRRIBkszsQFAHcnFch8cvAo+Jnwh8WeGsL51/p8qQM38MwG6Nh7h1U/hXg3jjxdL8bv2Z/hl4Yhnmg1Dx9PaaTeyRf6yFIQXvGwT2EDDJyPmGc9KAPqf8Atiw/sn+1Pttv/Znk/aPtvmr5Plbd3mb87duOd2cY5rC0L4neFvFHiR9C0jWrfU9RXTotWC2u6SJ7WViscqSgeWwYqfusTxmvl2LxdqEf7FcngxGlbxLHqJ+H3y5EnmG4+z7xjp+5O7nHFaj2vifwX+05rPhz4daTp95qsPgPTbS1uNalePT7RIp5RvmMYMjZAACoMknkqATQB9bUV89eC/2ltX0XwP8AEi5+KGl6fpviLwHP5V8uiu/2S8WRQ9uYTISw37lX5j1OTjkDhtB/a+8U6f4n0G48S6p8LNU8Na1ew2Q0nwl4hN3rOnNOwEbSgtslCEhX8sDruGAKAPr6ivnab4v/ABZ8YfED4keEfAuheGDP4Z1C2ig1XxA1xHa+TJAsjRsImZ5JizHGAiqo5JJArvv2fPipqHxb8AtqOt6VHoviHT76fStUs4WLRLcwttcxkknYeoyTjOMnqQD0uivNte+JWp6X8fvCvgeKC0bSdV0a91GeZ0YzrJC8aqFO7aFIc5ypPTkVUb4q6sPjj4q8G/Z7L+y9K8Mwa1BNsfzmmeWRCrHdtKYQcBQevNAHqlFfI1j+0d8bta+Cek/FTT/CHhT/AIRy2sjeavZ3c1xHfXiI582S0RWZI0Cg48xmY7SdvQH1/wCJHj3xzN4F0XX/AIfQ+FbCzurP+073V/G13LBZ2UGxWCsIvm3EOTuJCqEOeooA9aor5y+G/wC1h9v+FfjrxB4qh0rUNT8HXP2W5l8IXBu7HU2dVMBtWJJ+csEwScEc46DY8Ha5+0Rq0zX+t+H/AAFpOl31rM1pp6XV297YTFC0AumH7uRQwVX8rB+bIxgigD2++vIdOs7i7uH8u3gjaWR8E7VUZJwOTwO1Z3hHxZpXjvwzpviDQ7r7dpGowrcWtx5bx+ZGeh2uAw+hANfLX7J+p/FPTbH4j6hrf/CJSaDbavq81z9j+1G7OpKwLBN52/Z+DjPz9K7Xwb+0L4n1K1+Cmq6zYaXFoXjq0eG9ntYpFa21ApvhVC0hAjcK4wwJyB83agD6HorxrxF8epPDvj7xylxDbx+CfBWiJe6re+W7XEl5Jl0gjYMFGIwCQVJJkXkd/H9P/bK8UafqWk63rmo/C288KalcwwtoHh/xH9p1+xSZgqtIN3lSmMsN4QeuMYJoA+wbi4jtLeWeVtkUSl3bBOFAyTxWV4N8Y6P8QPC+neItAu/t+jahF51rc+U8fmJkjO1wGHIPUCr+q3bWOlXl1GFZ4YXkXdyCQpIz7V826l+1F4ktf2evhz4uSz8PWfiTxhItsb7V5pLXRNOciRjJO25nCYjwBuySevYgH05RXF/Ce+8c33htm8fw+Hhq/mborrwvNLJZXELKGRlEvzg8kHOQcZHBrtKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvPfix8PfFnjI6ddeDviJfeANUtA8byR2EN/a3Eb7SQ9vLhS4Kja+cqCw/ir0KigDyr4O/AuT4ca1rPifxD4ovfHPjjWUSG91y9gS3VYUJKRQQJlYU5yVBOSM8dK9VoooAKKKKACiiigDK17wpo/iiHytV022v17GaMFh9G6j8KTwz4U0rwbppsNHtfsdoZDL5fmM/zHGTliT2Fa1FTyxvzW1NvbVfZ+y5ny9r6fcFFFFUYhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABSr94fWkpV+8PrQB84fHqbzPiJcLn/VwRL/47n+ted16J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skCs2ANxCAAnAAz7VgeA/jH4N+Jst1F4a1yLUZrZd8sJikhkC/3gsiqSPcAgZFJo/wAZfBuvaxp2k2GuR3Go6gsr29uIZAzLGWDlsr8gBRsbsZwcZpvDYyClScJK2rVnppe7Xor69ECrYeXLUUou+zuvwOns9F07TbWe2tLC1tbed3klhhhVEkdzl2YAYJbuT171E3hvSW0P+xjpdkdH8vyv7PNun2fZ/d8vG3HtiuN0r9oP4e634pXw7ZeJ7efVnlMCReVKI3cfwrKV2Nnthue2a53XP2lvDmg/F0eFLvUYIbGOAxXEptJ2lW9MihIgQuNpUk5wR/tCt4ZfmE5uKpy5kubZ3suv+RjLF4SMU3ONr8u6+49T1rwzo/iOxSx1bSbHVLJGDJb3tsk0akDAIVgQCATVjStIsdCsIrHTbK30+yiyI7a1iWKNMnJwqgAck1z/AIVvNKk8S+LVs9cv9RuobqIXtneSMYbBvKBCQgqAFK4Y4JGSee1YMP7R3w2uPEQ0OPxbZtfmTyQdkggLY6Cfb5f47sE8daxWGxVROnSjKSSTaSel1e9unr13NfbUIWnNpN6brWz2/wCAek0VzniT4ieHPCF6tprOqRafM1rJejzVbb5MZAdtwGOrAYzk54BqDwR8UvCvxG026v8Aw7rMOoWtq22dirxNFxnLK4VgMZ5IwcH0NYfVq/s/bcj5e9nb79jX21Ln9nzLm7X1+46qiuG8I/G/wP488QT6JoPiCHUdThV2aFIpFDBThijsoVx/uk8c9Oa7morUKuHlyVoOL7NNfmOnVp1lzU5JrydyS2/4+Iv98fzr3rwb/wAgOP8A32/nXgtt/wAfEX++P51714N/5Acf++386/YeA/8Ac8V/ih+Uj864q/3qh/hl+cTcooor9GPkQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqnrX/IHvv8Arg//AKCauVT1r/kD33/XB/8A0E1pT+NepFT4GeAa7/yFZ/8AgP8A6CKoVf13/kKz/wDAf/QRVCv5pz3/AJG2L/6+T/8ASmfs2U/8i7D/AOCP/pKPG/jhcafpPjn4d6x4jjVvCtpeTLNLNGXht7pkAgkk7AAg4Y8A4PuKvinxHoHjr4v/AA8PhW/s9c1SwnnnvbzS5kmWCzMTKyyOhIAZ2XCk9e3NezX+n2uqWU9ne20N5aToY5be4jDxyKeqsp4IPoapaB4T0TwpDLFomjafo8UzBpE0+1SBXIGASEAyfrRSx1OFKKcXzxjKK1920r6tb31froVUws5VJWa5ZNN6a6W2+75anh/wP8aeCfCNh40XWNT0zRdRn1+/edtQdYWuYxKwXaXx5gHzDC5wSeMnngdQsb2H4OeHdRsrp/DPhaTxZNfx3MlgLiOytHd/s8rQPwU3EEA8DcD6V7f8NvhXbr4e1O08X+HdPvZDrt/fWsd/DDdBY5ZSyuv3gpIx6H1r0+a1hubV7aaGOW3kQxvC6goykYKkHgjHavUrZpRw+JlOknJuSbu01ZJrTRrrpe9rW1Rw08DUrUYxm+Wy00aerT118um/keB+BtJ/tn4paNqt58YtK8d6lY2lyIrPT9Nto38plAbdJA5wAWU4bqenetb4ESW3hP4F6hrNtp6zTrLqF7PHGMPcukkmATg5OFC+wFep6B4N0Dwp539iaHpuj+fjzf7PtI4PMxnG7YBnGT19avabpdlototrp9nb2NqpZhDbRLGgJJJO1QBkkkn3NeficyjWi6aT5bx6RjpHmdrRSW8v1Oyjg3Tkpt6+93ertreTb6HyJ8QPGN14u8G+GL4ePtBuIHuNPk/4RHQdLTFoRKnLSl2ki27guSEBICgDNeyeJNf0zw7+0ho8uq6ha6bFceHZYYpLuVYkeQ3C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1Kkqs3Obu2FFFFMzCiiigAooooAKKKKACiiigAooooAKKKKAHwTyWsySxOY5EO5WHUGvpH4V+Jl1fTUjJ5kXeF/usOGX+tfNdejfB3WjY6i8JPCOsw+h+Vv0xXmZhQVag11R9rwpj5YTHKk37s/zPoyiiivz8/fgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr5u+MN41xq0S9i8sn5sAP5V9I18w/FPd/bcOf+eZ/Pca+hyZfvZM+E4yk45a0urX5o4uiiivsj8HCiiuI+GfiPUfEGneIZdQuPtD2ur3drCdirtjRsKvAGcep5rNzUZKPc6IUZVKcqq2jb8Tt6K8RX4i+KX+GPg3Vba6S51jUdZW0m81I0SZDJIu04QhRhV5UZ4rZsdQ8aeDviJoun67r1v4j0nXfORBHYLamzlRS4C7SSy44+Yk8fieZYqMrWi7O3yvt1PUllNWHMpTjdc2l3d8nxW0t0vq1fproeq0V4F8V/iNqfhHVb65i+J2k2E0Lt9n8Nw6Yt1u2YISaUbnjZh1yFAzx0zXVav428ReLpvDuieF5rbRb/U9OXVbvUbiMT/ZITtAEcZ4dixx83GAfqF9bhzSjbVemv4/nYbyeuoU6rkuWV9XzJKyu73ir/8AbvN2Wp6ZfX1tpdnLd3lxFaWsK75J53CIi+pY8AfWqera4ulL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ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK57xvoq6tpDkpvMYO5f7yEYYf1/CuhorWnUdKamuhlVpxrQdOWzPjvWtKk0XUprWQfdOUb+8vY1Rr6A+JPw3j1KFp4V2IvKOoyYieoI7r/KvDtU0G+0eTbdQMi5wJByh+hr9Bw2KhiIKUXqfzvnWS18srStG8Oj/AMyhRRRXafMhRRRQAUUUUAFFFFABRRRQAUUUUAFFFWbHTbrUpfLtYHmf/ZHA+p7Utty4xlNqMVdsit7eS7njhiQvLIdqqO5r6S+FvhlNI01JCP8AVrsVv7zHlm/PiuN+G/wxkSZbmfmXGHk/hjHdV9W9/wDJ9rghS2hSKNQkaDCqK+WzXGRa9jB+p+y8KZHPCJ4vEK0nsuyH0UUV8sfpYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUABAYEEZFY194R06+Yt5bQMevkkAH8MYrZorSFSdN3g7Gc6cKitNXONk+GGmyOWJU/70Kk/nTf8AhVum/wDTP/wHWu0orp+u4j+c4v7Owj/5do4v/hVum/8ATP8A8B1o/wCFW6b/ANM//Ada7Sin9dxH84f2dhP+faOL/wCFW6b/ANM//AdaP+FW6b/0z/8AAda7Sij67iP5w/s7Cf8APtHF/wDCrdN/6Z/+A60f8Kt03/pn/wCA612lFH13Efzh/Z2E/wCfaOL/AOFW6b/0z/8AAdaP+FW6b/0z/wDAda7Sij67iP5w/s7Cf8+0cX/wq3Tf+mf/AIDrR/wq3Tf+mf8A4DrXaUUfXcR/OH9nYT/n2jjF+F2mqwP7sfSBa1LPwTp1oykh5sfwuQF/ICt+ioli68lZyNIYLD03eMEhscaQoERVRF6KowBTqKK5DtCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k=
