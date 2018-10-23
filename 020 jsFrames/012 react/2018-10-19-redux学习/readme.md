react-redux学习

# 1 第一步 构建Store

## 1.1 Action：想清楚要做什么

Action是要做什么事的载体，它包含两部份信息：
- 我要做什么
- 做这件事所需要的数据信息

我们通过`store.dispatch()`来执行这个action

我们可以通过Action Create来生成一个action，ActionCreate是一个纯方法，让返回一个Action对象

## 1.2 Reduceers: App状态的结构是怎样的？如果通过action构造新的状态？

Reducer是一个纯方法（没有副作用），它的作用是通过解析一个Action得到新的State。

向Reducer转入当前的state和Action，Reducer返回新的state

最后可以把多个Reducer通过combinReducer合并为一个

## 1.3 Store

action将action和reducer组合起来对外提供接口，它的主要功能如下：

- 维护应用状态
- 获取当前状态：getState()
- 执行action: dispatch(action)
- 订阅状态变化：subscribe(listener)
- 取消事件订阅

### 1.3.1 构建store
```js
// 可以从服务端加载默认状态
const store = createStore(todoApp, window.STATE_FROM_SERVER)
```

## 1.4 数据流转过程

- 应用代码调用`store.dispatch(action)`，可以从任何地方调用
- redux调用reducer,获取到新的state
- redux可能需要合并多个子reducer
- redux触发订阅的事件（调用react的setState）


# 2 react-redux

## 2.1 将redux中的state转换成react中的props

我们需要一个方法，将state中的一部分转换成组件所需要的props。这其中可以对数据进行过滤、截断等操作。

这个方法的输入是redux中state，输出是组件所需要的props

## 2.2 我们还需要执行action

我们需要构造出props中所指定的callback方法，这些callbacks可以改变redux中的状态。

我们定义一个`mapDispatchToProps`，它的输入时redux中的dispatch方法，它的输出是一个包含了callbacks的对象

> 一个问题：redux状态变化会不会引起不必要的计算量。
例如某个组件只关心一小部分状态，但是它会涉及到很大的计算量。这时候redux的其它部分频繁发生变化，会不会导致这个组件反复计算props?

可以使用reselect来做优化，也可以自己手动实现

> 我还有一个问题：副作用在哪里发生？

## 2.3 将props和callback注入到组件中去
```js
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
```