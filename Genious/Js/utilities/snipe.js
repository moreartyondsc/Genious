const Discord = require("discord.js")
const db = require('quick.db')
const cl = new db.table("Color")
const config = require("../config")
const fs = require('fs')
const moment = require('moment')
const footer = config.app.footer

module.exports = {
    name: 'snipe',
    usage: 'snipe',
    description: `Permet d'afficher le derniers message supprimé sur le serveur`,
    async execute(client, message, args) {

        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color


        const msg = client.snipes.get(message.channel.id)
        if (!msg) return message.channel.send("Aucun message n'a été supprimer récemment !")
        const embed = new Discord.MessageEmbed()
            .setDescription(`**${msg.author.tag}** \`\`\`${msg.content}\`\`\``)
            .setColor(color)
            .setFooter({ text: `${footer}` })
        if (msg.image) embed.setImage(msg.image)

        message.channel.send({ embeds: [embed] })
    }
}