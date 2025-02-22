const Discord = require("discord.js");
const config = require("../../config.json");
const fs = require('fs');
const path = require('path');

const creditsFile = path.join(__dirname, '../../credits.json');


function transferCredits(senderId, recipientId, amount) {
    const credits = JSON.parse(fs.readFileSync(creditsFile));

    
    if (credits[senderId] < amount) {
        return false; 
    }

    
    credits[senderId] -= amount;

    
    credits[recipientId] = (credits[recipientId] || 0) + amount;

    
    fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
    return true; 
}

module.exports = {
    name: "transfercr",
    run: async (client, message, args) => {
        
        if (!message.member.roles.cache.has(config.role.owner) && !message.member.permissions.has("ADMINISTRATOR")) {
            message.reply("Vous n'avez pas les permissions pour transférer des crédits.");
            return;
        }

       
        const recipient = message.mentions.users.first();
        const amount = parseInt(args[1], 10);

        if (!recipient || isNaN(amount) || amount <= 0) {
            message.reply("Veuillez mentionner un utilisateur et un montant valide.");
            return;
        }

        
        const senderId = message.author.id;

        
        const success = transferCredits(senderId, recipient.id, amount);
        if (success) {
            message.reply(`${amount} crédits ont été transférés de ${message.author.username} à ${recipient.username}.`);
        } else {
            message.reply("Vous n'avez pas assez de crédits pour effectuer cette transaction.");
        }
    }
};
