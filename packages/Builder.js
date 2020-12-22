const consola = require('consola');
const debounce = require('debounce-promise');
const webpack = require('webpack');
const getWebpackConfig = require('../webpack.config');
const logWebpackIssues = require('../utils/log-webpack-issues');

const STATES = {
    IDLE: 1,
    RUNNING: 2,
};

/** @typedef {'run'|'watch'} RunMode */

class Builder {
    constructor() {
        this.compiler = null;
        this.state = STATES.IDLE;

        // Prevent multiple files being added/deleted at once from causing multiple restarts.
        this.start = debounce(this.start, 200);
        this.restart = debounce(this.restart, 200);
    }

    /** @param {RunMode} mode */
    async start(mode = 'run') {
        // Close existing compiler if already running.
        await this.close();

        this.compiler = webpack(getWebpackConfig());

        if (mode === 'watch') {
            this.compiler.watch({}, (error, result) => {
                logWebpackIssues(error, result);

                this.state = STATES.RUNNING;
                if (result.hasErrors()) {
                    consola.info('Build attempted...');
                } else {
                    consola.success('Successfully built!');
                }
            });

            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.state = STATES.RUNNING;
            this.compiler.run((error, result) => {
                logWebpackIssues(error, result);

                this.state = STATES.IDLE;
                if (result.hasErrors()) {
                    consola.info('Build attempted.');
                } else {
                    consola.success('Built!');
                }

                if (error || result.hasErrors()) {
                    reject();
                }

                resolve();
            });
        });
    }

    async close() {
        if (!this.compiler) {
            this.state = STATES.IDLE;
            return Promise.resolve();
        }

        return this.compiler.close(() => {
            this.state = STATES.IDLE;
            return Promise.resolve();
        });
    }

    /** @param {RunMode} mode */
    async restart(mode) {
        consola.info('Restarting...');
        this.start(mode);
    }
}

module.exports = Builder;
