/** @param {{ [key: string]: any }} object */
const removeUndefinedKeys = object => {
    const duplicate = Object.entries({ ...object }).filter(
        ([, value]) => typeof value !== 'undefined'
    );

    return Object.fromEntries(duplicate);
};

module.exports = removeUndefinedKeys;
