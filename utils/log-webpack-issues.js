const consola = require('consola');

/** @typedef {import('webpack').Stats} Stats */

/**
 * @param {Error} error
 * @param {Stats} result
 */
const logWebpackIssues = (error, result) => {
    if (error) {
        consola.error(new Error(error));
    }

    const info = result.toJson();

    if (result.hasErrors()) {
        info.errors.forEach(compilationError =>
            consola.error(compilationError)
        );
    }

    if (result.hasWarnings()) {
        info.warnings.forEach(compilationWarning =>
            consola.warn(compilationWarning)
        );
    }
};

module.exports = logWebpackIssues;
