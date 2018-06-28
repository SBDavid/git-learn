## 运营统计sta.js
>   运行package.json中scripts命令
>
>   安装：npm install
>
>   合并：npm run test
>
>   压缩：npm run execute

### ⊙ 目录结构

```

├─ dist/                           # build 生产环境下的文件
├─ src/
│    ├─  AnalyzeCommon.js          # 通用方法
│    ├─  UserInfo.js               # 用户属性
│    ├─  Analyze.js                # 统计逻辑
│    ├─  sta.js                    # 实例化统计类
│    ├─  snAnalyze.js              # 对接苏宁统计
├─ .babelrc                        # babel 转换配置
├─ package.json                    # 项目依赖配置文件
├─ webpack.config.babel.js         # 项目依赖配置文件


### v1.0.7
```
spm参数追加，苏宁统计增加ext扩展统计字段
```

### v1.0.6
```
Analyze --193 line (for in)报错  执行函数未判断是否为函数
```

### v1.0.5
```
针对客户端日志发送仍然保留"http:"协议;
```

### v1.0.4
```
去除苏宁ssa.js的"http:";
优化message监听;
```

### v1.0.3
```
web和M站增加统计模块snAnalyze.js用于对接苏宁统计，AnalyzeCommon.js增加方法sendSearchEvt用于
发送搜索统计到苏宁
追加spm统计
```

### v1.0.2
```
客户端使用低版本的IE弹出浮层，因此取消console.log;
```

### v1.0.1  
```
增加getExtendParam方法用于扩展pv pc统计;
提供window.getTjIdAndPt接口给苏宁调用;
```

### v1.0.0  
```
模块化运营统计sta.js;
```