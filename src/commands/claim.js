const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const config = require("../../config.json");
const fs = require('fs');
const path = require('path');

const creditsFile = path.join(__dirname, '../../credits.json');
const dailyFile = path.join(__dirname, '../../daily.json');

function addCredits(userId, amount) {
    const credits = JSON.parse(fs.readFileSync(creditsFile));
    credits[userId] = (credits[userId] || 0) + amount;
    fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
}

function canClaimDaily(userId) {
    const dailyData = JSON.parse(fs.readFileSync(dailyFile));
    const currentDate = new Date().toISOString().split('T')[0];

   
    if (dailyData[userId] === currentDate) {
        return false;
    }

  
    dailyData[userId] = currentDate;
    fs.writeFileSync(dailyFile, JSON.stringify(dailyData, null, 2));

    return true;
}
module.exports = {
    name: "claim",
    run: async (client, message, args) => {
        const user = message.author;

        const credits = JSON.parse(fs.readFileSync(creditsFile)); 
        const balance = credits[user.id] || 0; 

        if (balance >= 1999) {
            
            const embed = new EmbedBuilder()
                .setColor("#ffcc00")
                .setTitle("💎 Vous avez déjà le Lifetime !")
                .setDescription("Vous avez tout ce qu'il vous faut, vous voulez quoi de + ?")
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: "Developped by SixM" })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } else if (canClaimDaily(user.id)) {
            addCredits(user.id, 2);
           
            const embed = new EmbedBuilder()
                .setColor("#ffcc00")
                .setTitle("💰 Crédit Quotidien")
                .setDescription(`Vous avez reçu **2 crédits** !\nVous avez maintenant **${balance + 2} crédits** en tout.`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: "Developped by SixM" })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } else {
           
            const embed = new EmbedBuilder()
                .setColor("#ffcc00")
                .setTitle("🚫 Réclamation de Crédit")
                .setDescription("Vous avez déjà réclamé vos crédits aujourd'hui. Revenez demain pour en obtenir de nouveaux.")
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: "Developped by SixM" })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        }
    }
};
