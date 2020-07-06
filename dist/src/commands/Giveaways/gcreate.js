"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const core_1 = require("@klasa/core");
const utils_1 = require("@klasa/utils");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, utils_1.mergeObjects({
            requiredPermissions: [core_1.Permissions.FLAGS.EMBED_LINKS, core_1.Permissions.FLAGS.ADD_REACTIONS, core_1.Permissions.FLAGS.READ_MESSAGE_HISTORY],
            permissionLevel: store.client.options.giveaway.requiredPermission,
            promptLimit: 1,
            promptTime: 60 * 1000,
            runIn: [0],
            usageDelim: ' ',
            usage: '<channel:textchannel> <duration:duration> <winner_count:int{1,}> <title:...str{0,250}>',
            description: (lang) => lang.get('COMMAND_CREATE_DESCRIPTION'),
            extendedHelp: (lang) => lang.get('COMMAND_CREATE_EXTENDED')
        }, store.client.options.giveaway.commands.create || {}));
        this.createCustomResolver('textchannel', (arg, possible, message) => this.client.arguments.get('textChannel').run(arg, possible, message));
    }
    async run(msg, [channel, time, winnerCount, title]) {
        const giveaways = this.client.giveawayManager.running.filter(gv => gv.guildID === msg.guild.id);
        const max = this.client.options.giveaway.maxGiveaways;
        if (giveaways.length >= max)
            throw msg.language.get('MAX_GIVEAWAYS', max);
        return this.client.giveawayManager.create(channel, {
            endsAt: time.getTime(),
            author: msg.author.id,
            title,
            winnerCount
        })
            .then(() => msg.replyLocale('GIVEAWAY_CREATE_SUCCESS', [channel.toString()]));
    }
}
exports.default = default_1;
