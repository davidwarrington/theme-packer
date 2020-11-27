const delimiter = '@';

const getChunkName = (module, chunks, cacheGroup) => {
    let name = chunks
        .map(chunk => chunk.name)
        .sort()
        .join(delimiter);

    if (cacheGroup === 'defaultVendors') {
        name = `vendor${delimiter}${name}`;
    }

    return name;
};

module.exports = getChunkName;
