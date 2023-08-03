<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nodom3](./nodom3.md) &gt; [Nodom](./nodom3.nodom.md) &gt; [createRoute](./nodom3.nodom.createroute.md)

## Nodom.createRoute() method

创建路由

**Signature:**

```typescript
static createRoute(config: RouteCfg | Array<RouteCfg>, parent?: Route): Route;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [RouteCfg](./nodom3.routecfg.md) \| Array&lt;[RouteCfg](./nodom3.routecfg.md)<!-- -->&gt; | 路由配置 |
|  parent | [Route](./nodom3.route.md) | _(Optional)_ 父路由 |

**Returns:**

[Route](./nodom3.route.md)

## Remarks

配置项可以用嵌套方式

## Example


```js
Nodom.createRoute([{
  path: '/router',
  //直接用模块类，需import
  module: MdlRouteDir,
  routes: [
      {
          path: '/route1',
          module: MdlPMod1,
          routes: [{
              path: '/home',
              //直接用路径，实现懒加载
              module:'/examples/modules/route/mdlmod1.js'
          }, ...]
      }, {
          path: '/route2',
          module: MdlPMod2,
          //设置进入事件
          onEnter: function (module,path) {},
          //设置离开事件
          onLeave: function (module,path) {},
          ...
      }
  ]
}])
```
