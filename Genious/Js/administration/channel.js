const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const cl = new db.table("Color")
const fs = require('fs')
const moment = require('moment')
const config = require("../config")
const footer = config.app.footer

module.exports = {
    name: 'channel',
    usage: 'channel',
    description: `Contrôle les channels`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color

            if (!args[0]) {
                var channel = message.channel;
            } else {
                var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            };

            const choice = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('choice')
                    .setPlaceholder(`Que souhaitez-vous faire ?`)
                    .addOptions([
                        {
                            label: 'Vérouiller',
                            value: 'lock',
                            emoji: '',
                        },
                        {
                            label: 'Devérouiller',
                            value: 'unlock',
                            emoji: '',
                        },
                        {
                            label: 'Visible',
                            value: 'visible',
                            emoji: '',
                        },
                        {
                            label: 'Invisible',
                            value: 'invisble',
                            emoji: '',
                        },
                        {
                            label: 'Information',
                            value: 'info',
                            emoji: '',
                        },
                        {
                            label: 'Supprimer',
                            value: 'suppr',
                            emoji: '',
                        }
                    ])
            )


            const embedchannel = new Discord.MessageEmbed()
                .setDescription(`**Channel:** ${channel.name}`)
                .addField(`Vérouiller`, `non`)
                .addField(`Visible`, `non`)
                .setColor(color)
                .setFooter({ text: `${footer}` })

            message.channel.send({ embeds: [embedchannel], components: [choice] }).then(async msg => {

                const collector = message.channel.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    filter: (i => i.user.id === message.author.id)
                });
                collector.on("collect", async (collected) => {
                    collected.deferUpdate()
                    const value = collected.values[0];

                    if (value === "lock") {

                        if (!args[0]) {
                            var channel = message.channel;
                        } else {
                            var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
                        }

                        channel.permissionOverwrites.edit(message.guild.id, {
                            SEND_MESSAGES: false,
                        })
                        msg.edit({ embeds: [embedchannel], components: [choice] })

                    }
                    if (value === "unlock") {

                        if (!args[0]) {
                            var channel = message.channel;
                        } else {
                            var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
                        }

                        channel.permissionOverwrites.edit(message.guild.id, {
                            SEND_MESSAGES: true,
                        })
                        msg.edit({ embeds: [embedchannel], components: [choice] })

                    }
                    if (value === "visible") {

                        if (!args[0]) {
                            var channel = message.channel;
                        } else {
                            var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
                        }

                        channel.permissionOverwrites.edit(message.guild.id, {
                            VIEW_CHANNEL: true,
                        })
                        msg.edit({ embeds: [embedchannel], components: [choice] })

                    }
                    if (value === "invisible") {

                        if (!args[0]) {
                            var channel = message.channel;
                        } else {
                            var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
                        }

                        channel.permissionOverwrites.edit(message.guild.id, {
                            VIEW_MESSAGES: false,
                        })
                        msg.edit({ embeds: [embedchannel], components: [choice] })

                    }
                    if (value === "info") {

                        if (!args[0]) {
                            var channel = message.channel;
                        } else {
                            var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
                        };

                        const embedt = new Discord.MessageEmbed()
                            .setColor(color)
                            .setTitle(`Information sur le salon textuel : ${channel.name}`)
                            .setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
                            .setFooter({ text: `Gestion` })

                            .addFields(
                                {
                                    name: `🔧 Description`,
                                    value: `${channel.topic !== null ? channel.topic : 'Aucune'}`,
                                    inline: false
                                },
                                {
                                    name: `📃 Nom`,
                                    value: `<#${channel.id}>`,
                                    inline: true
                                },
                                {
                                    name: `🆔 Id`,
                                    value: `${channel.id}`,
                                    inline: true
                                },
                                {
                                    name: `🔞 NSFW`,
                                    value: `${channel.nsfw ? `oui` : `non`}`,
                                    inline: true
                                },
                                {
                                    name: `📙 Catégorie`,
                                    value: `${channel.parent !== null ? channel.parent : 'non-catégorisé'}`,
                                    inline: true
                                },
                                {
                                    name: `🎚 Position dans la catégorie`,
                                    value: `${channel.position + 1}`,
                                    inline: true
                                },
                                {
                                    name: `📆 Date de création`,
                                    value: `${moment(channel.createdAt).format('[le] DD/MM/YYYY [à] HH:mm:ss')}`,
                                    inline: false
                                }
                            )


                        msg.edit({ embeds: [embedt] })
                    }
                    if (value === "suppr") {

                        if (!args[0]) {
                            var channel = message.channel;
                        } else {
                            var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
                        }

                        channel.delete('Spam détecté')

                    }
                })
            })
        }
    }
}