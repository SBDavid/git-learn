/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import os from 'os';
import webpack from 'webpack';
import merge from 'webpack-merge';
import {base, define, uglify, banner} from './webpack.config.base';

let config = base();

export default () => {
	if (process.env.NODE_ENV == 'production') {
		config = merge(config,{
								plugins : [
											define(),
											uglify(),
									    	config.plugins.pop()
								]
							})
	}
	return config;
}