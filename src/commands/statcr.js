const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');
const fs = require('fs');
const path = require('path');

const creditsFile = path.join(__dirname, '../../credits.json');


function getCreditsStats() {
    const credits = JSON.parse(fs.readFileSync(creditsFile));

    let totalCredits = 0;
    let highestCredits = 0;
    let highestUser = '';
    let userCount = Object.keys(credits).length;

    
    Object.entries(credits).forEach(([userId, userCredits]) => {
        totalCredits += userCredits;
        if (userCredits > highestCredits) {
            highestCredits = userCredits;
            highestUser = userId;
        }
    });

    return { totalCredits, highestCredits, highestUser, userCount };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('statcr')
        .setDescription('Voir les statistiques des crédits du serveur'),
    async execute(interaction) {
       
        if (!interaction.member.roles.cache.has(config.role.owner) && !interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply("Vous n'avez pas les permissions pour voir les statistiques.");
        }

        
        const stats = getCreditsStats();
        const highestUser = interaction.client.users.cache.get(stats.highestUser);

        
        const embed = new Discord.EmbedBuilder()
            .setTitle("Statistiques des Crédits")
            .setColor("#00FF00")
            .addFields(
                { name: "Total des crédits", value: `${stats.totalCredits} crédits`, inline: false },
                { name: "Nombre d'utilisateurs", value: `${stats.userCount}`, inline: false },
                { name: "Utilisateur avec le plus de crédits", value: `${highestUser ? highestUser.username : "Inconnu"} (${stats.highestCredits} crédits)`, inline: false }
            )
            .setTimestamp();

       
        return interaction.reply({ embeds: [embed] });
    }
};
