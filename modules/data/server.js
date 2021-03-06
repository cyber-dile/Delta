var Server = {}
module.exports = Server

Server.cache = {}

Server.default_data = {
    settings: {
        promoted_role: [false, "role"],
        staff_role: [false, "role"]
    },
    misc: {
        nsfw: [false, "boolean"],
        all_channels_nsfw: [false, "boolean"]
    },
    perms: {}
}

Server.get = (id) => {
    return Delta.Data.load_cache(Server.cache, id, "./save_data/server_data/" + id + ".json", Server.default_data)
}

Server.save = (id) => {
    Delta.Data.save("./save_data/server_data/" + id + ".json", Server.get(id))
}