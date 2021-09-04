var Data = {}
module.exports = Data

var fs = require("fs")

Data.Global = require.main.require("./modules/data/global.js")
Data.Ranks = require.main.require("./modules/data/ranks.js")
Data.Server = require.main.require("./modules/data/server.js")
Data.User = require.main.require("./modules/data/user.js")

Data.create_dir = (filepath) => {
    try {
        if (!fs.existsSync(filepath)) {
            fs.mkdirSync(filepath)
        }
    } catch(err) {}
}

Data.save = (filepath, data) => {
    data = JSON.stringify(data)
    fs.writeFileSync(filepath, data)
}

Data.load = (filepath) => {
    if (fs.existsSync(filepath)) {
        var data = fs.readFileSync(filepath)
        data = JSON.parse(data)
        return data
    }
}

Data.clone = (obj) => {
    if (typeof(obj) == "object") {
        return JSON.parse(JSON.stringify(obj))
    } else {
        return obj
    }
}

Data.load_defaults = (data, defaults) => {
    if (!defaults) {return}
    for (key in defaults) {
        if (typeof(data[key]) == "undefined") {
            data[key] = Data.clone(defaults[key])
        } else if (typeof(defaults[key]) == "object") {
            Data.load_defaults(data[key], defaults[key])
        }
    }
}

Data.load_cache = (cache, id, filepath, defaults) => {
    if (cache[id]) {return cache[id]}
    var data = Data.load(filepath)
    if (!data) {
        data = Data.clone(defaults)
    }
    Data.load_defaults(data, defaults)
    cache[id] = data
    return cache[id]
}

Data.iterate_js = (dir, callback) => {
    var fs = require("fs")
    for (filename of fs.readdirSync(dir)) {
        callback(require.main.require("./modules/modules/base/commands/" + filename))
    }
}

Data.iterate_load = (dir, callback) => {
    var fs = require("fs")
    for (filename of fs.readdirSync(dir)) {
        callback(filename, Data.load(dir + filename))
    }
}

Data.iterate_save = (dir, cache) => {
    var fs = require("fs")
    for (index in cache) {
        Data.save(dir + index + ".json", cache[index])
    }
}

Delta.Initialize.push(Data)
Data.init = () => {
    Data.create_dir("./save_data/")
    Data.create_dir("./save_data/user_data/")
    Data.create_dir("./save_data/server_data/")
    Data.create_dir("./save_data/global_data/")
    Data.create_dir("./save_data/misc/")
    Data.create_dir("./save_data/misc/eval/")
    Data.create_dir("./save_data/misc/eval/message/")
    Data.create_dir("./save_data/misc/eval/reaction/")
    Data.create_dir("./save_data/misc/eval/reaction/channels/")
    Data.create_dir("./save_data/misc/eval/reaction/messages/")
    Data.create_dir("./save_data/misc/eval/interaction/")
    Data.create_dir("./save_data/misc/eval/interaction/channels/")
    Data.create_dir("./save_data/misc/eval/interaction/messages/")
    Data.create_dir("./save_data/misc/eval/auto/")
    Data.create_dir("./save_data/misc/eval/time/")
    Data.create_dir("./save_data/misc/eval/startup/")
}