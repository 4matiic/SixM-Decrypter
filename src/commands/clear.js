const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const config = require("../../config.json");

module.exports = {
    name: "clear",
    run: async (client, message, args) => {
        if (!message.member.roles.cache.has(config.role.owner)) {
            message.reply("Vous n'avez pas les permissions pour supprimer des messages.");
            return;
        }
        
        const amount = parseInt(args[0], 10);
        if (isNaN(amount) || amount <= 0 || amount > 100) {
            message.reply("Veuillez spécifier un nombre valide de messages à supprimer (entre 1 et 100).");
            return;
        }

        try {
            await message.channel.bulkDelete(amount, true);
            message.reply(`${amount} message(s) supprimé(s) avec succès.`);
        } catch (err) {
            console.error(err);
            message.reply("Une erreur est survenue lors de la suppression des messages.");
        }
    }
};
