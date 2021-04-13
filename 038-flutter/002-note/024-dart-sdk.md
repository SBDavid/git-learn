# Dart-sdk DartVm学习

## 文档和相关资料

- git: [wiki](https://github.com/dart-lang/sdk/wiki/Building)
- 什么是dart runtime vm :https://www.youtube.com/watch?v=J5DQRPRBiFI
- dartvm启动：http://gityuan.com/2019/06/23/dart-vm/
- C++项目嵌入dartVM：https://github.com/donny-dont/DartEmbeddingDemo
- 讨论：https://groups.google.com/a/dartlang.org/forum/#!topic/misc/qBuKmUBltas/discussion



## 架构图

![](/Users/jiaweitang/002-learn/git-learn/038-flutter/002-note/imgs/dart_whole_picture.jpg)

- Dart SDK

  - lib文件夹：dart核心库

  - bin文件夹：命令行工具

    - dart（dartVM）：运行dart脚本：包含jit编译、hot reload、运行环境、 Observatory

    - dart2native：AOT编译，

      - 它可以产出可执行文件或者AOT snapshot
      - 独立可执行文件：包含dart文件、依赖、dart runtime
      - AOT snapshot：不包含dart runtime

    - dartaotruntime：运行AOT snapshots



## 构建

- 下载 Chromium's [depot tools](http://dev.chromium.org/developers/how-tos/install-depot-tools):

- 获取源码：

  - ```shell
    mkdir dart-sdk
    cd dart-sdk
    fetch dart
    ```
  
- building:  64-bit SDK

  - ```shell
    # 64位
    # 输出路径：xcodebuild/ReleaseX64/dart_sdk
    cd dart-sdk/sdk
    ./tools/build.py --mode release --arch x64 create_sdk
    
    # 32位
    # 输出路径：xcodebuild/ReleaseIA32/dart_sdk
    cd dart-sdk/sdk
    ./tools/build.py --mode release --arch ia32 create_sdk
    
    # 64位 debug
    ./tools/build.py --mode debug --arch x64 create_sdk
    ```
  
- 更多有关构建的文档：https://github.com/dart-lang/sdk/wiki/Building-Dart-SDK-for-ARM-processors



## CMake

- 下载安装包
- 在vs code 中安装插件
- 配置path



## 运行命令



```shell
# 运行aot产物
~/001-workspace/dart-sdk/sdk/xcodebuild/DebugX64/dart-sdk/bin/dartaotruntime  /Users/jiaweitang/002-learn/learn_dartvm_debug/main.aot
# 编译aot产物
~/001-workspace/dart-sdk/sdk/xcodebuild/DebugX64/dart-sdk/bin/dart2native -k aot /Users/jiaweitang/002-learn/learn_dartvm_debug/main.dart
# 运行jit脚本
~/001-workspace/dart-sdk/sdk/xcodebuild/DebugX64/dart-sdk/bin/dart  /Users/jiaweitang/002-learn/learn_dartvm_debug/main.dart
# 编译dart
./tools/build.py --mode debug --arch x64 create_sdk
```

## Xcode调

- 添加命令行参数：Product->scheme->edit scheme->argument

- 断点问题

  - 原因：调试符号找不到源码，当前工作路径无法解析相对路径

  - 解决：在scheme中配置LLDB init file

    - ```python
      settings set -- target.source-map '../..' '/Users/jiaweitang/001-workspace/dart-sdk/sdk'
      ```

  - 相关学习：

    - lldb

      - 文档：http://lldb.llvm.org
    
      - ```python
    image lookup -vn 'dart::MessageHandler::HandleMessages'
        settings set -- target.source-map '../..' '/Users/jiaweitang/001-workspace/dart-sdk/sdk'
        breakpoint set --file "message_handler.cc" --line 214
        frame info
        register read
        ```
    
    - ninja
    
    - xcode
    
      - build phases
        - Action "Compile and copy dart via ninja"：执行脚本
        - compile source：如果xcode编译的项目这里会有
        - Link binary with Libraries：如果xcode编译的项目这里会有