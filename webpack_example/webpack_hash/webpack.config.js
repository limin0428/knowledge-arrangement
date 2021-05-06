const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
// 压缩js文件
const TerserPlugin = require('terser-webpack-plugin'); 
// 压缩css文件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); 
// 打包前清除出口目录下的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 
module.exports = {
    entry: {
        index: './src/index.js',
        home: './src/home.js'
    },
    // production development
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        // hash  chunkhash  contenthash
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
        ],
    },
    optimization: {
        // minimize为true  开启压缩
        minimize: true,
        minimizer: [new TerserPlugin({
            // 启用多进程并发运行并设置并发运行次数  Boolean 开启多进程  Number 最大并发运行次数
            parallel: 4,
            // 是否将打包文件中的注释单独提取到文件中
            extractComments: false,
        }), new OptimizeCSSAssetsPlugin()],

    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[name].[contenthash].chunk.css',
        })
    ]
}