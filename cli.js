const consola = require('consola');
const yargs = require('yargs');
const build = require('./commands/build');
const deploy = require('./commands/deploy');
const watch = require('./commands/watch');

const { argv } = yargs;

const commands = { build, deploy, watch };

const {
    _: { 0: command },
    ...args
} = argv;

(() => {
    const noCommandFoundMessage = `Please try running one of the following commands: ${Object.keys(
        commands
    ).join(', ')}.`;

    if (typeof command === 'undefined') {
        consola.error(
            new Error(`No command provided. ${noCommandFoundMessage}`)
        );
        return;
    }

    if (!commands[command]) {
        consola.error(
            new Error(
                `Command "${command}" not found. ${noCommandFoundMessage}`
            )
        );
        return;
    }

    try {
        commands[command](args);
    } catch (error) {
        consola.error(error);
    }
})();
