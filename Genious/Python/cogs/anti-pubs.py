import discord
from discord.ext import commands

class AntiDiscordLink(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_message(self, message):
        if message.author == self.bot.user:
            return

        link_keywords = ["discord.gg/", "dsc.gg/", ".gg/"]
        for keyword in link_keywords:
            if keyword in message.content:
                await message.delete()
                await message.channel.send(f"{message.author.mention}, l'envoi de liens vers d'autres serveurs Discord n'est pas autorisé ici.")
                break
    
    @commands.Cog.listener()
    async def on_message_edit(self, before, after):
        await self.on_message(after)

async def setup(bot):
    await bot.add_cog(AntiDiscordLink(bot))
