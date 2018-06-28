/**
 * ...
 * @author minliang1112@foxmail.com | kaizhou@pptv.com
 */

'use strict';

import os from 'os';
import path from 'path';
import webpack from 'webpack';
import pkg from './package.json';
import HappyPack from 'happypack'; // 开启happypack的多线程池
import UglifyJsParallelPlugin from 'webpack-uglify-parallel'; //采用了多核并行压缩的方式来提升压缩速度
import Es3ifyWebpackPlugin from 'es3ify-webpack-plugin';

const getDir = (dir) => path.resolve(__dirname, dir);
const happyThreadPool = HappyPack.ThreadPool({
	size: os.cpus().length
});

/* 
    "transform-es3-property-literals",
    "transform-es3-member-expression-literals",
    "transform-es2015-modules-simple-commonjs" 'es5-shim', 'es5-shim/es5-sham', */

let config = {
	entry: {
		'sta': [getDir('./src') + '/sta.js'],
	},

	output: {
		path: getDir('./dist'),
		filename: '[name].js'
	},

	resolve: {
		extensions: ['.js', '.json'],
		modules: [getDir('./src'), 'node_modules']
	},

	module: {
		rules: [{
			test: /\.js|.jsx$/,
			loaders: ['happypack/loader?id=happybabel'],
			exclude: /node_modules/,
		}, {
			test: /.js$/,
			enforce: 'post', // post-loader处理
			loader: 'es3ify-loader'
		}]
	},

	plugins: [
		new HappyPack({
			id: 'happybabel',
			loaders: ['babel-loader'],
			threadPool: happyThreadPool,
			cache: true,
			verbose: true
		}),
		new Es3ifyWebpackPlugin(),
		new webpack.BannerPlugin({
			banner: ['/**',
					   '* ...',
					   '* @author ' + pkg.author,
					   '* ' + new Date(),
					   '*/'
					].join('\n'),
			raw: true,
			entryOnly: true
		})
	]
}


export default () => {
	if (process.env.NODE_ENV == 'production') {
		let pop = config.plugins.pop();
		config.plugins = config.plugins.concat([
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify(process.env.NODE_ENV)
				}
			}),
			new UglifyJsParallelPlugin({
				workers: os.cpus().length,
				mangle: true,
				comments: false,
				compressor: {
					properties: false,
					warnings: false
				}
			}),
			pop
		]);
	}
	return config;
}