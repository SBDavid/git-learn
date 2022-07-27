## android应用的启动

### Application：应用程序全局上下文
- 本质上是Context

### Activity：展示界面的组件
- 本质上是Context
- 主要功能：
	- 事件回调：暂停、恢复、触摸
		- 在回调中可以获取系统资源，例如数据库
	- 打开弹窗
	- 打开其他Activity
	- 设置导航栏
- setContentView：设置Activity的布局资源
	- 可以是资源文件的id
	- 可以指定View，默认布局方式MATCH_PARENT

### ReactRootView：管理RN的显示布局
- Activity中通过`setContentView`方法关联了这个类
- 先介绍android中的view
	- view是android中的widget，例如文字、按钮
	- viewGroup包含多个view，例如列表
	- 可以控制布局规则
	- Canvas完成绘制
	- 处理触摸事件
- ViewGroup：继承View，实现了ViewParent, ViewManager
	- ViewGroup是其它View的容器
	- onMeasure：要求所有的孩子计算大小
	- onLayout：要求所有的孩子计算位置
- ViewParent：访问父亲，控制孩子的交点等等
- ViewManager：加入view，删除view
- ReactRootView：继承FrameLayout，实现了RootView, ReactRoot
	- FrameLayout：一种布局方式，默认把孩子放在左上角
	- ReactRoot：React根容器接口，其中的方法主要在ReactInstanceManager中被调用


### ReactInstanceManager：RN核心管理类
- 主要作用：
	- 通过CatalystInstance管理JS和native的通信
	- RN页面的启动
- Activity在`onCreate`方法中构建了ReactInstanceManager
- Activity中的暂停、恢复、按返回键代理给ReactInstanceManager处理