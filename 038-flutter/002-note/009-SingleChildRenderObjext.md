## Flutter中的盒子渲染模型

### 1. Flutter中Widget的类型

- 组合式组件
  - StatalessWidget
  - StatefulWidget
- 渲染组件
  - LeafRenderObjectWidget
    - RawImage
  - SingleChildRenderObjectWidget
  - MultiChildRenderObjectWidget
- 代理型组件
  - InheritedWidget

### 2. SingleChildRenderObjectWidget

- SingleChildRenderObjectWidget继承自RenderObjectWidget
- RenderObjectWidget内部包含了一份RenderObject，它的作用是提供实际渲染的配置

### 3. RenderObject

- parentData
  - 父级使用这个数据，用于存放和这个节点相关的数据。
  - 对这个节点不透明
  - 有父级几点设置
  - 可以在节点插入父级之前设置
  - 这个数据的具体使用方式和渲染协议相关，有可能自己也能读取部分数据
- RenderObject不定义孩子的数量
- 不定义坐标系统
- Constraints
  - performLayout以Constraints为输入，并计算出size
- markNeedsLayout
  - 当影响layout的属性发生变化的时候，需要调用markNeedsLayout。
- sizedByParent
  - 容器的大小完全由父级决定
  - 效率高
- performResize（）
  - 只有当sizedByParent==true才需要实现这个方法
  - 当父级的constraints变化时，layout会调用这个方法。
- performLayout
  - 这个方法实际完成layout计算
  - 这个方法有layout方法调用，不可直接调用。layout会判断需不需要调用performLayout
  - 如果sizedByParent==true，则这个方法不应该改变这个renderObject的大小，应该由performResize完成
  - 如果sizedByParent==false，这个方法应该计算这个RenderObject的大小和孩子的大小。
- layout方法
  - 渲染入口
  - 父级向子级传递constraints，子级根据constraints渲染。
  - 如果子级在layout时父级读取子级的信息，则父级必须传入parentUsesSize。
  - 流程
    - 判断是否是relayoutBoundary
      - parentUsesSize == false : 父级不收这个renderObject的影响
      - sizedByParent : 容器大小由父级确定，子级变化不会影响这个renderObject
      - constraints.isTight ：大小不受子级影响
      - parent is! RenderObject ：自己是一个layer
    - 判断时候需要执行layout，以下条件是&&关系
      - !_needsLayout：这个renderObject不是脏的。
      - constraints == _constraints ：父级的限制没有发生变化。
      - relayoutBoundary没有发生变化
      - 同时满足这些条件就不需要layout
    - 更新constraints和relayoutBoundary
    - 走到这里说明需要layout
    - 如果sizedByParent == true
      - performResize();
    - 执行performLayout();
    - _needsLayout = false;
    - 标记需要：markNeedsPaint();

- RenderBox
  - 父级向自己传递限制，自己根据限制决定自己的大小，父级根据子级的大小决定自己的大小。
  - width-in-height-out
    - 父级的限制带有一个tight的宽度，子级更具这个宽度值决定自己的高度，父级更具子级的高度决定自己的高度。
  - 自己实现一个RenderXXX
    - 首先定义RenderXXX需要的属性
      - 如果属性影响layout则调用markNeedsLayout
      - 如果只影响绘制，则调用markNeedsPaint
    - 确定孩子的情况
      - 一个RenderBox类型孩子
        - RenderProxyBox：父亲包裹孩子
        - RenderShiftedBox：父亲比孩子大，且可以对齐
      - 单个孩子不是RenderBox类型
        - 使用RenderObjectWithChildMixin
      - 一列孩子
        - ContainerRenderObjectMixin
      - 更复杂的情况