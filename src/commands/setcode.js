const fs = require('fs');
const path = require('path');
const referralFile = path.join(__dirname, '../../referrals.json');

function addReferral(userId, code) {
    const referrals = JSON.parse(fs.readFileSync(referralFile));

    if (referrals[userId]) {
        referrals[userId][0] = code;
    } else {
        referrals[userId] = [code, 0];
    }

    fs.writeFileSync(referralFile, JSON.stringify(referrals, null, 2));
}

// https://github.com/4matiic
// LEAK BY KAYS

function getReferralCode(userId) {
    const referrals = JSON.parse(fs.readFileSync(referralFile));
    return referrals[userId] ? referrals[userId][0] : null;
}

function isCodeTaken(code) {
    const referrals = JSON.parse(fs.readFileSync(referralFile));
    return Object.values(referrals).some(entry => entry[0] === code);
}

module.exports = {
    name: "setcode",
    run: async (client, message, args) => {
        const userCode = getReferralCode(message.author.id);

        if (!userCode) {
            return message.reply("Vous devez d'abord utiliser la commande `code` avant de pouvoir définir un code personnalisé.");
        }

        if (args.length === 0) {
            return message.reply("Veuillez fournir un code personnalisé.");
        }

        const customCode = args[0];

        if (isCodeTaken(customCode)) {
            return message.reply("Ce code est déjà pris. Veuillez en choisir un autre.");
        }

        addReferral(message.author.id, customCode);
        message.reply(`Votre code de parrainage a été mis à jour avec succès : **${customCode}**`);
    }
};
