"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Command {
    constructor(store, file, directory) {
        super(store, file, directory, klasa_1.util.mergeDefault({
            requiredPermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
            runIn: ['text'],
            usageDelim: ' ',
            enabled: store.client.options.giveaway.enableCommands,
            description: (lang) => lang.get('COMMAND_LIST_DESCRIPTION'),
            extendedHelp: (lang) => lang.get('COMMAND_LIST_EXTENDED')
        }, store.client.options.giveaway.commands.list));
    }
    async run(msg) {
        const giveaways = this.client.giveawayManager.running.filter(gv => gv.guildID === msg.guild.id);
        if (giveaways.length === 0)
            throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));
        let mess = msg.language.get('GIVEWAY_LIST_TITLE', msg.guild.name);
        for (let i = 0; i < giveaways.length; i++) {
            const { channelID, winnerCount, title, endsAt } = giveaways[i].data;
            mess += msg.language.get('GIVEAWAY_LIST_BODY', i + 1, giveaways[i].messageID, channelID, winnerCount, endsAt, title);
        }
        return msg.send(mess, { split: true });
    }
}
exports.default = default_1;
