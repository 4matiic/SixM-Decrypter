const path = require('path');
const colors = require('colors');
const fs = require('fs');

module.exports = async (client) => {
    try {
        const files = fs.readdirSync('./src/events');
        console.log(colors.red('=== Events ==='));
        files
            .filter((file) => file.endsWith('.js'))
            .forEach((fileName) => {
                const eventName = fileName.slice(0, -3);
                const eventHandler = require(path.join(__dirname, '../events', eventName));
                client.on(eventName, eventHandler.bind(null, client));
                console.log(
                    colors.green('-> ') +
                    ' ' +
                    colors.gray(`Event ${colors.cyan(eventName)} activé avec succès !`)
                );
            });
    } catch (error) {
        console.error(error);
    }
};
