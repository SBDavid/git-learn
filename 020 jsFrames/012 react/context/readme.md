react context学习

## 作用
避免props逐层向子组件传递，特别是当props被多次复用，并且使用这个props的组件非常分散时。

如果只是props需要传递的层次很深，但是props并没有被多次复用时，可以使用其他方案替代。例如在高层节点上创建组件，并将整个组件传递到生成，这样就避免了props变化导致中间组件需要修改props的风险。

## 注意点

### Context动态修改
`Context.Provider`所传入的`value`是可以动态修改的。一般`value`值是state或者props可以调用`setState`修改`context`。

不建议直接向`value`中传入一个新对象，这会导致react无法判断context是否有更新，结果每一父组件发生render无论context是否变化，都是导致监听这个context的组件发生render。

## 在深层组件中触发context更新

可以context中传入自定义方法，在传入的方法中更新调用`setState`来更新context

## 在生命周期钩子中使用context

一个通过`this.props`访问`context`

## 可以通过`higher-order component`给组件绑定context

## 需要继续学习的地方

- Render Props
- Forwarding Refs to Context Consumers
- context发生变化，但是没有触发PureComponent的render和didUpated