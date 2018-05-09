var path = require('path');
var webpack = require('webpack');
const EditableSourcesWebpackPlugin = require('editable-sources-webpack-plugin');

module.exports = {
  devtool: "source-map",
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "./dist/"
  },
  plugins: [
    new EditableSourcesWebpackPlugin(/\.js$/, function (sourceCode) {
      sourceCode = sourceCode
        .replace(/\.catch\(/g, `['catch'](`)
        .replace(/\.throw\(/g, `['throw'](`);

      console.info(sourceCode);
      return sourceCode;
    }),
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
      chunks: "async",
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
          name: "other",
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};