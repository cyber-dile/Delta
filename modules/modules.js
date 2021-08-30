var Modules = {}
module.exports = Modules

Modules.load = (name, folder) => Modules[name] = require.main.require("./modules/modules/${folder}/module.js")
