const yargs = require('yargs');
const build = require('./commands/build');
const deploy = require('./commands/deploy');
const watch = require('./commands/watch');

(() => {
    return yargs
        .command('build', 'Build theme from source.', {}, build)
        .command(
            'deploy [env]',
            'Build theme and deploy to given environments.',
            {},
            deploy
        )
        .command(
            'watch [env]',
            'Watch source files for theme updates.',
            {},
            watch
        ).argv;
})();
