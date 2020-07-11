## AndroidManifest.xml application标签

该节点中包含有应用程序属性和子节点。

### android:name属性
该属性用完整的Java类名赋值，该类名是一个Application子类的实现。当应用程序进程被启动时，这个类在其他任何应用程序组件被实例化之前实例化。

## FlutterApplication 的作用
- app的启动入口
- 启动FlutterMain.startInitialization

## FlutterMain 
- 设置log日志
- initConfig：初始化参数配置