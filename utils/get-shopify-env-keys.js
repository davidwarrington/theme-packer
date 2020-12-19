const dotenv = require('dotenv');
const convertSnakeToCamelCase = require('./convert-snake-to-camel-case');

/** @returns {{[key: string]: string}} */
const getShopifyEnvKeys = () => {
    const results = dotenv.config();
    const shopifyEntries = Object.entries(results.parsed)
        .filter(([key]) => key.startsWith('SHOPIFY_'))
        .map(([key, value]) => [
            convertSnakeToCamelCase(key.toLowerCase().replace(/^shopify_/, '')),
            value,
        ]);

    return Object.fromEntries(shopifyEntries);
};

module.exports = getShopifyEnvKeys;
