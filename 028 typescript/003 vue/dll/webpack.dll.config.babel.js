/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import os from 'os';
import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import uglifys from '../uglify.json';
import { getDir, dll, define, uglify, banner } from '../webpack.config.base';

let vendors = ["vue","vue-class-component","vue-resource","vue-router","vuex","vuex-class"];

let config = {
    entry: {
        vendor: vendors
    },
    output: {
        path: getDir('./dist'),
        filename: '[name].js',
        library: '[name]'
    },
    module: {
        rules: []
    },
    plugins: [
        dll(),
        banner()
    ]
}

if (uglifys.isEs3) {
    config.module.rules.push({
                                test: /.js$/,
                                enforce: 'post', // post-loader处理
                                use: 'es3ify-loader'
                            })
}

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
