const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const config = require("../../config.json");
const fs = require('fs');
const path = require('path');

const creditsFile = path.join(__dirname, '../../credits.json');


function removeCredits(userId, amount) {
    const credits = JSON.parse(fs.readFileSync(creditsFile));
    if (credits[userId] && credits[userId] >= amount) {
        credits[userId] -= amount;
    } else {
        return false;
    }
    fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
    return true;
}

module.exports = {
    name: "removecr",
    run: async (client, message, args) => {
 
        if (!message.member.roles.cache.has(config.role.owner)) {
            message.reply("Vous n'avez pas les permissions pour retirer des crédits.");
            return;
        }

       
        const user = message.mentions.users.first();
        const amount = parseInt(args[1], 10);
        if (!user || isNaN(amount) || amount <= 0) {
            message.reply("Utilisateur ou montant invalide.");
            return;
        }


        const success = removeCredits(user.id, amount);
        if (success) {
            message.reply(`${amount} crédits retirés de ${user.username}.`);
        } else {
            message.reply(`${user.username} n'a pas assez de crédits pour effectuer cette opération.`);
        }
    }
};
