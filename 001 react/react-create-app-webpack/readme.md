# 使用webpack创建新的页面

- 安装 webpack
- 配置 webpack命令
```json
"scripts": {
    "dev": "webpack --config webpack.config.js"
},
```
- 安装 react, react-dom
- 安装 babel-loader, babel-preset-react, babel-core
- 配置 .babelrc { "presets": ["react"] }
- 配置 webpack-loader
```js
module: {
    rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
}
```