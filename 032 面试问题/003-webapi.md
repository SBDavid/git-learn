## 1. 流的概念（中等）
- 如何发送大文件并显示发送进度
```js
XMLHttpRequest.onprogress = function (event) {
  event.loaded;
  event.total;
};
```

- 流式处理的应用

## 2. 事件冒泡与捕获（简单）
```js
addEventListener(event,fn,useCapture)
stopPropagation();
```

- 如果点击div后，div被删除，我们如何在此之前获取div的信息

## 3. 移动端点击200毫秒的延时（中等）
- 为何有延迟
  - 判断双击
- 如何回避
  - 取消屏幕缩放 scale
  - 自己组装事件
    - touchstart
    - touchmove
    - touchend

## 4. 如何进行处理计算密集型任务（简单）
- webworker

## 5. 如何跨域访问（简单）