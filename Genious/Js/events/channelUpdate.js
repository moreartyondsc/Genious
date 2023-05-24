const Discord = require('discord.js')
const db = require("quick.db")
const owner = new db.table("Owner")
const rlog = new db.table("raidlog")
const punish = new   db.table("Punition")
const wl = new db.table("Whitelist")
const acu = new db.table("antichannelupdate")
const config = require('../config')

module.exports = {
    name: 'channelUpdate',
    once: false,

    async execute(client, oldChannel, newChannel) {

        const audit = (await oldChannel.guild.fetchAuditLogs("CHANNEL_UPDATE")).entries.first()
        if (audit?.executor?.id == client.user.id) return

        let isOn = await acu.fetch(`config.${oldChannel.guild.id}.antichannelupdate`)

        if (isOn == true) {

            if (wl.get(`${channel.guild.id}.${audit.executor.id}.wl`) !== null) return;
            if (owner.get(`owners.${audit.executor.id}`) !== null) return;
            if (audit.executor.id == config.app.owners) return;

            if (audit?.executor?.id == oldChannel?.guild?.ownerId) return
            if ((audit.action == "CHANNEL_UPDATE" || audit.action == "CHANNEL_OVERWRITE_UPDATE")) {
                // edit
                newChannel.edit({
                    name: oldChannel?.name,
                    type: oldChannel?.type,
                    position: oldChannel?.position || 0,
                    parent: oldChannel?.parent
                })

                if (punish.get(`sanction_${oldChannel.guild.id}`) === "ban") {
                    oldChannel.guild.members.ban(audit.executor.id, { reason: `AntiChannel Update` })

                } else if (punish.get(`sanction_${oldChannel.guild.id}`) === "derank") {

                    oldChannel.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                        if (role.name !== '@everyone') {
                            oldChannel.guild.members.resolve(audit.executor).roles.remove(role).catch(err => { throw err })
                        }
                    })

                } else if (punish.get(`sanction_${oldChannel.guild.id}`) === "kick") {

                    oldChannel.guild.members.kick(audit.executor.id, { reason: `AntiChannel Update` })
                }
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<@${audit.executor.id}> a tenté de \`modifié\` un salon, il a été sanctionné`)
                    .setTimestamp()
                client.channels.cache.get(rlog.fetch(`${channel.guild.id}.raidlog`)).send({ embeds: [embed] }).catch(console.error)
            }
        }
    }
}