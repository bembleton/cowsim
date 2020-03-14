const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        contentBase: './dist',
        hot: true,
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin([
            { from: 'src/static' }
        ])
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.bmp$/i,
                loader: 'file-loader',
                options: {
                    name: 'sprites/[name].[ext]',
                    publicPath: '../'
                }
            }
        ],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};
