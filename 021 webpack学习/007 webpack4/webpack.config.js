var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: "source-map",
  entry: {
    index: './src/index.js',/* 
    mod: './src/mod.js',
    mod1: './src/mod1.js', */
    css1: './src/index.css'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "./dist/"
  },
  plugins: [
    //new webpack.optimize.ModuleConcatenationPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};