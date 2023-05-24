const Discord = require("discord.js")
const db = require('quick.db')
const cl = new db.table("Color")
const owner = new db.table("Owner")
const config = require("../config")
const fs = require('fs')
const moment = require('moment')

module.exports = {
    name: 'searchvoc',
    usage: 'searchvoc',
    description: `Permet de chercher un membre en vocal dans le serveur`,
    async execute(client, message, args) {

        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let embed = new Discord.MessageEmbed()
            .setTitle("Recherche vocal")
            .setColor(color)

        message.channel.send({ embeds: [embed] })
    }
}