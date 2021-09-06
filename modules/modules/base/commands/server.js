const Delta = require("../../../../delta")

var Command = {}
module.exports = Command

Command.rank = 4
Command.name = "server"
Command.alias = []
Command.desc = "Lets you change bot settings for the server."

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
            case "promoted_role":
                sd.settings.promoted_role[0] = await Delta.Resolve.get_role(value, interaction.guild)
                if (sd.settings.promoted_role[0]) {
                    sd.settings.promoted_role[0] = sd.settings.promoted_role[0].id
                }
                interaction.reply({content: "` Setting set to " + sd.settings.promoted_role[0] + "! `", ephemeral: true})
                break
            case "staff_role":
                sd.settings.staff_role[0] = await Delta.Resolve.get_role(value, interaction.guild)
                if (sd.settings.staff_role[0]) {
                    sd.settings.staff_role[0] = sd.settings.staff_role[0].id
                }
                interaction.reply({content: "` Setting set to " + sd.settings.staff_role[0] + "! `", ephemeral: true})
                break
            default:
                interaction.reply({content: "` That's not a setting you can change! `", ephemeral: true})
        }
        Delta.Data.Server.save(interaction.guild.id)
    } else {
        var {MessageEmbed} = Delta.Packages.Discord
        
        var desc = ""
        
        var pr = sd.settings.promoted_role[0]
        if (pr) {
            pr = await interaction.guild.roles.fetch(pr)
            pr = "`" + pr.toString() + "`"
        }
        desc += "` promoted_role: " + pr + " `\n` > The role that gives the PROMOTED rank in the bot. `\n"
        var sr = sd.settings.staff_role[0]
        if (sr) {
            sr = await interaction.guild.roles.fetch(sr)
            sr = "`" + sr.toString() + "`"
        }
        desc += "` staff_role: " + sr + " `\n` > The role that gives the STAFF rank in the bot. `\n"

        var embed = new MessageEmbed()
            .setTitle("Server Settings")
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
