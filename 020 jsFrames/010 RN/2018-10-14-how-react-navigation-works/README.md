# 要解决的问题

## 1 系统的架构？

### 1.1 react-navigation

- 对外总入口
- 对内起到“交换机的功能”，如果A模块引用B模块，需要通过总入口中转。
- 主要对native/core/stack三个库进行中转

### 1.2 native

- createNavigator方法提供了导航顶层容器
- 顶层容器构建了props和navigation结构

### 1.3 core

core提供了三个文件夹

- routers: 提供状态管理
- views: 单个导航页的容器，并提供context状态
- navigator：总体导航的容器，并提供状态

### 1.4 stack

提供了 stackNavigator的各种View组件，包括Head/body/动画

## 2. 深入研究

### 2.1 state从哪里来？

### 2.2 state是怎样的架构，有哪些字段？

- 所有的状态一开始都在`createAppContainer`中初始化。
- createAppContainer在初始化的过程中，为state传入了第一个navState
- 第一个navState的结构取决于是哪一种路由

```
key: 'StackRouterRoot',
isTransitioning: false,
index: 0,
routes: [route],
```

createAppContainer把router对象，当前navState，dispatch方法，addListener方法以props的形式传给下级

### 2.3 state的initState是怎么得到的？

createNavigation会构造出第一个state, 此时index=0, routes中只有一个route。并且更具routers生成descriptors数组。
NavigatorView可以更具这个descriptors渲染出第一个导航页面


## 3. 遗留问题

- 状态全部由组件内部控制，这种库是怎么设计的
- 导航是可以递归嵌套的，怎么设计这种库
- 导航库中有各种动画，动画状态和其它状态是如何合作的

## 4. 待阅读资料

https://apiko.com/blog/10-react-native-open-source-projects-you-must-know/
https://www.moveoapps.com/blog/libraries-that-make-react-native-development-easier-and-faster/

https://www.jianshu.com/p/470606826b12


Attempted to transition from state `RESPONDER_INACTIVE_PRESS_IN` to `RESPONDER_ACTIVE_LONG_PRESS_IN`, which is not supported. This is most likely due to `Touchable.longPressDelayTimeout` not being cancelled.