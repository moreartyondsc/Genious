const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js')
const db = require('quick.db')
const config = require("../config")
const owner = new db.table("Owner")
const cl = new db.table("Color")
const footer = config.app.footer


module.exports = {
    name: 'clean',
    usage: 'clean',
    description: `Permet de clean un vocal.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color

            let channel = message.member.voice.channel;
            for (let member of channel.members) {
                member[1].voice.setChannel(null)
            }
            message.channel.send("Succès, ce vocal a été **clean**")

            let channellogs = db.get(`${message.guild.id}.modlog`)
            if (channellogs == null) return

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a \`clean\` le vocal ${channel}`)
                .setTimestamp()
                .setFooter({ text: `📚` })
            client.channels.cache.get(channellogs).send({ embeds: [embed] }).catch(console.error)
        }
    }
}