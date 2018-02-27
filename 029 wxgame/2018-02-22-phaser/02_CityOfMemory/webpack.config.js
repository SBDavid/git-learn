var path = require('path');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      pixi: path.join(__dirname, './node_modules/phaser/dist/pixi.js'),
      p2: path.join(__dirname, './node_modules/phaser/dist/p2.js')
      
    }
  }
};