import discord, os
from discord.ext import commands
from cogs.tools import *

bot = commands.Bot(command_prefix="!", intents=discord.Intents.all())
user_messages = {}
@bot.remove_command('help')

@bot.event
async def on_ready():
    print("Load modules")
    await bot.change_presence(status=discord.Status.online, activity=discord.Game("play.herium.fr"))
    for filename in os.listdir("./cogs"):
        if filename.endswith(".py"):
            if filename[:-3] not in ["tools", "interaction"]:
                await bot.load_extension(f"cogs.{filename[:-3]}")
    print (f"Logged in as {bot.user.name}")

"""
@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandNotFound):
        return
    elif isinstance(error, commands.MissingRequiredArgument):
        await ctx.send(f"**Error:** Argument manquant: {error.param.name}")
    elif isinstance(error, commands.BadArgument):
        await ctx.send(f"**Erreur:** Argument invalide pour la commande {ctx.command.name}: {error}")
    elif isinstance(error, commands.CheckFailure):
       await ctx.send("**Error:** Vous n'avez pas la permission d'utiliser cette commande.")
    else:
        await ctx.send("**Error:** Une erreur inattendue s'est produite. Contactez le support: https://discord.gg/VFb3RkJazt")
"""

config = getJson()
bot.run(config["token"])  # remplacer "TOKEN" par le token de votre bot