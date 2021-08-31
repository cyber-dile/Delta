const { DefaultUserAgent } = require('@discordjs/rest')

require('dotenv').config()

var Delta = {}
global.Delta = Delta
module.exports = Delta
Delta.Packages = {}
Delta.Packages.Discord = require('discord.js')
Delta.Packages.REST = require('@discordjs/rest')
Delta.Packages.Builder = require('@discordjs/builders')
Delta.Packages.DiscordAPITypes = require('discord-api-types/v9')
Delta.Packages.DiceRoller = require('rpg-dice-roller')

const { Client, Intents } = Delta.Packages.Discord;
const { REST } = Delta.Packages.REST
Delta.Flags = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING
]
Delta.Client = new Client({intents: Delta.Flags});
Delta.REST = new REST({ version: '9' }).setToken(process.env.token);

process.on('unhandledRejection', error => {
	console.log('Unhandled promise rejection:', error);
});

Delta.init_server = async (server, cmds) => {
    if (cmds) {
        Delta.Commands.register(server)
    }
}

class FunctionArray {
    list = []
    constructor(...new_list) {
        this.list = new_list
    }
    execute(...args) {
        for (var f of this.list) {
            f(...args)
        }
    }
}
Delta.FunctionArray = FunctionArray

Delta.Initialize = []
Delta.on_ready = new FunctionArray()
Delta.on_interaction = new FunctionArray()
Delta.on_message = new FunctionArray()
Delta.on_reaction = new FunctionArray()

Delta.Client.on('ready', () => {
    Delta.on_ready.execute()
});
Delta.Client.on('interactionCreate', async interaction => {
    Delta.on_interaction.execute(interaction)
});
Delta.Client.on('messageCreate', async message => {
    Delta.on_message.execute(message)
})
Delta.Client.on('messageReactionAdd', async reaction => {
    Delta.on_reaction.execute(reaction, true)
})
Delta.Client.on('messageReactionRemove', async reaction => {
    Delta.on_reaction.execute(reaction, false)
})
Delta.Client.on('guildCreate', async guild => {
    Delta.init_server(guild)
})

Delta.on_ready.list.push(async () => {
    console.log(`Delta is now online.`);

    for (var i = 0; i < Delta.Initialize.length; i++) {
        Delta.Initialize[i].init()
    }
    var guilds = Array.from((await Delta.Client.guilds.fetch()).values())
})

Delta.Commands = require("./modules/commands.js")
Delta.Data = require("./modules/data.js")
Delta.Evaluate = require("./modules/evaluate.js")
Delta.Modules = require("./modules/modules.js")
Delta.Resolve = require("./modules/resolve.js")

Delta.Modules.load("Base", "base")
// Delta.Modules.load("Channels", "channels")
// Delta.Modules.load("Corkboard", "corkboard")
// Delta.Modules.load("Role", "role")
// Delta.Modules.load("Support", "support")

Delta.Client.login(process.env.TOKEN);
