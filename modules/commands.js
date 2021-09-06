var Commands = {}
module.exports = Commands

Commands.module_list = []

Commands.list = []
Commands.cache = {}

Commands.execute = async (interaction, data_override) => {
    if (interaction.isCommand()) {
        var sd = {perms: {}}
        if (interaction.guild) {sd = Delta.Data.Server.get(interaction.guild.id)}
        var cmd = Commands.cache[interaction.commandName]
        if (cmd != null) {
            var cmdrank = cmd.rank
            if (sd && sd.perms[cmd.name]) {cmdrank = sd.perms[cmd.name]}
            var rank = await Delta.Data.Ranks.get_rank(interaction.user, interaction.guild)
            if (rank >= cmdrank) {
                cmd.execute(interaction, data_override)
            } else {
                var your_name = await Delta.Resolve.get_rank_name(rank)
                var cmd_name = await Delta.Resolve.get_rank_name(cmdrank)
                await interaction.reply({content: "` You can't use this command- you're rank [" + rank + " - " + your_name + "], but this command needs rank [" + cmdrank + " - " + cmd_name + "]! `", ephemeral: true})
            }
        } else {
            await interaction.reply({content: "` Something happened, and that command couldn't be ran! `", ephemeral: true})
        }
    } else if (interaction.isButton()) {
        var original = interaction.message.interaction
        if (original && original.commandName) {
            var cmd = Commands.cache[original.commandName]
            if (typeof(cmd) != "undefined" && cmd.button) {
                cmd.button(interaction, original)
            }
        }
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
    var sd = Delta.Data.Server.get(server.id)
    var parsed_commands = []
    var { Routes } = Delta.Packages.DiscordAPITypes

    for (var i = 0; i < Commands.list.length; i++) {
        var command = Commands.list[i]
        var cmdrank = command.rank
        if (sd.perms[command.name]) {cmdrank = sd.perms[command.name]}
        var prefix = "[" + cmdrank + " - " + (await Delta.Resolve.get_rank_name(cmdrank)) + "] "
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
    } catch (err) {
        console.log(err)
    }
}

Commands.load_commands = () => {
    Commands.list = []
    Commands.cache = {}
    for (f of Commands.module_list) {
        f()
    }
}

Delta.on_interaction.list.push(Commands.execute)
Delta.Initialize.push(Commands)

Commands.init = async () => {
    Commands.load_commands()
}
