const Delta = require("../../delta")

var Ranks = {}
module.exports = Ranks

Ranks.get_rank = async (user, guild) => {
    user = await Delta.Resolve.get_user(user)

    var user_data = Delta.Data.User.get(user.id)
    if (user_data.OWNER) {return 7}
    if (user_data.SUPPORT) {return 5}
    if (user_data.BLOCKED) {return 0}

    if (guild) {
        if (user.id == guild.ownerId) {return 4}
        var member = await Delta.Resolve.get_guild_member(user, guild)
        if (member) {
            var sd = Delta.Data.Server.get(guild.id)
            var sr = await Delta.Resolve.get_setting(sd.settings.staff_role, guild)
            if (sr && member.roles.cache.get(sr.id)) {
                return 3
            }
            var pr = await Delta.Resolve.get_setting(sd.settings.promoted_role, guild)
            if (sr && member.roles.cache.get(sr.id)) {
                return 2
            }
        }
    }

    return 1
}
