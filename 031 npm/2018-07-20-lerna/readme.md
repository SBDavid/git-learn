## 学习记录

### 1. 全局安装
npm install --global lerna

### 2. 初始化
lerna init
生成package.json和learn.json

### 3. 依赖配置
lerna init --exact
等同于npm ^的配置

### 4. bootstrap
lerna bootstrap
安装所有项目的依赖
Symlink together all Lerna packages

### 5. 增加新的依赖包
lerna add pagename --scope packagename --save
