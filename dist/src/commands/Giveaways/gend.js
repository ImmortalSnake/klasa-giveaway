"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Command {
    constructor(store, file, directory) {
        super(store, file, directory, klasa_1.util.mergeDefault({
            requiredPermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
            permissionLevel: 5,
            runIn: ['text'],
            usageDelim: ' ',
            usage: '[message:message]',
            enabled: store.client.options.giveaway.enableCommands,
            description: (lang) => lang.get('COMMAND_END_DESCRIPTION'),
            extendedHelp: (lang) => lang.get('COMMAND_END_EXTENDED')
        }, store.client.options.giveaway.commands.end));
    }
    async run(msg, [message]) {
        const running = this.client.giveawayManager.running.find(gv => gv.guildID === msg.guild.id);
        if (!running)
            throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));
        const id = message ? message.id : running.messageID;
        const giveaway = running || this.client.giveawayManager.running.find(gv => gv.messageID === id);
        if (!giveaway)
            throw msg.language.get('GIVEAWAY_NOT_FOUND');
        await this.client.giveawayManager.end(id);
        return null;
    }
}
exports.default = default_1;
