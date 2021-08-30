var Commands = {}
module.exports = Commands

Commands.list = []
Commands.cache = {}

Commands.handle_command = async (interaction, data_override) => {
    if (!interaction.isCommand()) return

    var cmd = Commands.cache[interaction.commandName]
    if (cmd != null) {
        cmd.execute(interaction, data_override)
    } else {
        await interaction.reply({content: "` Something happened, and that command couldn't be ran! `", ephemeral: true})
    }
}

Commands.add = (command) => {
    Commands.list.push(command)
    Commands.cache[command.name] = command
    for (alias in command.alias) {
        Commands.cache[alias] = command
    }
}

Commands.register = async (server) => {
    var parsed_commands = []

    for (command in Commands.list) {
        if (command.filter & command.filter(server)) {
            var commands = command.register()
            if (commands) {
                if (typeof commands == "object") {
                    for (cmd in commands) {
                        parsed_commands.push(cmd.data.toJSON())
                    }
                } else {
                    parsed_commands.push(commands.data.toJSON())
                }
            }
        }
    }

    try {
        await Delta.REST.put(Routes.applicationGuildCommands(Delta.Client.application.id, server.id), {body: commands})
    } catch (err) {
        //
    }
}

Delta.InteractionMixins.push(Commands.handle_command)
Delta.Initialize.push(Commands)

Commands.init = async () => {

}
