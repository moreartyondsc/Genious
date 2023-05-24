const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const alerte = new db.table("AlertePerm")
const config = require("../config")
const fs = require('fs')
const moment = require('moment')
const p2 = new db.table("Perm2")
const p3 = new db.table("Perm3")

module.exports = {
    name: 'unhide',
    usage: 'unhide',
    description: `Permet de unhide un salon`,
    async execute(client, message, args, color) {

        const perm2 = p2.fetch(`perm2_${message.guild.id}`)
        const perm3 = p3.fetch(`perm3_${message.guild.id}`)

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = db.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color


            if (args[0] === "all") {
                message.guild.channels.cache.forEach((channel, id) => {
                    channel.permissionOverwrites.edit(message.guild.id, {
                        VIEW_CHANNEL: true,
                    })
                }, `Tous les salons unhide par ${message.author.tag}`);

                message.channel.send(`${message.guild.channels.cache.size} salons unhide`);

                const channellogs = alerte.get(`${message.guild.id}.alerteperm`)

                const embed = new Discord.MessageEmbed()
                    .setDescription(`<a:ltEyes:982403689736175617> | ${message.author.tag} vient de unhide tous les salons du serveur \n Executeur : <@${message.author.id}>`)
                    .setTimestamp()
                    .setColor(color)
                    .setFooter({ text: `📚` })
                client.channels.cache.get(channellogs).send({ embeds: [embed] }).catch(console.error)
            }
        }
        else if (owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(perm2) || message.member.roles.cache.has(perm3) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel

            try {
                message.guild.roles.cache.forEach(role => {
                    channel.permissionOverwrites.edit(message.guild.id, {
                        VIEW_CHANNEL: true,
                    });
                }, `Salon unhide par ${message.author.tag}`);
            } catch (e) {
                console.log(e);
            }
            message.channel.send(`Les membres ne peuvent à nouveau voir le salon <#${channel.id}>`);
        }


        let channellogs = db.get(`${message.guild.id}.modlog`)
        if (channellogs == null) return

        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> a utilisé la commande \`unhide\` le salon <#${message.channel.id}>`)
            .setTimestamp()
            .setFooter({ text: `📚` })
        client.channels.cache.get(channellogs).send({ embeds: [embed] }).catch(console.error)

    }
}