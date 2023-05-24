const Discord = require('discord.js')
const config = require('../config')
const db = require('quick.db')
const alerte = new db.table("AlertePerm")
const cl = new db.table("Color")
const aa = new db.table("Antiadmin")
const punish = new db.table("Punition")
const rlog = new db.table("raidlog")
const owner = new db.table("Owner")

module.exports = {
    name: 'guildMemberUpdate',
    once: false,

    async execute(client, oldMember, newMember) {

        let color = cl.fetch(`color_${oldMember.guild.id}`)
        if (color == null) color = config.app.color

        let channellogs = alerte.get(`${newMember.guild.id}.alerteperm`)

        let roleping = db.get(`role_${newMember.guild.id}`)
        if (roleping === null) roleping = "@everyone"
        let fetchedLogs = await oldMember.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" })
        deletionLog = fetchedLogs.entries.first();

        if (!deletionLog) return;

        const { executor } = deletionLog;
        if (executor.id === client.user.id) return;
        if (executor.id === "ID") return;

        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            let newroles = null;
            deletionLog.changes.forEach(r => {
                newroles = r.new
            });

            if (db.get(`adminping_${oldMember.guild.id}`) == true) {

                if (newMember.permissions.has(`ADMINISTRATOR`) && !oldMember.permissions.has(`ADMINISTRATOR`)) {
                    const lologs = channellogs
                    const pingrole = roleping
                    const logsAdmin = newMember.guild.channels.cache.get(lologs)

                    if (logsAdmin) {

                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Permission Admin détectée [Danger]`, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
                            .setTitle(`Une perm admin à été ajoutée`)
                            .setDescription(`Executeur : ${executor} \n Membre : ${oldMember}\n Rôle : <@&${newroles.map(r => r.id).join(">, <@&")}>`)
                            .setTimestamp()
                            .setFooter({ text: `⚠️` })
                            .setColor(color)
                        const msg = await logsAdmin.send({ content: `${pingrole}`, embeds: [embed] })

                    }

                    if (owner.get(`owners.${executor.id}`) === true) return
                    if (executor.id === config.app.owners) return
                    if (executor.id === config.app.funny) return


                    if (aa.get(`config.${oldMember.guild.id}.antiadmin`) === true) {

                        const audit = (await oldMember.guild.fetchAuditLogs("MEMBER_ROLE_UPDATE")).entries.first()
                        if (audit?.executor?.id == client.user.id) return

                        oldMember.guild.members.resolve(newMember).roles.cache.forEach(role => {
                            if (role.name !== '@everyone') {
                                oldMember.guild.members.resolve(newMember).roles.remove(role).catch(err => { throw err })

                            }

                            else if (punish.get(`sanction_${oldMember.guild.id}`) === "ban") {
                                oldMember.guild.members.ban(audit.executor.id, { reason: `Anti Admin` })

                            } else if (punish.get(`sanction_${oldMember.guild.id}`) === "derank") {

                                oldMember.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                                    if (role.name !== '@everyone') {
                                        oldMember.guild.members.resolve(audit.executor).roles.remove(role).catch(err => { throw err })
                                    }
                                })

                            } else if (punish.get(`sanction_${oldMember.guild.id}`) === "kick") {

                                oldMember.guild.members.kick(audit.executor.id, { reason: `Anti Admin` })
                            }
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`<@${audit.executor.id}> a tenté d'ajouté un role possédant une \`perm admin\` a <@${newMember.id}>, ils ont été sanctionné`)
                                .setTimestamp()
                            client.channels.cache.get(rlog.fetch(`${oldMember.guild.id}.raidlog`)).send({ embeds: [embed] }).catch(console.error)
                        })
                    }



                }
            }
        }

        if (db.get(`banping_${oldMember.guild.id}`) == true) {

            let newroles = null;
            deletionLog.changes.forEach(r => {
                newroles = r.new
            });


            if (newMember.permissions.has(`BAN_MEMBERS`) && !oldMember.permissions.has(`BAN_MEMBERS`)) {
                const lologs = channellogs
                const pingrole = roleping
                const logsAdmin = newMember.guild.channels.cache.get(lologs)

                if (logsAdmin) {

                    const embed = new Discord.MessageEmbed()
                        .setAuthor({ name: `Permission Ban détectée [Danger]`, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
                        .setTitle(`Une perm Ban à été ajoutée`)
                        .setDescription(`Executeur : ${executor} \n Membre : ${oldMember}\n Rôle : <@&${newroles.map(r => r.id).join(">, <@&")}>`)
                        .setTimestamp()
                        .setFooter({ text: `⚠️` })
                        .setColor(color)
                    const msg = await logsAdmin.send({ embeds: [embed] })

                }
            }
        }

        if (db.get(`roleping_${oldMember.guild.id}`) == true) {

            let newroles = null;
            deletionLog.changes.forEach(r => {
                newroles = r.new
            });


            if (newMember.permissions.has(`MANAGE_ROLES`) && !oldMember.permissions.has(`MANAGE_ROLES`)) {
                const lologs = channellogs
                const pingrole = roleping
                const logsAdmin = newMember.guild.channels.cache.get(lologs)

                if (logsAdmin) {

                    const embed = new Discord.MessageEmbed()
                        .setAuthor({ name: `Permission role détectée [Danger]`, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
                        .setTitle(`Une perm role à été ajoutée`)
                        .setDescription(`Executeur : ${executor} \n Membre : ${oldMember}\n Rôle : <@&${newroles.map(r => r.id).join(">, <@&")}>`)
                        .setTimestamp()
                        .setFooter({ text: `⚠️` })
                        .setColor(color)
                    const msg = await logsAdmin.send({ embeds: [embed] })

                }
            }
        }
    }
}