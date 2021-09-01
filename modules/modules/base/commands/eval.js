var Command = {}
module.exports = Command

Command.rank = 7
Command.name = "eval"
Command.alias = []
Command.desc = "Runs Javascript code."

Command.execute = async (interaction, data_override) => {
    var ud = await Delta.Data.User.get(interaction.user.id)
    var code = interaction.options.getString("code")
    if (data_override) {if (data_override.code) {code = data_override.code}}
    await interaction.reply({content: "` Evaluating code... `", ephemeral: ud.settings.ephemeral[0]})
    try {
        eval(code)
        await interaction.editReply({content: "` Code executed successfully! `"})
    } catch (err) {
        await interaction.editReply({content: "` Code error! `\n" + err})
    }
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)
    cmd.addStringOption(option =>
		option.setName('code')
			.setDescription('The JavaScript code that should be executed')
			.setRequired(true));

    return cmd
}
