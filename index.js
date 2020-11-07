const chokidar = require('chokidar');
const Builder = require('./packages/Builder');

const LAYOUT_DIR = 'src/scripts/layout/';
const TEMPLATES_DIR = 'src/scripts/templates/';
const builder = new Builder();

(async () => {
    await builder.start('watch');

    chokidar.watch('./src', { ignoreInitial: true }).on('all', async (event, path) => {
        const changeInLayoutOrTemplatesDir = [LAYOUT_DIR, TEMPLATES_DIR]
            .some(dirPath => path.startsWith(dirPath));
        const restartEvent = ['add', 'unlink'].includes(event);

        if (changeInLayoutOrTemplatesDir && restartEvent) {
            builder.restart('watch');
        }
    });
})();