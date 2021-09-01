var Command = {}
module.exports = Command

Command.rank = 1
Command.name = "e926"
Command.alias = []
Command.desc = "Looks up an image on e926."

Command.results = {}

Command.lookup = (tags, callback) => {
    var request = require("request")
    request.get({
        "method" : "GET",
        "uri": "https://e621.net/posts.json?tags=" + tags + "%20rating:s",
        "followRedirect":false,
        "headers": {
            'User-Agent': 'Delta (by @cyberdile)'
        }
    }, (err, res, body) => {
        var post = JSON.parse(body);
        callback(post)
    });
}

Command.display = async (interaction, id) => {
    if (Command.results[id]) {
        var tags = Command.results[id][0]
        var posts = Command.results[id][1]
        var page = Command.results[id][2]
        var post = posts[page]
        var {MessageActionRow, MessageButton, MessageEmbed} = Delta.Packages.Discord

        var row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("previous")
                    .setStyle("PRIMARY")
                    .setLabel("⭠")
                    .setDisabled(page == 0),
                new MessageButton()
                    .setCustomId("next")
                    .setStyle("PRIMARY")
                    .setLabel("⭢")
                    .setDisabled(page >= posts.length - 1)
            )

        var artist = ""
        if (post.tags.artist.length > 0) {
            artist = "(" + post.tags.artist.join(", ") + ")"
        }
        
        var embed = new MessageEmbed()
            .setTitle("e926 - " + tags + " " + artist)
            .setDescription("[Link to Original](https://e926.net/posts/" + post.id + ")")
            .setFooter("(Post #" + post.id + ") - " + (page + 1) + " / " + posts.length, Delta.Client.user.displayAvatarURL())
            .setImage(post.file.url)

        if (interaction.type == "APPLICATION_COMMAND") {await interaction.editReply({content: null, components: [row], embeds: [embed]})}
        else {await interaction.update({content: null, components: [row], embeds: [embed]})}
    } else {
        await interaction.update("` It's been too long since this was originally sent - try using the command again! `")
    }
}

Command.execute = async (interaction, data_override) => {
    var tags = interaction.options.getString("tags")
    if (data_override) {if (data_override.tags) {tags = data_override.tags}}
    await interaction.reply("` Looking up your tags... `")

    Command.lookup(tags, async response => {
        var posts = response.posts
        if (posts.length > 0) {
            Command.results[interaction.id] = [tags, posts, 0]
            Command.display(interaction, interaction.id)
            setTimeout(() => {
                Command.results[interaction.id] = null // clear out commands from memory in 10 minutes. that's lengthy enough to get your use out of it
            }, 10 * 60 * 1000);
        } else {
            await interaction.editReply("` Your query had no results! `")
        }
    })
}

Command.button = async (button, interaction, data_override) => {
    var id = interaction.id
    if (Command.results[id]) {
        switch (button.customId) {
            case "previous":
                Command.results[id][2] -= 1
                break
            case "next":
                Command.results[id][2] += 1
                break
        }
    }
    Command.display(button, id)
}

Command.filter = async (guild) => {
    return true
}

Command.register = async (guild, prefix) => {
    var { SlashCommandBuilder } = Delta.Packages.Builder

    var cmd = new SlashCommandBuilder().setName(Command.name).setDescription(prefix + Command.desc)
    cmd.addStringOption(option =>
		option.setName('tags')
			.setDescription('The tags to search for')
			.setRequired(true));

    return cmd
}