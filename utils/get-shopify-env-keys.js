const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Config = require('../packages/Config');
const convertSnakeToCamelCase = require('./convert-snake-to-camel-case');

/**
 * @param {string} name
 *
 * Function is a copy of _getFileName from {@link https://github.com/Shopify/slate/blob/5ecc510efed9a14fa9e3954c1adedeac91650144/packages/slate-env/index.js#L37 | @shopify/slate-env}.
 */
const getEnvFileName = name => {
    const basename = '.env';

    if (typeof name === 'undefined' || name.trim() === '') {
        return basename;
    }

    return `${basename}.${name}`;
};

/**
 * @param {string} env
 * @returns {{[key: string]: string}}
 */
const getShopifyEnvKeys = env => {
    const envFilePath = path.resolve(
        Config.get('paths.theme'),
        getEnvFileName(env)
    );

    if (!fs.existsSync(envFilePath)) {
        throw new Error(`Missing env file at ${envFilePath}`);
    }

    dotenv.config({ path: envFilePath });
    const shopifyEntries = Object.entries(process.env)
        .filter(([key]) => key.startsWith('SHOPIFY_'))
        .map(([key, value]) => [
            convertSnakeToCamelCase(key.toLowerCase().replace(/^shopify_/, '')),
            value,
        ]);

    return Object.fromEntries(shopifyEntries);
};

module.exports = getShopifyEnvKeys;
