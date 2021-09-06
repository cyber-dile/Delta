var Evaluate = {}
module.exports = Evaluate

Evaluate.message_channels = {} // id -> function
Evaluate.reaction_messages = {} // id -> function
Evaluate.reaction_channels = {} // id -> function
Evaluate.interaction_messages = {} // id -> function
Evaluate.interaction_channels = {} // id -> function
Evaluate.time_stamps = {} // id -> [time, function]
Evaluate.auto_execs = {} // id -> function
Evaluate.startup = {} // id -> function

Evaluate.message = async (message) => {
    if (Evaluate.message_channels[message.id]) {
        eval(Evaluate.message_channels[message.id])
    }
}

Evaluate.reaction = async (message, emoji, user, reacted) => {
    if (Evaluate.reaction_messages[message.id]) {
        if (typeof(Evaluate.reaction_messages[message.id]) == "object") {
            for (index in Evaluate.reaction_messages[message.id]) {
                var code = Evaluate.reaction_messages[message.id][index]
                eval(code)
            }
        } else {
            var code = Evaluate.reaction_messages[message.id]
            eval(code)
        }
    }
    if (Evaluate.reaction_channels[message.channel.id]) {
        if (typeof(Evaluate.reaction_channels[message.channel.id]) == "object") {
                var code = Evaluate.reaction_messages[message.channel.id][index]
            for (index in Evaluate.reaction_channels[message.channel.id]) {
                var code = Evaluate.reaction_channels[message.channel.id][index]
                eval(code)
            }
        } else {
            var code = Evaluate.reaction_channels[message.channel.id]
            eval(code)
        }
    }
}

Evaluate.interaction = async (interaction) => {
    if (interaction.message) {
        if (Evaluate.interaction_messages[interaction.message.id]) {
            if (typeof(Evaluate.interaction_messages[interaction.message.id]) == "object") {
                for (index in Evaluate.interaction_messages[interaction.message.id]) {
                    var code = Evaluate.interaction_messages[interaction.message.id][index]
                    eval(code)
                }
            } else {
                var code = Evaluate.interaction_messages[interaction.message.id]
                eval(code)
            }
        }
    }
    if (Evaluate.interaction_channels[interaction.channel.id]) {
        if (typeof(Evaluate.interaction_channels[message.channel.id]) == "object") {
            for (index in Evaluate.interaction_channels[message.channel.id]) {
                var code = Evaluate.interaction_channels[message.channel.id][index]
                eval(code)
            }
        } else {
            var code = Evaluate.interaction_channels[message.channel.id]
            eval(code)
        }
    }
}

Evaluate.startup = async () => {
    Evaluate.load()

    for (index in Evaluate.startup) {
        if (typeof(Evaluate.startup[index]) == "object") {
            for (startup_index in Evaluate.startup[index]) {
                var code = Evaluate.startup[index][startup_index]
                eval(code)
            }
        } else {
            var code = Evaluate.startup[index]
            eval(code)
        }
    }
}

Evaluate.time = async () => {
    var save = false
    for (index in Evaluate.time_stamps) {
        var table = Evaluate.time_stamps[index]
        if (Delta.time() > table[0]) {
            if (typeof(table[1]) == "object") {
                for (time_index in table[1]) {
                    var code = table[1][time_index]
                    eval(code)
                }
            } else {
                var code = table[1]
                eval(code)
            }
            Evaluate.time_stamps[index] = null
            save = true
        }
    }
    if (save) {Evaluate.save()}
}

Evaluate.automatic = async () => {
    for (index in Evaluate.auto_execs) {
        if (typeof(Evaluate.auto_execs[index]) == "object") {
            for (auto_index in Evaluate.auto_execs[index]) {
                var code = Evaluate.auto_execs[index][auto_index]
                eval(code)
            }
        } else {
            var code = Evaluate.auto_execs[index]
            eval(code)
        }
    }
}

Evaluate.add = (table, index, value) => {
    if (typeof(table) == "string") {
        table = Evaluate[table]
    }
    if (!table[index]) {
        table[index] = value
    } else {
        if (typeof(table[index]) == "object") {
            if (typeof(table[index][0]) == "number") {
                if (typeof(table[index][1]) == "object") {
                    table[index][1].push(value)
                } else {
                    table[index][1] = [table[index][1], value]
                }
            } else {
                table[index].push(value)
            }
        } else {
            table[index] = [table[index], value]
        }
    }
}

Evaluate.remove_all = (table, index) => {
    if (typeof(table) == "string") {
        table = Evaluate[table]
    }
    table[index] = null
}

Evaluate.remove = (table, index, sub) => {
    if (typeof(table) == "string") {
        table = Evaluate[table]
    }
    if (table[index]) {
        if (typeof(table[index]) == "object") {
            if (typeof(table[index][0]) == "object") {
                if (typeof(table[index][1]) == "object") {
                    for (subindex in table[index][1]) {
                        var value = table[index][1][subindex]
                        if (subindex == sub || value == sub) {
                            table[index][1].splice(subindex, 1)
                            break
                        }
                    }
                    if (table[index][1].size() == 0) {
                        table[index] = null
                    }
                } else {
                    if (sub == 0 || table[index][1] == sub) {
                        table[index] = null
                    }
                }
            } else {
                for (subindex in table[index]) {
                    var value = table[index][subindex]
                    if (subindex == sub || value == sub) {
                        table[index].splice(subindex, 1)
                        break
                    }
                }
                if (table[index].size() == 0) {
                    table[index] = null
                }
            }
        } else {
            if (sub == 0 || table[index] == sub) {
                table[index] = null
            }
        }
    }
}

Evaluate.pastebin = (id) => {
    var request = require("request")
    return new Promise((resolve, reject) => {
        var options = {
            url: "https://pastebin.com/raw/" + id,
            method: "GET"
        }
        request.get(options, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

Evaluate.save = () => {
    Delta.Data.iterate_save("./save_data/misc/eval/message/", Evaluate.message_channels)
    Delta.Data.iterate_save("./save_data/misc/eval/reaction/channels/", Evaluate.reaction_channels)
    Delta.Data.iterate_save("./save_data/misc/eval/reaction/messages/", Evaluate.reaction_messages)
    Delta.Data.iterate_save("./save_data/misc/eval/interaction/channels/", Evaluate.interaction_channels)
    Delta.Data.iterate_save("./save_data/misc/eval/interaction/messages/", Evaluate.interaction_messages)
    Delta.Data.iterate_save("./save_data/misc/eval/auto/", Evaluate.auto_execs)
    Delta.Data.iterate_save("./save_data/misc/eval/time/", Evaluate.time_stamps)
    Delta.Data.iterate_save("./save_data/misc/eval/startup/", Evaluate.startup)
}

Evaluate.load = () => {
    Delta.Data.iterate_load("./save_data/misc/eval/message/", (name, val) => Evaluate.message_channels[name.substring(0, name.length - 5)] = val)
    Delta.Data.iterate_load("./save_data/misc/eval/reaction/channels/", (name, val) => Evaluate.reaction_channels[name.substring(0, name.length - 5)] = val)
    Delta.Data.iterate_load("./save_data/misc/eval/reaction/messages/", (name, val) => Evaluate.reaction_messages[name.substring(0, name.length - 5)] = val)
    Delta.Data.iterate_load("./save_data/misc/eval/interaction/channels/", (name, val) => Evaluate.interaction_channels[name.substring(0, name.length - 5)] = val)
    Delta.Data.iterate_load("./save_data/misc/eval/interaction/messages/", (name, val) => Evaluate.interaction_messages[name.substring(0, name.length - 5)] = val)
    Delta.Data.iterate_load("./save_data/misc/eval/auto/", (name, val) => Evaluate.auto_execs[name.substring(0, name.length - 5)] = val)
    Delta.Data.iterate_load("./save_data/misc/eval/time/", (name, val) => Evaluate.time_stamps[name.substring(0, name.length - 5)] = val)
    Delta.Data.iterate_load("./save_data/misc/eval/startup/", (name, val) => Evaluate.startup[name.substring(0, name.length - 5)] = val)
}