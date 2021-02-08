const fs = require('fs');

/** @param {string} path Path to directory */
const ensureDirectoryExists = path => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};

module.exports = ensureDirectoryExists;
