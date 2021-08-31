var Command = {}
module.exports = Command

Command.rank = 5
Command.name = "refresh"
Command.alias = []
Command.desc = "Refreshes the bot's commands in the server."

Command.execute = async (interaction, data_override) => {
    await interaction.reply({content: "` Refreshing server... `", ephemeral: true})
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)
    cmd.addStringOption(option =>
		option.setName('option')
			.setDescription('Refresh all servers?')

    return cmd
}
