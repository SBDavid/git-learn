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

### 第二阶段：Layout动画

#### 2.1 打开实验功能
```js
import {UIManager, Platform, LayoutAnimation} from 'react-native';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}
```

可以手动设置属性
```js
LayoutAnimation.configureNext({
    duration: 300, //持续时间
    create: { // 视图创建
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.opacity,// opacity、scaleXY
    },
    update: { // 视图更新
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.opacity,
    },
    delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
    }
});
```

也可以使用预设
```js
LayoutAnimation.spring();
```

### 第三阶段：ScrollView程序触发滚动
当ScrollView所在的组件触发componentDidUpdate方法时，SrollView的内容并没有发生变化。原因还没有找到。
但是可以使用onContentSizeChange事件回调监听内容的变化