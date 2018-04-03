var path = require('path');

console.info(path.resolve(__dirname, "../lib"))

module.exports = {
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: [path.resolve(__dirname, "../lib"), "node_modules"]
  }
};