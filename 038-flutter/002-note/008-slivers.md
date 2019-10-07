为了有能力开发列表相关的效果。
性能调优

- 了解Sliver如何使用
  - 参考一个Sliver最简单的例子（30）
  - 写一个固定的SLiver，用于数据显示和动画（40）

RenderObjectWidget
为RenderObjectElement提供配置，提供RenderObject实现真正的渲染

SingleChildRenderObjectWidget extends RenderObjectWidget
提供一个child座位配置

SliverConstraints.scrollOffset
- Sliver滚动的距离，到达上边界之前为0，到达之后从0增加

SliverConstraints.remainingPaintExtent
- Sliver需要绘制的长度，也就是Sliver被拉出的高度
- 如果Sliver在Bottom一下，则为0，拉出之后从0零增加

SliverConstraints.overlap
- 和前面Sliver的重叠高度

SliverGeometry.paintExtent
- Sliver在Viewport中显示的高度
- 它代表绘制区域占[SliverConstraints.remainingPaintExtent]中的高度
- 他不会影响下一个Sliver的位置
- 它的范围0~remainingPaintExtent
- 它会影响下个Sliver的Overlap

SliverGeometry.maxPaintExtent
- paintExtent的总高度
- remainingPaintExtent是无限时使用
- 当viewport时shrink-wrapping时使用
- 必须大于等于paintExtent

SliverGeometry.maxScrollObstructionExtent
- 减少可滚动距离
- 仅在pin在顶部是使用

SliverGeometry.layoutExtent
- 它决定了下一个Sliver的位置
- 范围0~paintExtent
- 默认=paintExtent

SliverGeometry.scrollExtent
- 它决定Sliver需要滚动的长度
- 它决定所有Siliver的[SliverConstraints.scrollOffset]

SliverGeometry.paintOrigin
- Sliver实际绘制起始点
- 不影响下一个Siliver的位置
- 影响后面SLiver的overlap

SliverGeometry.scrollOffsetCorrection
- 修改scrollOffset值
- 修改之后不需要计算Geometry，和child的layout
- performLayout会立即重新调用


## CupertinoSliverNavigationBar
- 如何张开的
  - child在layout的时候传入BoxConstraint
  - BoxConstraint.maxExtent设置为constraints.overlap
  - 这样内容就可随着拖动逐渐张开了
  - 同时maxExtent也加入内容块自己定义的高度（layoutExtent），进一步使高度增加
- 突然增加的内容块高度会导致画面抖动
  - 这里使用scrollOffsetCorrection来修复
- 虽然内容块的高度得到了正确的计算，但是显示位置不对
  - 这里通过paintOrigin来修正
  - paintOrigin设置为overlap
- layoutExtent paintExtent也准确的设置了
- 如何收回高度
  - 通过去除内容块高度来收回
  - 同样会导致画面抖动
  - 通过scrollOffsetCorrection消除抖动
