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

const entryNameDelimiter = '@';
const entryPartsDelimiter = '.';
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

/**
 * @param {string} type
 * @param {string[]} otherFileNameParts
 */
const getEntrypointKey = (type, otherFileNameParts) => {
    const filename = otherFileNameParts.join(entryPartsDelimiter);

    return `${type}.${path.basename(filename)}`;
};

/** @param {ModulePartialData[]} partials */
const getLiquidConditionsFromPartials = partials => {
    return partials
        .map(partial => {
            let name = partial.filename;
            if (partial.parentDirectory) {
                name = `${partial.parentDirectory}/${name}`;
            }

            return `${partial.type} == '${name}'`;
        })
        .join(' or ');
};

/**
 * @param {string} entry
 * @param {Entrypoints} entrypoints
 */
const getParentDirectory = (entry, entrypoints) => {
    const dirname = path.dirname(entrypoints[entry][0]);

    return path.basename(dirname);
};

/**
 * @param {string} filename
 * @param {Entrypoints} entrypoints
 * @returns {ModulePartialData[]}
 */
const getPartialsData = (filename, entrypoints) => {
    const fileNameParts = path
        .basename(filename, path.extname(filename))
        .split(entryNameDelimiter)
        .filter(part => !part.startsWith('vendor'));

    return fileNameParts.map(partialName => {
        const [typeIdentifier, ...otherFileNameParts] = partialName.split(
            entryPartsDelimiter
        );

        const type = {
            l: 'layout',
            t: 'templates'
        }[typeIdentifier];

        let parentDirectory;
        if (type === 'templates') {
            const parentDirectoryName = getParentDirectory(
                partialName,
                entrypoints
            );
            if (parentDirectoryName !== 'templates') {
                parentDirectory = parentDirectoryName;
            }
        }

        return {
            entrypoint: entrypoints[getEntrypointKey(type, otherFileNameParts)],
            filename: otherFileNameParts.join(entryPartsDelimiter),
            parentDirectory,
            type: type === 'templates' ? 'template' : type,
        };
    });
};

const renderScriptTagsSnippet = ({ htmlWebpackPlugin }) => {
    const jsFiles = htmlWebpackPlugin.files.js.map(filename =>
        decodeURIComponent(path.basename(filename))
    );

    const tags = jsFiles
        .map(filename => {
            if (filename === 'runtime.js') {
                return `<script src="${getAssetSrc(filename)}"></script>`;
            }

            const partials = getPartialsData(
                filename,
                htmlWebpackPlugin.options.entrypoints
            );

            const assetSrc = getAssetSrc(filename);

            const conditions = getLiquidConditionsFromPartials(partials);

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

const renderStyleTagsSnippet = ({ htmlWebpackPlugin }) => {
    const cssFiles = htmlWebpackPlugin.files.css.map(filename =>
        decodeURIComponent(path.basename(filename))
    );

    const tags = cssFiles
        .map(filename => {
            const partials = getPartialsData(
                filename,
                htmlWebpackPlugin.options.entrypoints
            );
            const assetSrc = getAssetSrc(filename);

            const conditions = getLiquidConditionsFromPartials(partials);

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
