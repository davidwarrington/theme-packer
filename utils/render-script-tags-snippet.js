const path = require('path');

const entryNameDelimiter = '@';
const entryPartsDelimiter = '.';

/** @typedef {{[key: string]: string}} Entrypoints */

/**
 * @param {string} type
 * @param {string[]} otherFileNameParts
 */
const getEntrypointKey = (type, otherFileNameParts) => {
    const filename = otherFileNameParts.join(entryPartsDelimiter);

    return `${type}.${path.basename(filename, path.extname(filename))}`;
};

/**
 * @param {string} filename
 * @param {Entrypoints} entrypoints
 */
const getParentDirectory = (filename, entrypoints) => {
    const key = path.basename(filename, path.extname(filename));
    const dirname = path.dirname(entrypoints[key]);

    return path.basename(dirname);
};

/**
 * @param {string} filename
 * @param {Entrypoints} entrypoints
 */
const getPartialsData = (filename, entrypoints) => {
    const fileNameParts = filename
        .split(entryNameDelimiter)
        .filter(part => !part.startsWith('vendor'));
    return fileNameParts.map(partialName => {
        const [type, ...otherFileNameParts] = partialName.split(
            entryPartsDelimiter
        );

        let parentDirectory;
        if (type === 'templates') {
            const parentDirectoryName = getParentDirectory(
                filename,
                entrypoints
            );
            if (parentDirectoryName !== 'templates') {
                parentDirectory = parentDirectoryName;
            }
        }

        return {
            entrypoint: entrypoints[getEntrypointKey(type, otherFileNameParts)],
            filename: otherFileNameParts[0],
            parentDirectory,
            type: type === 'templates' ? 'template' : type,
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
                .map(partial => {
                    let name = partial.filename;
                    if (partial.parentDirectory) {
                        name = `${partial.parentDirectory}/${name}`;
                    }

                    return `${partial.type} == '${name}'`;
                })
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
