var Data = {}
module.exports = Data

Data.Ranks = require.main.require("./modules/data/ranks.js")

Data.save = async (filepath, data) => {

}

Data.load = async (filepath) => {

}

Data.load_defaults = (data, defaults) => {

}

Data.load_cache = (cache, id, filepath) => {

}

Data.iterate_js = (dir, callback) => {
    var fs = require("fs")
    for (filename of fs.readdirSync(dir)) {
        callback(require.main.require("./modules/modules/base/commands/" + filename))
    }
}
