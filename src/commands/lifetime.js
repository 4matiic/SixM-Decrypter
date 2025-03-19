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
    name: "lifetime",
    run: async (client, message, args) => {
        if (!message.member.roles.cache.has(config.role.owner)) {
            message.reply("Vous n'avez pas les permissions pour attribuer des crédits Lifetime.");
            return;
        }
        const user = message.mentions.users.first();
        if (!user) {
            message.reply("Veuillez mentionner un utilisateur.");
            return;
        }
        const amount = 4000;
        addCredits(user.id, amount);
        message.reply(`Lifetime ont été ajoutés à ${user.username}.`);
    }
};
