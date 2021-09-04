const Delta = require("../../../../delta")

var Command = {}
module.exports = Command

Command.rank = 7
Command.name = "bot"
Command.alias = []
Command.desc = "Lets you change global bot settings."

Command.execute = async (interaction, data_override) => {
    var gd = await Delta.Data.Global.get()
    var ud = await Delta.Data.User.get(interaction.user.id)
    var setting = interaction.options.getString("setting")
    var value = interaction.options.getString("value")
    if (data_override) {
        if (data_override.setting) {setting = data_override.setting}
        if (data_override.value) {value = data_override.value}
    }
    if (setting && value) {
        switch (setting) {
            case "error_channel":
                gd.settings.error_channel[0] = await Delta.Resolve.get_channel(value, interaction.guild)
                if (gd.settings.error_channel[0]) {
                    gd.settings.error_channel[0] = gd.settings.error_channel[0].id
                }
                interaction.reply({content: "` Setting set to " + gd.settings.error_channel[0].toString() + "! `", ephemeral: true})
                break
            default:
                interaction.reply({content: "` That's not a setting you can change! `", ephemeral: true})
        }
        Delta.Data.Global.save()
    } else {
        var {MessageEmbed} = Delta.Packages.Discord
        
        var desc = ""
        var ec = gd.settings.error_channel[0]
        if (ec) {
            ec = await Delta.Client.channels.fetch(ec)
            ec = "`" + ec.toString() + "`"
        }
        desc += "` error_channel: " + ec + " `\n` > The channel where errors are logged to. `\n"

        var embed = new MessageEmbed()
            .setTitle("Bot Settings")
            .setDescription(desc)
            .setFooter("Delta", Delta.Client.user.displayAvatarURL())
        
        interaction.reply({embeds: [embed], ephemeral: ud.settings.ephemeral[0]})
    }
}

Command.filter = async (guild) => {
    return guild.id == 863954812056109066
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)
    cmd.addSubcommand(scd =>
        scd.setName("set")
            .setDescription(prefix + "Sets a setting to a value")
            .addStringOption(option =>
                option.setName('setting')
                    .setDescription('The setting to change.')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('value')
                    .setDescription('The value to change a setting to.')
                    .setRequired(true))
    ).addSubcommand(scd => scd.setName("get").setDescription(prefix + "Gets a list of all the settings"))

    return cmd
}
