# React生命周期学习总结

## 1. constructor
### 1.1 作用
- 初始化state
- 绑定事件处理函数的this指向

### 1.2 props向state拷贝
```js
constructor(props) {
    this.state = {
        aa: this.props.aa
    }
}
```
在这种情况下props的变化不会引起stats的变化，容易引起bug。

## 2. getDerivedStateFromProps
### 2.1 作用
当state的值取决于props的变化时，可以使用这个钩子

### 2.2 调用时机
state变化或者props变化

### 2.3 用法
这个钩子返回新的state，或者null标识不更新state

### 2.4 注意
很多时候不需要手动监听props变化，可以使用更简单的做法完成相同的功能

### 2.5 扩展阅读
[you-probably-dont-need-derived-state](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

## 3. shouldComponentUpdate
### 3.1 作用
避免过度调用render函数。父组件的props发生变化会触发所有子组件调用render函数。即使变化的props不影响该子组件，也会触发子组件的render函数。

可以通过return false,避免触发render函数

### 3.2 注意
如果返回false，那么孩子节点也不会执行re-render。但是如果孩子节点的state发生变化，还是会触发render

### 3.3 PureComponent
PureComponent的作用和shouldComponentUpdate相似。PureComponent和Conponent的区别是，前者提供了默认的shouldComponentUpdate钩子，默认钩子会对state和props的前后状态做浅对比，如果前后状态相同则不执行render函数。

大多数时候应该竟可能的使用PureComponnet，因为相比较shouldComponentUpdate而言前者不容易遗漏一些判断，从而导致一些必要的渲染被遗漏。

## 4. render
### 4.1 作用
render函数返回React虚拟Dom结构，如果计算结果和之前的状态对比没有发生变化，则不需要改变页面Dom结构

### 4.2 触发时机
- 组件首次加载
- 页面state或者props发生变化时
- 父组件props发生变化，无论是否涉及该子组件，都出发render
- `shouldComponentUpdate`返回`false`时，不会触发render
- 调用`forceUpdate`时，无论`shouldComponentUpdate`返回什么，都出发render

### 4.3 注意
- render函数不应该改变state
- 不应该做网络请求
- 不应该改变任何外部状态
- 不应该依赖其它全局状态
- 相同的输入有相同的输出

## 5. getSnapshotBeforeUpdate
### 5.1 作用
在改变Dom结构之前保存一些页面状态。

保存的状态可以在`componentDidUpdate`中得到

### 5.2 注意
不要在这个钩子中使用`setState`，应为它发生在render函数之后。

## 6. componentDidMount
### 6.1 时机
Dom挂在完成之后触发

### 6.2 注意
- 如果在这个钩子中调用`setState`，会触发一次render函数。但是屏幕只会更新一次。但是这种操作可能引发性能问题。
- 如果某个组件的渲染依赖于另一个组件的屏幕状态（例如高度），那么可以在这个钩子中调用`setState`

### 6.3 未看懂的部分
This method is a good place to set up any subscriptions. If you do that, don’t forget to unsubscribe in componentWillUnmount()

## 7. componentDidUpdate
### 7.1 时机
- 发生在Dom渲染完成之后
- 即使改变的props/state不改变页面Dom结构，也会触发这个钩子

### 7.2 注意
在这个钩子中使用setState，可能会触发死循环和性能问题。而且对于用户来说是不可见的

## 8. componentWillUnmount
### 8.1 作用
释放资源和定时器

## 9. 其它方法

### 9.1 setState

- setState可以传入一个方法，用于读取之前的state
- 不能修改前值，需要返回一个新的对象
- 新的状态和之前的状态会合并
- 这里的合并是浅合并
- 如果传入一个更新对象，react不保证state即使更新，因为react将多个setState做合并更新。这意味着一些中间状态会被覆盖。

#### 升入阅读
[In depth: When and why are setState() calls batched?](https://stackoverflow.com/a/48610973/458193)
[In depth: Why isn’t this.state updated immediately?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

### 9.2 forceUpdate

- 用于改变除了state/props之外的状态
- 会触发render
- 忽略shouldupdate
- 触发子节点更新

### 9.3 defaultProps
默认props

扩展阅读
[higher-order-components](https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging)