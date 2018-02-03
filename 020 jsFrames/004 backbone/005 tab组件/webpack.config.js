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
        test: /\.html$/,
        loader: "underscore-template-loader",
        query: {
          prependFilenameComment: __dirname,
        }
      }
    ]
  }
};