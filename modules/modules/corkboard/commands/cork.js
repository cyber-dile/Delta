const Delta = require("../../../../delta")
const { message } = require("../../../evaluate")

var Command = {}
module.exports = Command

Command.rank = 3
Command.name = "cork"
Command.alias = []
Command.desc = "Allows you to change the server's corkboards."

Command.execute = async (interaction, data_override) => {
    if (interaction.guild) {
        var Corkboard = Delta.Modules.Corkboard
        var data = Corkboard.get_data(interaction.guild)
        var ud = Delta.Data.User.get(interaction.user.id)
        var eph = ud.settings.ephemeral[0]

        var {MessageEmbed} = Delta.Packages.Discord

        switch (interaction.options.getSubcommand()) {
            case "list":
                var desc = ""
                for (index in data.list) {
                    var board = data.list[index]
                    var ch = await Delta.Resolve.get_channel(board.channel)
                    if (ch) {ch = ch.toString()} else {ch = "`Channel doesn't exist anymore!`"}
                    var em = await Delta.Resolve.get_emoji(board.emoji)
                    if (typeof(em) == "object") {
                        em = em.toString()
                    } else if (em.startsWith("<")) {
                        em = "`Emoji doesn't exist anymore!`"
                    }
                    desc += "`#" + (parseInt(index) + 1) + ": [`" + ch + "`] (`" + em + "` x " + board.limit + ")`\n"
                }
                if (data.list.length == 0) {
                    desc = "` There aren't any corkboards in your server yet! `"
                }
                var embed = new MessageEmbed()
                    .setTitle("All Corkboards")
                    .setDescription(desc)
                    .setFooter("Delta", Delta.Client.user.displayAvatarURL())
                interaction.reply({content: "Showing list...", ephemeral: false})
                interaction.channel.send({embeds: [embed]})
                break
            case "add":
                var ch = interaction.options.getChannel("channel")
                var em = interaction.options.getString("emoji")
                var limit = interaction.options.getInteger("limit")

                if (!ch.isText()) {
                    interaction.reply({content: "` Channel has to be a text channel! `", ephemeral: true})
                    return
                }

                if (!limit) {
                    limit = 5
                }
                limit = Math.max(1, limit)
                em = (await Delta.Resolve.get_emoji(em)).toString()
                data.list.push({channel: ch.id, emoji: em, limit: limit})
                interaction.reply({content: "` Corkboard created! Its ID is " + data.list.length + ". `", ephemeral: eph})
                Delta.Data.Server.save(interaction.guild.id)
                break
            case "edit":
                var id = interaction.options.getInteger("id") - 1
                if (!data.list[id]) {
                    interaction.reply({content: "` This ID doesn't exist! `", ephemeral: true})
                    return
                }
                var value = interaction.options.getString("value")
                switch (interaction.options.getString("setting")) {
                    case "channel":
                        var channel = await Delta.Resolve.get_channel(value, interaction.guild)
                        if (!channel) {
                            interaction.reply({content: ` That's not a valid channel! `, ephemeral: true})
                            return
                        }
                        data.list[id].channel = channel.id
                        interaction.reply({content: `\` Corkboard #${(parseInt(id) + 1)}'s channel set to \`${channel.toString()}\`. \``, ephemeral: eph})
                        break
                    case "emoji":
                        var emoji = await Delta.Resolve.get_emoji(value).toString()
                        data.list[id].emoji = emoji
                        interaction.reply({content: `\` Corkboard #${(parseInt(id) + 1)}'s emoji set to \`${emoji}\`. \``, ephemeral: eph})
                        break
                    case "limit":
                        var limit = await Delta.Resolve.get_number(value)
                        limit = Math.max(1, Math.floor(limit))
                        data.list[id].limit = limit
                        interaction.reply({content: `\` Corkboard #${(parseInt(id) + 1)}'s limit set to ${limit}. \``, ephemeral: eph})
                        break
                }
                Delta.Data.Server.save(interaction.guild.id)
                break
            case "remove":
                var id = interaction.options.getInteger("id") - 1
                if (!data.list[id]) {
                    interaction.reply({content: "` This ID doesn't exist! `", ephemeral: true})
                }
                Corkboard.remove(interaction.guild, id)
                interaction.reply({content: "` Corkboard removed! `", ephemeral: eph})
                Delta.Data.Server.save(interaction.guild.id)
                break
        }
    } else {
        interaction.reply({content: "` You can't use this outside of servers! `", ephemeral: true})
    }
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)
    cmd.addSubcommand(scd =>
        scd.setName("list")
            .setDescription(prefix + "Lists off the existing corkboards."))
    cmd.addSubcommand(scd =>
        scd.setName("add")
            .setDescription(prefix + "Adds a new corkboard.")
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('The channel the corkboard should place its messages in.')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('emoji')
                    .setDescription('The emoji the corkboard listens for.')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('limit')
                    .setDescription('The amount of emojis needed for a message to appear.')))
    cmd.addSubcommand(scd =>
        scd.setName("edit")
            .setDescription(prefix + "Edits a corkboard.")
            .addIntegerOption(option =>
                option.setName('id')
                    .setDescription('The ID of the corkboard to remove.')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('setting')
                    .setDescription('The setting to edit.')
                    .setRequired(true)
                    .addChoice("channel", "channel")
                    .addChoice("limit", "limit")
                    .addChoice("emoji", "emoji"))
            .addStringOption(option =>
                option.setName('value')
                    .setDescription('The value to set the setting to.')
                    .setRequired(true)))
    cmd.addSubcommand(scd =>
        scd.setName("remove")
            .setDescription(prefix + "Removes a corkboard.")
            .addIntegerOption(option =>
                option.setName('id')
                    .setDescription('The ID of the corkboard to remove.')
                    .setRequired(true)))

    return cmd
}
