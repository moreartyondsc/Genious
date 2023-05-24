const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js')
const db = require('quick.db')
const config = require("../config")
const owner = new db.table("Owner")
const embedlog = new db.table("embedlog")
const cl = new db.table("Color")
const footer = config.app.footer


module.exports = {
    name: 'embedlog',
    usage: 'embedlog <id>',
    description: `Permet de changer le salon des logs.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color

            const newChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0] || message.channelId);
            if (args[0] == undefined) args[0] = `<#${message.channel.id}>`
            if (!newChannel) return message.channel.send({ content: "Aucun salon trouvé !" })
            if (embedlog.get(`${message.guild.id}.embedlog`) === newChannel) return message.channel.send(`<:salon:963584554621345793>・__Nouveau salon des logs embeds :__ \`${embedlog.get(`${message.guild.id}.embedlog`)}\``)
            else {
                embedlog.set(`${message.guild.id}.embedlog`, newChannel.id)
                message.channel.send(`<:salon:963584554621345793>・__Nouveau salon des logs embeds :__ ${args[0]}`)

                const logs = embedlog.get(`${message.guild.id}.embedlog`)

                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`${message.author.tag} à défini ce salon commme salon des logs embeds`)
                    .setDescription(`<:salon:963584554621345793> Ce salon est désormais utilisé pour __toutes__ les **logs embeds** du serveur\n Executeur : <@${message.author.id}>`)
                    .setTimestamp()
                    .setFooter({ text: `${footer}` })
                client.channels.cache.get(logs).send({ embeds: [embed] }).catch(console.error)
            }
        }
    }
}