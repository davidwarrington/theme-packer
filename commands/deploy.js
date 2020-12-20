const consola = require('consola');
const themeKit = require('@shopify/themekit');
const build = require('./build');
const getShopifyEnvKeys = require('../utils/get-shopify-env-keys');

const deploy = async ({ env }) => {
    try {
        await build();

        // Ensure environments are in an array so that we can chain deployments
        const envs = Array.isArray(env) ? env : [env];

        envs.reduce(async (previousPromise, currentEnv) => {
            await previousPromise;
            return themeKit.command('deploy', {
                dir: 'dist',
                ...getShopifyEnvKeys(currentEnv),
            });
        }, Promise.resolve());
    } catch (error) {
        consola.error(error);
    }
};

module.exports = deploy;
