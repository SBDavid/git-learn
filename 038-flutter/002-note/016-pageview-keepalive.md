## 滚动列表的keepalive用法和原理

### 1. 用法

只能在懒加载列表中使用(在`SliverWithKeepAliveWidget`中)，例如
- SliverGrid
- SliverList
- GridView
- ListView

#### 1.1 使用`AutomaticKeepAliveClientMixin`

- 覆盖`wantKeepAlive`属性
- 在`build`方法中调用基类中的`build`方法
- 更新`wantKeepAlive`属性，需要调用`updateKeepAlive`方法

### 2. 原理

#### 2.1 涉及到的对象

- AutomaticKeepAliveClientMixin : 使用在State上的mixin
  - KeepAliveHandle : ChangeNotifier
  - KeepAliveNotification: Notification
- AutomaticKeepAlive : StatefulWidget
  - KeepAlive : ParentDataWidget（ParentDataElement）
- SliverWithKeepAliveWidget
- RenderSliverMultiBoxAdaptor

#### 2.2 什么是`ParentDataWidget`

- 作用：父级widget向子级widget(`RenderObject`)传递数据。
- 比如：`Stack`通过`Positioned`(继承自`ParentDataWidget`)
- 每一种`ParentDataWidget`都针对特定的`RenderObject`和`RenderObjectWidget`。

```dart

// FlogJar组件通过FrogSize传递Size
class FrogSize extends ParentDataWidget<FrogJar> {
  FrogSize({
    Key key,
    @required this.size,
    @required Widget child,
  }) : assert(child != null),
       assert(size != null),
       super(key: key, child: child);

  final Size size;

  @override
  void applyParentData(RenderObject renderObject) {
    final FrogJarParentData parentData = renderObject.parentData;
    if (parentData.size != size) {
      parentData.size = size;
      final RenderFrogJar targetParent = renderObject.parent;
      targetParent.markNeedsLayout();
    }
  }
}
```

- applyParentData: 更新子级的parentData数据，并且调用父级的markNeedsLayout。parentData对孩子来说是透明的，所以子级不需要重新layout。

#### 2.3 `AutomaticKeepAliveClientMixin`
- `_ensureKeepAlive`在`initState`和`build`和更新的时候发送`KeepAliveNotification`通知。这个通知由`AutomaticKeepAlive`接受。
- `KeepAliveNotification`当中包含一个`KeepAliveHandle`，这个通知用来传递`KeepAliveHandle`。
- `KeepAliveHandle`是有一个`release`接口，调用`release`的时候将通知监听者。

#### 2.4 `KeepAlive`
概述：这个class用于懒加载列表中的列表项状态保活。他需要在`SliverWithKeepAliveWidget`中使用。例如`SliverGrid`和`SliverList`中会自动创建这个类。

`KeepAlive`继承自`ParentDataWidget`，`SliverWithKeepAliveWidget`组件通过这个类把`keepAlive`属性传递到孩子的`parentData`上。

`KeepAlive`组件中的`keepAlive`属性首次创建的时候为false，在`initState`和`build`的过程中发出了`KeepAliveNotification`通知，`AutomaticKeepAlive`组件收到通知后通过`_addClient`做了两件事：
第一件事：注册`KeepAliveHandle`的回调，当keepalive为false的时候回调函数通过`setState`把`Keepalive`中的`keepalive`设置为false。
第二件事：更新孩子的parentData，目的是把keepalive设置为true。通过`_updateParentDataOfChild`把孩子（renderObject）的keepalive换成ture。

#### 2.5 `AutomaticKeepAlive`

概要：用于接收`KeepAliveNotification`通知，并维护`RenderObject`上的keepalive属性。

#### 2.6 `SliverWithKeepAliveWidget`

概述：继承自`RenderObjectWidget`，它是所有具有孩子是KeepAlive的`Sliver`的基类。
它要求子类中的孩子（RenderObject）必须是`KeepAliveParentDataMixin`类型，也就是说孩子的perentData具有`keepAlive`属性。

#### 2.7 `RenderSliverMultiBoxAdaptor`
- setupParentData：设置孩子的parentData，其中包含了keepAlive属性

### 3. 组件关系层级

- RenderSliverMultiBoxAdaptor
  - AutomaticKeepAlive
    - KeepAlive
      - AutomaticKeepAliveClientMixin
        - KeepAliveHandle

### 4. 系统架构解析

- 形式：AutomaticKeepAliveClientMixin（自动保活有状态组件）
  - 操作：_ensureKeepAlive 发送保活通知
  - 操作：_releaseKeepAlive 释放保活
- 形式：KeepAliveNotification 保活通知
- 形式：AutomaticKeepAlive 自动保活状态监听管理
  - 操作：接受KeepAliveNotification
  - 操作：初始化keepAlive属性
  - 操作：根据通知更新keepAlive
- 形式：KeepAlive 保活属性的传递
  - 操作：更新renderObject中的keepAlive属性
- 形式：SliverList

