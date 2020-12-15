const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getChunkName = require('./utils/get-chunk-name');
const getEntrypoints = require('./utils/get-entrypoints');
const renderScriptTagsSnippet = require('./utils/render-script-tags-snippet');

module.exports = () => {
    const entrypoints = getEntrypoints();

    return {
        entry: entrypoints,
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
        ],
        optimization: {
            splitChunks: {
                chunks: 'initial',
                name: getChunkName,
            },
        },
    };
};
