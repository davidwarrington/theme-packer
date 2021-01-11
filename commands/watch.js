const path = require('path');
const chokidar = require('chokidar');
const consola = require('consola');
const themeKit = require('@shopify/themekit');
const getShopifyEnvKeys = require('../utils/get-shopify-env-keys');
const Watcher = require('../packages/Watcher');

const LAYOUT_DIR = 'src/scripts/layout/';
const TEMPLATES_DIR = 'src/scripts/templates/';

const watch = async ({ env }) => {
    try {
        themeKit.command('watch', {
            config: path.resolve(__dirname, '..', 'config.yml'),
            dir: 'dist',
            ...getShopifyEnvKeys(env),
        });
    } catch (error) {
        consola.error(error);
    }

    const server = new Watcher();
    await server.start();

    chokidar
        .watch('./src', { ignoreInitial: true })
        .on('all', async (event, path) => {
            const changeInLayoutOrTemplatesDir = [
                LAYOUT_DIR,
                TEMPLATES_DIR,
            ].some(dirPath => path.startsWith(dirPath));
            const restartEvent = ['add', 'unlink'].includes(event);

            if (changeInLayoutOrTemplatesDir && restartEvent) {
                await server.close();
                server.start();
            }
        });
};

module.exports = watch;
