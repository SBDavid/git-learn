- 生命周期
  - 框架调用Widget.createElement创建element
  - 框架调用element.mount
  - ComponentElement.performrebuild
  - element.updatechild
  - element.inflateWidget
  - element.mount

Element.dart
成员：
- _widget：对应的配置
- _parent：父级element
- _slot：？？？
- _owner：？？？
- _active：是否是激活状态
- RenderObject get renderObject：或取自己活子级的renderObject
- Element updateChild：widget更新后，更新element
  - 新建
  - 删除
  - 更行
    - 判断能不能复用element
  - mount：设置parent slot _inheritedWidgets
- detachRenderObject
- attachRenderObject
- 