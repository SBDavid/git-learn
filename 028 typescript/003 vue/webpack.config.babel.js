/**
 * ...
 * @author minliang1112@foxmail.com
 */

import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { base, define, uglify, banner } from './webpack.config.base';

let entryObj = {};
let getEntry = (dir) => {
    fs.readdirSync(dir).filter(function(item) { 
        console.info(item)
        return item.match(/\.d\.ts$/) === null;
    }).map((item) => {
        let _name = path.basename(item, path.extname(item));
        entryObj[_name] = dir + item;
    });
}
getEntry(
    "./src/js/views/"
);

let config = merge(base(), { entry : entryObj });
export default () => {
    if (process.env.NODE_ENV == 'production') {
        config = merge(config, {
            plugins: [
                define(),
                uglify(),
                config.plugins.pop()
            ]
        })
    }
    return config;
}
