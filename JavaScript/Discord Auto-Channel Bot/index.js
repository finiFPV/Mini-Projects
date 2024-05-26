const { Client, Intents, ChannelType, PermissionFlagsBits } = require('discord.js');
const { token, ownerId } = require('./config.json'); // Load token and ownerId from a separate config file
const privateVoiceChannelName = "➕ Create private channel";
const privateChannelCategoryName = "Private Channels";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Bot is in ${client.guilds.cache.size} guilds as of boot`);
    client.application.commands.set([
        {
            name: 'ping',
            description: "Replies with pong (bot's latency).",
        },
        {
            name: 'setup',
            description: "Setups the server so the bot can be properly used.",
        }
    ]);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    switch (interaction.commandName) {
        case 'ping':
            await interaction.reply({
                embeds: [
                    {
                        type: "rich",
                        title: `🏓 Pong!`,
                        color: Math.floor(Math.random() * 16777214) + 1,
                        fields: [
                            {
                                name: `API latency:`,
                                value: `\`${Math.round(client.ws.ping)}\``
                            },
                            {
                                name: `Response latency:`,
                                value: `\`${Date.now() - interaction.createdTimestamp}\``
                            }
                        ]
                    }
                ], ephemeral: interaction.member.id === ownerId
            });
            break;

        case 'setup':
            if (!interaction.member.permissions.has("ADMINISTRATOR") && interaction.member.id !== ownerId) {
                return await interaction.reply({
                    embeds: [
                        {
                            type: "rich",
                            title: `❌⚙️ Failed!`,
                            description: "You don't have the `administrator` permission!",
                            color: 0xff0000
                        }
                    ]
                });
            }

            let privateChannel = interaction.guild.channels.cache.find(channel => channel.name === privateVoiceChannelName);
            let category = interaction.guild.channels.cache.find(channel => channel.name === privateChannelCategoryName && channel.type === 'GUILD_CATEGORY');

            let changesMade = false

            if (!privateChannel) {
                privateChannel = await interaction.guild.channels.create(privateVoiceChannelName, { type: 'GUILD_VOICE' });
                changesMade = true
            }

            if (!category) {
                category = await interaction.guild.channels.create(privateChannelCategoryName, { type: 'GUILD_CATEGORY' });
                changesMade = true
            }

            await privateChannel.setParent(category);

            await interaction.reply({
                embeds: [
                    {
                        type: "rich",
                        title: `✅⚙️ Setup complete!`,
                        description: changesMade ?
                            "Channel: `➕ Create private channel` was created." :
                            "No setting up was needed. Everything is already set up.",
                        color: 0x00ff2a
                    }
                ]
            });
            break;

        default:
            break;
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (!newState.channel || newState.channel.name !== privateVoiceChannelName) return;

    const userName = newState.member.nickname || newState.member.user.username;
    let category = newState.guild.channels.cache.find(channel => channel.name === privateChannelCategoryName && channel.type === 'GUILD_CATEGORY');

    if (!category) {
        category = await newState.guild.channels.create(privateChannelCategoryName, { type: 'GUILD_CATEGORY' });
    }

    const permissions = [
        { id: newState.guild.id, deny: [PermissionFlagsBits.VIEW_CHANNEL] },
        { id: newState.member.id, allow: [PermissionFlagsBits.MANAGE_CHANNELS, PermissionFlagsBits.MANAGE_ROLES] }
    ];

    const channel = await newState.guild.channels.create(`${userName}'s channel`, {
        type: 'GUILD_VOICE',
        parent: category,
        permissionOverwrites: permissions
    });

    await newState.member.voice.setChannel(channel);

    if (oldState.channel && oldState.channel.members.size === 0) {
        await oldState.channel.delete();
        if (category.children.size === 0) await category.delete();
    }
});

client.login(token);
