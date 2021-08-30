const Delta = require("../../delta")

var User = {}
module.exports = User

User.cache = {}

User.default_data = {
    BLOCKED: false,
    OWNER: false,
    PROMOTED: false
}

User.get = (id) => {
    return Delta.Data.load_cache(User.cache, id, "./save_data/user_data/" + id + ".json", User.default_data)
}

User.save = (id) => {
    Delta.Data.save("./save_data/user_data/" + id + ".json", User.get(id))
}