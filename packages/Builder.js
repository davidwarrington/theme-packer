const consola = require('consola');
const webpack = require('webpack');
const getWebpackConfig = require('../webpack.config');
const logWebpackIssues = require('../utils/log-webpack-issues');

class Builder {
    constructor() {
        this.compiler = null;
    }

    async run() {
        this.compiler = webpack(getWebpackConfig());

        return new Promise((resolve, reject) => {
            this.compiler.run((error, result) => {
                logWebpackIssues(error, result);

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
}

module.exports = Builder;
