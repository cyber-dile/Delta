const Delta = require("../../../../delta")

var Command = {}
module.exports = Command

Command.rank = 5
Command.name = "misc"
Command.alias = []
Command.desc = "Lets you change miscellaneous bot settings for the server."

Command.execute = async (interaction, data_override) => {
    var sd = Delta.Data.Server.get(interaction.guild.id)
    var ud = Delta.Data.User.get(interaction.user.id)
    var setting = interaction.options.getString("setting")
    var value = interaction.options.getString("value")
    if (data_override) {
        if (data_override.setting) {setting = data_override.setting}
        if (data_override.value) {value = data_override.value}
    }
    if (setting && value) {
        switch (setting) {
            case "nsfw":
                sd.misc.nsfw[0] = await Delta.Resolve.get_boolean(value)
                interaction.reply({content: "` Setting set to " + sd.misc.nsfw[0] + "! `", ephemeral: true})
                break
            case "all_channels_nsfw":
                sd.misc.all_channels_nsfw[0] = await Delta.Resolve.get_boolean(value)
                interaction.reply({content: "` Setting set to " + sd.misc.all_channels_nsfw[0] + "! `", ephemeral: true})
                break
            default:
                interaction.reply({content: "` That's not a setting you can change! `", ephemeral: true})
        }
        Delta.Data.Server.save(interaction.guild.id)
    } else {
        var {MessageEmbed} = Delta.Packages.Discord
        
        var desc = ""
        desc += "` nsfw " + sd.misc.nsfw[0] + " `\n` > Whether or not NSFW channels should be enabled. `\n"
        desc += "` all_channels_nsfw: " + sd.misc.all_channels_nsfw[0] + " `\n` > Whether or not all channels are allowed to have NSFW channels ran in. `\n"

        var embed = new MessageEmbed()
            .setTitle("Miscellaneous Settings")
            .setDescription(desc)
            .setFooter("Delta", Delta.Client.user.displayAvatarURL())
        
        interaction.reply({embeds: [embed], ephemeral: ud.settings.ephemeral[0]})
    }
}

Command.filter = async (guild) => {
    return true
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
