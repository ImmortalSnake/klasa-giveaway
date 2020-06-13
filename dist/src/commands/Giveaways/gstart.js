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
            usage: '<duration:duration> <winner_count:int{1,}> <title:...str{0,250}>',
            enabled: store.client.options.giveaway.enableCommands,
            description: (lang) => lang.get('COMMAND_START_DESCRIPTION'),
            extendedHelp: (lang) => lang.get('COMMAND_START_EXTENDED')
        }, store.client.options.giveaway.commands.start));
    }
    async run(msg, [time, winnerCount = 1, title]) {
        const giveaways = this.client.giveawayManager.running.filter(g => g.guildID === msg.guild.id);
        const max = this.client.options.giveaway.maxGiveaways;
        if (giveaways.length > max)
            throw msg.language.get('MAX_GIVEAWAYS', max);
        await this.client.giveawayManager.create(msg.channel, {
            endsAt: time,
            author: msg.author.id,
            title,
            winnerCount
        });
        return null;
    }
}
exports.default = default_1;
