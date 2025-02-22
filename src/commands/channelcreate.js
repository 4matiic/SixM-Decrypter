const { EmbedBuilder, ChannelType } = require('discord.js'); 
const { ApplicationCommandType } = require('discord.js');

module.exports = {
    name: "channelcreate",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        try {
            const parentChannelId = "1339293683584995348"; // salon des fils
            const adminRoleId = "1340507179546837065"; // role acces au fils

            const parentChannel = interaction.guild.channels.cache.get(parentChannelId);
            if (!parentChannel) {
                return interaction.reply({ content: "Le salon parent n'a pas été trouvé.", ephemeral: true });
            }
            
            if (parentChannel.type !== ChannelType.GuildText) {
                return interaction.reply({ content: "Le salon parent doit être un salon textuel.", ephemeral: true });
            }

            const user = interaction.member;

            const existingThread = parentChannel.threads.cache.find(thread => 
                thread.name === `channel-${user.user.username}`
            );
            if (existingThread) {
                const embed = new EmbedBuilder()
                    .setColor("#ffcc00")
                    .setTitle("🚫 Thread déjà existant")
                    .setDescription("Vous avez déjà un thread privé. Un seul thread privé est autorisé.")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter({ text: "Developped by Kays / Zeu" })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const welcomeMessage = "Bienvenue dans votre thread privé ! Vous êtes le seul, à part les admins, à pouvoir y accéder. Si vous avez des questions, n'hésitez pas à nous contacter.";

            const thread = await parentChannel.threads.create({
                name: `channel-${user.user.username}`,
                autoArchiveDuration: 1440, 
                type: ChannelType.PrivateThread,
                reason: `Thread privé pour ${user.user.username}`
            });

            await thread.members.add(user.id);

            const adminRole = interaction.guild.roles.cache.get(adminRoleId);
            if (adminRole) {
                adminRole.members.forEach(async member => {
                    try {
                        await thread.members.add(member.id);
                    } catch (err) {
                        console.error(`Erreur lors de l'ajout de ${member.user.username} au thread`, err);
                    }
                });
            }

            await thread.send(welcomeMessage);

            const embed = new EmbedBuilder()
                .setColor("#ffcc00")
                .setTitle("🎟️ Thread Privé Créé")
                .setDescription(`Un thread privé a été créé pour vous : <#${thread.id}>.\nSeul vous et les admins y avez accès.`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: "Developped by SixM" })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur lors de la création du thread :", error);
            await interaction.reply({ content: "Une erreur est survenue lors de la création du thread. ❌", ephemeral: true });
        }
    }
};