"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = exports.Day = exports.Hour = exports.Minute = exports.Second = void 0;
const util_1 = require("./util");
const core_1 = require("@klasa/core");
exports.Second = 1000;
exports.Minute = 60 * exports.Second;
exports.Hour = 60 * exports.Minute;
exports.Day = 24 * exports.Hour;
exports.OPTIONS = {
    giveaway: {
        maxGiveaways: Infinity,
        requiredPermission: 5,
        updateInterval: 5000,
        enableCommands: true,
        provider: '',
        commands: {},
        nextRefresh: (giveaway) => giveaway.lastRefresh + (5 * exports.Minute),
        winnersFilter: (member) => { var _a; return member.id !== ((_a = member.client.user) === null || _a === void 0 ? void 0 : _a.id); },
        runMessage,
        finishMessage
    }
};
function runMessage(giveaway, language) {
    return mb => mb
        .setContent(language.get('GIVEAWAY_CREATE'))
        .setEmbed(new core_1.Embed()
        .setTitle(giveaway.title)
        .setColor(0x42f54e)
        .setDescription(language.get('GIVEAWAY_DESCRIPTION', giveaway.winnerCount, util_1.default.ms(giveaway.endsAt - Date.now()), giveaway.author))
        .setFooter(language.get('ENDS_AT'))
        .setTimestamp(giveaway.endsAt));
}
async function finishMessage(giveaway, winners, msg) {
    const embed = new core_1.Embed()
        .setTitle(giveaway.title)
        .setFooter(msg.language.get('ENDED_AT'))
        .setTimestamp();
    if (winners.length < giveaway.winnerCount) {
        return msg.edit(mb => mb
            .setContent(msg.language.get('GIVEAWAY_END'))
            .setEmbed(embed.setDescription(msg.language.get('NOT_ENOUGH_REACTIONS', giveaway.winnerCount))));
    }
    await msg.edit(mb => mb
        .setContent(msg.language.get('GIVEAWAY_END'))
        .setEmbed(embed.setDescription(`**Winner: ${winners.map(us => us.toString()).join(', ')}**`)));
    return msg.channel.send(mb => mb.setContent(msg.language.get('GIVEAWAY_WON', winners, giveaway.title)));
}
