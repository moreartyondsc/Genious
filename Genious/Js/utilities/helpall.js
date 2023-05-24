const Discord = require("discord.js")
const config = require("../config")
const db = require('quick.db')
const p = new db.table("Prefix")
const cl = new db.table("Color")
const footer = config.app.footer

module.exports = {
    name: 'helpall',
    usage: 'helpall',
    category: "utils",
    description: `Permet d'afficher l'help.`,
    async execute(client, message, args) {

        let pf = p.fetch(`prefix_${message.guild.id}`)
        if (pf == null) pf = config.app.px

        const imgperm = "https://cdn.discordapp.com/attachments/904084986536276059/987542547696062555/standard_2.gif"

        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color

        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId('help')
                .setPlaceholder(`Liste Permissions`)
                .addOptions([
                    {
                        label: 'Accueil',
                        value: 'acc',
                    },
                    {
                        label: 'Commandes Public',
                        value: 'public',
                    },
                    {
                        label: 'Perm 1',
                        value: 'perm1',
                    },
                    {
                        label: 'Perm 2',
                        value: 'perm2',
                    },
                    {
                        label: 'Perm 3',
                        value: 'perm3',
                    },
                    {
                        label: 'Perm Gestion Staff',
                        value: 'permgs',
                    },
                    {
                        label: 'Perm Gestion Perm',
                        value: 'permgp',
                    },
                    {
                        label: 'Perm Giveaway',
                        value: 'permga',
                    },
                    {
                        label: 'Owners',
                        value: 'owner',
                    },
                    {
                        label: 'Propriétaire',
                        value: 'buyer',
                    }
                ])
        )

        //Embed Help

        const help = new Discord.MessageEmbed()
            .setTitle(`📚・Panel d'aide Permissions ${client.user.username}`)
            .setDescription(`<a:coins:957097769934401586>・Ce bot appartient à <@${config.app.owners}>`)
            .setImage(imgperm)
            .setColor(color)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })


        const public = new Discord.MessageEmbed()
            .setDescription(`
\`\`\`fix
Commandes Publiques
\`\`\`

**\`${pf}activity\`**
**\`${pf}avatar\`**
**\`${pf}banner\`**
**\`${pf}help\`**
**\`${pf}helpall\`**
**\`${pf}ping\`**
**\`${pf}searchvoc\`**
**\`${pf}server info/pic/banner\`**
**\`${pf}config\`**
**\`${pf}snipe\`**
**\`${pf}support\`**
**\`${pf}suggest\`**
**\`${pf}perm\`**
**\`${pf}gestion\`**

          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)


        //Embed perm1

        const perm1 = new Discord.MessageEmbed()
            .setDescription(`
\`\`\`fix
Permission 1
\`\`\`

**\`${pf}voicemute\`**
**\`${pf}voiceunmute\`**
**\`${pf}roleinfo\`**
**\`${pf}mute\`**

          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)



        //Embed perm2

        const perm2 = new Discord.MessageEmbed()
            .setDescription(`
 \`\`\`fix
Permissions 2
 \`\`\`

**\`${pf}botlist\`**
**\`${pf}adminlist\`**
**\`${pf}rlist\`**
**\`${pf}hide\`**
**\`${pf}unhide\`**
**\`${pf}clear\`**


`)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)




        //Embed perm3

        const perm3 = new Discord.MessageEmbed()
            .setDescription(`
\`\`\`fix
Permission 3
\`\`\`

**\`${pf}lock\`**
**\`${pf}unlock\`**
**\`${pf}renew\`**
**\`${pf}slowmode\`**
**\`${pf}embed\`**
**\`${pf}emoji\`**
**\`${pf}ban\`**
**\`${pf}kick\`**
**\`${pf}unban\`**

`)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)

        //Embed permgs

        const permgs = new Discord.MessageEmbed()
            .setDescription(`
          
\`\`\`fix
Permission Gestion Staff
\`\`\`
**\`${pf}addrole\`**
**\`${pf}delrole\`**

          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)

        //Embed permgp

        const permgp = new Discord.MessageEmbed()
            .setDescription(`
      
\`\`\`fix
Permission Gestion Permissions
\`\`\`
**\`${pf}pall\`**
**\`${pf}padmin\`**
**\`${pf}pban\`**
**\`${pf}pkick\`**
**\`${pf}prole\`**
**\`${pf}pserveur\`**
**\`${pf}pview\`**
**\`${pf}pvoc\`**
**\`${pf}pwebhooks\`**


      `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)



        //Embed permga

        const permga = new Discord.MessageEmbed()
            .setDescription(`
                          
\`\`\`fix
Permission Giveaway
\`\`\`
**\`${pf}giveaway\`**
Permet de lancé un Giveaway sur le serveur
                    
                          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)


        const owner = new Discord.MessageEmbed()
            .setDescription(`
                          
\`\`\`fix
Owners
\`\`\`
**\`${pf}setalerte\`**
**\`${pf}antiadmin on/off\`**
**\`${pf}antiban on/off\`**
**\`${pf}antiupdate on/off\`**
**\`${pf}antibot on/off\`**
**\`${pf}antidown on/off\`**
**\`${pf}antilink invite/all/off\`**
**\`${pf}antieveryone on/off\`**
**\`${pf}antichannel create on/off\`**
**\`${pf}antichannel delete on/off\`**
**\`${pf}antichannel update on/off\`**
**\`${pf}antirole create on/off\`**
**\`${pf}antirole delete on/off\`**
**\`${pf}antirole update on/off\`**
**\`${pf}antiwebhook on/off\`**
**\`${pf}server lock/unlock\`**
**\`${pf}secur\`**
**\`${pf}secur on/off\`**
**\`${pf}wl\`**
**\`${pf}unwl\`**
**\`${pf}set perm\`**
**\`${pf}del perm\`**
**\`${pf}perm list\`**
**\`${pf}playing\`**
**\`${pf}stream\`**
**\`${pf}watch\`**
**\`${pf}list\`**
**\`${pf}setcategorie\`**
**\`${pf}setsuggest\`**
**\`${pf}soutien\`**
**\`${pf}boostlog\`**
**\`${pf}giveawaylog\`**
**\`${pf}messagelog\`**
**\`${pf}ticketlog\`**
**\`${pf}modlog\`**
**\`${pf}embedlog\`**
**\`${pf}raidlog\`**
**\`${pf}imghelp\`**
**\`${pf}muterole\`**
**\`${pf}annonce\`**
**\`${pf}derankall\`**
**\`${pf}mp\`**
**\`${pf}rolelist\`**
**\`${pf}ticket\`**
**\`${pf}ticketset\`**
**\`${pf}punition\`**
**\`${pf}join settings\`**
**\`${pf}join role\`**
**\`${pf}tempvoc\`**
**\`${pf}unbanall\`**

                          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)


        const buyer = new Discord.MessageEmbed()
            .setDescription(`
                          
\`\`\`fix
Propriétaire
\`\`\`
**\`${pf}leave [Id]\`**
Permet de faire quitter le bot d'un serveur

**\`${pf}mybot\`**
Permet d'inviter le bot sur des serveurs

**\`${pf}owner add/remove/list\`**
Permet de gérer les owners du bot

**\`${pf}prefix\`**
Permet de changer le prefix du bot

**\`${pf}serverlist\`**
Permet d'afficher la liste des serveurs du bot

**\`${pf}theme\`**
Permet de changer le thème couleur du bot

**\`${pf}setavatar\`**
Permet de changer le photo de profil du bot

**\`${pf}setname\`**
Permet de changer le nom du bot
 
                          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)



        message.channel.send({ embeds: [perm1], components: [row] }).then(async msg => {

            const collector = message.channel.createMessageComponentCollector({
                componentType: "SELECT_MENU",
                filter: (i => i.user.id === message.author.id)
            });
            collector.on("collect", async (collected) => {
                collected.deferUpdate()
                const value = collected.values[0];

                if (value === "acc") {
                    msg.edit({ embeds: [help], components: [row] });
                }

                if (value === "public") {
                    msg.edit({ embeds: [public], components: [row] });
                }
                if (value === "perm1") {
                    msg.edit({ embeds: [perm1], components: [row] });
                }
                if (value === "perm2") {
                    msg.edit({ embeds: [perm2], components: [row] });
                }
                if (value === "perm3") {
                    msg.edit({ embeds: [perm3], components: [row] });
                }
                if (value === "permgs") {
                    msg.edit({ embeds: [permgs], components: [row] });
                }
                if (value === "permgp") {
                    msg.edit({ embeds: [permgp], components: [row] });
                }
                if (value === "permga") {
                    msg.edit({ embeds: [permga], components: [row] });
                }
                if (value === "owner") {
                    msg.edit({ embeds: [owner], components: [row] });
                }
                if (value === "buyer") {
                    msg.edit({ embeds: [buyer], components: [row] });
                }
            })
        })

    }
}