## 学习最基本的容器Container

Container是一个组合式容器，其中包含了ConstraintsBox，padding，等容器

1. 可以设置padding
2. 设置margin
3. decoration
   1. 颜色
   2. 边框
   3. 背景
4. 绘制顺序
   1. transform
   2. decoration
   3. child
   4. foregroundDecoration
5. Layout
   1. 没有宽高，没有constraints最大最小值，没有孩子，父级是unbounded => 尽量小
      1. 例如ListView中的Container
   2. 有宽高，或者有constraints，没有孩子，没有对齐，父级有限制 => 更具自己的限制和父级的限制，通知最小化
      1. 前提是父级有对齐方式，负责子级最大化
   3. 如果没有孩子，没有任何限制，没有对齐，父级有限制 => 则最大化
   4. 如果有孩子，有对齐，父级没有限制 => 包裹自己的孩子
   5. 如果有孩子，有对齐，父级有限制 => 最大化，并且对齐自己的孩子
   6. 如果有孩子，没有限制，没有对齐 => 则把父级的限制传给自己，并且直接包裹自己的孩子。

需要研究android的measure和layout