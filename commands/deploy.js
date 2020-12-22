const consola = require('consola');
const themeKit = require('@shopify/themekit');
const build = require('./build');
const getShopifyEnvKeys = require('../utils/get-shopify-env-keys');

const deploy = async ({ env }) => {
    try {
        await build();
        consola.info('Starting deployment');

        // Ensure environments are in an array so that we can chain deployments
        const envs = Array.isArray(env) ? env : [env];

        await envs.reduce(async (previousPromise, currentEnv) => {
            await previousPromise;
            return themeKit.command('deploy', {
                dir: 'dist',
                ...getShopifyEnvKeys(currentEnv),
            });
        }, Promise.resolve());

        consola.success('Finished deployment.');
    } catch (error) {
        consola.error(error);
    }
};

module.exports = deploy;
