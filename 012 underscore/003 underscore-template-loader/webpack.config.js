var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
        test: /\.htm$/,
        loader: "underscore-template-loader",
        query: {
          prependFilenameComment: __dirname,
        }
    }]
  }
};