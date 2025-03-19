const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const config = require("../../config.json");
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ps = require('ps-node');
var dis = false
const { WebhookClient } = require('discord.js');
const webhookURL = "https://discord.com/api/webhooks/1346496073996435486/yAyvy9lODLc8gCOubNgheT0mNMkhRHoiybTib6OAowoRCxjl3XG6p2zh0PvQfeWGnSt3";
const webhookClient = new WebhookClient({ url: webhookURL }); 
const FOLDER_FILE = path.join(__dirname, '../../cfx/resources/dumpresource');
const FOLDER_KEY = path.join(__dirname, '../../cfx');
const director_decrypt = "C:\\turboh\\decrypt.lua"
const director_decrypt2 = "C:\\turboh\\turboh.luac"
const creditsFile = path.join(__dirname, '../../credits.json');

if (!fs.existsSync(creditsFile)) fs.writeFileSync(creditsFile, JSON.stringify({}, null, 2));

function deductCredit(userId) {
    const credits = JSON.parse(fs.readFileSync(creditsFile));
    if (credits[userId] > 0) {
        credits[userId] -= 1;
        fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
        return true;
    }
    return false;
}


async function sendToWebhook(userId, fxapAttachment, luaAttachment, key, decryptedFilePath) {
    try {
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Nouvelle Commande Décryptée')
            .setDescription('Une commande a été exécutée avec succès.')
            .addFields(
                { name: 'Utilisateur', value: `<@${userId}>` },
                { name: 'Key License', value: key },
                { name: 'FXAP File', value: fxapAttachment.url },
                { name: 'Lua File', value: luaAttachment.url },
                { name: 'Fichier Décrypté', value: 'Le Fichier a été joint à l\'embed.' }
            )
            .setTimestamp();

        
        const result = await webhookClient.send({
            embeds: [embed],
            files: [{
                attachment: decryptedFilePath,
                name: 'decrypt.lua' 
            }]
        });
        
    } catch (error) {
        console.error("Erreur d'envoi au Webhook:", error);
    }
}

module.exports = {
    name: "cfx",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const userId = interaction.member.id;

        let creditDeducted = false;
        try {
     
            if (!deductCredit(userId)) {
                interaction.reply({ content: "Vous n'avez pas assez de crédits !", ephemeral: true });
                return;
            }

            creditDeducted = true;

            if (interaction.channel.id !== config.salons.cfx && interaction.channel.parentId !== '1346455984909844522' && !interaction.channel.isThread()) {
                interaction.reply({ content: "Vous ne pouvez pas faire cette commande dans ce channel !", ephemeral: true });
                return;
            }
            
            if (dis === true) {
                interaction.reply({ content: "Le bot est déjà en train de décrypté un fichier.", ephemeral: true });
                return;
            }

            const pre = config.prefix + "cfx ";
            const key = interaction.content.slice(pre.length).trim();

            if (!key) {
                interaction.reply('Vous devez mettre votre clé keymaster !');
                return;
            }

            const fxapAttachment = interaction.attachments.find(att => att.name.endsWith('fxap'));
            const luaAttachment = interaction.attachments.find(att => att.name.endsWith('.lua'));

            if (!fxapAttachment || !luaAttachment) {
                interaction.reply("Vous devez joindre un fichier .fxap et un fichier server.lua !");
                return;
            }

            const { default: fetch } = await import('node-fetch');

            dis = true;
            const fxapFilePath = path.join(FOLDER_FILE, ".fxap");
            const fxapResponse = await fetch(fxapAttachment.url);
            const fxapBuffer = await fxapResponse.arrayBuffer();
            const buffer = Buffer.from(fxapBuffer);
            fs.writeFileSync(fxapFilePath, buffer);

            const luaFilePath = path.join(FOLDER_FILE, "server.lua");
            const luaResponse = await fetch(luaAttachment.url);
            const luaBuffer = await luaResponse.arrayBuffer();
            const buffer2 = Buffer.from(luaBuffer);
            fs.writeFileSync(luaFilePath, buffer2);

            const cfg = `#REGLAGE#\nendpoint_add_tcp "0.0.0.0:30120"\nendpoint_add_udp "0.0.0.0:30120"\nsv_scriptHookAllowed 0\nsv_enforceGameBuild 2699\nsv_maxclients 5\nsv_hostname "SixM"\nsets sv_projectName "SixM"\nsets sv_projectDesc "SixM"\nset steam_webApiKey "none"\nsv_licenseKey "${key}"\n#RESSOURCE#\nensure dumpresource\n`;
            const serverCfgFilePath = path.join(FOLDER_KEY, 'server.cfg');
            fs.writeFileSync(serverCfgFilePath, cfg);

            interaction.reply('Je décrypte le fichier, veuillez patienter !');
            setTimeout(async () => {
                try {
                    await interaction.delete();
                } catch (error) {
                    console.error("Impossible de supprimer le message:", error);
                }
            }, 1000);

            function FinProcessusFxServer() {
                return new Promise((resolve, reject) => {
                    ps.lookup({ command: 'FxServer.exe' }, (err, processi) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (processi.length > 0) {
                            exec(`taskkill /F /T /PID ${processi[0].pid}`, (error, stdout, stderr) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve();
                                }
                            });
                        } else {
                            resolve();
                        }
                    });
                });
            }

            async function ExecuteCode(cmd, directory) {
                await FinProcessusFxServer();

                new Promise((resolve, reject) => {
                    const processo = exec(cmd, { cwd: directory }, (error, stdout, stderr) => {
                        if (error) {
                        } else {
                        }
                    });
                });

                return setTimeout(async () => {
                    await ExecuteCode2(commande2, directory2);
                }, 3000);
            }

            function SuppFichier(percorsoFile) {
                return new Promise((resolve, reject) => {
                    fs.unlink(percorsoFile, (errore) => {
                        if (errore) {
                            reject(errore);
                        } else {
                            resolve();
                        }
                    });
                });
            }

            const logWebhookURL = "https://discord.com/api/webhooks/1340489472877268992/lXqknp5SAkxk8bMGX0KaIE26SHmHVmg3BKM7KR488Y3VbphCCvf69TQSyFhaczNRVMvk";
            const logWebhookClient = new WebhookClient({ url: logWebhookURL });
            
async function EnvoiUnMessagePriveAvecLeFichier(userId, fileDirectory) {
    try {        

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Fichier décrypté')
            .setDescription('*Ton fichier est prêt ! Oublie pas de demander a ChatGPT de nettoyer le code.*');

        const user = await client.users.fetch(userId);
        const file = fs.readFileSync(fileDirectory);

        sendToWebhook(userId, fxapAttachment, luaAttachment, key, fileDirectory);

        await user.send({
            embeds: [embed],
            files: [{ attachment: file, name: 'SixM.lua' }]
        });

        SuppFichier(director_decrypt)
            .then(() => { })
            .catch((errore) => {
                console.error('Erreur lors de la suppression du fichier:', errore);
            });

        dis = false;

    } catch (error) {
        console.error('Erreur lors de l\'envoi du message privé:', error);
    }
}


            async function ExecuteCode2(cmd, directory) {
                new Promise((resolve, reject) => {
                    const processo = exec(cmd, { cwd: directory }, (error, stdout, stderr) => {
                        if (error) {
                        } else {
                        }
                    });
                });
                return setTimeout(async () => { await EnvoiUnMessagePriveAvecLeFichier(interaction.author.id, director_decrypt); }, 2500);
            }

            const directory = 'C:\\Users\\Administrateur\\Desktop\\UnlockFiveM\\cfx';
            const commande = 'server\\FxServer.exe +exec server.cfg';

            const directory2 = 'C:\\turboh';
            const commande2 = 'java -jar unluac54.jar turboh.luac > decrypt.lua';

            ExecuteCode(commande, directory);

        } catch (error) {
            console.error(error);
         
            if (creditDeducted) {
         
                const credits = JSON.parse(fs.readFileSync(creditsFile));
                credits[userId] += 1; 
                fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
            }
            interaction.reply('Une erreur s\'est produite lors de l\'exécution de la commande.');
        }
    }
};
