## Layout动画学习总结

### 第一阶段：项目主体搭建、布局

#### 1.1 自定义组件最外层容器的样式
在使用自定义组件时，如果在组件上添加样式，这些样式不会自动生效。我们需要在自定义组件内部读取style（从props中读取），并且将样式添加到组件内部的容器上。

> 参考ChatBox组件

#### 1.2 ScrollView上的Padding
在ScrollView上添加Padding会导致滚动不到容器的顶部或者底部，可以在ScrollView的外层容器上添加Padding

#### 1.3 flex布局
flex后面的数字表示容器扩张或收缩的比例，flex: 0表示不缩放

#### 1.4 圆角背景
圆角可以通过ImageBackground实现，这个组件有borderRadius样式。Image组件不可以包含子组件

#### 1.5 Button
Button组件只能设置样色，而且在Android和IOS的展现不一样

#### 1.6 Margin
不是每个组件都有Margin属性，TextInput、TouchableHighlight就没有Margin