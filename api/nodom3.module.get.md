<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nodom3](./nodom3.md) &gt; [Module](./nodom3.module.md) &gt; [get](./nodom3.module.get.md)

## Module.get() method

获取模型属性值

**Signature:**

```typescript
get(model: Model | string, key?: string): unknown;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  model | [Model](./nodom3.model.md) \| string | 模型 |
|  key | string | _(Optional)_ 属性名，可以分级，如 name.firstName，如果为null，则返回自己 |

**Returns:**

unknown

属性值

## Remarks

参数个数可变，如果第一个参数为属性名，默认model为根模型，否则按照参数说明

