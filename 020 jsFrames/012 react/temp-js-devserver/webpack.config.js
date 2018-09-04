var path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, ''),
        compress: true,
        port: 9000,
        filename: 'bundle.js',
        lazy: false,
        inline: false,
        publicPath: '/',
        clientLogLevel: 'info'
    }
};