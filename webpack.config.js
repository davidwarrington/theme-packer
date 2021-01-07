const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const getChunkName = require('./utils/get-chunk-name');
const {
    addHmrToEntrypoints,
    convertEntrypointsToArrays,
    getEntrypoints,
} = require('./utils/get-entrypoints');
const {
    renderScriptTagsSnippet,
    renderStyleTagsSnippet,
} = require('./utils/render-asset-snippets');

const mode =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';

const finalStyleLoader =
    mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader';

module.exports = () => {
    const entrypoints = getEntrypoints();
    const entry =
        mode === 'development'
            ? addHmrToEntrypoints(entrypoints)
            : convertEntrypointsToArrays(entrypoints);

    const config = {
        entry,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist', 'assets'),
            publicPath: '/assets/',
        },
        mode,
        module: {
            rules: [
                {
                    test: /\.m?jsx?$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
                {
                    test: /\.css$/,
                    use: [finalStyleLoader, 'css-loader', 'postcss-loader'],
                },
                {
                    test: /\.s[ac]ss$/,
                    use: [
                        finalStyleLoader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [
                    path.join(process.cwd(), 'dist/**/*'),
                ],
            }),
            new HtmlWebpackPlugin({
                chunksSortMode: 'auto',
                entrypoints: entry,
                excludeChunks: ['static'],
                filename: '../snippets/includes.script-tags.liquid',
                inject: false,
                minify: {
                    collapseWhitespace: true,
                    preserveLineBreaks: true,
                    removeComments: true,
                    removeAttributeQuotes: true,
                },
                mode,
                templateContent: renderScriptTagsSnippet,
            }),
            new HtmlWebpackPlugin({
                chunksSortMode: 'auto',
                entrypoints: entry,
                excludeChunks: ['static'],
                filename: '../snippets/includes.style-tags.liquid',
                inject: false,
                minify: {
                    collapseWhitespace: true,
                    preserveLineBreaks: true,
                    removeComments: true,
                    removeAttributeQuotes: true,
                },
                mode,
                templateContent: renderStyleTagsSnippet,
            }),
            new CopyWebpackPlugin({
                /** @todo Replace sections pattern with liquid-schema-plugin once updated for Webpack v5. */
                patterns: [
                    { from: './src/assets/', to: '[name].[ext]' },
                    { from: './src/config/', to: '../config/' },
                    { from: './src/layout/', to: '../layout/' },
                    { from: './src/locales/', to: '../locales/' },
                    { from: './src/sections/', to: '../sections/' },
                    { from: './src/snippets/', to: '../snippets/' },
                    { from: './src/templates/', to: '../templates/' },
                ],
            }),
            new MiniCssExtractPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ],
    };

    if (mode === 'production') {
        config.optimization = {
            splitChunks: {
                chunks: 'initial',
                name: getChunkName,
            },
        };
    }

    return config;
};
