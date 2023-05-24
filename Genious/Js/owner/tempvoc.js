const Discord = require("discord.js")
const db = require('quick.db')
const config = require("../config")
const owner = new db.table("Owner")
const p = new db.table("Prefix")
const cl = new db.table("Color")

module.exports = {
    name: 'tempvoc',
    usage: 'tempvoc',
    description: `Permet de config les vocaux temporaires.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color

            let pf = p.fetch(`prefix_${message.guild.id}`)
            if (pf == null) pf = config.app.px

            let tempvocsettings = db.get(`tempvocsettings_${message.guild.id}`)
            if (tempvocsettings == null) tempvocsettings = "Non Configuré"
            if (tempvocsettings == true) tempvocsettings = "Activé"
            if (tempvocsettings == false) tempvocsettings = "Desactivé"

            let categorytemp = `<#${db.get(`categorytempvoc_${message.guild.id}`)}>`
            if (categorytemp == "<#null>") categorytemp = "Non Configuré"

            let salontemp = `<#${db.get(`salontempvoc_${message.guild.id}`)}>`
            if (salontemp == "<#null>") salontemp = "Non configuré"


            const embed = new Discord.MessageEmbed()
                .setTitle('Vocaux Temporaires')
                .setDescription(`__**Choisissez les options pour configuré les vocaux temporaires**__`)
                .addField(`Activé/Désactivé`, `Vocaux temporaires: __**${tempvocsettings}**__`)
                .addField(`Catégorie des vocaux temporaires`, `Catégorie: __**${categorytemp}**__`)
                .addField(`Salon des vocaux temporaires`, `Salon: __**${salontemp}**__`)
                .setColor(color)

            const alerteping = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('category')
                        .setLabel('Catégorie Tempvoc')
                        .setStyle('DANGER')
                )
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('salontemp')
                        .setLabel('Salon Tempvoc')
                        .setStyle('SUCCESS')
                )

            const onoff = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('Funny')
                    .setPlaceholder(`Activé / Désactivé`)
                    .addOptions([
                        {
                            label: 'Activer les vocaux temporaires',
                            value: 'active',
                            emoji: '972648521255768095',
                        },
                        {
                            label: 'Désactiver les vocaux temporaires',
                            value: 'desactive',
                            emoji: '988389407730040863',
                        },
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
                        db.set(`tempvocsettings_${message.guild.id}`, true)
                        f.reply({ content: `**Vocaux temporaires activé**`, ephemeral: true })
                    }

                    if (value === "desactive") {
                        db.set(`tempvocsettings_${message.guild.id}`, false)
                        f.reply({ content: `**Vocaux temporaires désactivé**`, ephemeral: true })
                    }


                })

                const filter = m => message.author.id === m.author.id;
                const collector = message.channel.createMessageComponentCollector({
                    componentType: "BUTTON",
                    filter: (i => i.user.id === message.author.id)
                })

                collector.on(`collect`, async (cld) => {
                    cld.deferUpdate()

                    if (cld.customId === "category") {

                        const ez = await message.channel.send(`Indiquez la catégorie ou seront créer les salons temporaires`)
                        let collected = await message.channel.awaitMessages({

                            max: 1,
                            time: 50000,
                            filter: filter,
                            errors: ["time"]
                        }).then(collected => {
                            ez.delete()

                            const msgperso = collected.first().content
                            db.set(`categorytempvoc_${message.guild.id}`, msgperso)

                            message.channel.send({ content: `Catégorie enregistrée` }).then(msg => {
                                setTimeout(() => msg.delete(), 6000)
                            })
                            collected.first().delete()

                        })
                    }

                    else if (cld.customId === "salontemp") {
                        const ez = await message.channel.send(`Indiquez le salon qui permettra de créer des vocaux temporaires (précisez l'id du salon sinon le module ne fonctionnera pas)`)
                        let collected = await message.channel.awaitMessages({

                            max: 1,
                            time: 15000,
                            filter: filter,
                            errors: ["time"]
                        }).then(collected => {
                            ez.delete()

                            let salonf = collected.first().content || collected.first().mentions.channels.first()
                            if (!salonf) return cld.message.channel.send({ content: "Salon introuvable." })

                            db.set(`salontempvoc_${message.guild.id}`, salonf)

                            message.channel.send({ content: `Le salon pour créer des vocaux temporaires est <#${salonf}>` }).then(msg => {
                                setTimeout(() => msg.delete(), 6000)
                            })
                            collected.first().delete()

                        })
                    }
                })
            })
        }
    }
}