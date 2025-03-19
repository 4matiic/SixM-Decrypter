const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

const redeemedFile = path.join(__dirname, '../../redeemed.json');
const referralsFile = path.join(__dirname, '../../referrals.json');

module.exports = {
    name: "redeemtop",
    run: async (client, message, args) => {
        try {
            const redeemed = JSON.parse(fs.readFileSync(redeemedFile));
            const referrals = JSON.parse(fs.readFileSync(referralsFile));

            const referralCounts = {};

            for (const userId of Object.keys(redeemed)) {
                const referrer = referrals[userId];
                if (referrer) {
                    const referrerId = referrer[0];

                    if (!referrals[referrerId]) {
                        referrals[referrerId] = [referrerId, 0];
                    }

                    referralCounts[referrerId] = (referralCounts[referrerId] || 0) + 1;

                    referrals[referrerId][1] = referralCounts[referrerId];
                }
            }

            fs.writeFileSync(referralsFile, JSON.stringify(referrals, null, 2));

            const sortedUsers = Object.entries(referralCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

            if (sortedUsers.length === 0) {
                message.reply("Aucun utilisateur n'a encore vu son code de parrainage utilisé.");
                return;
            }

            const leaderboard = await Promise.all(
                sortedUsers.map(async ([userReferrer, count], index) => {
                    try {
                        return `**${index + 1}. ${userReferrer}** - ${count} personnes ont utilisé son code`;
                    } catch (error) {
                        return `**${index + 1}. Utilisateur inconnu** - ${count} personnes ont utilisé son code`;
                    }
                })
            );

            const embed = new EmbedBuilder()
                .setTitle("🏆 Classement des meilleurs parrains 🏆")
                .setColor("#FFD700")
                .setDescription(leaderboard.join("\n"))
                .setFooter({ text: "Merci à tous pour votre participation !" })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur lors de l'affichage du classement :", error);
            await message.reply({ content: "Une erreur est survenue lors de l'affichage du classement. ❌", ephemeral: true });
        }
    }
};
