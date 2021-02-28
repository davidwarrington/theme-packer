const browserSync = require('browser-sync');
const consola = require('consola');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const Config = require('./Config');
const getShopifyEnvKeys = require('../utils/get-shopify-env-keys');
const getWebpackConfig = require('../webpack.config');

const isHotUpdateFile = filepath => /\.hot-update\.js(on)?$/.test(filepath);

class Watcher {
    /** @param {string} env */
    constructor(env) {
        this.app = null;
        this.shopifyEnvKeys = getShopifyEnvKeys(env);
    }

    /** @returns {browserSync.BrowserSyncInstance} */
    async start() {
        const config = getWebpackConfig();
        const compiler = webpack(config);

        const devMiddleware = webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath,
            writeToDisk: filepath => !isHotUpdateFile(filepath),
        });
        const hotMiddleware = webpackHotMiddleware(compiler);
        const addQueryParams = (req, res, next) => {
            const prefix = req.url.indexOf('?') > -1 ? '&' : '?';
            const queryStringComponents = ['_fd=0', 'pb=0'];
            req.url += prefix + queryStringComponents.join('&');
            next();
        };

        const middleware = [devMiddleware, hotMiddleware, addQueryParams];

        this.app = browserSync.create();

        this.app.init(
            {
                baseDir: compiler.outputPath,
                https: true,
                middleware,
                port: Config.get('server.port'),
                proxy: `https://${this.shopifyEnvKeys.store}?preview_theme_id=${this.shopifyEnvKeys.themeId}`,
                reloadDebounce: 1000,
                snippetOptions: {
                    rule: {
                        match: /<\/body>/i,
                        fn(snippet, match) {
                            return snippet + match;
                        },
                    },
                },
            },
            (error, instance) => {
                if (error) {
                    consola.error(error);
                    Promise.reject(error);
                } else {
                    consola.success('Server launched.');
                    Promise.resolve(instance);
                }
            }
        );
    }

    async close() {
        await this.app.exit();
        consola.success('Server closed.');
        Promise.resolve();
    }
}

module.exports = Watcher;
