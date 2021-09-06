var Module = {}
module.exports = Module

Delta.Data.Server.default_data.corkboard = {list: []} // {channel: "id", emoji: "toString", limit: 5}

Module.update = async (server, message, emoji, reacted) => {
    var boards = Module.get_all(message.guild, emoji)
    if (boards) {
        for (board of boards) {
            var channel = await Delta.Resolve.get_channel(board.channel)
            if (channel) {
                var reaction = message.reactions.resolve(emoji)
                var count = 0
                if (reaction) {count = reaction.count}
                var user = await Delta.Resolve.get_guild_member(message.author.id, message.guild)
                var should_exist = count >= board.limit
                var msgs = await channel.messages.fetch({limit: 100})
                var board_msg = msgs.find(msg => msg.content && msg.content.search(message.id) >= 0 && msg.content.search(emoji.toString()) >= 0)
                if (should_exist) {
                    var {MessageEmbed} = Delta.Packages.Discord
                    var username = user.nickname
                    if (!username) {
                        username = user.user.name
                    }
                    var embed = new MessageEmbed()
                        .setAuthor(username, user.user.displayAvatarURL(), message.url)
                        .setDescription(message.content.substr(0, 4096))
                        .setFooter("Delta", Delta.Client.user.displayAvatarURL())
                        .setTimestamp(message.createdTimestamp)
                    if (message.attachments.first()) {
                        embed.setImage(message.attachments.first().url)
                    }
                    var msg = {
                        content: message.channel.toString() + "` (ID: " + message.id + "): `" + emoji.toString() + "` x " + count + "`",
                        embeds: [embed]
                    }
                    if (board_msg) {
                        board_msg.edit(msg)
                    } else {
                        channel.send(msg)
                    }
                } else {
                    if (board_msg) {
                        board_msg.delete()
                    }
                }
            }
        }
    }
}

Module.get_data = (server) => {
    var gd = Delta.Data.Server.get(server.id)
    return gd.corkboard
}

Module.reaction = (message, emoji, user, reacted) => {
    var board = Module.get(message.guild, emoji)
    if (board) {
        Module.update(message.guild, message, emoji, reacted)
    }
}

Module.get = (server, emoji) => {
    var data = Module.get_data(server)
    for (index in data.list) {
        var board = data.list[index]
        if (board.emoji == emoji.toString()) {
            return index
        }
    }
}

Module.get_all = (server, emoji) => {
    var data = Module.get_data(server)
    var boards = []
    for (index in data.list) {
        var board = data.list[index]
        if (board.emoji == emoji.toString()) {
            boards.push(board)
        }
    }
    if (boards.length > 0) {return boards}
}

Module.remove = (server, index) => {
    var data = Module.get_data(server)
    data.list.splice(index, 1)
}

Module.load_commands = () => {
    Delta.Data.iterate_js("./modules/modules/corkboard/commands/", Delta.Commands.add)
}

Delta.Commands.module_list.push(Module.load_commands)
Delta.on_reaction.list.push(Module.reaction)