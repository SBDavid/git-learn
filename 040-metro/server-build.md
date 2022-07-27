# Server



## 属性

1. _bundler：IncrementalBundler：实现依赖获取，转换
2. _config：metro所有的配置



## build方法

输入： BundleOptions

输出：code: string, map: string,

### 1. 第一步 this._bundler.buildGraph

这一步包含了依赖解析与转化。

#### 1.1 调用 IncrementalBundler.buildGraph

输入：entryFile，transformOptions，otherOptions

输出：OutputGraph，Array<Module<>>



Module：里面包含了路径、依赖、代码

Graph：包含了项目入口，依赖



### 2. 第二步：IncrementalBundler

 **IncrementalBundler中的属性**

- _config：metro中所有的配置
- Bundler：负责模块的依赖解析，调用转换方法
- DeltaBundler：通过DeltaCalculator获取差异的依赖



##### 1.1.1 步骤 IncrementalBundler.buildGraphForEntries 

通过 _deltaBundler.buildGraph 完成实际工作

返回值： Graph

这一步中完成了：

- 依赖解析：通过Bundler
- transform
- serializer



### 3. 第三步：DeltaBundler

属性：

- Bundler
- Map<Graph<T>, DeltaCalculator<T>>

方法：

- buildGraph：通过 _bundler 和 DeltaCalculator 返回 Graph
  - this._bundler.getDependencyGraph() ：
    - 等待依赖解析完成
    - 构造 Transformer
  - 构造：DeltaCalculator
  - 通过 DeltaCalculator.getDelta 获取 graph



### 4. DeltaCalculator

属性：

- _dependencyGraph：依赖关系
- _deletedFiles
- _modifiedFiles
- _graph



方法：

- getDelta 返回差异的依赖
  - 实际上通过 _getChangedDependencies 获取依赖
- _getChangedDependencies：
  - 首次打包通过 initialTraverseDependencies 获取依赖



### 5.  traverseDependencies 文件：

方法：

- initialTraverseDependencies：首次构建依赖
  - 构建配置选项：包括依赖解析，转换的配置
- processModule：递归方法
  - 













### 第二部 bundleToString



## 第一个重要文件 collectDependencies

### 原始文件

1. 作用：通过 ast 解析出依赖，对import、require进行转译
2. visitor：通过 registerDependency 注册以来，并完成 import 语句的转译
3. registerDependency：通过 DefaultModuleDependencyRegistry 完成依赖注册，并返回依赖
4. DefaultModuleDependencyRegistry：
   1. 通过 name 查看是否已经注册过
   2. 如果没有则新建一个，加入
      1. name
      2. asyncType
      3. locs
   3. 如果有，则合并属性

### 修改后的文件

1. collectDependencies
   1. 在这个主入口中，先是通过 visitor 完成了依赖的解析
   2. 通过 treeShakingVisitor 对 import 和 export 进行处理
      1. ImportDeclaration：
         1. 忽略 类型导入
         2. 获取 import 节点中的 name
         3. 如果是 import default 记应用数为一
         4. 如果导入具体某个对象，在具体对象上+1
         5. 如果导入全部，在 expertAll上+1
      2. CallExpression：调用import("") or require("")
         1. 找到 import 方法所对用的 name
         2. 找到 name 所对应的 依赖，exportDefault +1
      3. ExportAllDeclaration
         1. 找到 name 所对应的 依赖，exportAll +1
      4. ExportNamedDeclaration：导出具体对象
         1. 找具体的对象名
         2. 通过 registerExport 记录对象名
         3. 每个模块的 _exports 独立
   3. 最后返回：
      1. ast
      2. namedExports
      3. dependencies
2. registerDependency 方法：完成各类型引用计数器的累加



## 第二个重要文件 metro-tree-shaking

1. treeShaking 方法
   1. 忽略：Babel、react-native、项目入口、自定义
   2. collectExports 方法：
      1. 遍历每一个模块
         1. exportsFormOtherModule export { a as b} from 'dddd'
      2. 把每一的dependences中的应用信息，传递到每一个模块
   3. removeUnUsedExports 方法：
      1. 在 for 循环中分析每一个模块
         1. 如果是 ExportDefault ，那么检查是否有其他模块引用了 Default ，如果没有则删除
         2. 如果是 ExportAll，那么检查是否以 export * from XXX，的形式被引用，如果没有则删除
         3. 如果是 ExportNamed，
            1. ClassDeclaration、FunctionDeclaration，如果没有外部引用，并且没有本地的副作用，则删除

## 主题流程描述

1. collectDependencies
   1. 针对每一个文件执行这个方法
   2. 如果遇到 import 语法，则找到具体import的模块，在它的importee对象上记录引用次数。
   3. 对于不同的 import 类型，例如 import default，import * as xx from xxx，记录引用次数。
   4. 如果遇到 export * 语法，找到被引用的模块，记录 export all +1
   5. 如果遇到 export 具体对象，则先记录导出的对象名列表，后期用于判断是否从其他模块引用，然后添加引用数
2. tree-shaking
   1. collectExports，在上一步中，依赖信息保存在当前模块中，在这里我们把这些信息累加到被依赖的模块
      1. 便利每一个模块，对模块的每一个依赖再进行遍历
      2. 如果被依赖的模块是以 import { a } 被导出，则找到依赖模块，引用数累加
      3. exportDefault 相似
      4. 如果是 export all ，则判断一下父级模块通过 import { a } 使用 export all：（如果多级导出 export * 则有bug）
         1. 如果有则找到依赖的 a 模块，引用+1
         2. 如果没有则对 export all +1
   2. removeUnUsedExports：遍历每一个模块
      1. 判断不同类型的引用次数
      2. 删除没有引用的模块
      3. 如果有删除记录，需要走 transform 方法，暂时没有研究 
   3. remove dependencies
      1. 通过 importee 判断是否没有引用
      2. 建立代删除的列表，一边删除，一边添加待删除模块的子模块
      3. 知道全部删除完成
