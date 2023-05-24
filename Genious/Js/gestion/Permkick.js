const Discord = require("discord.js");
const db = require("quick.db");
const owner = new db.table("Owner")
const alerte = new db.table("AlertePerm")
const cl = new db.table("Color")
const pgp = new db.table("PermGp")
const config = require("../config")

module.exports = {
    name: 'pkick',
    usage: 'pkick',
    category: "owner",
    description: `Permet de Désactive toutes les permissions ban du serveur.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(pgp.fetch(`permgp_${message.guild.id}`)) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color

            const roles = message.guild.roles.cache.filter(role => role.permissions.any(["KICK_MEMBERS"]));
            roles.forEach(role => role.setPermissions(role.permissions.remove(["KICK_MEMBERS"])).catch(() => { }))

            const permEmbed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription('**Je désactive les permissions __KICK__ à tous les rôles.**')

            message.channel.send({ embeds: [permEmbed] })

            const channellogs = alerte.get(`${message.guild.id}.alerteperm`)
            let roleping = db.get(`role_${message.guild.id}`)
            if (roleping === null) roleping = "@everyone"

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${message.author.tag} à désactivé toutes les __permissions kick__ du serveur`)
                .setDescription(`<a:loading:957097853694664746> Merci de patienter avant de réactiver les permissions le temps que le problème soit réglé\n Executeur : <@${message.author.id}>`)
                .setTimestamp()
                .setFooter({ text: `📚` })
            client.channels.cache.get(channellogs).send({ content: `${roleping}`, embeds: [embed] }).catch(console.error)

        }
    }
}