var Module = {}
module.exports = Module

Module.load_commands = () => {
    Delta.Data.iterate_js("./modules/modules/base/commands/", Delta.Commands.add)
}

Delta.Commands.module_list.push(Module.load_commands)