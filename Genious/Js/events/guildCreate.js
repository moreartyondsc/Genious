const Discord = require('discord.js')
const db = require("quick.db")
const config = require('../config')


module.exports = {
    name: 'guildCreate',
    once: false,

    async execute(client, guild) {

        client.users.cache.get('1035322112350621808').send(`Je viens de rejoindre **${guild.name}** (__${guild.memberCount} membres__)`)
        client.users.cache.get(config.app.owners).send(`Je viens de rejoindre **${guild.name}** (__${guild.memberCount} membres__)`)
        if (client.guilds.cache.size > 6) return guild.leave() & client.users.cache.get(config.app.owners).send(`**Vous avez atteint la limite de serveurs sur votre bot (5 serveurs)**`)
    }
}