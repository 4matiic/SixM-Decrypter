const config = require('../../config.json');
const { ChannelType } = require('discord.js');

const categoryId = '1339627119877296148';
const inactiveChannels = {};

module.exports = async (client, message) => {
    if (message.author.bot) return;

    if (message.channel.parentId === categoryId) {
        inactiveChannels[message.channel.id] = Date.now();
    }

    if (!message.content.toLowerCase().startsWith(config.prefix)) return;
    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

    const args = message.content
        .trim().slice(config.prefix.length)
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`../commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        console.log(err);
    }
};

setInterval(() => {
    const now = Date.now();
    for (const channelId in inactiveChannels) {
        const lastActive = inactiveChannels[channelId];
        const channel = client.channels.cache.get(channelId);

        if (channel && now - lastActive >= 3600000) {
            if (channel.type === ChannelType.GuildText) {
                channel.delete()
                    .then(() => {
                        console.log(`Le canal ${channel.name} a été supprimé pour inactivité.`);
                        delete inactiveChannels[channelId];
                    })
                    .catch(console.error);
            }
        }
    }
}, 3600000);
