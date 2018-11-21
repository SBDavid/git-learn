var path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    devtool: 'source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            { test: /\.js$/, exclude: /node_modules/ , loader: "babel-loader" }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devServer: {
        contentBase: path.join(__dirname, ''),
        host: '192.168.72.199',
        compress: true,
        port: 9001,
        filename: 'bundle.js',
        lazy: false,
        inline: false,
        publicPath: '/',
        clientLogLevel: 'info'
    }
};