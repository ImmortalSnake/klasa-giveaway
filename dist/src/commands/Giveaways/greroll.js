"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Command {
    constructor(store, file, directory) {
        super(store, file, directory, klasa_1.util.mergeDefault({
            permissionLevel: 5,
            runIn: ['text'],
            usageDelim: ' ',
            usage: '[message:message]',
            enabled: store.client.options.giveaway.enableCommands,
            description: (lang) => lang.get('COMMAND_REROLL_DESCRIPTION'),
            extendedHelp: (lang) => lang.get('COMMAND_REROLL_EXTENDED')
        }, store.client.options.giveaway.commands.reroll));
    }
    async run(msg, [message]) {
        if (!message) {
            message = await msg.channel.messages
                .fetch(msg.guildSettings.get('giveaways.finished'));
            if (!message)
                throw msg.language.get('NO_FINISHED_GIVEAWAY', msg.guildSettings.get('prefix'));
        }
        const winners = await this.client.giveawayManager.reroll(message);
        return msg.send(`🎉 **New winner(s) are**: ${winners.map(w => w.toString()).join(', ')}`);
    }
}
exports.default = default_1;
