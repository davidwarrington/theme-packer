#!/usr/bin/env node

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
            y => {
                y.option('allenvs', { alias: 'a' })
                    .option('allow-live')
                    .option('nodelete', { alias: 'n' });
            },
            deploy
        )
        .command(
            'watch [env]',
            'Watch source files for theme updates.',
            y => {
                y.option('allenvs', { alias: 'a' })
                    .option('allow-live')
                    .option('notify', { alias: 'n' });
            },
            watch
        ).argv;
})();
