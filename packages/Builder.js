const consola = require('consola');
const webpack = require('webpack');
const getWebpackConfig = require('../webpack.config');

const STATES = {
    IDLE: 1,
    RUNNING: 2,
    RESTARTING: 3,
};

/** @typedef {'run'|'watch'} RunMode */

class Builder {
    constructor() {
        this.compiler = null;
        this.state = STATES.IDLE;
    }

    /** @param {RunMode} mode */
    async start(mode) {
        // Close existing compiler if already running.
        await this.close();

        this.compiler = webpack(getWebpackConfig());

        if (mode === 'run') {
            this.state = STATES.RUNNING;
            this.compiler.run(error => {
                if (error) {
                    consola.error(new Error(error));
                }

                this.state = STATES.IDLE;
                consola.success('Built!');
            });
        } else if (mode === 'watch') {
            this.compiler.watch({}, error => {
                if (error) {
                    consola.error(new Error(error));
                }
                this.state = STATES.RUNNING;
                consola.success('Successfully built!');
            });
        }
    }

    async close() {
        if (!this.compiler) {
            this.state = STATES.IDLE;
            return Promise.resolve();
        }

        this.compiler.close(() => {
            this.state = STATES.IDLE;
            Promise.resolve();
        });
    }

    /** @param {RunMode} mode */
    async restart(mode) {
        consola.info('Restarting...');
        this.state = STATES.RESTARTING;
        this.start(mode);
    }
}

module.exports = Builder;