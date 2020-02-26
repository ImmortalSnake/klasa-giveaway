"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const Giveaway_1 = require("./Giveaway");
const util_1 = require("../util/util");
class GiveawayManager {
    constructor(client) {
        this.running = [];
        this.giveaways = [];
        this.client = client;
    }
    get provider() {
        return this.client.providers.get(this.client.options.giveaway.provider || '') || this.client.providers.default;
    }
    async init() {
        const hasTable = await this.provider.hasTable('Giveaways');
        if (!hasTable)
            await this.provider.createTable('Giveaways');
        const entries = await this.provider.getAll('Giveaways');
        for (const entry of entries)
            await this.add(entry).init();
        setInterval(this.refresh.bind(this), 5000);
    }
    async create(channel, rawData) {
        const giveaway = await this.add(rawData)
            .create(channel);
        await this.provider.update('Giveaways', giveaway.messageID, giveaway.data);
        return null;
    }
    delete(id) {
        const index = this.running.findIndex(g => g.messageID === id);
        if (index !== -1)
            this.running.splice(index, 1).forEach(g => g.state = 'FINISHED');
        return this.provider.delete('Giveaways', id);
    }
    async end(id) {
        const giveaway = this.running.find(g => g.messageID === id);
        if (!giveaway)
            throw Error(`No giveaway found with ID: ${id}`);
        giveaway.endsAt = Date.now();
        return this.update(giveaway);
    }
    async edit(id, data) {
        const giveaway = this.running.find(g => g.messageID === id);
        if (!giveaway)
            throw Error(`No giveaway found with ID: ${id}`);
        klasa_1.util.mergeDefault(giveaway.data, data);
        return this.provider.update('Giveaways', id, giveaway.data);
    }
    async reroll(msg, data) {
        var _a, _b, _c, _d, _e;
        const reaction = ((_a = data) === null || _a === void 0 ? void 0 : _a.reaction) || '🎉';
        if (((_b = msg) === null || _b === void 0 ? void 0 : _b.author.id) !== msg.client.user.id
            || !msg.reactions.has(reaction))
            throw msg.language.get('GIVEAWAY_NOT_FOUND');
        const isRunning = this.running.find(g => g.messageID === msg.id);
        if (isRunning)
            throw msg.language.get('GIVEAWAY_RUNNING');
        const users = await ((_c = msg.reactions.get(reaction)) === null || _c === void 0 ? void 0 : _c.users.fetch());
        return util_1.default.getWinners(msg, users, (_e = (_d = data) === null || _d === void 0 ? void 0 : _d.winnerCount, (_e !== null && _e !== void 0 ? _e : 1)));
    }
    async update(giveaway) {
        if (giveaway.state === 'FINISHED')
            return;
        if (giveaway.endsAt <= Date.now())
            return giveaway.finish().catch();
        this.giveaways.push(giveaway);
        return giveaway.update().catch();
    }
    refresh() {
        if (!this.giveaways.length)
            return;
        for (const giveaway of this.giveaways) {
            if (giveaway.state !== 'FINISHED')
                setTimeout(this.update.bind(this, giveaway), giveaway.refreshAt - Date.now());
        }
        this.giveaways = [];
        this.running = this.running.filter(g => g.state !== 'FINISHED');
    }
    add(data) {
        const giveaway = new Giveaway_1.default(this, data);
        this.giveaways.push(giveaway);
        this.running.push(giveaway);
        return giveaway;
    }
}
exports.default = GiveawayManager;
