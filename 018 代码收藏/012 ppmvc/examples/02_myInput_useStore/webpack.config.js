var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.htm$/,
        loader: "underscore-template-loader",
        query: {
          prependFilenameComment: __dirname,
        }
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'less-loader', options: { strictMath: true, noIeCompat: true } }
          ]
      }
    ]
  },
  resolve: {
    alias: {
      ppmvc: path.resolve(__dirname, '../../ppmvc.js'),
    }
  },
  externals: {
    jquery: 'jQuery',
    underscore: '_'
  }
};