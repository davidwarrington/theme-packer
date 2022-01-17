const fs = require('fs');
const path = require('path');
const md5 = require('./md5');
const Config = require('../packages/Config');

/**
 * @param {{[key: string]: string|string[]}} entrypoints
 * @returns {{[key: string]: string[]}}
 */
const addHmrToEntrypoints = entrypoints => {
    const entries = Object.entries(entrypoints).map(([key, value]) => {
        let newValue = value;
        if (!Array.isArray(newValue)) {
            newValue = [newValue];
        }

        newValue.push('webpack-hot-middleware/client');

        return [key, newValue];
    });

    return Object.fromEntries(entries);
};

/**
 * @param {{[key: string]: string|string[]}} entrypoints
 * @returns {{[key: string]: string[]}}
 */
const convertEntrypointsToArrays = entrypoints => {
    const entries = Object.entries(entrypoints).map(([key, value]) => [
        key,
        [value].flat(),
    ]);

    return Object.fromEntries(entries);
};

const VALID_LIQUID_TEMPLATES = [
    '404',
    'article',
    'blog',
    'cart',
    'collection',
    'account',
    'activate_account',
    'addresses',
    'login',
    'order',
    'register',
    'reset_password',
    'gift_card',
    'index',
    'list-collections',
    'page',
    'password',
    'product',
    'search',
];

/** @param {string} filename */
const isValidTemplate = filename => {
    return VALID_LIQUID_TEMPLATES.some(template =>
        filename.startsWith(template)
    );
};

/**
 * getEntrypoints is basically just a rewrite of the
 * {@link https://github.com/Shopify/slate/blob/master/packages/slate-tools/tools/webpack/config/utilities/get-template-entrypoints.js | Slate v1 get-entrypoints utilities}.
 */
const getEntrypoints = (asTemplateNameMap = false) => {
    const entrypoints = {};

    const entrypointsMap = {
        layout: fs.readdirSync(Config.get('paths.theme.src.scripts.layout')),
        templates: fs.readdirSync(
            Config.get('paths.theme.src.scripts.templates')
        ),
        'templates/customers': fs.readdirSync(
            Config.get('paths.theme.src.scripts.templates.customers')
        ),
    };

    Object.keys(entrypointsMap).forEach(key => {
        entrypointsMap[key].forEach(file => {
            const { name } = path.parse(file);
            const entryFile = path.join(
                Config.get(`paths.theme.src.scripts.${key.replace('/', '.')}`),
                `${name}.js`
            );
            const entryType = key.split('/')[0];

            // Ignore directories
            if (!fs.existsSync(entryFile)) {
                return;
            }

            // Ignore invalid template entrypoints
            if (entryType === 'templates' && !isValidTemplate(name)) {
                return;
            }

            const hashedName = md5(name).substring(0, 6).toString();

            if (asTemplateNameMap) {
                entrypoints[hashedName] = name;
            } else {
                entrypoints[`${entryType.charAt(0)}.${hashedName}`] = entryFile;
            }
        });
    });

    return entrypoints;
};

module.exports = {
    addHmrToEntrypoints,
    convertEntrypointsToArrays,
    getEntrypoints,
};
