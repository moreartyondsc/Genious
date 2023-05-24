const db = require("quick.db")

module.exports = {
    name: 'presenceUpdate',
    once: false,

    async execute(client, oldPresence, newPresence) {

        const member = newPresence.member
        const link = db.fetch("support" + member.guild.id)
        if (link === null) return;
        if (link === true) {
            const roleID = await db.fetch("role" + member.guild.id)
            const inviteLink = await db.fetch("status" + member.guild.id)
            if (member.roles.cache.find(role => role.id === roleID.id)) {
                if (member.presence.activities.some(activity => activity.type === "CUSTOM" && activity.state && activity.state.includes(inviteLink))) return;
                if (!member.presence.activities.some(activity => activity.type === "CUSTOM" && activity.state && activity.state.includes(inviteLink))) {
                    await member.roles.remove(roleID.id);
                }
            } if (!member.roles.cache.find(role => role.id === roleID.id) && member.presence.activities.some(activity => activity.type === "CUSTOM" && activity.state && activity.state.includes(inviteLink))) {
                await member.roles.add(roleID.id);
            }
        }
    }
}
