# 读懂Babel需要回答的问题？

## 1. 语法插件在什么时机执行，执行后的ast树是什么样的？例如jsx转码。

## 2. 多个重复plugin是如何去重的，如果他们是在多个preset里面？
加载partail的最后一步，执行去重工作

## 3. 一共有多少种配置方式，每一种叫什么名字，覆盖方式是怎样的？
- programmaticChain: 通过babel.transfer(code, opts)输入
- configFileChain: 通过babel.config.js文件输入
- fileChain: 通过babelrc输入

configFileChain < fileChain < programmaticChain

## 4. passes是干什么的？

## 5. ingore自执行模块是干什么的？
过滤掉空的perset

## 6. partail和full分别是干什么的？
- partail: 负责从多个渠道加载配置文件，
- full：负责执行ignore操作并将preset和plugin合并

## 7. 配置中读取到的option（例如parseOpt）会覆盖preset中的配置
