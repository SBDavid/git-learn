var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: "source-map",
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};