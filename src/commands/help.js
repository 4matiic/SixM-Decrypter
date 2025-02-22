const { ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "help",
    type: ApplicationCommandType.ChatInput,
    description: "Affiche la liste des commandes disponibles",

    run: async (client, interaction) => {
        try {
            const embed = new EmbedBuilder()
                .setColor("#ffcc00")
                .setTitle("📜 Liste des commandes")
                .setDescription("Voici les commandes disponibles sur le bot :")
                .addFields(
                    { name: "Gestion des crédits", "value": "`balance` - Affiche votre solde de crédits.\n`balancetop` - Affiche la liste des utilisateurs ayant le plus de crédits.\n`Lifetime` - Donner un accès à vie.\n`addcr` - Ajouter des crédits.\n`removecr` - Retirer des crédits.\n`resetcr` - Réinitialise les crédits des utilisateurs.\n`statcr` - Affiche les statistiques des crédits.\n`transfercr` - Permet de transférer des crédits à un autre utilisateur.\n`claim` - Réclame des crédits.", inline: false },
                    { name: "Commandes liées au code de parrainage", value: "`code` - Affiche votre code de parrainage.\n`setcode` - Définit votre code de parrainage.", inline: false },
                    { name: "Autres commandes", value: "`cfx` - Commande spécifique pour CFX.\n`channelcreate` - te crée un channel pour toi tous seul.", inline: false },
                    { name: "Aide", value: "`help` - Affiche cette liste des commandes.", inline: false }
                )
                .setFooter({ text: "Developped by Kays / Zeu" })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur lors de l'exécution de la commande help:", error);
            await interaction.reply({ content: "Une erreur est survenue lors de l'affichage des commandes.", ephemeral: true });
        }
    }
};
