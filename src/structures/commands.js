const colors = require('colors');
const fs = require('fs');

module.exports = async () => {
    try {
        const files = fs.readdirSync('./src/commands');
        console.log(colors.red('=== Commandes ==='));
        files
            .filter((file) => file.endsWith('.js'))
            .forEach((fileName) => {
                const commandName = fileName.slice(0, -3);
                console.log(
                    colors.green('-> ') +
                    ' ' +
                    colors.gray(`Commande ${colors.cyan(commandName)} activée avec succès !`)
                );
            });
    } catch (error) {
        console.error(error);
    }
};
