const figlet = require('figlet');
const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const p = new db.table("Prefix")
const config = require("../config")
const footer = config.app.footer
const cl = new db.table("Color")

module.exports = {
    name: 'gay',
    usage: 'gay',
    description: `jeux`,
    async execute(client, message, args) {

        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color

        let Member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        let Result = Math.floor(Math.random() * 101);

        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`Es tu Gay ?`)
            .setThumbnail(Member.user.displayAvatarURL())
            .setDescription(`**${Member.user.username} est ${Result}% Gay :rainbow_flag:**`)
            .setFooter(`${client.user.username}`, client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))

        message.channel.send({ embeds: [embed] });

    }
}