const Discord = require("discord.js");
const config = require("../../config.json");
const fs = require('fs');
const path = require('path');

const creditsFile = path.join(__dirname, '../../credits.json');


function resetCredits(userId) {
    const credits = JSON.parse(fs.readFileSync(creditsFile));
    if (credits[userId]) {
        credits[userId] = 0; 
        fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
        return true;
    }
    return false;
}

module.exports = {
    name: "resetcr",
    run: async (client, message, args) => {
      
        if (!message.member.roles.cache.has(config.role.owner)) {
            message.reply("Vous n'avez pas les permissions pour réinitialiser les crédits.");
            return;
        }

        
        const user = message.mentions.users.first();
        if (!user) {
            message.reply("Veuillez mentionner un utilisateur pour réinitialiser ses crédits.");
            return;
        }

        
        const success = resetCredits(user.id);
        if (success) {
            message.reply(`Les crédits de ${user.username} ont été réinitialisés à 0.`);
        } else {
            message.reply(`${user.username} n'a pas de crédits à réinitialiser.`);
        }
    }
};
