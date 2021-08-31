const Delta = require("../../../../delta")

var Command = {}
module.exports = Command

Command.rank = 5
Command.name = "refresh"
Command.alias = []
Command.desc = "Refreshes the bot's commands in the server."

Command.execute = async (interaction, data_override) => {
    var all = interaction.options.getString("all")
    if (data_override) {if (data_override.all) {all = data_override.all}}
    if (all) {
        var s = "` Updating servers... `"
        await interaction.reply({content: s, ephemeral: true})
        var servers = await Delta.Client.guilds.fetch()
        for (server of servers.values()) {
            await interaction.editReply(s + "\n` Refreshing " + server.name + "... `")
            await Delta.init_server(server, true)
            s = s + "\n` Refreshed " + server.name + "! `"
        }
        await interaction.editReply(s)
    } else {
        await interaction.reply({content: "` Refreshing server... `", ephemeral: true})
        Delta.init_server(interaction.guild, true)
        await interaction.editReply("` Refreshed " + interaction.guild.name + "! `")
    }
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)
    cmd.addStringOption(option =>
		option.setName('all')
			.setDescription('Refresh all servers?')
            .addChoice("all", "all"))

    return cmd
}