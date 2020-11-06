const path = require('path');

module.exports = {
    entry: './src/layout/index',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
};