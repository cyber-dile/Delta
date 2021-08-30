const Delta = require("../../delta")

var Global = {}
module.exports = Global

Global.data = {}
Global.loaded = true

Global.get = () => {
    if (!Global.loaded) {
        var data = Delta.Data.load("./save_data/global_data/data.json")
        if (data) {
            Delta.Data.load_defaults(data, Global.data)
            Global.data = data
        }
        Global.loaded = true
    }
    return Global.data
}

Global.save = () => {
    Delta.Data.save("./save_data/global_data/data.json", Global.get())
}