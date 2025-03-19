const { ApplicationCommandType, EmbedBuilder } = require("discord.js"); 
const fs = require('fs');
const path = require('path');

const creditsFile = path.join(__dirname, '../../credits.json');

function getCredits(userId) {
    try {
        const credits = JSON.parse(fs.readFileSync(creditsFile, 'utf8'));
        return credits[userId] || 0;
    } catch (error) {
        return 0;
    }
}

module.exports = {
    name: "balance",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        try {
            const balance = getCredits(interaction.member.id);
            
         
            const balanceText = balance > 1999 ? "Lifetime" : `${balance} crédit(s)`;

            const embed = new EmbedBuilder()
                .setColor("#ffcc00")
                .setTitle("💰 Solde")
                .setDescription(`Vous avez **${balanceText}**.`)
                .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: "Developped by Kays / Zeu" })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'embed :", error);
            await interaction.reply({ content: "Une erreur est survenue. ❌", ephemeral: true });
        }
    }
};
