const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const getEntrypoints = require('./utils/get-entrypoints');

module.exports = () => {
    return {
        entry: getEntrypoints(),
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist', 'assets'),
        },
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.m?jsx?$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
        ],
    }
};