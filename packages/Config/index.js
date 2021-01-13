const { paths, server } = require('./defaults');

class Config {
    constructor() {
        this.data = {
            ...paths,
            ...server,
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
