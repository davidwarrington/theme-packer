const path = require('path');
const consola = require('consola');
const themeKit = require('@shopify/themekit');
const build = require('./build');
const Config = require('../packages/Config');
const getShopifyEnvKeys = require('../utils/get-shopify-env-keys');
const removeUndefinedKeys = require('../utils/remove-undefined-keys');

const deploy = async ({ env, allenvs, allowLive, nodelete }) => {
    try {
        await build();
        consola.info('Starting deployment');

        // Ensure environments are in an array so that we can chain deployments
        const envs = Array.isArray(env) ? env : [env];

        await envs.reduce(async (previousPromise, currentEnv) => {
            await previousPromise;
            const options = removeUndefinedKeys({
                config: path.resolve(__dirname, '..', 'config.yml'),
                dir: Config.get('paths.theme.dist'),
                ...getShopifyEnvKeys(currentEnv),
                allenvs,
                allowLive,
                nodelete,
            });

            return themeKit.command('deploy', options);
        }, Promise.resolve());

        consola.success('Finished deployment.');
    } catch (error) {
        consola.error(error);
    }
};

module.exports = deploy;
