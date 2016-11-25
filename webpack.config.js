// const webpack = require('webpack');
const path = require('path');

let prod = process.env.NODE_ENV === "production";

module.exports = {
    entry: {
        task: './lib/task'
    },
    output: {
        path: './dist',
        filename: prod ? '[name].min.js' : '[name].js',
        library: 'task',
        libraryTarget: 'umd',
        umdNamedDefine: true
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
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: false
    //         }
    //     })
    // ],
    externals: {}
};