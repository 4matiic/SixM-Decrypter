const fs = require('fs');
const path = require('path');
const referralFile = path.join(__dirname, '../../referrals.json');


function addReferral(userId, code) {
    const referrals = JSON.parse(fs.readFileSync(referralFile));
    referrals[userId] = code;  
    fs.writeFileSync(referralFile, JSON.stringify(referrals, null, 2));
}


function getReferralCode(userId) {
    const referrals = JSON.parse(fs.readFileSync(referralFile));
    return referrals[userId];
}

module.exports = {
    name: "code",
    run: async (client, message, args) => {
        const userCode = getReferralCode(message.author.id);

        if (!userCode) {
          
            const newCode = `code-${message.author.id}`;
            addReferral(message.author.id, newCode);
            message.reply(`Votre code de parrainage est : **${newCode}**`);
        } else {
            message.reply(`Votre code de parrainage est : **${userCode}**`);
        }
    }
};
