module.exports = {
    name: "invite",
    run: async (client, message, args) => {
        
        message.reply(`
        **Comment utiliser le système de parrainage :**

1. **Obtenir un code de parrainage :**
   - Utilisez la commande \`.code\` pour générer votre propre code de parrainage unique. Ce code vous permet de parrainer d'autres utilisateurs.
   
2. **Définir un code personnalisé :**
   - Après avoir obtenu votre code par défaut, vous pouvez personnaliser votre code en utilisant la commande \`.setcode <votre_code_personnalisé>\`. Assurez-vous que le code que vous choisissez n'est pas déjà pris par quelqu'un d'autre.

3. **Utiliser un code de parrainage :**
   - Pour utiliser un code de parrainage d'un autre utilisateur, il suffit d'utiliser la commande \`.redeem <code>\`. Vous recevrez 1 crédit pour avoir utilisé un code valide, et la personne qui vous a parrainé recevra 3 crédits.
   
4. **Que se passe-t-il quand vous utilisez un code ?**
   - Lorsqu'un utilisateur utilise votre code de parrainage, il reçoit 1 crédit et vous obtenez 3 crédits en retour.
   - Un utilisateur ne peut utiliser un code qu'une seule fois. Une fois qu'il a utilisé un code, il ne peut plus en utiliser d'autres.

5. **Vérification de votre code :**
   - Pour voir votre code de parrainage actuel, utilisez la commande \`.code\`.
   - Pour personnaliser votre code après l'avoir généré, utilisez \`.setcode <nouveau_code>\`.

Si vous avez d'autres questions, n'hésitez pas à demander !
        `);
    }
};
