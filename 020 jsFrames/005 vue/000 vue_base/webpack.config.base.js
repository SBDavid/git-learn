/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import os from 'os';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import pkg from './package.json';
import uglifys from './uglify.json';
import UglifyJsParallelPlugin from 'webpack-uglify-parallel';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HappyPack from 'happypack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const manifest = './dll/manifest.json';

let uglifyObj = {
    "workers": os.cpus().length
}
Object.assign(uglifyObj, uglifys.ug);

export function getDir(dir) {
    return path.resolve(__dirname, dir)
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
    return new UglifyJsParallelPlugin(uglifyObj)
}

export function define() {
    return new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    })
}

export function dll() {
    return new webpack.DllPlugin({
        path: getDir(manifest),
        name: '[name]',
        context: __dirname
    })
}

function createHappyPlugin(id, loaders) {
    return new HappyPack({
        id: id,
        loaders: loaders,
        threadPool: happyThreadPool,
        verbose: true
    })
}

let basecfg = {
    devtool: process.env.NODE_ENV == 'production' ? false : "source-map",
    output: {
        path: getDir('./dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.css', '.json', '.jsx', '.vue', '.ts'],
/*         alias: {
            vue: 'vue/dist/vue.esm.js'
        } */
    },
    module: {
        rules: [
{
                test: /\.(less|css)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!less-loader"
                })
            }, {
                test: /\.(png|gif)$/,
                use: "url-loader?limit=8192&publicPath=../&name=assets/[name].[ext]"
            }]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "css/style-[name].css",
            allChunks: true
        }),
        createHappyPlugin('happybabel', ['babel-loader']),
        banner()
    ]
}

if (uglifys.vue) {
    if (uglifys.vue['isTS'] == true) {
        basecfg.module.rules.push({
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                appendTsSuffixTo: [/\.vue$/]
            }
        });
        basecfg.module.rules.push({
            test: /\.vue$/,
            use: "vue-loader",
            exclude: /node_modules/
        });
    } else {
        basecfg.module.rules.push({
            test: /\.vue$/,
            use: "vue-loader",
            exclude: /node_modules/
        })
    }
}

export function base() {
    if (fs.existsSync(manifest)) {
        basecfg.plugins.unshift(new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(manifest)
        }));
    }
    return basecfg;
}