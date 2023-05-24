const Discord = require("discord.js")
const db = require("quick.db")
const owner = new db.table("Owner")
const ownercount = new db.table("Ownercount")
const cl = new db.table("Color")
const config = require("../config")
const footer = config.app.footer

module.exports = {
    name: 'owner',
    usage: 'owner',
    category: "owner",
    description: `Permet de gérer les owners du bot.`,
    async execute(client, message, args) {

        if (config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color

            if (args[0]) {
                let member = client.users.cache.get(message.author.id);
                if (args[0]) {
                    member = client.users.cache.get(args[0]);
                } else {
                    return message.channel.send(`Aucun membre trouvé pour \`${args[0] || "rien"}\``)

                }
                if (message.mentions.members.first()) {
                    member = client.users.cache.get(message.mentions.members.first().id);
                }
                if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[0] || "rien"}\``)

                if (owner.get(`owners.${member.id}`) === true) { return message.channel.send(`${member.username} est déjà owner`) }
                ownercount.add(`${config.app.owners}.ownercount`, 1)
                owner.push(`${config.app.owners}.owner`, member.id)
                owner.set(`owners.${member.id}`, member.id)
                message.channel.send(`**__${member.username}__** est maintenant owner`)

            } else if (!args[0]) {


                let own = owner.get(`${config.app.owners}.owner`)
                let ownc = owner.get(`${config.app.owners}.ownercount`)
                if (ownc === null || "Nan") ownc = 1
                let p0 = 0;
                let p1 = 30;
                let page = 1;

                let embed = new Discord.MessageEmbed()
                embed.setTitle("Liste des Owners")
                    .setColor(color)
                    .setDescription(!own ? "Aucun" : own.map((user, i) => `<@${user}>`).slice(0, 30).join("\n")
                    )
                    .setFooter({ text: `${footer}` })
                message.channel.send({ embeds: [embed] })


            }
        }
    }
}