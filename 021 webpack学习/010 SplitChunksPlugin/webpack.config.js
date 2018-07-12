var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: "source-map",
  entry: {
    index: './src/index.js',
    index2: './src/index2.js',
    style: './src/index.css'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "./dist/"
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
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
  },
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
        other: {
          name: "other",
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: false
        }
      }
    }
  }
};