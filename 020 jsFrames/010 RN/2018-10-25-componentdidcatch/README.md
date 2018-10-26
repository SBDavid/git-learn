RN异常处理经验

## 1. 组件及异常捕获
可以使用`componentDidCatch`和`getDerivedStateFromError`捕获子节点中的异常
但是仅限于生命周期函数和render函数中的异常
> RN 0.55以上版本可以使用

## 2. 捕获全局同步异常
使用ErrorUtils

## 3. 捕获Promise中没有处理的异常
可是使用第三方提供的Promise（例如https://www.promisejs.org/），其中带有全局异常捕获功能