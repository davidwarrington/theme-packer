const chokidar = require('chokidar');
const consola = require('consola');
const themeKit = require('@shopify/themekit');
const yargs = require('yargs');
const Builder = require('./packages/Builder');
const getShopifyEnvKeys = require('./utils/get-shopify-env-keys');

const { env } = yargs.argv;
const LAYOUT_DIR = 'src/scripts/layout/';
const TEMPLATES_DIR = 'src/scripts/templates/';
const builder = new Builder();

(async () => {
    await builder.start('watch');

    try {
        themeKit.command('watch', {
            dir: 'dist',
            ...getShopifyEnvKeys(env),
        });
    } catch (error) {
        consola.error(error);
    }

    chokidar
        .watch('./src', { ignoreInitial: true })
        .on('all', async (event, path) => {
            const changeInLayoutOrTemplatesDir = [
                LAYOUT_DIR,
                TEMPLATES_DIR,
            ].some(dirPath => path.startsWith(dirPath));
            const restartEvent = ['add', 'unlink'].includes(event);

            if (changeInLayoutOrTemplatesDir && restartEvent) {
                builder.restart('watch');
            }
        });
})();
