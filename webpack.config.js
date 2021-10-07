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
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime']
              }
            }
          },
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
            },
            {
              test: /.txt$/i,
              use: 'raw-loader'
            }
        ],
    },
    resolve: {
      extensions: [".js"],
      alias: {
        "~": path.resolve(__dirname, "src")
      }
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};
