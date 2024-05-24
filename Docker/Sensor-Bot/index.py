# Import necessary libraries
from datetime import datetime
from discord import Client, Embed, Intents
from discord.ext import tasks
from os import environ
from psutil import (
    cpu_percent,
    disk_io_counters,
    disk_usage,
    net_io_counters,
    sensors_fans,
    sensors_temperatures,
    virtual_memory,
    boot_time,
)
from random import choice
from sys import exit

# Function to retrieve environment variables with fallback values
def get_env_variable(name, default=None):
    value = environ.get(name)
    if value is None:
        if default is None:
            exit(f"Please set the {name} environment variable.")
        else:
            return default
    return value

# Load environment variables
botToken = get_env_variable("botToken", "YOUR_BOT_TOKEN_HERE")
channelID = int(get_env_variable("channelID", "YOUR_CHANNEL_ID_HERE"))
home_server = environ.get("home_server", "False").lower() == "true"

# Efficient Uptime Calculation
def get_formatted_uptime(uptime_seconds):
    intervals = [('Weeks', 604800), ('Days', 86400), ('Hours', 3600), ('Mins', 60), ('Secs', 1)]
    for unit, seconds_in_unit in intervals:
        if uptime_seconds >= seconds_in_unit:
            return f"{round(uptime_seconds / seconds_in_unit, 2)} {unit}"
    return f"{uptime_seconds} Secs"

# Code Reusability - Disk usage calculation
def get_disk_usage_info():
    disk_info = disk_usage("/")
    return (
        round(disk_info.used / 1000000000, 2),
        round(disk_info.total / 1000000000, 2),
        disk_info.percent
    )

# Generate a colorful embed with server statistics
def generate_embed():
    colors = [
        0xFFE4E1, 0x00FF7F, 0xD8BFD8, 0xDC143C, 0xFF4500, 0xDEB887, 0xADFF2F,
        0x800000, 0x4682B4, 0x006400, 0x808080, 0xA0522D, 0xF08080, 0xC71585,
        0xFFB6C1, 0x00CED1,
    ]
    embed = Embed(title="📊 Server Monitor", color=choice(colors))
    embed.set_author(name="Server Stats Bot")
    embed.add_field(name="💻 Cpu Usage:", value=f"{cpu_percent()}%", inline=True)
    embed.add_field(name="📶 Network Sent:", value=f"{round(net_io_counters().bytes_sent / 1000000, 2)} MB", inline=True)
    embed.add_field(name="📥 Network Received:", value=f"{round(net_io_counters().bytes_recv / 1000000, 2)} MB", inline=True)
    embed.add_field(name="💽 Disk Written:", value=f"{round(disk_io_counters().write_bytes / 1000000, 2)} MB", inline=True)
    embed.add_field(name="💾 Disk Read:", value=f"{round(disk_io_counters().read_bytes / 1000000, 2)} MB", inline=True)
    if home_server:
        fans = sensors_fans()["asus"]
        temperatures = sensors_temperatures()
        embed.add_field(name="🌬️ Fan RPM:", value=fans[0][1] if fans else "N/A", inline=True)
        embed.add_field(name="🌡️ MB Temp:", value=f"{temperatures['asus'][0][1]} °C" if 'asus' in temperatures else "N/A", inline=True)
        embed.add_field(name="🌡️ Cpu Temp:", value=f"{temperatures['coretemp'][0][1]} °C" if 'coretemp' in temperatures else "N/A", inline=True)
    uptime = get_formatted_uptime(uptime_seconds())
    embed.add_field(name="⏳ Uptime:", value=uptime, inline=True)
    ram_info = virtual_memory()
    embed.add_field(
        name="🧠 Ram Usage:",
        value=f"{round(ram_info.used / 1000000000, 2)} GB/{round(ram_info.total / 1000000000, 2)} GB ({ram_info.percent}%)",
        inline=False,
    )
    used_disk_space, total_disk_space, disk_usage_percent = get_disk_usage_info()
    embed.add_field(
        name="💾 Disk Usage:",
        value=f"{used_disk_space} GB/{total_disk_space} GB ({disk_usage_percent}%)",
        inline=False,
    )
    embed.set_footer(
        text=f'Last updated: {datetime.now().strftime("%d/%m/%Y %H:%M:%S")}, Last Boot: {datetime.fromtimestamp(boot_time()).strftime("%d/%m/%Y %H:%M:%S")}'
    )
    return embed

# Discord Client
class MyClient(Client):
    async def on_ready(self):
        print(f"🚀 Logged on as {self.user}!")
        monitor.start(self)

# Initialize Discord client with intents
intents = Intents.default()
client = MyClient(intents=intents)

# Tasks Loop
@tasks.loop(seconds=15.0)
async def monitor(self):
    await client.wait_until_ready()
    embed = generate_embed()
    channel = client.get_channel(channelID)
    async for message in channel.history(limit=200):
        if message.author == self.user:
            await message.edit(embed=embed)
            break
    else:
        await channel.send(embed=embed)

# Run Discord client with bot token
client.run(botToken)