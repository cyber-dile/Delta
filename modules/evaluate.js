var Evaluate = {}
module.exports = Evaluate

Evaluate.message_channels = {} // id -> function
Evaluate.reaction_messages = {} // id -> function
Evaluate.reaction_channels = {} // id -> function
Evaluate.interaction_messages = {} // id -> function
Evaluate.interaction_channels = {} // id -> function
Evaluate.time_stamps = {} // id -> [time, function]
Evaluate.auto_execs = {} // id -> function

Evaluate.message = async (message) => {
    if (Evaluate.message_channels[message.id]) {
        eval(Evaluate.message_channels[message.id])
    }
}

Evaluate.reaction = async (reaction, reacted) => {
    if (Evaluate.reaction_messages[message.id]) {
        eval(Evaluate.reaction_messages[message.id])
    }
    if (Evaluate.reaction_channels[message.channel.id]) {
        eval(Evaluate.reaction_channels[message.channel.id])
    }
}

Evaluate.interaction = async (interaction) => {
    if (Evaluate.interaction_messages[interaction.message.id]) {
        eval(Evaluate.interaction_messages[interaction.message.id])
    }
    if (Evaluate.interaction_channels[interaction.channel.id]) {
        eval(Evaluate.interaction_channels[interaction.channel.id])
    }
}

Evaluate.startup = async () => {
    Evaluate.load()

    for (code of Evaluate.startup) {
        eval(code)
    }
}

Evaluate.time = async () => {
    var save = false
    for (index in Evaluate.time_stamps) {
        var table = Evaluate.time_stamps[index]
        if (Delta.time() > table[0]) {
            eval(table[1])
            Evaluate.time_stamps[index] = null
            save = true
        }
    }
    if (save) {Evaluate.save()}
}

Evaluate.automatic = async () => {
    for (index in Evaluate.auto_execs) {
        var code = Evaluate.auto_execs[index]
        eval(code)
    }
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