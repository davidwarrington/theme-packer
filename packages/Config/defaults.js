const path = require('path');

/** @typedef {import('./index')} Config */

const paths = {
    'paths.theme': process.cwd(),

    /** @param {Config} config */
    'paths.theme.nodeModules': config =>
        path.join(config.get('paths.theme'), 'node_modules'),

    /** @param {Config} config */
    'paths.theme.packageJson': config =>
        path.join(config.get('paths.theme'), 'package.json'),

    /** @param {Config} config */
    'paths.theme.src': config => path.join(config.get('paths.theme'), 'src'),

    /** @param {Config} config */
    'paths.theme.src.assets': config =>
        path.join(config.get('paths.theme.src'), 'assets'),

    /** @param {Config} config */
    'paths.theme.src.config': config =>
        path.join(config.get('paths.theme.src'), 'config'),

    /** @param {Config} config */
    'paths.theme.src.layout': config =>
        path.join(config.get('paths.theme.src'), 'layout'),

    /** @param {Config} config */
    'paths.theme.src.locales': config =>
        path.join(config.get('paths.theme.src'), 'locales'),

    /** @param {Config} config */
    'paths.theme.src.scripts': config =>
        path.join(config.get('paths.theme.src'), 'scripts'),

    /** @param {Config} config */
    'paths.theme.src.scripts.layout': config =>
        path.join(config.get('paths.theme.src.scripts'), 'layout'),

    /** @param {Config} config */
    'paths.theme.src.scripts.templates': config =>
        path.join(config.get('paths.theme.src.scripts'), 'templates'),

    /** @param {Config} config */
    'paths.theme.src.scripts.templates.customers': config =>
        path.join(config.get('paths.theme.src.scripts.templates'), 'customers'),

    /** @param {Config} config */
    'paths.theme.src.sections': config =>
        path.join(config.get('paths.theme.src'), 'sections'),

    /** @param {Config} config */
    'paths.theme.src.snippets': config =>
        path.join(config.get('paths.theme.src'), 'snippets'),

    /** @param {Config} config */
    'paths.theme.src.styles': config =>
        path.join(config.get('paths.theme.src'), 'styles'),

    /** @param {Config} config */
    'paths.theme.src.templates': config =>
        path.join(config.get('paths.theme.src'), 'templates'),

    /** @param {Config} config */
    'paths.theme.src.templates.customers': config =>
        path.join(config.get('paths.theme.src.templates'), 'customers'),

    /** @param {Config} config */
    'paths.theme.dist': config => path.join(config.get('paths.theme'), 'dist'),

    /** @param {Config} config */
    'paths.theme.dist.assets': config =>
        path.join(config.get('paths.theme.dist'), 'assets'),

    /** @param {Config} config */
    'paths.theme.dist.config': config =>
        path.join(config.get('paths.theme.dist'), 'config'),

    /** @param {Config} config */
    'paths.theme.dist.layout': config =>
        path.join(config.get('paths.theme.dist'), 'layout'),

    /** @param {Config} config */
    'paths.theme.dist.locales': config =>
        path.join(config.get('paths.theme.dist'), 'locales'),

    /** @param {Config} config */
    'paths.theme.dist.scripts': config =>
        path.join(config.get('paths.theme.dist'), 'scripts'),

    /** @param {Config} config */
    'paths.theme.dist.sections': config =>
        path.join(config.get('paths.theme.dist'), 'sections'),

    /** @param {Config} config */
    'paths.theme.dist.snippets': config =>
        path.join(config.get('paths.theme.dist'), 'snippets'),

    /** @param {Config} config */
    'paths.theme.dist.styles': config =>
        path.join(config.get('paths.theme.dist'), 'styles'),

    /** @param {Config} config */
    'paths.theme.dist.templates': config =>
        path.join(config.get('paths.theme.dist'), 'templates'),

    /** @param {Config} config */
    'paths.theme.dist.templates.customers': config =>
        path.join(config.get('paths.theme.dist.templates'), 'customers'),
};

module.exports = paths;
