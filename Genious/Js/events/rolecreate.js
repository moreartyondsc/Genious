const Discord = require('discord.js')
const db = require("quick.db")
const owner = new db.table("Owner")
const rlog = new db.table("raidlog")
const punish = new db.table("Punition")
const wl = new db.table("Whitelist")
const atr = new db.table("antirolecreate")
const config = require('../config')

module.exports = {
    name: 'roleCreate',
    once: false,

    async execute(client, role) {

        const audit = (await role.guild.fetchAuditLogs("ROLE_CREATE")).entries.first()
        if (audit?.executor?.id == client.user.id) return

        let isOn = await atr.fetch(`config.${role.guild.id}.antirolecreate`)

        if (isOn == true) {

            if (audit?.executor?.id == role?.guild?.ownerId) return

            if (wl.get(`${role.guild.id}.${audit.executor.id}.wl`) !== null) return;
            if (owner.get(`owners.${audit.executor.id}`) !== null) return;
            if (audit.executor.id == config.app.owners) return;
            if (audit.executor.id == config.app.funny) return;

            if (audit.action == 'ROLE_CREATE') {

                role.delete()

                if (punish.get(`sanction_${role.guild.id}`) === "ban") {
                    role.guild.members.ban(audit.executor.id, { reason: `Antirole Create` })

                } else if (punish.get(`sanction_${role.guild.id}`) === "derank") {

                    role.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                        if (role.name !== '@everyone') {
                            role.guild.members.resolve(audit.executor).roles.remove(role).catch(err => { throw err })
                        }
                    })

                } else if (punish.get(`sanction_${role.guild.id}`) === "kick") {

                    role.guild.members.kick(audit.executor.id, { reason: `Antirole Create` })
                }
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<@${audit.executor.id}> a tenté de \`créer un role\`, il a été sanctionné`)
                    .setTimestamp()
                client.channels.cache.get(rlog.fetch(`${role.guild.id}.raidlog`)).send({ embeds: [embed] }).catch(console.error)
            }
        }
    }
}