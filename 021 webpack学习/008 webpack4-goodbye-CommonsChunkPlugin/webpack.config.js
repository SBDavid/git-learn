var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: "none",
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "./dist/"
  },
  plugins: [
    /* new webpack.optimize.ModuleConcatenationPlugin() */
  ],
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      minSize: 30,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendors: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          name: "vue",
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};