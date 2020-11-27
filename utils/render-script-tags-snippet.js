const path = require('path');

const entryNameDelimiter = '@';
const entryPartsDelimiter = '.';

/**
 * @param {string} type
 * @param {string[]} otherFileNameParts
 */
const getEntrypointKey = (type, otherFileNameParts) => {
    const typePrefix = type === 'template' ? `${type}s` : type;
    const filename = otherFileNameParts.join(entryPartsDelimiter);

    return `${typePrefix}.${path.basename(filename, path.extname(filename))}`;
};

/**
 * @param {string} filename
 * @param {{[key: string]: string}} entrypoints
 */
const getPartialsData = (filename, entrypoints) => {
    const fileNameParts = filename
        .split(entryNameDelimiter)
        .filter(part => !part.startsWith('vendor'));
    return fileNameParts.map(partialName => {
        const [type, ...otherFileNameParts] = partialName.split(
            entryPartsDelimiter
        );

        return {
            entrypoint: entrypoints[getEntrypointKey(type, otherFileNameParts)],
            filename: otherFileNameParts[0],
            type,
        };
    });
};

const renderScriptTagsSnippet = ({ htmlWebpackPlugin }) => {
    const jsFiles = htmlWebpackPlugin.files.js.map(filename =>
        decodeURIComponent(path.basename(filename))
    );

    return jsFiles
        .map(filename => {
            const partials = getPartialsData(
                filename,
                htmlWebpackPlugin.options.entrypoints
            );
            const assetSrc = `{{ ${filename} | asset_url }}`;

            const conditions = partials
                .map(
                    partial =>
                        `${partial.type} == '${path.basename(
                            partial.filename,
                            path.extname(partial.filename)
                        )}'`
                )
                .join(' or ');

            return `
                {%- if ${conditions} -%}
                    <script src="${assetSrc}" defer></script>
                {%- else -%}
                    <link rel="prefetch" href="${assetSrc}" as="script">
                {%- endif -%}
            `;
        })
        .join('');
};

module.exports = renderScriptTagsSnippet;
