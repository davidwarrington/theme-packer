/** @param {string} string */
const convertSnakeToCamelCase = string =>
    string.replace(/_[a-z]/g, group => group.toUpperCase().replace('_', ''));

module.exports = convertSnakeToCamelCase;
