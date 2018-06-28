/**
 * ...
 * @author minliang1112@foxmail.com
 */
'use strict';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import {base, define, uglify, banner} from './webpack.config.base';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
//获取目录路径
var getDir = function(dir) {
  return path.resolve(__dirname, dir);
}
//遍历目录路径生成入口配置
var setEntryObj = function(dir) {
  var entryObj = {};
  var getEntry = function(dir) {
      fs.readdirSync(dir).map(function(item) {
          if (item.indexOf('.js') > 0) {
              if (process.env.entry) {
                  if (item.indexOf(process.env.entry) > -1) {
                      console.info(`打包入口为：${item}`);
                      entryObj[path.basename(item, '.js')] = dir + '\/' + item;
                  }
              } else {
                  entryObj[path.basename(item, '.js')] = dir + '\/' + item;
              }
          }
      });
  }(dir);
  return entryObj;
}
let config = merge(base(), {entry : setEntryObj(getDir('./src/js/views/'))});
export default () => {
  if (process.env.NODE_ENV == 'production') {
    config = merge(config, {
                    plugins : [
                                define(),
                                uglify(),
                                new OptimizeCSSAssetsPlugin({}),
                                config.plugins.pop()
                              ]
                  })
  }
  return config;
}