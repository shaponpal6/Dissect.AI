require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');
const versions = {
    tracking: '1.0.2'
};

const config = (directory) => {
    return {
        entry: path.resolve(directory, 'index.js'),
        output: {
            path: path.resolve(directory, 'dist'),
            filename: `${directory.toLowerCase()}.${versions[directory]}.js`,
            publicPath: '/',
        },
        mode: 'production',
        // optimization: { // uncomment for clearer debugging
        //     minimize: false,
        // },
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
        plugins: [
            // new webpack.DefinePlugin({
            //     'process.env.NODE_ENV': JSON.stringify('production')
            // }),
            new webpack.IgnorePlugin(/\/iconv-loader$/),
            // new webpack.optimize.DedupePlugin(),
            new CompressionPlugin(),
            // new S3Plugin({
            //     // Only upload js
            //     include: /.*\.(js)/,
            //     s3Options: {
            //         accessKeyId: process.env.AWS_ACCESS_KEY_ID, //process.env.AWS_ACCESS_KEY_ID
            //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, //process.env.AWS_SECRET_ACCESS_KEY
            //         region: 'ap-southeast-1'
            //     },
            //     s3UploadOptions: {
            //         Bucket: 'visenze-static'
            //     },
            //     basePathTransform: (() => 'productcat/dist/js'),
            // }),
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.css']
        },
    }
};

module.exports = directory => {
    return config(directory);
};
