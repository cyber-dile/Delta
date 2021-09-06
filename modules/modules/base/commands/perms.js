const Delta = require("../../../../delta")

var Command = {}
module.exports = Command

Command.rank = 4
Command.name = "perms"
Command.alias = []
Command.desc = "Allows you to change the permissions of any commands that you can use."

var descs = [
    "You're blocked from Delta. You can't use any commands in the bot.",
    "You can use the default commands in the bot.",
    "You have the promoted role in the server you're currently in. You can use cosmetic commands in the bot.",
    "You have the staff role in the server you're currently in. You can use moderation commands in the bot.",
    "You are the owner of the server you're in. You can use server setting commands in the bot.",
    "You're registerred as a support user of Delta. You can use most commands in the bot.",
    null,
    "You're registerred as an owner of Delta. You can use every command in the bot."
]

Command.execute = async (interaction, data_override) => {
    if (interaction.guild) {
        var ud = Delta.Data.User.get(interaction.user.id)
        var rank = await Delta.Data.Ranks.get_rank(interaction.user, interaction.guild)
        var sd = Delta.Data.Server.get(interaction.guild.id)

        switch (interaction.options.getSubcommand()) {
            case "get":
                var command = Delta.Commands.cache[interaction.options.getString("command")]
                if (command) {
                    var r = command.rank
                    if (sd.perms[command.name]) {
                        r = sd.perms[command.name]
                    }
                    var d = await Delta.Resolve.get_rank_name(r)
                    interaction.reply({content: "` The required rank needed for /" + command.name + " is [" + r + " - " + d + "]. `", ephemeral: ud.settings.ephemeral[0]})
                } else {
                    interaction.reply({content: "` That's not a valid command! `", ephemeral: true})
                }
                break
            case "set":
                var value = interaction.options.getInteger("rank")
                value = Math.max(0, Math.min(value, rank))
                var command = Delta.Commands.cache[interaction.options.getString("command")]
                if (command) {
                    var r = command.rank
                    var tr = command.rank
                    if (sd.perms[command.name] != null) { tr = sd.perms[command.name] }
                    if (tr > rank) {
                        interaction.reply({content: "` You don't have the permissions to edit that command! `", ephemeral: true})
                        return
                    }
                    if (value == r) {
                        sd.perms[command.name] = null
                    } else {
                        sd.perms[command.name] = value
                    }
                    var tr = command.rank
                    if (sd.perms[command.name] != null) { tr = sd.perms[command.name] }
                    var d = await Delta.Resolve.get_rank_name(tr)
                    interaction.reply({content: "` Set the required rank needed for /" + command.name + " to [" + tr + " - " + d + "]. `", ephemeral: ud.settings.ephemeral[0]})
                    Delta.Data.Server.save(interaction.guild.id)
                } else {
                    interaction.reply({content: "` That's not a valid command! `", ephemeral: true})
                }
                break
        }
    } else {
        interaction.reply({content: "` You can't use this outside of servers! `", ephemeral: true})
    }
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)
    cmd.addSubcommand(scd =>
        scd.setName("set")
            .setDescription(prefix + "Sets the rank required to run a command.")
            .addStringOption(option =>
                option.setName('command')
                    .setDescription('The command to change.')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('rank')
                    .setDescription('The rank to set the command to.')
                    .setRequired(true)))
    cmd.addSubcommand(scd =>
        scd.setName("get")
            .setDescription(prefix + "Gets the rank required to run a command.")
            .addStringOption(option =>
                option.setName('command')
                    .setDescription('The command to see.')
                    .setRequired(true)))

    return cmd
}
