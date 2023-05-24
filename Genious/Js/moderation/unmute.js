const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const p = new db.table("Prefix")
const config = require("../config")
const p1 = new db.table("Perm1")
const p2 = new db.table("Perm2")
const p3 = new db.table("Perm3")
const footer = config.app.footer

module.exports = {
    name: 'unmute',
    usage: 'unmute',
    description: `Permet de mute un utilisateur sur le serveur`,
    async execute(client, message, args) {

        let pf = p.fetch(`prefix_${message.guild.id}`)
        if (pf == null) pf = config.app.px

        const perm1 = p1.fetch(`perm1_${message.guild.id}`)
        const perm2 = p2.fetch(`perm2_${message.guild.id}`)
        const perm3 = p3.fetch(`perm3_${message.guild.id}`)

        if (owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(perm1) || message.member.roles.cache.has(perm2) || message.member.roles.cache.has(perm3) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let muted = await db.fetch(`muterole_${message.guild.id}`)

            const target = message.mentions.members.first()

            var reason = args.slice(1).join(" ");

            let muterole = await message.guild.roles.cache.get(muted)

            if (!muterole) return message.channel.send(`**Ce serveur ne possède pas de role muet** \`${pf}muterole\``)

            if (!args[0]) return message.channel.send(`**Veuillez mentionner un utilisateur !**`)
            if (!target) return message.channel.send(`**Veuillez mentionner un utilisateur !**`)

            if (!reason) {
                reason = '`Aucune raison fournie`';
            }

            try {
                await target.roles.remove(muterole);

                message.channel.send({ content: `${target} a été unmute` })
            } catch (err) {
                return
            }

        }
    }
}