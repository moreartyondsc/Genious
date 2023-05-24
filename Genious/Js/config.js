module.exports = {
    app: {
        px: '+', //Prefixe
        token: 'TOKEN', //Token du bot
        owners: 'ID', //id de l'owner du bot
        funny: 'ID', //id Développeur
        color: '#9C1515', //couleur par défaut (Vous pouvez choisir grâce à htmlcolorcodes.com)
        footer: 'Pseudo', //Pseudo de l'owner du bot
        maxVol: '150',
        everyoneMention: false,
        hostedBy: true,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
}