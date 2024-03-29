<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nodom3](./nodom3.md) &gt; [Module](./nodom3.module.md) &gt; [watch](./nodom3.module.watch.md)

## Module.watch() method

监听model

**Signature:**

```typescript
watch(model: Model | string | string[], key: string | string[] | ((m: any, k: any, ov: any, nv: any) => void), operate?: boolean | ((m: any, k: any, ov: any, nv: any) => void), deep?: boolean): () => void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  model | [Model](./nodom3.model.md) \| string \| string\[\] | 模型或属性 |
|  key | string \| string\[\] \| ((m: any, k: any, ov: any, nv: any) =&gt; void) | 属性/属性数组，支持多级属性 |
|  operate | boolean \| ((m: any, k: any, ov: any, nv: any) =&gt; void) | _(Optional)_ 钩子函数 |
|  deep | boolean | _(Optional)_ 是否深度监听 |

**Returns:**

() =&gt; void

回收监听器函数，执行后取消监听

## Remarks

参数个数可变，如果第一个参数为属性名，则第二个参数为钩子函数，第三个参数为deep，默认model为根模型

否则按照参数说明

