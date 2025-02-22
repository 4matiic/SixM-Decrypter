const Discord = require("discord.js");
const config = require("../../config.json");
const fs = require('fs');
const path = require('path');

const creditsFile = path.join(__dirname, '../../credits.json');

function getCredits(userId) {
    const credits = JSON.parse(fs.readFileSync(creditsFile));
    return credits[userId] || 0;
}

module.exports = {
    name: "balancetop",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const creditsData = JSON.parse(fs.readFileSync(creditsFile));
        
         
        const sortedCredits = Object.entries(creditsData)
            .filter(([userId, credits]) => credits <= 1999) 
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); 

        const embed = new Discord.EmbedBuilder()
            .setTitle("Leaderboard")
            .setColor("#ffcc00")
            .setDescription("Voici le top 10 des utilisateurs avec le plus de crédits (hors Lifetime) :")
            .setTimestamp()
            .setFooter({ text: "Developped by Kays / Zeu" });

        if (sortedCredits.length === 0) {
            embed.addFields({
                name: "Aucun utilisateur",
                value: "Il n'y a aucun utilisateur.",
            });
        } else {
            sortedCredits.forEach(([userId, credits]) => {
                const user = client.users.cache.get(userId);
                embed.addFields({
                    name: user ? user.username : userId,
                    value: `${credits} crédit(s)`,
                    inline: true,
                });
            });
        }

        interaction.reply({ embeds: [embed] });
    }
};
