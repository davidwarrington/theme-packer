const fs = require('fs');
const path = require('path');

/** @returns {object} */
const getUserConfig = () => {
    const configPath = path.resolve(process.cwd(), 'theme-packer.config.js');

    if (fs.existsSync(configPath)) {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        return require(configPath);
    }

    return {};
};

module.exports = getUserConfig;
