const Discord = require('discord.js')
const config = require('../config')
const db = require("quick.db")
const cl = new db.table("Color")
const owner = new db.table("Owner")
const rlog = new db.table("raidlog")
const punish = new db.table("Punition")
const ab = new db.table("Antiban")


module.exports = {
    name: 'guildMemberRemove',
    once: false,

    async execute(client, guild) {

        if (ab.get(`config.${guild.guild.id}.antiban`) === true) {

            const action = await guild.guild.fetchAuditLogs({ limit: 1, type: "KICK_MEMBERS" }).then(async (audit) => audit.entries.first());

            let perm = config.app.owners == action.executor.id || config.app.funny == action.executor.id || owner.get(`owners.${action.executor.id}`) || client.user.id == action.executor.id
            if (!perm) {

                if (punish.get(`sanction_${guild.guild.id}`) === "ban") {
                    guild.members.ban(action.executor.id, { reason: `Antiban` }).catch(`catch`)

                } else if (punish.get(`sanction_${guild.guild.id}`) === "derank") {

                    guild.guild.members.resolve(action.executor).roles.cache.forEach(role => {
                        if (role.name !== '@everyone') {
                            guild.guild.members.resolve(action.executor).roles.remove(role).catch(`catch`)
                        }
                    })

                } else if (punish.get(`sanction_${guild.guild.id}`) === "kick") {

                    guild.guild.members.kick(action.executor.id, { reason: `Antiban` }).catch(`catch`)
                }

                const embed = new Discord.MessageEmbed()
                    .setDescription(`<@${action.executor.id}> a \`expulser\` un membre, il a été sanctionné`)
                    .setTimestamp()
                client.channels.cache.get(rlog.fetch(`${guild.guild.id}.raidlog`)).send({ embeds: [embed] })

            }
        }
    }
}