# 1. Widget
## 简介
widget是Element的配置，它是不可变的。

widget可以多次添加到树中，

在更新的时候如果widget的type和key一致，则element可以做更新，否则element需要重建。

## 成员

- key
  - GlobalKey：允许对应的element在树中移动，例如hero动画。
- Element createElement();
  - 构造一个实例
- canUpdate
  - 类型和key是否相同

# 2. StatelessWidget
- build的调用时机
  - 首次插入树
  - 父级widget配置发生变化
  - 关联的InheritedWidget发生变化
- 如果build经常需要重建，那么我们需要性能优化
  - 减少不必要的层次，使用Align，CustomSingleChildLayout，CustomPaint
  - 使用const构造函数
  - 使用StatefulWidget缓存公共元素，在结构变化时使用GlobalKey
  - 如果InheritedWidget经常变化，则把widget拆成更小的widget.

- 成员
  - createElement：构建element维护元素在树中的位置。
  - build：build方法中的context就是StatelessElement实例对象