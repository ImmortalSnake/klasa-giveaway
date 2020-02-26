"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Command {
    constructor(store, file, directory) {
        super(store, file, directory, klasa_1.util.mergeDefault({
            requiredPermissions: ['ADD_REACTIONS'],
            permissionLevel: 5,
            runIn: ['text'],
            usageDelim: ' ',
            usage: '<duration:timespan> <winner_count:int> <title:...str{0,250}>',
            enabled: store.client.options.giveaway.enableCommands,
            description: (lang) => lang.get('COMMAND_START_DESCRIPTION'),
            extendedHelp: (lang) => lang.get('COMMAND_START_EXTENDED')
        }, store.client.options.giveaway.commands.start));
    }
    async run(msg, [time, winnerCount, title]) {
        const giveaways = this.client.giveawayManager.running.filter(g => g.guildID === msg.guild.id);
        const max = this.client.options.giveaway.maxGiveaways;
        if (giveaways.length > max)
            throw msg.language.get('MAX_GIVEAWAYS', max);
        return this.client.giveawayManager.create(msg.channel, {
            endsAt: Date.now() + time,
            author: msg.author.id,
            title,
            winnerCount
        });
    }
}
exports.default = default_1;
