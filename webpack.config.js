const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        contentBase: './public',
        hot: true,
    },
    plugins: [
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.bmp$/i,
                use: [
                    {
                        loader: 'buffer-loader'
                    }
                ]
            }
        ],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public')
    }
};
