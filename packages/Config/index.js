const { app, paths, server, webpack } = require('./defaults');
const getUserConfig = require('../../utils/get-user-config');

class Config {
    constructor() {
        this.data = {
            ...app,
            ...paths,
            ...server,
            ...webpack,
            ...getUserConfig(),
        };
    }

    /** @param {string} key */
    get(key) {
        const value = this.data[key];

        if (typeof value === 'function') {
            return value(this);
        }

        return value;
    }

    /**
     * @param {string} key
     * @param {any} value
     */
    set(key, value) {
        this.data[key] = value;
    }
}

module.exports = new Config();
