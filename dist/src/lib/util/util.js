"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
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
        const filtered = users
            .map(us => { var _a; return (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.resolve(us); })
            .filter(us => Boolean(us))
            .filter(us => msg.client.options.giveaway.winnersFilter(us));
        return Util.sample(filtered, winnerCount)
            .filter(us => Boolean(us));
    }
    static sample(array, size) {
        return Array.from({ length: size }, () => array.splice(Math.floor(Math.random() * array.length), 1)[0]);
    }
}
exports.default = Util;
