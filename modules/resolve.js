var Resolve = {}
module.exports = Resolve

Resolve.get_string = async(resolvable) => {
    return resolvable.toString()
}

Resolve.get_number = async (resolvable) => {
    return parseFloat(resolvable)
}

Resolve.get_boolean = async (resolvable) => {
    resolvable = await Resolve.get_string(resolvable)
    resolvable = resolvable.toLowerCase().substring(0,1)
    return resolvable == "t" || resolvable == "y"
}

Resolve.get_user = async (resolvable, server) => {
    if (typeof(resolvable) == "object" && resolvable instanceof Delta.Packages.Discord.GuildMember) {return resolvable.user}
    if (typeof(resolvable) == "object" && resolvable instanceof Delta.Packages.Discord.User) {return resolvable}
    if (server) {
        var u
        try { u = await server.members.fetch(resolvable) } catch (err) {}
        if (u) {return u.user}
        resolvable = await Resolve.get_string(resolvable)
        var members = await server.members.fetch()
        var member = members.find(m => m.nickname.toLowerCase().substr(0, resolvable.length) == resolvable.toLowerCase())
        return member
    } else {
        return (await Delta.Client.users.fetch(resolvable))
    }
    return false
}

Resolve.get_guild_member = async (resolvable, server) => {
    if (typeof(resolvable) == "object" && resolvable instanceof Delta.Packages.Discord.GuildMember) {return resolvable}
    if (!server) {return}
    var user = await Resolve.get_user(resolvable, server)
    if (user) {
        var m = await server.members.fetch(user.id)
        return m
    }
    return false
}

Resolve.get_channel = async (resolvable, server) => {
    if (typeof(resolvable) == "object" && resolvable instanceof Delta.Packages.Discord.Channel) {return resolvable}
    if (server) {
        var c
        try { c = (await server.channels.fetch(resolvable)) } catch (err) {}
        if (c) {return c}
        resolvable = await Resolve.get_string(resolvable)
        var channels = await server.channels.fetch()
        var channel = channels.find(c => c.name.toLowerCase().substr(0, resolvable.length) == resolvable.toLowerCase())
        return channel
    } else {
        try {return (await Delta.Client.channels.fetch(resolvable))} catch(err) {}
    }
    return false
}

Resolve.get_role = async (resolvable, server) => {
    if (typeof(resolvable) == "object" && resolvable instanceof Delta.Packages.Discord.Role) {return resolvable}
    if (!server) {return}
    var r
    try { r = (await server.roles.fetch(resolvable)) } catch (err) {}
    if (r) {return r}
    resolvable = await Resolve.get_string(resolvable)
    var roles = await server.roles.fetch()
    var role = roles.find(c => c.name.toLowerCase().substr(0, resolvable.length) == resolvable.toLowerCase())
    return role
    return false
}

Resolve.get_emoji = async (resolvable) => {
    if (typeof(resolvable) == "object" && resolvable instanceof Delta.Packages.Discord.Emoji) {return resolvable}
    var filter = e => (resolvable.toString() == e.toString())
    var result = Delta.Client.emojis.cache.find(filter)
    if (result) {return result}
    filter = e => (resolvable == e.id || e.name.toLowerCase() == resolvable.toLowerCase())
    var result = Delta.Client.emojis.cache.find(filter)
    if (result) {return result}
    filter = e => (e.name.toLowerCase().substr(0, resolvable.length) == resolvable.toLowerCase())
    var result = Delta.Client.emojis.cache.find(filter)
    if (result) {return result}
    return resolvable
}

Resolve.get_guild = async (resolvable) => {
    if (typeof(resolvable) == "object" && resolvable instanceof Delta.Packages.Discord.Guild) {return resolvable}
    var g = (await Delta.Client.guilds.fetch(resolvable))
    if (g) {return g}
    return false
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
    return false
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
    return false
}

Resolve.get_type = async (resolvable, type, server) => {
    switch (type) {
        case "string": return await Resolve.get_string(resolvable)
        case "number": return await Resolve.get_number(resolvable)
        case "boolean": return await Resolve.get_boolean(resolvable)
        case "user": return await Resolve.get_user(resolvable, server)
        case "guild_member": return await Resolve.get_guild_member(resolvable, server)
        case "channel": return await Resolve.get_channel(resolvable, server)
        case "role": return await Resolve.get_role(resolvable, server)
        case "emoji": return await Resolve.get_emoji(resolvable)
        case "guild": return await Resolve.get_guild(resolvable)
        case "rank": return await Resolve.get_rank(resolvable)
        case "rank_name": return await Resolve.get_rank_name(resolvable)
    }
    return false
}

Resolve.get_setting = async (setting, server) => await Resolve.get_type(setting[0], setting[1], server)
