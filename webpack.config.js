// var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        task: './index'
    },
    output: {
        path: './dist',
        filename: '[name].min.js'
    },
    eslint: {
        configFile: './.eslintrc'
    },
    module: {
        loaders: [
            {
                text: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel!eslint'
            }
        ]
    },
    resolve: {
        root: path.join(__dirname, 'src'),
        extensions: ['', '.js', '.json'],
        alias: { // 设置别名

        }
    },
    externals: {}
};