const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getChunkName = require('./utils/get-chunk-name');
const getEntrypoints = require('./utils/get-entrypoints');
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

    return {
        entry: entrypoints,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist', 'assets'),
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
                entrypoints,
                excludeChunks: 'static',
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
                entrypoints,
                excludeChunks: 'static',
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
            new MiniCssExtractPlugin(),
        ],
        optimization: {
            splitChunks: {
                chunks: 'initial',
                name: getChunkName,
            },
        },
    };
};
