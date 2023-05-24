const Discord = require("discord.js")
const db = require("quick.db")
const owner = new db.table("Owner")
const ownercount = new db.table("Ownercount")
const cl = new db.table("Color")
const config = require("../config")
const footer = config.app.footer

module.exports = {
    name: 'unowner',
    usage: 'unowner',
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
                if (owner.get(`owners.${member.id}`) === null) { return message.channel.send(`${member.username} n'est pas owner`) }
                owner.subtract(`${config.app.owners}.ownercount`, 1)
                owner.set(`${config.app.owners}.owner`, owner.get(`${config.app.owners}.owner`).filter(s => s !== member.id))
                owner.delete(`owners.${member.id}`, member.id)

                message.channel.send(`**__${member.username}__** n'est plus owner`)

            } else if (!args[0]) {
                return
            }
        } else { }
    }
}