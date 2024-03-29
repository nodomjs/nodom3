<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nodom3](./nodom3.md) &gt; [Nodom](./nodom3.nodom.md)

## Nodom class

Nodom接口暴露类

**Signature:**

```typescript
export declare class Nodom 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [isDebug](./nodom3.nodom.isdebug.md) | <code>static</code> | boolean | 是否为debug模式，开启后，表达式编译异常会输出到控制台 |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [app(clazz, selector)](./nodom3.nodom.app.md) | <code>static</code> | 应用初始化 |
|  [createDirective(name, handler, priority)](./nodom3.nodom.createdirective.md) | <code>static</code> | 创建指令 |
|  [createRoute(config, parent)](./nodom3.nodom.createroute.md) | <code>static</code> | 创建路由 |
|  [debug()](./nodom3.nodom.debug.md) | <code>static</code> | 启用debug模式 |
|  [registModule(clazz, name)](./nodom3.nodom.registmodule.md) | <code>static</code> | 注册模块 |
|  [request(config)](./nodom3.nodom.request.md) | <code>static</code> | ajax 请求，如果需要用第三方ajax插件替代，重载该方法 |
|  [setLang(lang)](./nodom3.nodom.setlang.md) | <code>static</code> | 设置语言 |
|  [setRejectTime(time)](./nodom3.nodom.setrejecttime.md) | <code>static</code> | 重复请求拒绝时间间隔 |
|  [use(clazz, params)](./nodom3.nodom.use.md) | <code>static</code> | use插件（实例化） |

