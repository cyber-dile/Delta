var Ranks = {}
module.exports = Ranks

Ranks.get_rank = async (user, guild) => {
    user = await Delta.Resolve.get_user(user)
    if (user.id == "118531631408480257") {return 7}

    var user_data = {}
    if (user_data.OWNER) {return 7}
    if (user_data.SUPPORT) {return 5}
    if (user_data.BLOCKED) {return 0}

    if (guild) {
        if (user.id == guild.ownerid) {return 4}
        var member = Delta.Resolve.get_guild_member(user, guild)
        // aaagh
    }

    return 1
}