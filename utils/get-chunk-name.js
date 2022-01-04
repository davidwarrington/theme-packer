const md5 = require('./md5');

const delimiter = '@';

const getChunkName = (module, chunks, cacheGroup) => {
    let name = chunks
        .map(chunk => chunk.name)
        .sort()
        .join(delimiter);

    if (cacheGroup === 'defaultVendors') {
        name = `vendor${delimiter}${name}`;
    }

    // 247 is the 255 character limit minus 7 (for when 'assets/' is prepended)
    return name.length > 247 ? md5(name) : name;
};

module.exports = getChunkName;
