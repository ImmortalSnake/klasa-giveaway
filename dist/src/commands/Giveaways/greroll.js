"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const utils_1 = require("@klasa/utils");
const core_1 = require("@klasa/core");
class default_1 extends klasa_1.Command {
    constructor(store, directory, file) {
        super(store, directory, file, utils_1.mergeObjects({
            permissionLevel: 5,
            requiredPermissions: [core_1.Permissions.FLAGS.EMBED_LINKS, core_1.Permissions.FLAGS.ADD_REACTIONS, core_1.Permissions.FLAGS.READ_MESSAGE_HISTORY],
            runIn: [0],
            usageDelim: ' ',
            usage: '[message:message]',
            description: (lang) => lang.get('COMMAND_REROLL_DESCRIPTION'),
            extendedHelp: (lang) => lang.get('COMMAND_REROLL_EXTENDED')
        }, store.client.options.giveaway.commands.reroll || {}));
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
            return msg.replyLocale('COMMAND_REROLL_NO_WINNER');
        return msg.replyLocale('COMMAND_REROLL_SUCCESS', [winners.map(win => win.toString()).join(', ')]);
    }
}
exports.default = default_1;
