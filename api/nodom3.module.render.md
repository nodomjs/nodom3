<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nodom3](./nodom3.md) &gt; [Module](./nodom3.module.md) &gt; [render](./nodom3.module.render.md)

## Module.render() method

模型渲染

**Signature:**

```typescript
render(): boolean;
```
**Returns:**

boolean

## Remarks

渲染流程：

1. 获取首次渲染标志

2. 执行template方法获得模板串

3. 与旧模板串比较，如果不同，则进行编译

4. 判断是否存在虚拟dom树（编译时可能导致模板串为空），没有则结束

5. 如果为首次渲染，执行onBeforeFirstRender事件

6. 执行onBeforeRender事件

7. 保留旧渲染树，进行新渲染

8. 执行onRender事件

9. 如果为首次渲染，执行onFirstRender事件

10. 渲染树为空，从document解除挂载

11. 如果未挂载，执行12，否则执行13

12. 执行挂载，结束

13. 新旧渲染树比较，比较结果为空，结束，否则执行14

14. 执行onBeforeUpdate事件

15. 更新到document

16. 执行onUpdate事件，结束

