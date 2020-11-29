const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const config = (directory) => {
    return {
        devtool: 'source-map',
        entry: path.resolve(directory, 'index-dev.js'),
        output: {
            path: path.resolve(directory, 'dist'),
            filename: 'index_bundle.js',
            publicPath: '/',
        },
        mode: 'development',
        module: {
            rules: [
                {test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader']},
                {
                    test: /\.(sc|c)ss$/, use: ['style-loader', 'css-loader', {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [require("autoprefixer")()],
                        },
                    }, 'sass-loader']
                },
                {test: /\.(jpe|jpg)$/, use: ["file-loader"]},
                {test: /\.(png|eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/, use: ["url-loader"]}
            ]
        },
        devServer: {
            host: '0.0.0.0',
            compress: true,
            hot: true,
            open: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(directory, 'index.html')
            }),
            new webpack.HotModuleReplacementPlugin(),
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.css']
        },
    }
};

module.exports = directory => {
    return config(directory);
};
