const Discord = require("discord.js")
const config = require("../config")
const db = require('quick.db')
const p = new db.table("Prefix")
const cl = new db.table("Color")
const footer = config.app.footer

module.exports = {
    name: 'helpmsg',
    usage: 'helpmsg',
    category: "utils",
    description: `Permet d'afficher l'help.`,
    async execute(client, message, args) {

        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color

        const embed = new Discord.MessageEmbed()
            .setTitle(`Arguments de messages`)
            .setDescription(`Exemple de message simple: \`{MemberMention} nous a rejoint,  nous sommes maintenant {MemberCount} sur {Server}\``)
            .addFields(
                { name: '{MemberName}', value: 'Le nom du membre concerné\n`Exemple: Funny`', inline: true },
                { name: '{MemberMention}', value: `Mentionne le membre concerné\n\`Exemple:\` <@${message.author.id}>`, inline: true },
                { name: '{MemberTag}', value: 'Le nom et le # du membre concerné\n`Exemple: Funny#0666`', inline: true },
            )

        message.channel.send({ embeds: [embed] })
    }
}