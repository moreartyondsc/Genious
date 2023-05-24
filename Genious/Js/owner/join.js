const Discord = require("discord.js")
const db = require('quick.db')
const config = require("../config")
const owner = new db.table("Owner")
const p = new db.table("Prefix")
const cl = new db.table("Color")

module.exports = {
    name: 'join',
    usage: 'joinsettings',
    description: `Permet de config le join settings.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            if (args[0] == 'settings') {

                let color = cl.fetch(`color_${message.guild.id}`)
                if (color == null) color = config.app.color

                let pf = p.fetch(`prefix_${message.guild.id}`)
                if (pf == null) pf = config.app.px

                let onoffjoin = db.get(`joinsettings_${message.guild.id}`)
                if (onoffjoin == true) onoffjoin = "Activé"
                if (onoffjoin == false) onoffjoin = "Désactivé"
                if (onoffjoin == null) onoffjoin = "Désactivé"

                let onoffjoinmp = db.get(`joinsettingsmp_${message.guild.id}`)
                if (onoffjoinmp == true) onoffjoinmp = "Activé"
                if (onoffjoinmp == false) onoffjoinmp = "Désactivé"
                if (onoffjoinmp == null) onoffjoinmp = "Désactivé"

                let messagebvn = db.get(`messagebvn_${message.guild.id}`)
                if (messagebvn == null) messagebvn = "Non configuré"

                let mpjoin = db.get(`messagebvnmp_${message.guild.id}`)
                if (mpjoin == null) mpjoin = "Non configuré"

                let joinrole = `<@&${db.get(`joinrole_${message.guild.id}`)}>`
                if (joinrole == "<@&null>") joinrole = "Non configuré"

                let salonbvn = `<#${db.get(`salonbvn_${message.guild.id}`)}>`
                if (salonbvn == "<#null>") salonbvn = "Non configuré"

                const embed = new Discord.MessageEmbed()
                    .setTitle('Paramètres de Bienvenue')
                    .setDescription(`__**Choisissez les options lorsqu'un membre rejoindra le serveur**__`)
                    .addField(`Activé/Désactivé`, `Message de Bienvenue: __**${onoffjoin}**__\n MP de Bienvenue: __**${onoffjoinmp}**__`)
                    .addField(`Message de bienvenue`, messagebvn)
                    .addField(`MP de bienvenue`, mpjoin)
                    .addField(`Role de bienvenue`, joinrole)
                    .addField(`Salon de bienvenue`, salonbvn)
                    .setColor(color)
                    .setFooter({ text: `Si vous avez apporté des modifications refaite la commande pour actualiser ce message` })

                const alerteping = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('mpperso')
                            .setLabel('MP Personnalisé')
                            .setStyle('DANGER')
                    )
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('messageperso')
                            .setLabel('Message Personnalisé')
                            .setStyle('SUCCESS')
                    )
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('salonbvn')
                            .setLabel('Salon de Bienvenue')
                            .setStyle('PRIMARY')
                    )

                const onoff = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('Funny')
                        .setPlaceholder(`Activé / Désactivé`)
                        .addOptions([
                            {
                                label: 'Activer Message de bienvenue',
                                value: 'active',
                                emoji: '972648521255768095',
                            },
                            {
                                label: 'Désactiver Message de bienvenue',
                                value: 'desactive',
                                emoji: '988389407730040863',
                            },

                            {
                                label: 'Activer le MP de bienvenue',
                                value: 'activemp',
                                emoji: '📨',
                            },
                            {
                                label: 'Désactiver le MP de bienvenue',
                                value: 'desactivemp',
                                emoji: '988389407730040863',
                            }
                        ])
                )


                message.channel.send({ embeds: [embed], components: [alerteping, onoff] }).then(async msg => {

                    const collectorX = message.channel.createMessageComponentCollector({
                        componentType: "SELECT_MENU",
                        filter: (i => i.user.id === message.author.id)
                    });


                    collectorX.on("collect", async (f) => {

                        const value = f.values[0];
                        //retour
                        if (value === "active") {
                            db.set(`joinsettings_${message.guild.id}`, true)
                            f.reply({ content: `**Message de bienvenue activé**`, ephemeral: true })
                        }

                        if (value === "desactive") {
                            db.set(`joinsettings_${message.guild.id}`, false)
                            f.reply({ content: `**Message de bienvenue désactivé**`, ephemeral: true })
                        }

                        if (value === "activemp") {
                            db.set(`joinsettingsmp_${message.guild.id}`, true)
                            f.reply({ content: `**MP de bienvenue Activé**`, ephemeral: true })
                        }

                        if (value === "desactivemp") {
                            db.set(`joinsettingsmp_${message.guild.id}`, false)
                            f.reply({ content: `**MP de bienvenue désactivé**`, ephemeral: true })
                        }
                    })

                    const filter = m => message.author.id === m.author.id;
                    const collector = message.channel.createMessageComponentCollector({
                        componentType: "BUTTON",
                        filter: (i => i.user.id === message.author.id)
                    })

                    collector.on(`collect`, async (cld) => {
                        cld.deferUpdate()

                        if (cld.customId === "mpperso") {

                            const ez = await message.channel.send(`Indiquez le message à envoyé en message privé (${pf}helpmsg pour afficher les variables)`)
                            let collected = await message.channel.awaitMessages({

                                max: 1,
                                time: 50000,
                                filter: filter,
                                errors: ["time"]
                            }).then(collected => {
                                ez.delete()

                                const msgperso = collected.first().content
                                db.set(`messagebvnmp_${message.guild.id}`, msgperso)

                                message.channel.send({ content: `MP de bienvenue enregistré avec succès` }).then(msg => {
                                    setTimeout(() => msg.delete(), 6000)
                                })
                                collected.first().delete()

                            })
                        }

                        else if (cld.customId === "messageperso") {
                            const ez = await message.channel.send(`Indiquez le message qui sera envoyé par message privé aux nouveaux membres (${pf}helpmsg pour afficher les variables)`)
                            let collected = await message.channel.awaitMessages({

                                max: 1,
                                time: 50000,
                                filter: filter,
                                errors: ["time"]
                            }).then(collected => {
                                ez.delete()

                                const msgperso = collected.first().content
                                db.set(`messagebvn_${message.guild.id}`, msgperso)

                                message.channel.send({ content: `Message de bienvenue enregistré avec succès` }).then(msg => {
                                    setTimeout(() => msg.delete(), 6000)
                                })
                                collected.first().delete()

                            })
                        }

                        else if (cld.customId === "salonbvn") {
                            const ez = await message.channel.send(`Indiquez le salon de bienvenue (précisez l'id du salon sinon le module ne fonctionnera pas)`)
                            let collected = await message.channel.awaitMessages({

                                max: 1,
                                time: 15000,
                                filter: filter,
                                errors: ["time"]
                            }).then(collected => {
                                ez.delete()


                                let salonf = collected.first().content || collected.first().mentions.channels.first()
                                if (!salonf) return cld.message.channel.send({ content: "Salon introuvable." })

                                db.set(`salonbvn_${message.guild.id}`, salonf)

                                message.channel.send({ content: `Les messages de bienvenue seront envoyés dans <#${salonf}>` }).then(msg => {
                                    setTimeout(() => msg.delete(), 6000)
                                })
                                collected.first().delete()

                            })
                        }
                    })
                })
            }

            if (args[0] == 'role') {

                if (args[1] == 'on') {
                    message.channel.send({ content: `Role de bienvenue __activé__` })
                    db.set(`joinsettingsrole_${message.guild.id}`, true)
                    return
                }


                else if (args[1] == 'off') {
                    message.channel.send({ content: `Role de bienvenue __activé__` })
                    db.set(`joinsettingsrole_${message.guild.id}`, false)
                    return
                }

                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])

                if (!role) return message.channel.send({ content: `Merci de spécifiez le rôle à ajouter` })
                if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) return message.channel.send({ content: `Le **joinrole** n'a pas pu etre configuré car le role séléctionné contient des permissions **Dangereuses**` })

                message.channel.send({ content: `Le role ${role} sera désormais automatiquement attribué aux nouveaux membres` })
                db.set(`joinrole_${message.guild.id}`, role.id)

            }
        }
    }
}