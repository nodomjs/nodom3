<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nodom3](./nodom3.md) &gt; [Module](./nodom3.module.md) &gt; [invokeOuterMethod](./nodom3.module.invokeoutermethod.md)

## Module.invokeOuterMethod() method

调用模块外方法

**Signature:**

```typescript
invokeOuterMethod(methodName: string, p1?: any, p2?: any, p3?: any, p4?: any, p5?: any, p6?: any, p7?: any, p8?: any, p9?: any, p10?: any): unknown;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  methodName | string | 方法名 |
|  p1 | any | _(Optional)_ |
|  p2 | any | _(Optional)_ |
|  p3 | any | _(Optional)_ |
|  p4 | any | _(Optional)_ |
|  p5 | any | _(Optional)_ |
|  p6 | any | _(Optional)_ |
|  p7 | any | _(Optional)_ |
|  p8 | any | _(Optional)_ |
|  p9 | any | _(Optional)_ |
|  p10 | any | _(Optional)_ |

**Returns:**

unknown

方法返回值

## Remarks

当该模块作为子模块使用时，调用方法属于使用此模块的模板对应的模块

对于下面的例子，模块`Module1`<!-- -->需要调用模块`Main`<!-- -->的`outerFoo方法`<!-- -->，则采用`invokeOuterMethod`<!-- -->进行调用。

## Example


```js
 //Module1
 class Module1 extends Module{
     //your code
 }

 //Main
 class Main extends Module{
     modules=[Module1];
     template(){
         return `
             <div>
                 <Module1 />
             </div>
         `
     }
     outerFoo(){

     }
 }

```
