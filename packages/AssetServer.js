const consola = require('consola');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const isHotUpdateFile = filepath => /\.hot-update\.js(on)?$/.test(filepath);

/** @typedef {import('webpack').Compiler} Compiler */
/** @typedef {import('webpack').MultiCompiler} MultiCompiler */

class AssetServer {
    constructor() {
        this.app = null;
        this.server = null;
    }

    /** @param {Compiler & MultiCompiler} compiler */
    createApp(compiler) {
        const devMiddleware = webpackDevMiddleware(compiler, {
            writeToDisk: filepath => !isHotUpdateFile(filepath),
        });
        const hotMiddleware = webpackHotMiddleware(compiler);
        const staticMiddleware = express.static(`${process.cwd()}/dist`);

        this.app = express();

        this.app.use(devMiddleware);
        this.app.use(hotMiddleware);
        this.app.use('/assets', staticMiddleware);

        return this;
    }

    async close() {
        if (!this.server) {
            this.app = null;
            this.server = null;

            Promise.resolve();
        }

        this.server.close(() => {
            consola.success('Closed server.');
            this.app = null;
            this.server = null;

            return Promise.resolve();
        });
    }

    /** @param {number} port */
    async start(port) {
        this.server = this.app.listen(port, () => {
            consola.success(
                `Asset server launched. Listening on port ${port}.`
            );

            return Promise.resolve();
        });
    }
}

module.exports = AssetServer;
