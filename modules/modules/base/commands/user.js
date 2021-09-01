const Delta = require("../../../../delta")

var Command = {}
module.exports = Command

Command.rank = 1
Command.name = "user"
Command.alias = []
Command.desc = "Lets you change your settings."

Command.execute = async (interaction, data_override) => {
    var sd = await Delta.Data.User.get(interaction.user.id)
    var setting = interaction.options.getString("setting")
    var value = interaction.options.getString("value")
    if (data_override) {
        if (data_override.setting) {setting = data_override.setting}
        if (data_override.value) {value = data_override.value}
    }
    if (setting && value) {
        switch (setting) {
            case "ephemeral":
                sd.settings.ephemeral[0] = await Delta.Resolve.get_boolean(value)
                interaction.reply({content: "` Setting set to " + sd.settings.ephemeral[0] + "! `", ephemeral: true})
            case "public_ephemeral":
                sd.settings.public_ephemeral[0] = await Delta.Resolve.get_boolean(value)
                interaction.reply({content: "` Setting set to " + sd.settings.public_ephemeral[0] + "! `", ephemeral: true})
                break
            default:
                interaction.reply({content: "` That's not a setting you can change! `", ephemeral: true})
        }
        Delta.Data.User.save(interaction.user.id)
    } else {
        var {MessageEmbed} = Delta.Packages.Discord
        
        var desc = ""
        desc += "` ephemeral: " + sd.settings.ephemeral[0] + " `\n` > Whether or not user commands (eg /user) should be hidden from the public. `\n"
        desc += "` public_ephemeral: " + sd.settings.public_ephemeral[0] + " `\n` > Whether or not cosmetic commands (eg /e926) should be hidden from the public. `\n"

        var embed = new MessageEmbed()
            .setTitle("User Settings")
            .setDescription(desc)
            .setFooter("Delta", Delta.Client.user.displayAvatarURL())
        
        interaction.reply({embeds: [embed], ephemeral: sd.settings.ephemeral[0]})
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
            .setDescription("Sets a setting to a value")
            .addStringOption(option =>
                option.setName('setting')
                    .setDescription('The setting to change.')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('value')
                    .setDescription('The value to change a setting to.')
                    .setRequired(true))
    ).addSubcommand(scd => scd.setName("get").setDescription("Gets a list of all the settings"))

    return cmd
}
