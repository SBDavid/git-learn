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
import UglifyJsParallelPlugin from 'uglifyjs-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HappyPack from 'happypack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const manifest = './dll/manifest.json';
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
let basecfg = {
    devtool: process.env.NODE_ENV == 'production' ? false : "source-map",
    output: {
        path: getDir('./dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.css', '.vue', '.json'],
        alias: {
            'zepto': getDir('./lib/zepto.js')
        }
    },
    module: {
        rules: [{
            test: /\.js?$/,
            loader: 'happypack/loader?id=happybabel',
            exclude: /node_modules|vue\/dist|vuex\/|vue-loader\/|vue-hot-reload-api\//,
        }, {
            test: /\.vue$/,
            use : 'vue-loader'
        }, {
            test:/\.(css|less)$/,
            use:[process.env.NODE_ENV == 'production'?MiniCssExtractPlugin.loader:'vue-style-loader', 'css-loader', 'less-loader']
        }, {
            test:/\.(css|less)$/,
            use:[process.env.NODE_ENV == 'production'?MiniCssExtractPlugin.loader:'vue-style-loader', 'css-loader', 'less-loader']
        }, 
        {
            test: /\.(png|gif)$/,
            use: "url-loader?limit=8192&publicPath=../&name=assets/[name].[ext]"

        }
    ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/style-[name].css",
            allChunks: true
        }),
        new CopyWebpackPlugin([
        {
            from: getDir('./node_modules/swiper/dist/js/swiper.min.js'),
            to: '../dist/swiper.js'
        },
        {
            context: './src/assets',
            from: { glob: '{*.gif,*.png,header/*.png}' },
            to: '../dist/assets',
        }, 
        {
            ignore: ['*.less', 'style_original.css', 'readme.md'],
            from: './src/css',
            to: '../dist/css'
        }]),
        new HappyPack({
            id: 'happybabel',
            loaders: ['cache-loader', 'babel-loader'],
            threadPool: happyThreadPool
        }),
        new VueLoaderPlugin(),
        banner()
    ]
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