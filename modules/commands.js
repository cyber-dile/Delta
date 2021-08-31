var Commands = {}
module.exports = Commands

Commands.list = []
Commands.cache = {}

Commands.execute = async (interaction, data_override) => {
    if (!interaction.isCommand()) return

    var cmd = Commands.cache[interaction.commandName]
    if (cmd != null) {
        var rank = await Delta.Data.Ranks.get_rank(interaction.user, interaction.guild)
        if (rank >= cmd.rank) {
            cmd.execute(interaction, data_override)
        } else {
            var your_name = await Delta.Resolve.get_rank_name(rank)
            var cmd_name = await Delta.Resolve.get_rank_name(cmd.rank)
            await interaction.reply({content: "` You can't use this command- you're rank [" + rank + " - " + your_name + "], but this command needs rank [" + cmd.rank + " - " + cmd_name + "]! `", ephemeral: true})
        }
    } else {
        await interaction.reply({content: "` Something happened, and that command couldn't be ran! `", ephemeral: true})
    }
}

Commands.add = (command) => {
    Commands.list.push(command)
    Commands.cache[command.name] = command
    for (alias of command.alias) {
        Commands.cache[alias] = command
    }
}

Commands.register = async (server) => {
    var parsed_commands = []
    var { Routes } = Delta.Packages.DiscordAPITypes

    for (var i = 0; i < Commands.list.length; i++) {
        var command = Commands.list[i]
        var prefix = "[" + command.rank + " - " + (await Delta.Resolve.get_rank_name(command.rank)) + "] "
        if (!command.filter || (await command.filter(server))) {
            var commands = await command.register(server, prefix)
            if (commands) {
                if (Array.isArray(commands)) {
                    for (cmd of commands) {
                        parsed_commands.push(cmd.toJSON())
                    }
                } else {
                    parsed_commands.push(commands.toJSON())
                }
            }
        }
    }

    try {
        await Delta.REST.put(Routes.applicationGuildCommands(Delta.Client.application.id, server.id), {body: parsed_commands})
        console.log("Slash commands successfully updated for " + server.name + " (" + server.id + ").")
    } catch (err) {
        console.log(err)
    }
}

Delta.on_interaction.list.push(Commands.execute)
Delta.Initialize.push(Commands)

Commands.init = async () => {

}
