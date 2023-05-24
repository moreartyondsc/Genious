const Discord = require("discord.js")
const db = require('quick.db')
const cl = new db.table("Color")
const config = require("../config")
const fs = require('fs')
const moment = require('moment')
const footer = config.app.footer

module.exports = {
    name: 'suggest',
    usage: 'suggest',
    description: `Permet d'afficher le derniers message supprimé sur le serveur`,
    async execute(client, message, args) {

        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color

        let suggest = db.get(`${message.guild.id}.suggestions`)
        if (suggest == null) return message.channel.send(`Les __**suggestions**__ ne sont pas activées sur le serveur`)

        const Suggestion = args.join(" ")

        if (!Suggestion) return message.delete();
        if (!Suggestion) return message.reply("Veuillez indiquer une phrase pour votre suggestion !")

        let laDate = new Date();
        const messagee = message.author;
        const embedSuggestion = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(
                {
                    name: `Suggestion de ${messagee.tag}`,
                    iconURL: messagee.displayAvatarURL({ dynamic: true })
                })

            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `${message.member.displayName}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
            .setDescription(`<:CircleInterrogation:984991835841765386> Suggestion de ${message.author} | <t:${Math.floor(message.createdAt / 1000)}:F>\nSuggestions : \`\`\`${Suggestion}\`\`\``)
            .setTimestamp()

        return message.guild.channels.cache.get(suggest).send({
            embeds: [embedSuggestion]
        }).then(async msg => {
            msg.react('✅')
            msg.react('❌')
            try { await message.delete() } catch (err) { }
        })
    }
}