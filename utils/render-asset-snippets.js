const path = require('path');
const Config = require('../packages/Config');

/** @typedef {{[key: string]: string}} Entrypoints */
/**
 * @typedef {{
 *  entrypoint: string;
 *  filename: string;
 *  parentDirectory?: string;
 *  type: string;
 * }} ModulePartialData
 */

const mode = Config.get('app.mode');

/** @param {string} filename */
const getAssetSrc = filename =>
    mode === 'production'
        ? `{{ '${filename}' | asset_url }}`
        : `{{ base_url }}/assets/${filename}`;

/**
 * Make asset paths absolute whilst running in development mode on the theme customiser.
 *
 * @note Due to quirks surronding `shop.url` and similar Liquid variables, it's not
 * possible to set this dynamically for `.myshopify.com` or `.shopifypreview.com` urls.
 */
const assignBaseUrl = () => {
    const browserSyncInstance = Config.get('server.instance');

    if (!browserSyncInstance) {
        return '';
    }

    /** @type {string} url */
    const urls = browserSyncInstance.getOption('urls');
    const getOriginFromUrl = url => new URL(urls.get(url)).origin;

    if (Config.get('assets.always-external-urls')) {
        return `{%- assign base_url = '${getOriginFromUrl('external')}' -%}`;
    }

    return `
        {%- if request.design_mode -%}
            {%- assign base_url = '${getOriginFromUrl('local')}' -%}
        {%- endif -%}
    `;
};

const getChunkForFile = (filename, compilation) => {
    return [...compilation.chunks].find(chunk => chunk.files.has(filename));
};

const getLiquidConditionsFromChunk = chunk => {
    const liquidAssociations = {
        layouts: [],
        templates: [],
        other: [],
    };

    let runtimes;
    if (typeof chunk.runtime === 'string') {
        runtimes = [chunk.runtime];
    } else {
        runtimes = [...chunk.runtime];
    }

    runtimes.forEach(runtime => {
        if (runtime.startsWith('layout.', '')) {
            liquidAssociations.layouts.push(runtime.replace('layout.', ''));
        } else if (runtime.startsWith('templates.', '')) {
            liquidAssociations.templates.push(
                runtime.replace('templates.', '')
            );
        } else {
            liquidAssociations.other.push(runtime);
        }
    });

    const conditions = [];
    liquidAssociations.layouts.forEach(layout =>
        conditions.push(`layout == '${layout}'`)
    );
    liquidAssociations.templates.forEach(template =>
        conditions.push(`template == '${template}'`)
    );

    return conditions.join(' or ');
};

const renderScriptTagsSnippet = ({ compilation, htmlWebpackPlugin }) => {
    const jsFiles = htmlWebpackPlugin.files.js.map(filename =>
        decodeURIComponent(path.basename(filename))
    );

    const tags = jsFiles
        .map(filename => {
            if (filename === 'runtime.js') {
                return `<script src="${getAssetSrc(filename)}"></script>`;
            }

            const associatedChunk = getChunkForFile(filename, compilation);

            const conditions = getLiquidConditionsFromChunk(associatedChunk);
            const assetSrc = getAssetSrc(filename);

            return `
                {%- if ${conditions} -%}
                    <script src="${assetSrc}" defer></script>
                {%- else -%}
                    <link rel="prefetch" href="${assetSrc}" as="script">
                {%- endif -%}
            `;
        })
        .join('');

    const browserSyncInstance = Config.get('server.instance');
    if (browserSyncInstance) {
        const localUrl = new URL(
            browserSyncInstance.getOption('urls').get('local')
        );

        return `
            ${assignBaseUrl(localUrl.origin)}
            ${tags}
        `;
    }

    return tags;
};

const renderStyleTagsSnippet = ({ compilation, htmlWebpackPlugin }) => {
    const cssFiles = htmlWebpackPlugin.files.css.map(filename =>
        decodeURIComponent(path.basename(filename))
    );

    const tags = cssFiles
        .map(filename => {
            const associatedChunk = getChunkForFile(filename, compilation);

            const conditions = getLiquidConditionsFromChunk(associatedChunk);
            const assetSrc = getAssetSrc(filename);

            return `
                {%- if ${conditions} -%}
                    <link href="${assetSrc}" rel="stylesheet">
                {%- else -%}
                    <link rel="prefetch" href="${assetSrc}" as="style">
                {%- endif -%}
            `;
        })
        .join('');

    const browserSyncInstance = Config.get('server.instance');
    if (browserSyncInstance) {
        const localUrl = new URL(
            browserSyncInstance.getOption('urls').get('local')
        );

        return `
            ${assignBaseUrl(localUrl.origin)}
            ${tags}
        `;
    }

    return tags;
};

module.exports = {
    renderScriptTagsSnippet,
    renderStyleTagsSnippet,
};
