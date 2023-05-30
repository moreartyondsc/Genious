import discord
from discord.ext import commands
import json

class Logs(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        print("Log module prêt")

    @commands.command()
    async def set_log(self, ctx, channel: discord.TextChannel):
        guild_id = ctx.guild.id
        channel_id = channel.id
        log_data = {"guild_id": guild_id, "channel_id": channel_id}

        with open("Log_data.json", "w") as file:
            json.dump(log_data, file)

        await ctx.send(f"Le salon de logs a été défini sur {channel.mention}.")

    @commands.Cog.listener()
    async def on_channel_update(self, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == before.guild.id and channel_id:
            guild = before.guild
            user = guild.me

            embed = discord.Embed(
                title="channelUpdate",
                description=f"{user.mention} a modifié le salon {after.mention}",
                color=discord.Color.gold(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Avant", value=before.name, inline=False)
            embed.add_field(name="Maintenant", value=after.name, inline=False)

            channel = guild.get_channel(channel_id)
            await channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_channel_delete(self, channel):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == channel.guild.id and channel_id:
            guild = channel.guild
            user = guild.me

            embed = discord.Embed(
                title="channelDelete",
                description=f"{user.mention} a supprimé le salon {channel.name}",
                color=discord.Color.red(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Salon", value=channel.name)

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)


    @commands.Cog.listener()
    async def on_guild_ban_add(self, guild, user):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == guild.id and channel_id:
            guild = user.guild
            bot_user = guild.me

            embed = discord.Embed(
                title="guildBanAdd",
                description=f"{bot_user.mention} a banni {user.mention}",
                color=discord.Color.red(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Temp", value="Temp si fourni")
            embed.add_field(name="Raison", value="Raison si fournie")

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_guild_ban_remove(self, guild, user):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == guild.id and channel_id:
            guild = user.guild
            bot_user = guild.me

            embed = discord.Embed(
                title="guildBanRemove",
                description=f"{bot_user.mention} a débanni {user.mention}",
                color=discord.Color.green(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Bannis pour", value="Raison du ban")
            embed.add_field(name="Temp", value="Temp du bannissement si fourni")

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_guild_role_create(self, role):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == role.guild.id and channel_id:
            guild = role.guild
            bot_user = guild.me

            embed = discord.Embed(
                title="guildRoleCreate",
                description=f"{bot_user.mention} a créé le rôle {role.mention}",
                color=discord.Color.green(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Id du rôle", value=role.id)
            embed.add_field(name="Permissions", value=role.permissions.value)

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_guild_role_delete(self, role):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == role.guild.id and channel_id:
            guild = role.guild
            bot_user = guild.me

            embed = discord.Embed(
                title="guildRoleDelete",
                description=f"{bot_user.mention} a supprimé le rôle {role.name}",
                color=discord.Color.red(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Id du rôle", value=role.id)
            embed.add_field(name="Permissions", value=role.permissions.value)

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_guild_role_update(self, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == before.guild.id and channel_id:
            guild = before.guild
            bot_user = guild.me

            embed = discord.Embed(
                title="guildRoleUpdate",
                description=f"{bot_user.mention} a modifié le rôle {before.name}",
                color=discord.Color.yellow(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Ancien Id du rôle", value=before.id)
            embed.add_field(name="Nouveau Id du rôle", value=after.id)
            embed.add_field(name="Anciennes permissions", value=before.permissions.value)
            embed.add_field(name="Nouvelles permissions", value=after.permissions.value)

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_guild_update(self, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == before.id and channel_id:
            guild = before
            bot_user = guild.me

            embed = discord.Embed(
                title="guildUpdate",
                description=f"{bot_user.mention} a modifié le serveur {before.name}",
                color=discord.Color.orange(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Id du serveur", value=before.id)
            embed.add_field(name="Nouveauté", value=get_guild_updates(before, after))
            embed.add_field(name="Ancien", value=get_guild_before_info(before))

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_message_delete(self, message):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == message.guild.id and channel_id:
            guild = message.guild
            bot_user = guild.me

            embed = discord.Embed(
                title="messageDelete",
                description=f"{bot_user.mention} a supprimé un message",
                color=discord.Color.red(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Dans le salon", value=message.channel.mention)
            embed.add_field(name="Message", value=message.content)
            embed.add_field(name="Auteur du message", value=message.author.mention)

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_message_delete_bulk(self, messages):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == messages[0].guild.id and channel_id:
            guild = messages[0].guild
            bot_user = guild.me

            embed = discord.Embed(
                title="messageDeleteBulk",
                description=f"{bot_user.mention} a supprimé {len(messages)} messages",
                color=discord.Color.black(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Dans le salon", value=messages[0].channel.mention)
            embed.add_field(name="Nombre de messages", value=len(messages))

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_message_edit(self, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == before.guild.id and channel_id:
            guild = before.guild
            bot_user = guild.me

            embed = discord.Embed(
                title="messageUpdate",
                description=f"{bot_user.mention} a modifié un message",
                color=discord.Color.gold(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Dans le salon", value=before.channel.mention)
            embed.add_field(name="Message", value=before.content)
            embed.add_field(name="Nouveau message", value=after.content)
            embed.add_field(name="Auteur du message", value=before.author.mention)

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_remove(self, member):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == member.guild.id and channel_id:
            guild = member.guild
            bot_user = guild.me

            embed = discord.Embed(
                title="guildMemberKick",
                description=f"{bot_user.mention} a kické {member.mention}",
                color=discord.Color.red(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Raison", value="Aucune raison spécifiée")
            embed.add_field(name="Auteur", value=bot_user.mention)

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_update(self, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == before.guild.id and channel_id:
            guild = before.guild
            bot_user = guild.me

            embed = discord.Embed(
                title="guildMemberUpdate",
                description=f"{bot_user.mention} a modifié {after.mention}",
                color=discord.Color.blue(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Ancien", value=before.status)
            embed.add_field(name="Nouveau", value=after.status)

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_update(self, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == before.guild.id and channel_id:
            guild = before.guild
            bot_user = guild.me

            if before.nick != after.nick:
                embed = discord.Embed(
                    title="guildMemberNickUpdate",
                    description=f"{bot_user.mention} a modifié le pseudo de {after.mention}",
                    color=discord.Color.black(),
                    timestamp=discord.utils.utcnow()
                )

                embed.add_field(name="Ancien", value=before.nick)
                embed.add_field(name="Nouveau", value=after.nick)

                log_channel = guild.get_channel(channel_id)
                await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_verify(self, member):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == member.guild.id and channel_id:
            guild = member.guild
            bot_user = guild.me

            embed = discord.Embed(
                title="guildMemberVerify",
                description=f"{bot_user.mention} a détecté la vérification d'un membre",
                color=discord.Color.default(),
                timestamp=discord.utils.utcnow()
            )

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_voice_state_update(self, member, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == member.guild.id and channel_id and before.channel:
            guild = member.guild
            bot_user = guild.me

            if member == bot_user:
                return

            if before.channel == after.channel:
                return

            if before.channel:
                embed = discord.Embed(
                    title="voiceChannelLeave",
                    description=f"{member.mention} a quitté le salon vocal {before.channel.name}",
                    color=discord.Color.gold(),
                    timestamp=discord.utils.utcnow()
                )

                embed.add_field(name="Salon", value=before.channel.name)

                log_channel = guild.get_channel(channel_id)
                await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_voice_state_update(self, member, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == member.guild.id and channel_id and after.channel:
            guild = member.guild
            bot_user = guild.me

            if member == bot_user:
                return

            if before.channel == after.channel:
                return

            if after.channel:
                embed = discord.Embed(
                    title="voiceChannelJoin",
                    description=f"{member.mention} a rejoint le salon vocal {after.channel.name}",
                    color=discord.Color.green(),
                    timestamp=discord.utils.utcnow()
                )

                embed.add_field(name="Vocal", value=after.channel.name)

                log_channel = guild.get_channel(channel_id)
                await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_voice_state_update(self, member, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == member.guild.id and channel_id:
            guild = member.guild
            bot_user = guild.me

            if member == bot_user:
                return

            embed = discord.Embed(
                title="voiceStateUpdate",
                color=discord.Color.default(),
                timestamp=discord.utils.utcnow()
            )

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_voice_state_update(self, member, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == member.guild.id and channel_id:
            guild = member.guild
            bot_user = guild.me

            if member == bot_user:
                return

            if before.channel != after.channel:
                embed = discord.Embed(
                    title="voiceChannelSwitch",
                    description=f"{member.mention} a déplacé {member} vers le salon {after.channel.mention}",
                    color=discord.Color.red(),
                    timestamp=discord.utils.utcnow()
                )
                embed.add_field(name="Ancien vocal", value=before.channel.name)
                embed.add_field(name="Nouveau vocal", value=after.channel.name)

                log_channel = guild.get_channel(channel_id)
                await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_guild_emojis_update(self, guild, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == guild.id and channel_id:
            embed = discord.Embed(
                title="guildEmojisUpdate",
                description=f"{guild.me.mention} a modifié les emojis",
                color=discord.Color.orange(),
                timestamp=discord.utils.utcnow()
            )

            emoji_changes = []

            for emoji in before:
                if emoji not in after:
                    emoji_changes.append(f"- {emoji} (supprimé)")

            for emoji in after:
                if emoji not in before:
                    emoji_changes.append(f"+ {emoji} (ajouté)")

            emoji_changes_str = "\n".join(emoji_changes)

            embed.add_field(name="Anciens emojis", value="\u200b" if not before else ", ".join(str(emoji) for emoji in before))
            embed.add_field(name="Nouveaux emojis", value="\u200b" if not after else ", ".join(str(emoji) for emoji in after))
            embed.add_field(name="Changements", value=emoji_changes_str)

            log_channel = guild.get_channel(channel_id)
            await log_channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_guild_member_update(self, before, after):
        with open("Log_data.json", "r") as file:
            log_data = json.load(file)

        guild_id = log_data.get("guild_id")
        channel_id = log_data.get("channel_id")

        if guild_id == before.guild.id and channel_id and before.premium_since != after.premium_since:
            embed = discord.Embed(
                title="guildMemberBoostUpdate",
                description=f"{before.guild.me.mention} a reçu un boost",
                color=discord.Color.purple(),
                timestamp=discord.utils.utcnow()
            )

            embed.add_field(name="Membre ayant boost", value=before.mention)
            embed.add_field(name="Ancien nombre de boost", value=str(before.guild.premium_subscription_count))
            embed.add_field(name="Nouveau nombre de boost", value=str(after.guild.premium_subscription_count))
            embed.add_field(name="Niveau de boost", value=str(after.guild.premium_tier))

            log_channel = before.guild.get_channel(channel_id)
            await log_channel.send(embed=embed)


    def get_guild_updates(before, after):
        updates = []

        if before.name != after.name:
            updates.append(f"Nom du serveur : {before.name} → {after.name}")

        if before.region != after.region:
            updates.append(f"Région : {before.region} → {after.region}")

        # Ajoutez d'autres attributs de serveur que vous souhaitez comparer et afficher

        if updates:
            return "\n".join(updates)
        else:
            return "Aucune modification détectée"

    def get_guild_before_info(guild):
        info = []

        info.append(f"Nom du serveur : {guild.name}")
        info.append(f"Région : {guild.region}")

        # Ajoutez d'autres attributs de serveur que vous souhaitez afficher avant la modification

        return "\n".join(info)

async def setup(bot):
    await bot.add_cog(Logs(bot))
