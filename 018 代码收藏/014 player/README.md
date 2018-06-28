
## H5Player 3.0.0及以上重构版 [puremvc的ES6版本] —— Webpack 构建
>   运行package.json中scripts命令
>
>   安装：npm install
>
>   生产环境：npm run execute
>
>   开发、测试环境：npm run test

### v4.0.0
```
支持点播（播放基础功能、影视付费、体育付费）；
play返回216错误码，显示安装或者下载PP客户端；
M站播放环境时，优化掉min进度条，改用相同进度条进行切换；
优化小窗模式下的UI显示；
苏宁统计修改；
```

### v3.3.1
```
新增manualPlay接口，支持M站环境的外部调用；
M站广告播放器追加userUnique参数，作为用户标识；
```

### v3.3.0
```
重新整合新的广告播放器模块，配合新广告播放器；
```

### v3.2.0
```
拆分入口文件为H5Iframe.js、H5Player.js分别供专题、播放页使用；
```

### v3.1.2
```
修复jquery获取message事件的bug；
播放日志新增ifid（play接口bt字段）、cataid1（play接口tbcid字段）、cataid2（play接口bcid字段）；
新增播放开始后客户端下载提示；
新增广告播放器整合模块；
新增观赛券购买逻辑；
```

### v3.1.1
```
修复回看时返回直播出现两次play请求的bug；
修复有时block下载两次的bug；
回看时增加左右键盘进度操作；
```

### v3.1.0
```
支持PC端的直播节目启用HTML5播放器播放（基础播放功能、付费功能）；
```

### v3.0.10
```
体育免费直播试看5分钟
```

### v3.0.9
```
聚力视频文案修改PP视频
```

### v3.0.8
```
修正可能的 h5 postmessage不存在的bug;
修正请求H5广告播放器时vvid为空的bug;
添加黑白名单的功能
```

### v3.0.7
```	
andriod手机环境下点击全屏抛出事件"onFullscreen",在M站由播放页做伪全屏处理;
新增苏宁对接统计;
移动端分享链接携带参数userto=vine,获取此参数并追加字段sf进入bip报文;
增加播放前图片的自适应显示;(posterfull:1全屏 0 半屏);
正是启用version=6版本的直播play请求;
```

### v3.0.6
```
修正付费直播节目类型判断错误和独立iframe分享时样式的bug;
```

### v3.0.5
```
优化播放前图片的自适应显示;
恢复广告端的message消息的zepto模式监听;
android 原生浏览器不支持 localStorage，做如下兼容处理;
新增对外 onPlayStateChanged 的postmessage事件用于通知当前播放状态，携带对象属性{ playstate : playing | paused | stopped };
新增支持非提示类型UI初始隐藏功能（播放按钮、控制栏UI等），具体为ctx透传 isSkin 布尔值（0:隐藏 | 1:显示）;
修正TipsManager.js中的对象合并导致 originObj 原始对象变更的bug;
修正TipsManager.js中的关闭提示导致的剩余提示位置显示的bug;
增加对定时上线节目的显示倒计时提示;
新增对ctx中传递pl播放串的支持;
修正feedback用户信息收集弹出窗的样式bug;
```

### v3.0.4
```
DownloadManager.js 更换 url 地址;
体育下载app请求增加 rcc_channel_id 字段;
```

### v3.0.3
```
Android 手机兼容性问题暂不启用es6的proxy代理;
```

### v3.0.2
```
优化清晰代码结构，新增H5ControllerCommand.js | H5ModelCommand.js | H5PlayCommand.js
sd、Bfr报文新增字段:ut(ut=104vip登录,ut=103普通用户,ut=101未登录);
新增sectionid字段透传给广告播放器及播放日志;
```

### v3.0.1
```
修复频道投放广告播放器无法播放的bug;
```

### v3.0.0
```
优化icon图片加载，新增雪碧图；
新增错误码（510、210、211）的样式及逻辑处理；
体育直播时，播放器内显示标题取sectiontitle字段；
APP跳转链接增加userfrom = play_end字段；
Bfr报文新增字段：ss：(播放器获取页面传给播放器的ctx串中的msiteSourceSite参数) 播放来源；
```



## H5Player 2.0.0及以上重构版 [puremvc] —— Grunt 构建
>   运行package.json中scripts命令
>
>   安装：npm install
>
>   生产环境：npm run execute
>
>   开发、测试环境：npm run test


### v2.2.5  
```
优化付费直播的提示；
优化自动播放模式（autoplay默认0，仅限ios）；
```

### v2.2.4  
```
优化gruntfile逻辑，提高构建速度；
支持聚力APP内的自动播放；
```

### v2.2.3  
```
修改play请求回调error的重试机制，连播时没有index没有重置的bug；
3001错误时，增加videourl；
video请求出错，启用备用ip请求video；
实时在线统计增加卡顿次数、卡顿时长字段；
```

### v2.2.2  
```
修改online日志的bug；
增加play请求回调error的重试机制；
修正加解密相关bug；
```

### v2.2.1  
```
采用外部实例化访问prototype替换component对象的"__proto__"访问机制；
修改点、直播提示背景图适宽问题；
节目备案号超过屏幕宽度时，最大宽度80%折行显示；
提交错误码的日志，feedback功能
```

### v2.2.0  
```
新增UIComponent.js作为各个Component的基类；
播放器支持视频防盗链；
新增实时在线统计；
play和视频请求追加vvid；
新增直播付费提示及点播结束后提示优化；
去除静态"http:"字符【为日后兼容https:】；
新增节目备案号显示；
原生的事件机制转换为zepto的事件监听机制；
```

### v2.1.5  
```
针对localStorage在safri的无痕浏览时的兼容处理；
新增会员影片的无广告逻辑处理；
修改视频结束后的浮层显示样式；
新增播放器视频标题显示；
针对新版play请求返回的异常响应格式的修改处理；
在广告播放器url后追加渠道o参数;
```

### v2.1.4  
```
版本作废
```

### v2.1.3  
```
修正某些情况下自动播放的bug，以及传递给广告的plat更改为mbs；
```

### v2.1.2  
```
更改广告播放逻辑，由播放器来播放广告；
```

### v2.1.1  
```
playVideo 支持连播；
```

### v2.1.0  
```
更改报文发送机制，统一往mobile.synacast.com发送；
报文发送类采用ES6来编写，通过Babel来转换为ES5；
新增函数节流阀 throttle，防止持续性的导致性能下降的调用；
微信环境打开时，play请求追加from_ua=weixin参数；
```

### v2.0.4
```
恢复非ik平台发送sd限制；
```

### v2.0.3
```
新增switchVideo接口（对外预留）；
删除异常的window.top（获取不到）；
新增进度条渐变；
更换loading图；
修正广告播放结束后未删除广告容器的bug；
取消非ik平台发送sd限制；
```

### v2.0.2  
```
处理判断play返回errorcode中VIP不能预览播放的bug；
新增错误提示信息(2008:地区屏蔽，2006:无频道信息，2009:token验证失败，3001:视频播发异常)；
启用CSS rem支持；
```
	   
### v2.0.1	
```
统一版本号代码出处；
支持杜比播放（ft=22）；
修正部分机型（华为）结束后，点击无法重播的bug；
修正直播时的时间显示位置；
开放对外接口（playVideo | pauseVideo | stopVideo | seekVideo | setVolume | getVolume | playTime | duration | version）；
新增简化进度条；
修正重播时，水印重复叠加生成dom的bug；
去除点击时的目标底部背景；
放开VR视频播放；
```

### v2.0.0
```
重构版本；
UI优化；
新增完整视频的连播功能；
新增右上角水印logo显示；
新增弹幕显示功能，暂未开启；
新增监听广告message事件；
```