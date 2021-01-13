const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const Config = require('./packages/Config');
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

const mode = Config.get('app.mode');

const finalStyleLoader =
    mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader';

module.exports = () => {
    const entrypoints = getEntrypoints();
    const entry =
        mode === 'development'
            ? addHmrToEntrypoints(entrypoints)
            : convertEntrypointsToArrays(entrypoints);

    const jsLoaders = ['babel-loader'];

    const plugins = [
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
    ];

    if (mode === 'development') {
        jsLoaders.push({
            loader: path.resolve(__dirname, './utils/hmr-loader'),
            options: { entrypoints },
        });

        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    const config = {
        entry,
        output: {
            filename: '[name].js',
            path: path.resolve(process.cwd(), 'dist', 'assets'),
            publicPath: '/assets/',
        },
        resolveLoader: {
            modules: [
                path.resolve(__dirname, 'node_modules'),
                path.resolve('node_modules'),
            ],
        },
        mode,
        module: {
            rules: [
                {
                    test: /\.m?jsx?$/,
                    exclude: /node_modules/,
                    use: jsLoaders,
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
        plugins,
    };

    if (mode === 'production') {
        config.optimization = {
            splitChunks: {
                chunks: 'initial',
                name: getChunkName,
            },
        };
    } else {
        /**
         * @warning This is only a temporary fix.
         * @see {@link https://github.com/webpack/webpack-dev-server/issues/2792|Related GitHub Issue}
         */
        config.optimization = {
            minimize: false,
            runtimeChunk: 'single',
        };

        config.stats = 'errors-warnings';
    }

    return config;
};
