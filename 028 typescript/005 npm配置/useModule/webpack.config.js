var path = require('path');

module.exports = {
	entry: './src/index.ts',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		modules: [path.resolve(__dirname, "src/m"), "node_modules"]
	}
};