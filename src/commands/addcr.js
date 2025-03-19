const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const config = require("../../config.json");
const fs = require('fs');
const path = require('path');

const creditsFile = path.join(__dirname, '../../credits.json');

function addCredits(userId, amount) {
    const credits = JSON.parse(fs.readFileSync(creditsFile));
    credits[userId] = (credits[userId] || 0) + amount;
    fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
}

module.exports = {
    name: "addcr",
    run: async (client, message, args) => {
        if (!message.member.roles.cache.has(config.role.owner)) {
            message.reply("Vous n'avez pas les permissions pour ajouter des crédits.");
            return;
        }
        const user = message.mentions.users.first();
        const amount = parseInt(args[1], 10);
        if (!user || isNaN(amount) || amount <= 0) {
            message.reply("Utilisateur ou montant invalide.");
            return;
        }
        addCredits(user.id, amount);
        message.reply(`${amount} crédits ajoutés à ${user.username}.`);
    }
};
