/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import os from 'os';
import path from 'path';
import webpack from 'webpack';
import pkg from './package.json';
import UglifyJsParallelPlugin from 'uglifyjs-webpack-plugin';//'webpack-uglify-parallel';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import SpritesmithPlugin from 'webpack-spritesmith';
import HappyPack from 'happypack'; // 开启happypack的多线程池

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

export function getDir(dir) {
    return path.resolve(__dirname, dir)
}

export function define() {
    return new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    })
}

export function banner() {
    return new webpack.BannerPlugin({
        banner: ['/**',
            '\n * ...',
            '\n * @author ' + pkg.author,
            '\n * ' + new Date(),
            '\n */',
            '\n'
        ].join(''),
        raw: true,
        entryOnly: true
    })
}

export function uglify() {
    return new UglifyJsParallelPlugin({
        uglifyOptions: {
            ecma: 8,
            mangle: true,
            output: { comments: false },
            compress: { warnings: false }
        },
        sourceMap: false,
        cache: true,
        parallel: os.cpus().length * 2
    })
}

let basecfg = {
    entry: {
        'player-min': [getDir('./src') + '/H5Iframe.js'], //供分享、专题等以iframe嵌入H5播放器方式使用
        'player-major' : [getDir('./src') + '/H5Player.js'],//供主站3901、5701等pid以直接引入H5播放器静态文件方式使用
        //'barrage-min': [getDir('./src') + '/Barrage.js']
    },

    output: {
        path: getDir('./dist'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.js', '.json'],
        modules: [getDir('./src'), 'node_modules', 'css'],
        alias: {
            'H5PcCore'  : getDir('./src/H5PcCore'),
            'player'    : getDir('./src/cn/pplive/player'),
            'bip'       : 'player/bip',
            'common'    : 'player/common',
            'controller': 'player/controller',
            'crypto'    : 'player/crypto',
            'manager'   : 'player/manager',
            'model'     : 'player/model',
            'view'      : 'player/view',
            'puremvc'   : getDir('./lib/puremvc'),
            'CryptoJS'  : getDir('./lib/crypto-js'),
            'barrage'   : 'player/barrage'
        }
    },

    module: {
        rules: [{
            test: /\.jsx?$/,
            use: 'happypack/loader?id=happybabel',
            exclude: /node_modules/
        }, {
            test: /\.(less|css)$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!less-loader'
            })
        }, {
            test: /\.(png|gif)$/,
            use: 'url-loader?limit=8192&publicPath=../&name=assets/[name].[ext]'
        }/*, {
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            }, {
                loader: 'expose-loader',
                options: '$'
            }]
        }*/]
    },
	externals: {
		jquery: 'window.jQuery' //或者jquery:'jQuery'
	},
    plugins: [
        new ExtractTextPlugin({
            filename: 'css/style-player.css', 
            allChunks: true 
        }),
        new CopyWebpackPlugin([{
            from: getDir('./src/css'),
            to: getDir('./dist/assets'),
            ignore: ['mob/*.png', 'pc/*.png', 'oth/*.png', '**/*.css', '**/*.less']
        },{
            from: getDir('./node_modules/jquery/dist/jquery.min.js'),
            to: getDir('./dist/jquery.min.js')
        }]),
        new HappyPack({
            id: 'happybabel',
            loaders: ['cache-loader', 'babel-loader'],
            threadPool: happyThreadPool
        })
    ]
}

export function base() {
    [{
        cwd : 'mob',
        name : 'm_player_sprite'
    },{
        cwd : 'pc',
        name : 'w_player_sprite'
    },{
        cwd : 'oth',
        name : 'w_oth_sprite'
    }].forEach((item)=>{
        basecfg.plugins.unshift(new SpritesmithPlugin({
            src: {
                cwd: getDir('./src/css/'+item['cwd']),
                glob: '*.png'
            },
            target: {
                image: getDir('./src/css/'+item['name']+'.png'),
                css: getDir('./dist/css/'+item['name']+'.css')
            },
            spritesmithOptions: {
                algorithm: 'binary-tree'
            }
        }))
    });
    return basecfg;
}