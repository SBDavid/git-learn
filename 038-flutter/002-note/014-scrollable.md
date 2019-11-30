## CustomScrollView

- 继承了ScrollView
- 添加了```List<Widget> slivers```
- 实现了```buildSlivers```方法

## ScrollView

真正完成了滚动的事件和显示

包含山部分：
- Scrollable：接受滚动事件
- viewport：负责显示sliver
- slivers：滚动列表

## Scrollable
通过接受到的事件修改position，并将position传递给一个viewport。

## position

### 底层基类 mixin ScrollMetrics

- pixels：当前滚动位置
- minScrollExtent：最小滚动位置
- maxScrollExtent：最大滚动位置
- outOfRange：是否超出
- atEdge：滚动到头部或者底部
- viewportDimension：主轴长度
- extentBefore：滚动至viewport上部的长度
- extentInside：viewport中的长度，通常我viewport高度，在overscroll或者元素过少时，extentInside < viewport
- extentAfter：。。。

### 倒数第二层 ViewportOffset 是一个ChangeNotify

> 这是一个抽象类，用来决定ViewPort中的那些部分是可见的

- 方法：bool applyViewportDimension()
  - 用来重新确定vivwport的长度
  - 如果shrink-wrap == false，只会在在初始化的时候调用一次，以及父级变化的时候调用
  - 如果shrink-wrap == true，会调用多次
  - 如果新的主轴长度会改变offset，viewport需要重新layout
  - 它之后会调用applyContentDimensions方法
- 方法：bool applyContentDimensions
  - 通过minScrollExtent，maxScrollExtent来确定content的长度
  - 如果新的长度会改变offset，那么RenderViewport需要重新layout.
  - 每次applyViewportDimension都会调用这个方法
  - 每次offset被corrected的时候都会调用这个方法
- 方法：correctBy
  - 修正offset
  - 在RenderViewport的layout过程中调用，在applyContentDimensions调用之前
- jumpTo
- animateTo
- moveTo
- userScrollDirection：手势滚动的方向，相对于主轴方向
- allowImplicitScrolling：例如一段文字收到focus事件后需要完全展示到屏幕上。

## ScrollPosition 抽象类
> 控制ViewPort的显示内容

- 通过activity来控制滚动
- 可能存在多个ScrollPosition，physics变化时通过absorb来转换

- hold 停止当前的activity，启动一个HoldScrollActivity
- drag 启动一个drag activity
- activity：当前的执行的ScrollActivity
- beginActivity：修改当前activity

## ScrollActivity
> 滚动事件的基类 例如拖动事件、滑动事件

- 子类
  - BallisticScrollActivity
  - DrivenScrollActivity

## ScrollPositionWithSingleContext
> 管理 scroll activities，ScrollActivity会影响viewport的显示内容

