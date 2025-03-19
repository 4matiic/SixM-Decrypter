const Discord = require('discord.js'),

    { Client, GatewayIntentBits, ApplicationCommandOptionType, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js'),
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ],
    }),
    config = require('./config.json'),
    commandes = require('./src/structures/commands'),
    events = require('./src/structures/events')
    
commandes()
events(client)

module.exports = client
client.on('interactionCreate', (interaction) => {
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return interaction.reply('Error');
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        command.run(client, interaction);
    }
});

process.on('beforeExit', (code) => { //
  // console.error('[antiCrash] :: [beforeExit]');
  // console.error(code);
});
process.on('exit', (error) => { //
  // console.error('[antiCrash] :: [exit]');
  // console.error(error);
});
process.on('multipleResolves', (type, promise, reason) => {
  // console.error('[antiCrash] :: [multipleResolves]');
  // console.error(type, promise, reason);
});
process.on('unhandledRejection', (reason, promise) => {
  // console.error('[antiCrash] :: [unhandledRejection]');
  // console.error(promise, reason);
});
process.on('rejectionHandled', (promise) => { //
  // console.error('[antiCrash] :: [rejectionHandled]');
  // console.error(promise);
})
process.on("uncaughtException", (err, origin) => {
  // console.error('[antiCrash] :: [uncaughtException]');
  // console.error(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  // console.error('[antiCrash] :: [uncaughtExceptionMonitor]');
  // console.error(err, origin);
});
process.on('warning', (warning) => { //
  // console.error('[antiCrash] :: [warning]');
  // console.error(warning);
});

client.login(config.token)