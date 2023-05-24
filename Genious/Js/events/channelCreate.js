const Discord = require('discord.js')
const db = require("quick.db")
const owner = new db.table("Owner")
const rlog = new db.table("raidlog")
const punish = new db.table("Punition")
const wl = new db.table("Whitelist")
const atc = new db.table("antichannelcreate")
const config = require('../config')

module.exports = {
    name: 'channelCreate',
    once: false,

    async execute(client, channel) {

        let muterole = await channel.guild.roles.cache.get(db.fetch(`muterole_${channel.guild.id}`)) || channel.guild.roles.cache.find(role => role.name === `muet`) || channel.guild.roles.cache.find(role => role.name === `Muted`) || channel.guild.roles.cache.find(role => role.name === `Mute`)
        if (muterole) {

            channel.permissionOverwrites.edit(muterole, {
                SEND_MESSAGES: false,
                SPEAK: false,
            })
        }

        if (atc.get(`config.${channel.guild.id}.antichannelcreate`) !== true) return;

        const audit = await channel.guild.fetchAuditLogs({ type: "CHANNEL_CREATE" }).then(audits => audits.entries.first())
        if (audit?.executor?.id == client.user.id) return

        if (wl.get(`${channel.guild.id}.${audit.executor.id}.wl`) !== null) return;
        if (owner.get(`owners.${audit.executor.id}`) !== null) return;
        if (audit.executor.id == config.app.owners) return;
        if (audit?.executor?.id == channel?.guild?.ownerId) return
        channel.delete()

        if (punish.get(`sanction_${channel.guild.id}`) === "ban") {
            channel.guild.members.ban(audit.executor.id, { reason: `AntiChannel Create` })

        } else if (punish.get(`sanction_${channel.guild.id}`) === "derank") {

            channel.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                if (role.name !== '@everyone') {
                    channel.guild.members.resolve(audit.executor).roles.remove(role).catch(err => { throw err })
                }
            })

        } else if (punish.get(`sanction_${channel.guild.id}`) === "kick") {

            channel.guild.members.kick(audit.executor.id, { reason: `AntiChannel Create` })
        }

        const embed = new Discord.MessageEmbed()
            .setDescription(`<@${audit.executor.id}> a tenté de \`créer un salon\`, il a été sanctionné`)
            .setTimestamp()
        client.channels.cache.get(rlog.fetch(`${channel.guild.id}.raidlog`)).send({ embeds: [embed] }).catch(console.error)

    }
}