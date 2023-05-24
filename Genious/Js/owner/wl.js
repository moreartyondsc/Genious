const Discord = require("discord.js")
const db = require("quick.db")
const owner = new db.table("Owner")
const wl = new db.table("Whitelist")
const wlcount = new db.table("Wlcount")
const cl = new db.table("Color")
const config = require("../config")
const footer = config.app.footer

module.exports = {
    name: 'wl',
    usage: 'wl',
    category: "owner",
    description: `Permet de gérer la wl du bot.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

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
                if (wl.get(`${message.guild.id}.${member.id}.wl`) === true) { return message.channel.send(`${member.username} est déjà whitelist`) }
                wl.add(`${message.guild.id}.wlcount`, 1)
                wl.push(`${message.guild.id}.wl`, member.id)
                wl.set(`${message.guild.id}.${member.id}.wl`, member.id)

                message.channel.send(`${member.username} est maintenant dans la whitelist`)

            } else if (!args[0]) {


                let own = wl.get(`${message.guild.id}.wl`)
                let ownc = wl.get(`${message.guild.id}.wlcount`)
                if (ownc === null || "Nan") ownc = 1
                let p0 = 0;
                let p1 = 30;
                let page = 1;

                let embed = new Discord.MessageEmbed()
                embed.setTitle("Whitelist")
                    .setColor(color)
                    .setDescription(!own ? "Aucun" : own.map((user, i) => `<@${user}>`).slice(0, 30).join("\n")
                    )
                    .setFooter({text: `${footer}`})
                message.channel.send({embeds: [embed]})


            }
        }
    }

}
