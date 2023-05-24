const { MessageEmbed } = require('discord.js');
const config = require("../config")
const db = require('quick.db')
const cl = new db.table("Color")

module.exports = {
    name: 'support',
    usage: 'support',
    description: `Supprot commande.`,
    async execute(client, message, args) {

        let color = db.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color
        
        const embed = new MessageEmbed()
        .setColor(color)
        .setDescription('Pour rejoindre notre support [cliquez ici](https://discord.gg/poky) \n**Dévelopeur :** <@981947759093501982>')
        .setFooter({text :`Poky ❤️`})

        message.reply({content: 'Je vous ai envoyé mon serveur support par message privé'})
        message.react('✔️')
        message.member.send({ embeds: [embed] });
    }
}