var Resolve = {}
module.exports = Resolve

Resolve.get_string = async(resolvable) => {
    return resolvable.toString()
}

Resolve.get_number = async (resolvable) => {
    return parseFloat(resolvable)
}

Resolve.get_boolean = async (resolvable) => {
    resolvable = get_string(resolvable)
    resolvable = resolvable.toLowerCase().substring(0,1)
    return resolvable == "t" || resolvable == "y"
}

Resolve.get_user = async (resolvable, server) => {
    if (typeof(resolvable) == "object" & resolvable instanceof Delta.Packages.Discord.GuildMember) {return resolvable.user}
    if (typeof(resolvable) == "object" & resolvable instanceof Delta.Packages.Discord.User) {return resolvable}
    if (server) {
        var u = await server.members.fetch(resolvable)
        if (u) {return u.user}
        resolvable = Resolve.get_string(resolvable)
        var members = await server.members.fetch()
        var member = members.find(m => m.nickname.toLowerCase().substr(0, resolvable.length) == resolvable.toLowerCase())
        return member
    } else {
        return (await Delta.Client.users.fetch(resolvable))
    }
}

Resolve.get_guild_member = async (resolvable, server) => {
    if (typeof(resolvable) == "object" & resolvable instanceof Delta.Packages.Discord.GuildMember) {return resolvable}
    if (!server) {return}
    var user = Resolve.get_user(resolvable, server)
    if (user) {return (await server.users.fetch(user.id))}
}

Resolve.get_channel = async (resolvable, server) => {
    if (typeof(resolvable) == "object" & resolvable instanceof Delta.Packages.Discord.Channel) {return resolvable}
    if (server) {
        var c = (await server.channels.fetch(resolvable))
        if (c) {return c}
        resolvable = Resolve.get_string(resolvable)
        var channels = await server.channels.fetch()
        var channel = channels.find(c => c.name.toLowerCase().substr(0, resolvable.length) == resolvable.toLowerCase())
        return channel
    } else {
        return (await Delta.Client.channels.fetch(resolvable))
    }
}

Resolve.get_role = async (resolvable, server) => {
    if (typeof(resolvable) == "object" & resolvable instanceof Delta.Packages.Discord.Role) {return resolvable}
    if (!server) {return}
    var r = (await server.roles.fetch(resolvable))
    if (r) {return r}
    resolvable = Resolve.get_string(resolvable)
    var roles = await server.roles.fetch()
    var role = roles.find(c => c.name.toLowerCase().substr(0, resolvable.length) == resolvable.toLowerCase())
    return role
}

Resolve.get_guild = async (resolvable) => {
    if (typeof(resolvable) == "object" & resolvable instanceof Delta.Packages.Discord.Guild) {return resolvable}
    var g = (await Delta.Client.guilds.fetch(resolvable))
    if (g) {return g}
}

Resolve.get_rank = async (resolvable) => {
    var ranks = [
        "BLOCKED",
        "USER",
        "PROMOTED",
        "STAFF",
        "SERVER",
        "SUPPORT",
        null,
        "OWNER"
    ]
    if (resolvable == null) {return}
    if (ranks.find(r => r == resolvable)) {return ranks.indexOf(resolvable)}
    if (ranks[resolvable]) {return resolvable}
}

Resolve.get_rank_name = async (resolvable) => {
    var ranks = [
        "BLOCKED",
        "USER",
        "PROMOTED",
        "STAFF",
        "SERVER",
        "SUPPORT",
        null,
        "OWNER"
    ]
    var rank = await Resolve.get_rank(resolvable)
    return ranks[rank]
}

Resolve.get_type = async (resolvable, type, server) => {
    switch (type) {
        case "string": return Resolve.get_string(resolvable)
        case "number": return Resolve.get_number(resolvable)
        case "boolean": return Resolve.get_boolean(resolvable)
        case "user": return Resolve.get_user(resolvable, server)
        case "guild_member": return Resolve.get_guild_member(resolvable, server)
        case "channel": return Resolve.get_channel(resolvable, server)
        case "role": return Resolve.get_role(resolvable, server)
        case "guild": return Resolve.get_guild(resolvable)
        case "rank": return Resolve.get_rank(resolvable)
        case "rank_name": return Resolve.get_rank_name(resolvable)
    }
}

Resolve.setting = async (setting, server) => await Resolve.get_type(setting[0], setting[1], server)
