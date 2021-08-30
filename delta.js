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

Delta.Initialize = []
Delta.InteractionMixins = []
Delta.ReactionMixins = []
Delta.MessageMixins = []

Delta.Commands = require("./modules/commands.js")
Delta.Data = require("./modules/data.js")
Delta.Evaluate = require("./modules/evaluate.js")
Delta.Modules = require("./modules/modules.js")
Delta.Resolve = require("./modules/resolve.js")

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

Delta.mixin = (...funcs) => {
    return (...args) => {
        for (f in funcs) {
            f(...args)
        }
    }
}

Delta.Client.on('ready', () => {
  console.log(`Delta is now online.`);

  for (i = 0; i < Delta.Initialize.length; i++) {
      Delta.Initialize[i].init()
  }
});

Delta.Client.on('interactionCreate', async interaction => {
    for (i = 0; i < Delta.InteractionMixins.length; i++) {
        var value = Delta.InteractionMixins[i]
        if (value(interaction)) {
            return
        }
    }
});

Delta.Client.on('messageCreate', async message => {
    for (i = 0; i < Delta.MessageMixins.length; i++) {
        var value = Delta.MessageMixins[i]
        if (value(message)) {
            return
        }
    }
})

Delta.Client.on('messageReactionAdd', async reaction => {
    for (i = 0; i < Delta.ReactionMixins.length; i++) {
        var value = Delta.ReactionMixins[i]
        if (value(reaction, true)) {
            return
        }
    }
})
Delta.Client.on('messageReactionRemove', async reaction => {
    for (i = 0; i < Delta.ReactionMixins.length; i++) {
        var value = Delta.ReactionMixins[i]
        if (value(reaction, false)) {
            return
        }
    }
})

Delta.Client.login(process.env.TOKEN);
