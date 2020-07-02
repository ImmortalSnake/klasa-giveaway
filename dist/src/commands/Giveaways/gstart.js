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
            usage: '<duration:duration> <winner_count:int{1,}> <title:...str{0,250}>',
            enabled: store.client.options.giveaway.enableCommands,
            description: (lang) => lang.get('COMMAND_START_DESCRIPTION'),
            extendedHelp: (lang) => lang.get('COMMAND_START_EXTENDED')
        }, store.client.options.giveaway.commands.start || {}));
    }
    async run(msg, [time, winnerCount, title]) {
        const giveaways = this.client.giveawayManager.running.filter(gv => gv.guildID === msg.guild.id);
        const max = this.client.options.giveaway.maxGiveaways;
        if (giveaways.length >= max)
            throw msg.language.get('MAX_GIVEAWAYS', max);
        await this.client.giveawayManager.create(msg.channel, {
            endsAt: time.getTime(),
            author: msg.author.id,
            title,
            winnerCount
        });
        return [msg];
    }
}
exports.default = default_1;
