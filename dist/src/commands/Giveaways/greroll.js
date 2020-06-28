"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Command {
    constructor(store, file, directory) {
        super(store, file, directory, klasa_1.util.mergeDefault({
            permissionLevel: 5,
            requiredPermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
            runIn: ['text'],
            usageDelim: ' ',
            usage: '[message:message]',
            enabled: store.client.options.giveaway.enableCommands,
            description: (lang) => lang.get('COMMAND_REROLL_DESCRIPTION'),
            extendedHelp: (lang) => lang.get('COMMAND_REROLL_EXTENDED')
        }, store.client.options.giveaway.commands.reroll));
    }
    async run(msg, [message]) {
        const finished = msg.guildSettings.get('giveaways.finished');
        if (!finished)
            throw msg.language.get('NO_FINISHED_GIVEAWAY', msg.guildSettings.get('prefix'));
        if (!message) {
            message = await msg.channel.messages.fetch(finished).catch(() => null);
            if (!message)
                throw msg.language.get('NO_FINISHED_GIVEAWAY', msg.guildSettings.get('prefix'));
        }
        const winners = await this.client.giveawayManager.reroll(message);
        if (!winners.length)
            return msg.sendLocale('COMMAND_REROLL_NO_WINNER');
        return msg.sendLocale('COMMAND_REROLL_SUCCESS', [winners.map(win => win.toString()).join(', ')]);
    }
}
exports.default = default_1;
