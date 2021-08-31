var Command = {}
module.exports = Command

Command.rank = 7
Command.name = "spoof"
Command.alias = []
Command.desc = "Sends a message as the bot."

Command.execute = async (interaction, data_override) => {
    var message = interaction.options.getString("message")
    if (data_override) {if (data_override.message) {message = data_override.code}}
    await interaction.reply({content: "` Sending message... `", ephemeral: true})
    try {
        var data
        try {
            data = JSON.parse(message)
        } catch (err) {}
        if (typeof(data) == "object") {
            interaction.channel.send(data)
        } else {
            interaction.channel.send(message)
        }
        await interaction.editReply({content: "` Message sent successfully! `"})
    } catch (err) {
        await interaction.editReply({content: "` Error! `\n" + err})
    }
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)
    cmd.addStringOption(option =>
		option.setName('message')
			.setDescription('The message that should be sent')
			.setRequired(true));

    return cmd
}
