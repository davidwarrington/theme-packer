const path = require('path');

const getJSEntries = entrypoints =>
    Object.values(entrypoints).reduce((array, entry) => {
        const jsEntries = (Array.isArray(entry) ? entry : [entry])
            .filter(entrypoint => entrypoint.endsWith('.js'))
            .map(entrypoint => path.resolve(process.cwd(), entrypoint));

        return [...array, ...jsEntries];
    }, []);

function hmrLoader(source) {
    const entrypoints = getJSEntries(this.getOptions().entrypoints);

    // eslint-disable-next-line no-underscore-dangle
    if (!entrypoints.includes(this._module.resource)) {
        return source;
    }

    // Ensure module has code for HMR updates.
    const hmrContent = `
        if (module.hot) {
            module.hot.accept();

            // Reload the page if it's not the first load.
            if (module.hot.data) {
                window.location.reload();
            }
        }
    `;

    return `${source}\n\n${hmrContent}`;
}

module.exports = hmrLoader;
