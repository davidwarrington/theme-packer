module.exports = ({ mode }) => {
    const plugins = ['autoprefixer'];
    if (mode === 'production') {
        plugins.push('cssnano');
    }

    return { plugins };
};
