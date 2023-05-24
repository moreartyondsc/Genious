const Discord = require("discord.js")
const config = require("../config")
const db = require('quick.db')
const p = new db.table("Prefix")
const cl = new db.table("Color")
const footer = config.app.footer
const paginationEmbed = require('discordjs-button-pagination')
const { MessageEmbed, MessageButton } = require('discord.js');


module.exports = {
    name: 'helpb',
    usage: 'helpb',
    category: "utils",
    description: `Permet d'afficher l'help.`,
    async execute(client, message, args) {

        let pf = p.fetch(`prefix_${message.guild.id}`)
        if (pf == null) pf = config.app.px

        let img = db.fetch(`img_${message.guild.id}`)
        if (img == null) img = "https://cdn.discordapp.com/attachments/904084986536276059/991547878789091359/standard_6.gif"

        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color

        //Embed Help

        const Help = new Discord.MessageEmbed()
            .setTitle(`📚・Panel d'aide de ${client.user.username}`)
            .setDescription(`<a:coins:957097769934401586>・Ce bot appartient à <@${config.app.owners}>`)
            .setImage(img)
            .setColor(color)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })

        //Embed Owner

        const Owner = new Discord.MessageEmbed()
            .setDescription(`
\`\`\`fix
Permet de gérer la configuration du bot sur le serveur !
\`\`\`

**\`${pf}setalerte [ID]\`**
Permet de mettre en place un salon d'alerte lorsqu'une permission administrateur sera ajouté à un membre

**\`${pf}setalerte [ID]\`**
Permet de choisir les perms pour les quels il faudra ping dans le salon alerte

**\`${pf}alerteping [@]\`**
Permet de choisir quel role sera mentionner lors de alertes permissions administrateurs

**\`${pf}soutien\`**
Permet de choisir un role et un statut de soutien afin de récompenser les membres qui ont le statut

**\`${pf}imghelp [lien]\`**
Permet de choisir quelle image/gif sera affiché dans l'accueil du help

**\`${pf}muterole\`**
Met en place un role muet sur le serveur

**\`${pf}wl/unwl\`**
Permet de gérer la whitelist du bot

**\`${pf}transcript\`**
Recupère tous les messages d'un salon

**\`${pf}ticket\`**
Permet de créer un système de ticket personnalisé sur le serveur

**\`${pf}ticketset\`**
Créer un système ticket pré défini

**\`${pf}permticket\`**
Permet de configuré un role qui aura accès aux tickets

**\`${pf}setcategorie\`**
Permet de séléctionner la catégorie ou seront ouvert les tickets

**\`${pf}massiverole add/remove\`**
Donne ou retire un role à tous les membres du serveur

**\`${pf}derankall\`**
Derank toutes les personnes ayant des Permissions Dangereuses sur le serveur

**\`${pf}embed\`**
Créer un embed grace à l'embed builder

**\`${pf}buttonrole <role> <description>\`**
Créer un embed pour que les gens puissent cliqué pour avoir un role

**\`${pf}prefix\`**
Change le prefix du bot

**\`${pf}stream/playing/listen/watch <statut>\`**
Change le statut du bot

**\`${pf}pfp/pfp off\`**
Permet d'activé ou désactuvé le mode pfps sur un salon

**\`${pf}mp\`**
Permet d'envoyer un message privé à un membre via le bot

**\`${pf}theme\`**
Permet de changer le theme couleur du bot

**\`${pf}punition derank/kick/ban\`**
Permet de choisir la punition qui sera éxécuté lors des raid

**\`${pf}bl/unbl\`**
Permet de gérer la blacklist

**\`${pf}permlist\`**
Affiche la configuration des perms configurés sur le serveur

**\`${pf}set/del perm1/2/3/gs/gp/ga <role>\`**
Permet de configurer le niveau de permission associé à un role

**\`${pf}say <message>\`**
Faire parler de bot dans un salon textuel

**\`${pf}lock all\`**
Permet de fermé tous les salons du serveur

**\`${pf}unlock all\`**
Permet de d'ouvrir tous les salons du serveur

**\`${pf}joinsettings\`**
Permet de configurer les paramètres du join settings

**\`${pf}joinrole <role>\`**
Attribue un role automatiquement aux membres qui rejoignent le serveur

**\`${pf}tempvoc\`**
Affiche un menu interactif pour gérer les vocaux temporaires sur le serveur

          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)



        //Embed Gestion

        const Gestion = new Discord.MessageEmbed()
            .setTitle("Gestion Permission")
            .setDescription(`
 \`\`\`fix
 Permet de controler les permissions du serveur
 \`\`\`

 **\`${pf}perm\`**
Affiche les permissions d'un membre sur le serveur

**\`${pf}gestion\`**
Affiche les différents modules des gestion et leurs utilités

**\`${pf}pall\`**
Désactive __toutes les permissions__ du serveur 

**\`${pf}padmin\`**
Désactive toutes les permissions __administateur__ du serveur

**\`${pf}prole\`**
Désactive toutes les permissions __roles__ du serveur

**\`${pf}pban\`**
Désactive toutes les permissions __ban__ du serveur

**\`${pf}pkick\`**
Désactive toutes les permissions __kick__ du serveur

**\`${pf}pvoc\`**
Désactive toutes les permissions __voc__ du serveur

**\`${pf}pwebhooks\`**
Désactive toutes les permissions __webhooks__ du serveur

**\`${pf}pviewc\`**
Désactive toutes les permissions __voir les salons__ du serveur

**\`${pf}pserveur\`**
Désactive toutes les permissions __Gérer le serveur__ du serveur

**\`${pf}peveryone\`**
Désactive toutes les permissions __Everyone__ du serveur

`)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)




        //Embed Modération

        const moderation = new Discord.MessageEmbed()
            .setDescription(`
\`\`\`fix
Modération
\`\`\`

**\`${pf}adminlist\`**
Affiche la liste des personnes ayant la permission __Administrateur__

**\`${pf}botlist\`**
Affiche la liste de tous les bots présent sur le serveur

**\`${pf}rlist\`**
Affiche la liste des personnes ayant la permission __Gérer les roles__

**\`${pf}mute\`**
Rends muet un membre

**\`${pf}unmute\`**
Redonne la parole un membre

**\`${pf}emoji\`**
Permet de créer un émoji sur le serveur

**\`${pf}channel\`**
Permet de gérer un salon

**\`${pf}hide\`**
Permet de cacher un salon

**\`${pf}unhide\`**
Permet de rendre visible un salon

**\`${pf}lock\`**
Permet de fermé un salon

**\`${pf}unlock\`**
Permet d'ouvrir un salon

**\`${pf}config\`**
Afficher la configuration du bot sur le serveur

**\`${pf}addrole\`**
Permet d'ajouter un role à un membre

**\`${pf}delrole\`**
Retire un role à un membre

**\`${pf}annonce\`**
Permet de faire une annonce de l'administration

**\`${pf}kick\`**
Expulse un membre du serveur

**\`${pf}ban\`**
Ban un membre du serveur

**\`${pf}clear <nombre>\`**
Supprime 1 ou plusieurs messages

**\`${pf}clean <id utilisateur/id channel>\`**
Expulse tous les membres d'un vocal

**\`${pf}renew\`**
Recrée un salon à l'identique

**\`${pf}slowmode\`**
Met en place un mode lent sur un salon

**\`${pf}voicemute\`**
Mute un membre en vocal

**\`${pf}voiceunmute\`**
Unmute un membre en vocal

**\`${pf}unban <id>\`**
Unban un membre du serveur

**\`${pf}unbanall\`**
Unban tous les membres du serveur

`)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)

        //Embed Utilitaire

        const Utilitaire = new Discord.MessageEmbed()
            .setTitle("Utilitaire")
            .setDescription(`
          
\`\`\`fix
Commandes Public
\`\`\`
**\`${pf}help\`**
Vous permet d'obtenir l'intégralité des commandes du bot et leurs informations

**\`${pf}helpall\`**
Vous permet d'obtenir l'intégralité des commandes assignées aux role selons leurs niveaux de permissions

**\`${pf}helpmsg\`**
Affiche la totalité des variables messages

**\`${pf}ping\`**
Permet d'afficher le ping du bot

**\`${pf}support\`**
Si vous cherchez des bots personnalisé en tout genre notre support vous propose des bots sur demande

**\`${pf}avatar [id/mention]\`**
Permet d'obtenir l'avatar d'un membre

**\`${pf}banner [id/mention]\`**
Permet d'obtenir la bannière d'un membre

**\`${pf}server info\`**
Permet d'obtenir les informations du serveur

**\`${pf}server pic\`**
Permet d'obtenir la pp du serveur

**\`${pf}server banner\`**
Permet d'obtenir la bannière du serveur

**\`${pf}roleinfo [role]\`**
Permet d'obtenir des informations sur un role

**\`${pf}searchvoc [@/ID]\`**
Permet de chercher un membre en vocal sur le serveur

**\`${pf}snipe\`**
Permet d'afficher le dernier message supprimé dans le salon

**\`${pf}suggest\`**
Permet de faire une suggestion sur le serveur

**\`${pf}userinfo\`**
Permet d'avoir des informations sur un utilisateur

**\`${pf}vc\`**
Affiche les statistiques du serveur

          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)

        //Embed activity

        const activity = new Discord.MessageEmbed()
            .setDescription(`
      
\`\`\`fix
Activity Together
\`\`\`
**\`${pf}activity\`**
Permet de lancer une activitée dans votre salon vocal

**__Activitées disponibles :__**
\`Youtube\`
\`Poker\`
\`Chess\`
\`Checkers in the Park\`
\`Betrayal\`
\`Fishington\`
\`Letter Tile\`
\`Words Snack\`
\`Doodle Crew\`
\`SpellCast\`
\`Awkord\`
\`Puttparty\`
\`Sketchheads\`
\`Ocho\`

      `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)



        //Embed logs

        const logs = new Discord.MessageEmbed()
            .setDescription(`
                          
\`\`\`fix
Logs du serveur
\`\`\`
**\`${pf}presetlogs\`**
Créer et configure automatiquement tous les salons logs

**\`${pf}messagelog\`**
Affiche toutes les logs des messages supprimés ou édités

**\`${pf}modlog\`**
Affiche toutes les logs des actions de modération

**\`${pf}ticketlog\`**
Affiche les logs des tickets

**\`${pf}giveawaylog\`**
Affiche les logs de chaque Giveaway lancé dans le serveur

**\`${pf}boostlog\`**
Affiche une log dès qu'une personne boostera le serveur

**\`${pf}embedlog\`**
Permet d'afficher les logs des embeds supprimés

**\`${pf}raidlog\`**
Permet d'afficher les logs des embeds supprimés

**\`${pf}setsuggest\`**
Salon qui sera utilisé pour envoyé toutes les suggestions proposés par les membres
                    

                    
                          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)



        const giveaway = new Discord.MessageEmbed()
            .setDescription(`
                          
\`\`\`fix
Giveaway
\`\`\`
**\`${pf}giveaway <salon> <temps> <nombre winners> <Gain>\`**
Permet de lancer un Giveaway sur le serveur

                          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)


        const jeux = new Discord.MessageEmbed()
            .setDescription(`
                          
\`\`\`fix
Jeux
\`\`\`
**\`${pf}8ball <question>\`**
**\`${pf}ascii <text>\`**
**\`${pf}catsay <text>\`**
**\`${pf}click\`**
**\`${pf}combat\`**
**\`${pf}gif\`**
**\`${pf}gay\`**
**\`${pf}hack\`**
**\`${pf}insta\`**
**\`${pf}mot\`**
**\`${pf}gunfight\`**
**\`${pf}puissance4\`**
**\`${pf}snake\`**


                          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)


        const antiraid = new Discord.MessageEmbed()
            .setDescription(`
                          
\`\`\`fix
Configuration de l'Antiraid
\`\`\`

**\`${pf}secur\`**
Configurer les protections de l'antiraid sur le serveur

**\`${pf}secur on\`**
Active toutes les protections de l'antiraid

**\`${pf}secur off\`**
Désactive toutes les protections de l'antiraid

**\`${pf}punition\`**
Permet de choisir la punition si un membre non owner/wl tente de faire une action non autorisé

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


                          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)


        const music = new Discord.MessageEmbed()
            .setDescription(`
                          
\`\`\`fix
Musique
\`\`\`
**\`${pf}play <nom/url musique>\`**
Permet d'écouter de la musique sur un serveur

**\`${pf}pause\`**
Permet de mettre en pause la musique actuelle

**\`${pf}resume\`**
Permet de remettre en lecture la musique mise en pause

**\`${pf}stop\`**
Permet d'arreter la musique

**\`${pf}volume <0/150>\`**
Permet de régler le volume de la musique

                          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)

        const proprio = new Discord.MessageEmbed()
            .setDescription(`
                          
\`\`\`fix
Propriétaire du bot
\`\`\`
**\`${pf}mybot\`**
Obtenir une invitation de votre bot

**\`${pf}owner\`**
Permet de mettre owner un membre __Attention les owners peuvent faire toutes les commandes__

**\`${pf}unowner\`**
Permet de retirer un membre des owners

**\`${pf}reboot\`**
Permet de redémarrer le bot

**\`${pf}serverlist\`**
Permet d'obtenir la liste des servers où se trouvent le bot

**\`${pf}setavatar <image>\`**
Change la pp du bot

**\`${pf}setname <Nouveau Nom>\`**
Change le nom du bot

                          `)
            .setFooter({ text: `${footer} | Prefix actuel : ${pf}` })
            .setColor(color)


        const button1 = new MessageButton()
            .setCustomId('gauche')
            .setLabel('<<<')
            .setStyle('DANGER');

        const button2 = new MessageButton()
            .setCustomId('droite')
            .setLabel('>>>')
            .setStyle('DANGER');


        pages = [
            Help,
            Owner,
            Gestion,
            moderation,
            Utilitaire,
            activity,
            logs,
            giveaway,
            jeux,
            antiraid,
            music,
            proprio

        ];

        buttonList = [
            button1,
            button2
        ]

        paginationEmbed(message, pages, buttonList);

    }
}