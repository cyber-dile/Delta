var Command = {}
module.exports = Command

Command.rank = 1
Command.name = "ping"
Command.alias = []
Command.desc = "Displays information about the bot's connectivity."

Command.execute = async (interaction, data_override) => {
    var ud = Delta.Data.User.get(interaction.user.id)
    await interaction.reply({content: "` Pong! `", ephemeral: ud.settings.ephemeral[0]})
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)

    return cmd
}
