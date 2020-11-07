const path = require('path');
const getEntrypoints = require('./utils/get-entrypoints');

module.exports = () => {
    return {
        entry: getEntrypoints(),
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist', 'assets'),
        },
        mode: 'development',
    }
};