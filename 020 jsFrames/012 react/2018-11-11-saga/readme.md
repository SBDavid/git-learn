学习：redux+saga+react+websocket编程

## 1. 遇到的问题

### 1.1 框架使用问题
#### 1.1.1 redux：过多的Container类型容器
#### 1.1.2 styled-component如何与present组件如何结合
#### 1.1.3 react：props类型如何与typescript结合
我们需要在jsx文件中定义ts接口，在定义componnet或者purecomponnet时传入这个接口
redux中的mapDispatchToProps也可以规定Action的类型
redux中的createStore也可以指定类型
#### 1.1.4 react：component<props, state, ?>第三个参数是什么？
第三个参数是snapshot，以后研究一下