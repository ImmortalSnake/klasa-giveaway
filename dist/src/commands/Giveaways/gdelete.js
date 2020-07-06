"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const core_1 = require("@klasa/core");
const utils_1 = require("@klasa/utils");
class default_1 extends klasa_1.Command {
    constructor(store, directory, file) {
        super(store, directory, file, utils_1.mergeObjects({
            requiredPermissions: [core_1.Permissions.FLAGS.EMBED_LINKS, core_1.Permissions.FLAGS.ADD_REACTIONS, core_1.Permissions.FLAGS.READ_MESSAGE_HISTORY],
            permissionLevel: 5,
            runIn: [0],
            usageDelim: ' ',
            usage: '[message:message]',
            description: (lang) => lang.get('COMMAND_DELETE_DESCRIPTION'),
            extendedHelp: (lang) => lang.get('COMMAND_DELETE_EXTENDED')
        }, store.client.options.giveaway.commands.delete || {}));
    }
    async run(msg, [message]) {
        const running = this.client.giveawayManager.running.find(gv => gv.guildID === msg.guild.id);
        if (!running)
            throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));
        const id = message ? message.id : running.messageID;
        const giveaway = this.client.giveawayManager.running.find(gv => gv.messageID === id);
        if (!giveaway)
            throw msg.language.get('GIVEAWAY_NOT_FOUND');
        await this.client.giveawayManager.delete(id).catch(() => console.log());
        return msg.channel.send(mb => mb.setContent(msg.language.get('GIVEAWAY_DELETE', id)));
    }
}
exports.default = default_1;
