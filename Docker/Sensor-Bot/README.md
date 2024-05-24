# Server Stats Discord Bot

## Overview
This project aims to create a Discord bot that displays live statistics of a home server in a designated Discord channel. The bot fetches various system metrics such as CPU usage, network activity, disk I/O, RAM usage, disk space utilization, uptime, and hardware sensor data (if available), and presents them in real-time using Discord embeds.

## Purpose
The primary purpose of this project is to provide a convenient way for server administrators to monitor the performance and health of their home servers directly from Discord. It allows users to keep track of crucial system metrics without needing to access the server directly or use separate monitoring tools.

## Features
- **Real-time Monitoring**: The bot continuously fetches system statistics at regular intervals and updates the Discord channel with the latest information.
- **Customizable Configuration**: Users can configure the bot by providing their Discord bot token and the ID of the channel where they want the stats to be displayed.
- **Flexible Deployment**: The project includes Docker support, allowing for easy deployment in various environments.
- **Hardware Sensor Support**: If available, the bot can also fetch hardware sensor data such as fan RPM and temperature.

## Usage
1. **Set up Discord Bot**: Create a new Discord bot in the Discord Developer Portal and obtain the bot token.
2. **Configure Environment Variables**: Set the environment variables `botToken` and `channelID` with your Discord bot token and the ID of the channel where you want the stats to be displayed, respectively.
3. **Run the Bot**: Run the Docker container containing the bot using the provided Dockerfile.

## Deployment
### Docker
1. Build the Docker image:
   ```bash
   docker build -t server-stats-bot .
   ```
2. Run the Docker container:
   ```bash
   docker run -d --name server-stats-bot -e botToken=<YOUR_BOT_TOKEN> -e channelID=<YOUR_CHANNEL_ID> server-stats-bot
   ```

## Disclaimer
This project was primarily built for personal use but is designed to be reusable and customizable for other users. While it aims to provide accurate server statistics, it is provided as-is without any warranty. Users are encouraged to review and modify the code according to their requirements and security best practices.