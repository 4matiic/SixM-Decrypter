const fs = require('fs');
const path = require('path');
const config = require("../../config.json");

const creditsFile = path.join(__dirname, '../../credits.json');
const referralFile = path.join(__dirname, '../../referrals.json');
const redeemedFile = path.join(__dirname, '../../redeemed.json');


function addCredits(userId, amount) {
    const credits = JSON.parse(fs.readFileSync(creditsFile));
    credits[userId] = (credits[userId] || 0) + amount;
    fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
}


function getReferralCode(userId) {
    const referrals = JSON.parse(fs.readFileSync(referralFile));
    return referrals[userId];
}


function hasRedeemed(userId) {
    const redeemed = JSON.parse(fs.readFileSync(redeemedFile));
    return redeemed[userId] !== undefined;
}

function markAsRedeemed(userId) {
    const redeemed = JSON.parse(fs.readFileSync(redeemedFile));
    redeemed[userId] = true;
    fs.writeFileSync(redeemedFile, JSON.stringify(redeemed, null, 2));
}

module.exports = {
    name: "redeem",
    run: async (client, message, args) => {
        const refCode = args[0];

        if (hasRedeemed(message.author.id)) {
            message.reply("Vous avez déjà utilisé un code de parrainage.");
            return;
        }

        const referrals = JSON.parse(fs.readFileSync(referralFile));
        const userWithCode = Object.keys(referrals).find(userId => referrals[userId] === refCode);

        if (!userWithCode) {
            message.reply("Code de parrainage invalide.");
            return;
        }

        if (userWithCode === message.author.id) {
            message.reply("Vous ne pouvez pas utiliser votre propre code de parrainage.");
            return;
        }

        addCredits(message.author.id, 1);
        addCredits(userWithCode, 3);

        markAsRedeemed(message.author.id);

        message.reply(`Vous avez utilisé le code de parrainage de <@${userWithCode}> et gagné 1 crédit. <@${userWithCode}> a gagné 3 crédits.`);
    }
};
