var Command = {}
module.exports = Command

Command.rank = 1
Command.name = "e926"
Command.alias = []
Command.desc = "Looks up an image on e926."

Command.execute = async (interaction, data_override) => {
    await interaction.reply({content: "` This command isn't implemented yet. `", ephemeral: true})
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)
    cmd.addStringOption(option =>
		option.setName('tags')
			.setDescription('The tags to search for')
			.setRequired(true));

    return cmd
}