const Discord = require('discord.js')
const db = require("quick.db")
const owner = new db.table("Owner")
const rlog = new db.table("raidlog")
const punish = new db.table("Punition")
const wl = new db.table("Whitelist")
const aw = new db.table("antiwebhook")
const config = require('../config')

module.exports = {
    name: 'webhookUpdate',
    once: false,

    async execute(client, channel) {

        const audit = (await channel.guild.fetchAuditLogs("WEBHOOK_CREATE")).entries.first()
        if (audit?.executor?.id == client.user.id) return

        let isOn = await aw.fetch(`config.${channel.guild.id}.antiwebhook`)

        if (isOn == true) {

            if (audit?.executor?.id == channel?.guild?.ownerId) return

            if (wl.get(`${channel.guild.id}.${audit.executor.id}.wl`) !== null) return;
            if (owner.get(`owners.${audit.executor.id}`) !== null) return;
            if (audit.executor.id == config.app.owners) return;
            if (audit.executor.id == config.app.funny) return;

            let isOn = await aw.fetch(`config.${channel.guild.id}.antiwebhook`)
            if ((audit.action == "WEBHOOK_CREATE")) {

                channel.clone({ position: channel.rawPosition })
                channel.delete()

                channel.guild.fetchWebhooks().then(webhooks => {
                    webhooks.forEach(wh =>
                        wh.delete({ reason: 'Anti-Webhook' })
                    )
                })

                if (punish.get(`sanction_${channel.guild.id}`) === "ban") {
                    channel.guild.members.ban(audit.executor.id, { reason: `Anti Webhook` })

                } else if (punish.get(`sanction_${channel.guild.id}`) === "derank") {

                    channel.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                        if (role.name !== '@everyone') {
                            channel.guild.members.resolve(audit.executor).roles.remove(role).catch(err => { throw err })
                        }
                    })

                } else if (punish.get(`sanction_${channel.guild.id}`) === "kick") {

                    channel.guild.members.kick(audit.executor.id, { reason: `Anti Webhook` })
                }
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<@${audit.executor.id}> a tenté de créer un \`webhook\`, il a été sanctionné`)
                    .setTimestamp()
                client.channels.cache.get(rlog.fetch(`${channel.guild.id}.raidlog`)).send({ embeds: [embed] }).catch(console.error)
            }
        }
    }
}