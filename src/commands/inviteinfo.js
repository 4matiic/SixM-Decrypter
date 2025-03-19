const fs = require('fs');
const path = require('path');
const referralFile = path.join(__dirname, '../../referrals.json');
const redeemedFile = path.join(__dirname, '../../redeemed.json');
const creditsFile = path.join(__dirname, '../../credits.json');


function getReferralCode(userId) {
    const referrals = JSON.parse(fs.readFileSync(referralFile));
    return referrals[userId];
}


function getUsersByReferralCode(refCode) {
    const referrals = JSON.parse(fs.readFileSync(referralFile));
    return Object.keys(referrals).filter(userId => referrals[userId] === refCode);
}


function getNumberOfInvitations(userId) {
    const referrals = JSON.parse(fs.readFileSync(referralFile));
    return Object.values(referrals).filter(code => code === getReferralCode(userId)).length;
}


function hasRedeemed(userId) {
    const redeemed = JSON.parse(fs.readFileSync(redeemedFile));
    return redeemed[userId] !== undefined;
}

module.exports = {
    name: "inviteinfo",
    run: async (client, message, args) => {
        const targetUser = message.mentions.users.first() || message.author;  


        const referralCode = getReferralCode(targetUser.id);

        if (!referralCode) {
            message.reply("Cet utilisateur n'a pas de code de parrainage.");
            return;
        }

       
        const usersRedeemed = getUsersByReferralCode(referralCode);
        const numberOfInvites = usersRedeemed.length;


        const redeemedList = usersRedeemed.map(userId => `<@${userId}>`).join(', ') || "Aucun utilisateur n'a utilisé ce code.";

        message.reply(`L'utilisateur <@${targetUser.id}> a invité **${numberOfInvites}** personne(s). Voici la liste des utilisateurs ayant utilisé son code : ${redeemedList}`);
    }
};
