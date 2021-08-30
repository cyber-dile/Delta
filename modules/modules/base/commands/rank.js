var Command = {}
module.exports = Command

Command.rank = 0
Command.name = "rank"
Command.alias = []
Command.desc = "[1 - USER] Shows you your rank."

var descs = [
    "You're blocked from Delta. You can't use any commands in the bot.",
    "You can use the default commands in the bot.",
    "You have the promoted role in the server you're currently in. You can use cosmetic commands in the bot.",
    "You have the staff role in the server you're currently in. You can use moderation commands in the bot.",
    "You are the owner of the server you're in. You can use server setting commands in the bot.",
    "You're registerred as a support user of Delta. You can use most commands in the bot.",
    null,
    "You're registerred as an owner of Delta. You can use every command in the bot."
]

Command.execute = async (interaction, data_override) => {
    var rank = await Delta.Data.Ranks.get_rank(interaction.user, interaction.guild)
    var name = await Delta.Resolve.get_rank_name(rank)
    var desc = descs[rank]

    var {MessageEmbed} = Delta.Packages.Discord

    var embed = new MessageEmbed()
        .setTitle("[" + rank + " - " + name + "]")
        .setDescription(desc)
        .setFooter("Delta", Delta.Client.user.displayAvatarURL())
    
    await interaction.reply({ephemeral: true, embeds: [embed]})
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(Command.desc)

    return cmd
}
