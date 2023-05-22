import discord, json, datetime, asyncio

def getJson(file = "config"):
	with open(f"{file}.json") as f:
		data = json.load(f)
	return data;

def save(data, file = "config"):
    with open(f"{file}.json", "w") as f:
        json.dump(data, f)