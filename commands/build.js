const Builder = require('../packages/Builder');

const build = async () => new Builder().start('run');

module.exports = build;
