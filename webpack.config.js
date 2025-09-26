const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
        devMiddleware: {
            writeToDisk: true,
        }
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
                { from: "./src/styles", to: "styles" },
                { from: "./static/fonts", to: "static/fonts" },
                { from: "./static/images", to: "static/images" },
                { from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css" },
                { from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "js" },
            ],
        }),
    ],
};