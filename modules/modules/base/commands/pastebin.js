const Delta = require("../../../../delta")

var Command = {}
module.exports = Command

Command.rank = 7
Command.name = "pastebin"
Command.alias = []
Command.desc = "Runs Javascript code from a Pastebin ID."

Command.execute = async (interaction, data_override) => {
    var ud = await Delta.Data.User.get(interaction.user.id)
    var id = interaction.options.getString("id")
    if (data_override) {if (data_override.id) {id = data_override.id}}
    var code = await Delta.Evaluate.pastebin(id)
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
		option.setName('id')
			.setDescription('The ID to read from')
			.setRequired(true));

    return cmd
}
