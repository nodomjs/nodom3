<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nodom3](./nodom3.md) &gt; [RouteCfg](./nodom3.routecfg.md)

## RouteCfg type

路由配置

**Signature:**

```typescript
export declare type RouteCfg = {
    path?: string;
    module?: Module;
    modulePath?: string;
    routes?: Array<RouteCfg>;
    onEnter?: (module: any, url: any) => void;
    onLeave?: (module: any, url: any) => void;
    parent?: Route;
};
```
**References:** [Module](./nodom3.module.md)<!-- -->, [RouteCfg](./nodom3.routecfg.md)<!-- -->, [Route](./nodom3.route.md)

