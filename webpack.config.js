const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiquidSchemaPlugin = require('liquid-schema-plugin');
const { merge } = require('webpack-merge');
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
                path.join(Config.get('paths.theme.dist'), '/**/*'),
            ],
        }),
        new HtmlWebpackPlugin({
            chunksSortMode: 'auto',
            entrypoints: entry,
            excludeChunks: ['static'],
            filename: path.join(
                Config.get('paths.theme.dist.snippets'),
                Config.get('webpack.assets.snippets.script-tags')
            ),
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
            filename: path.join(
                Config.get('paths.theme.dist.snippets'),
                Config.get('webpack.assets.snippets.style-tags')
            ),
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
            patterns: [
                {
                    from: Config.get('paths.theme.src.assets'),
                    to: '[name].[ext]',
                },
                {
                    from: Config.get('paths.theme.src.config'),
                    to: Config.get('paths.theme.dist.config'),
                },
                {
                    from: Config.get('paths.theme.src.layout'),
                    to: Config.get('paths.theme.dist.layout'),
                },
                {
                    from: Config.get('paths.theme.src.locales'),
                    to: Config.get('paths.theme.dist.locales'),
                },
                {
                    from: Config.get('paths.theme.src.snippets'),
                    to: Config.get('paths.theme.dist.snippets'),
                },
                {
                    from: Config.get('paths.theme.src.templates'),
                    to: Config.get('paths.theme.dist.templates'),
                },
            ],
        }),
        new LiquidSchemaPlugin({
            from: {
                liquid: Config.get('paths.theme.src.sections'),
                schema: Config.get('paths.theme.src.schemas'),
            },
            to: Config.get('paths.theme.dist.sections'),
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

    if (mode === 'production') {
        plugins.push(
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            })
        );
    }

    const config = {
        entry,
        output: {
            filename: '[name].js',
            path: Config.get('paths.theme.dist.assets'),
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
                {
                    test: /\.(eot|ttf|woff|woff2|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: '[name][ext]',
                    },
                },
                {
                    test: /\.(jpg|jpeg|png|gif)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: '[name][ext]',
                    },
                },
                {
                    test: /\.svg$/,
                    type: 'asset/resource',
                    generator: {
                        filename: '[name][ext]',
                    },
                },
            ],
        },
        plugins,
    };

    if (mode === 'production') {
        config.devtool = 'hidden-source-map';

        config.optimization = {
            splitChunks: {
                chunks: 'initial',
                name: getChunkName,
            },
        };
    } else {
        config.devtool = 'eval-source-map';

        /**
         * @warning This is only a temporary fix.
         * @see {@link https://github.com/webpack/webpack-dev-server/issues/2792 | Related GitHub Issue}
         */
        config.optimization = {
            minimize: false,
            runtimeChunk: 'single',
        };

        config.stats = 'errors-warnings';
    }

    const overriddenConfig = Config.get('webpack.override')(config);

    return merge(overriddenConfig, Config.get('webpack.extend'));
};
