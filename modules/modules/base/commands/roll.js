var Command = {}
module.exports = Command

Command.rank = 1
Command.name = "roll"
Command.alias = []
Command.desc = "Rolls a dice using https://www.npmjs.com/package/rpg-dice-roller."

Command.update = async (interaction) => {
    var {DiceRoll} = Delta.Packages.DiceRoller
    var {MessageEmbed} = Delta.Packages.Discord
    var msg = interaction.message
    if (!msg) {
        msg = await interaction.fetchReply()
    }
    var embed = new MessageEmbed(msg.embeds[0])
    var roll = embed.title.substring(12)
    var result = new DiceRoll(roll)
    embed.setDescription(embed.description + "\n` " + result.output + " `")
    if (interaction.update) {
        await interaction.update({embeds: [embed]})
    } else {
        await interaction.editReply({embeds: [embed]})
    }
}

Command.clear = async (interaction) => {
    var {DiceRoll} = Delta.Packages.DiceRoller
    var {MessageEmbed} = Delta.Packages.Discord
    var msg = interaction.message
    var embed = new MessageEmbed(msg.embeds[0])
    var roll = embed.title.substring(12)
    var result = new DiceRoll(roll)
    embed.setDescription("` (min) " + result.minTotal + " < (avg) " + result.averageTotal + " < (max) " + result.maxTotal + " `")
    embed.setDescription(embed.description + "\n` " + result.output + " `")
    await interaction.update({embeds: [embed]})
}

Command.execute = async (interaction, data_override) => {
    var {DiceRoll} = Delta.Packages.DiceRoller
    var {MessageActionRow, MessageButton, MessageEmbed} = Delta.Packages.Discord
    var ud = Delta.Data.User.get(interaction.user.id)
    var roll = interaction.options.getString("roll")
    if (data_override) {if (data_override.roll) {roll = data_override.roll}}

    var result = new DiceRoll(roll)
    
    var embed = new MessageEmbed()
        .setTitle("Dice Roll - " + roll)
        .setDescription("` (min) " + result.minTotal + " < (avg) " + result.averageTotal + " < (max) " + result.maxTotal + " `")
        .setFooter("Delta", Delta.Client.user.displayAvatarURL())
    
    var row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("reroll")
                .setStyle("PRIMARY")
                .setLabel("Roll Again"),
            new MessageButton()
                .setCustomId("clear")
                .setStyle("PRIMARY")
                .setLabel("Clear Logs")
        )
    
    await interaction.reply({embeds: [embed], components: [row], ephemeral: ud.settings.public_ephemeral[0]})

    Command.update(interaction)
}

Command.button = async (button, og) => {
    switch (button.customId) {
        case "reroll":
            Command.update(button)
            break
        case "clear":
            Command.clear(button)
            break
    }
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)
    cmd.addStringOption(option =>
		option.setName('roll')
			.setDescription('Your query to roll')
			.setRequired(true));

    return cmd
}
