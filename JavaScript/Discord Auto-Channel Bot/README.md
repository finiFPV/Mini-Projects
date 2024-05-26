# Discord Auto-Channel Bot

This Discord bot is designed to simplify server management by automating the creation and deletion of private voice channels. It ensures a seamless user experience by dynamically generating channels based on user activity.

## Features

- **Automated Channel Generation:** The bot automatically creates private voice channels when users join a designated channel.
- **Dynamic Management:** Channels are dynamically managed, closing when no users are present and reopening when users join again.
- **Customizable Configuration:** Bot administrators can customize channel names, categories, and permissions to suit their server's needs.
- **Effortless Setup:** Easy setup process allows server owners to quickly configure the bot for their server.

## How It Works

1. **User Joins Channel:** When a user joins the designated channel (e.g., "Create private channel"), the bot creates a private voice channel for them.
2. **Dynamic Channel Management:** Channels are automatically closed when they become empty and reopened when users join again.

## Installation

1. Clone the repository to your local machine.
2. CD into this dir.
3. Install dependencies using `npm install`.
4. Configure the bot token and other settings in the `config.json` file.
5. Run the bot using `node index.js`.

## Configuration

Modify the `config.json` file to configure the bot:

- **Token:** Your Discord bot token.
- **OwnerID:** The ID of the bot owner.
- **PrivateVoiceChannel:** Name of the channel where users trigger the creation of private channels.
- **PrivateChannelCategory:** Name of the category where private channels will be created.

## Usage

Once the bot is running and configured, you have ran the setup command in your Discord erver, users can trigger the creation of private channels by joining the designated channel. The bot will handle the rest automatically.