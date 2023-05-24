const Discord = require('discord.js')
const moment = require('moment');
const config = require('../config')
const db = require("quick.db")
const cl = new db.table("Color")
const owner = new db.table("Owner")
const rlog = new db.table("raidlog")
const punish = new db.table("Punition")
const lock = new db.table("Serverlock")
const atb = new db.table("Antibot")

module.exports = {
    name: 'guildMemberAdd',
    once: false,

    async execute(client, member) {

        let color = cl.fetch(`color_${member.guild.id}`)
        if (color == null) color = config.app.color

        if (lock.get(`serverlock_${member.guild.id}`) === "lock") {
            member.kick("Serveur Vérouillé")
            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${member} à été **kick** pour avoir \`rejoint pendant que le serveur était verrouillé\``)
            client.channels.cache.get(rlog.fetch(`${member.guild.id}.raidlog`)).send({ embeds: [embed] }).catch(console.error)
        }

        if (db.get(`blacklist.${member.id}`)) {

            member.guild.members.ban(member.id, { reason: `Blacklist` })
            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${member} a rejoit en étant __blacklist__, il à été **ban**`)
            client.channels.cache.get(rlog.fetch(`${member.guild.id}.raidlog`)).send({ embeds: [embed] }).catch(console.error)
        }


        if (member.user.bot) {

            if (atb.get(`config.${member.guild.id}.antibot`) === true) {

                const action = await member.guild.fetchAuditLogs({ limit: 1, type: "BOT_ADD" }).then(async (audit) => audit.entries.first());
                if (action.executor.id === client.user.id) return;

                let perm = config.app.owners == action.executor.id || config.app.funny == action.executor.id || owner.get(`owners.${action.executor.id}`)

                const embed = new Discord.MessageEmbed()
                    .setDescription(`<@${action.executor.id}> a ajouté un \`bot\` au serveur\nBot ajouté: <@${member.id}>`)
                    .setTimestamp()
                client.channels.cache.get(rlog.fetch(`${member.guild.id}.raidlog`)).send({ embeds: [embed] }).catch(console.error)

                if (!perm) {

                    member.kick('Antibot')

                    if (punish.get(`sanction_${member.guild.id}`) === "ban") {
                        member.guild.members.ban(action.executor.id, { reason: `Anti Bot` })

                    } else if (punish.get(`sanction_${member.guild.id}`) === "derank") {

                        member.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                            if (role.name !== '@everyone') {
                                member.guild.members.resolve(action.executor).roles.remove(role).catch(err => { throw err })
                            }
                        })

                    } else if (punish.get(`sanction_${member.guild.id}`) === "kick") {

                        member.guild.members.kick(action.executor.id, { reason: `Anti bot ` })
                    }

                }
            }
        }

        if (member.user) {

            if (db.get(`joinsettings_${member.guild.id}`) === true) {

                const messagejoin = db.fetch(`messagebvn_${member.guild.id}`)

                const salonbvn = db.fetch(`salonbvn_${member.guild.id}`)

                const premiumTier = {
                    NONE: 0,
                    TIER_1: 1,
                    TIER_2: 2,
                    TIER_3: 3,
                };

                const content = messagejoin
                    .replaceAll('{MemberName}', member)
                    .replaceAll('{MemberMention}', `<@${member.id}>`)
                    .replaceAll('{MemberTag}', member.user.tag)
                    .replaceAll('{MemberID}', member.id)
                    .replaceAll('{Server}', member.guild)
                    .replaceAll('{MemberCount}', member.guild.memberCount)
                    .replaceAll('{ServerBoostsCount}', `${member.guild.premiumSubscriptionCount || '0'}`)
                    .replaceAll('{ServerLevel}', `${premiumTier[member.guild.premiumTier]}`)
                    .replaceAll('{VocalMembersCount}', member.guild.members.cache.filter(m => m.voice.channel).size)
                    .replaceAll('{OnlineMembersCount}', member.guild.presences.cache.filter((presence) => presence.status !== "offline").size)

                client.channels.cache.get(salonbvn).send({ content: content }).catch(console.error)


                if (db.get(`joinsettingsmp_${member.guild.id}`) === true) {

                    const messagejoin = db.fetch(`messagebvnmp_${member.guild.id}`)

                    const content = messagejoin
                        .replaceAll('{MemberName}', member)
                        .replaceAll('{MemberMention}', `<@${member.id}>`)
                        .replaceAll('{MemberTag}', member.user.tag)
                        .replaceAll('{MemberID}', member.id)
                        .replaceAll('{Server}', member.guild)
                        .replaceAll('{MemberCount}', member.guild.memberCount)
                        .replaceAll('{ServerBoostsCount}', `${member.guild.premiumSubscriptionCount || '0'}`)
                        .replaceAll('{ServerLevel}', `${premiumTier[member.guild.premiumTier]}`)
                        .replaceAll('{VocalMembersCount}', member.guild.members.cache.filter(m => m.voice.channel).size)
                        .replaceAll('{OnlineMembersCount}', member.guild.presences.cache.filter((presence) => presence.status !== "offline").size)

                    member.send({ content: content })

                }

                if (db.get(`joinsettingsrole_${member.guild.id}`) === true) {

                    const joinrole = db.fetch(`joinrole_${member.guild.id}`)

                    member.roles.add(joinrole)

                }

            }
        }
    }
}