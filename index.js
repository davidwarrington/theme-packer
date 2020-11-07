const chokidar = require('chokidar');
const Builder = require('./packages/Builder');

const TEMPLATES_DIR = 'src/scripts/templates/';
const builder = new Builder();

(async () => {
    await builder.start('watch');

    chokidar.watch('./src', { ignoreInitial: true }).on('all', async (event, path) => {
        const changeInTemplatesDir = path.startsWith(TEMPLATES_DIR);
        const restartEvent = ['add', 'unlink'].includes(event);
        const builderIsAlreadyRestarting = builder.state === Builder.states.RESTARTING;

        if (
            changeInTemplatesDir &&
            restartEvent &&
            !builderIsAlreadyRestarting
        ) {
            builder.restart('watch');
        }
    });
})();