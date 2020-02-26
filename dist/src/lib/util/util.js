"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Util {
    static ms(duration) {
        const seconds = Math.floor((duration / constants_1.Second) % 60);
        const minutes = Math.floor((duration / constants_1.Minute) % 60);
        const hours = Math.floor((duration / constants_1.Hour) % 24);
        const days = Math.floor(duration / constants_1.Day);
        let mess = '';
        if (days)
            mess += `**${days}** day${days > 1 ? 's' : ''} `;
        if (hours)
            mess += `**${hours}** hour${hours > 1 ? 's' : ''} `;
        if (minutes)
            mess += `**${minutes}** minute${minutes > 1 ? 's' : ''} `;
        if (seconds)
            mess += `**${seconds}** second${seconds > 1 ? 's' : ''} `;
        return mess;
    }
    static getWinners(msg, users, winnerCount) {
        return users
            .mapValues(u => msg.guild.member(u))
            .filter(u => Boolean(u))
            .random(winnerCount);
    }
}
exports.default = Util;
