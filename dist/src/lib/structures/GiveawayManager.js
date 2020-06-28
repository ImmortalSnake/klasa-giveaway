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
        return this.client.providers.get(this.client.options.giveaway.provider) || this.client.providers.default;
    }
    async init() {
        const hasTable = await this.provider.hasTable('Giveaways');
        if (!hasTable)
            await this.provider.createTable('Giveaways');
        const entries = await this.provider.getAll('Giveaways');
        for (const entry of entries)
            await this.add(entry).init();
        setInterval(this.refresh.bind(this), this.client.options.giveaway.updateInterval);
    }
    async create(channel, rawData) {
        const giveaway = await this.add(rawData)
            .create(channel);
        await this.provider.update('Giveaways', giveaway.messageID, giveaway.data);
        return giveaway;
    }
    async delete(id) {
        const index = this.running.findIndex(gv => gv.messageID === id);
        if (index !== -1)
            this.running.splice(index, 1).forEach(gv => { gv.state = 'FINISHED'; });
        return this.provider.delete('Giveaways', id);
    }
    async end(id) {
        const giveaway = this.running.find(gv => gv.messageID === id);
        if (!giveaway)
            throw Error(`No giveaway found with ID: ${id}`);
        giveaway.endsAt = Date.now();
        return this.update(giveaway);
    }
    async edit(id, data) {
        const giveaway = this.running.find(gv => gv.messageID === id);
        if (!giveaway)
            throw Error(`No giveaway found with ID: ${id}`);
        klasa_1.util.mergeDefault(giveaway.data, data);
        await this.provider.update('Giveaways', id, giveaway.data);
        return giveaway;
    }
    async reroll(msg, data) {
        var _a, _b;
        const reaction = (data && data.reaction) || '🎉';
        if (msg.author.id !== msg.client.user.id ||
            !msg.reactions.cache.has(reaction))
            throw msg.language.get('GIVEAWAY_NOT_FOUND');
        const isRunning = this.running.find(gv => gv.messageID === msg.id);
        if (isRunning)
            throw msg.language.get('GIVEAWAY_RUNNING');
        const users = await ((_a = msg.reactions.resolve(reaction)) === null || _a === void 0 ? void 0 : _a.users.fetch());
        return util_1.default.getWinners(msg, users, (_b = (data && data.winnerCount), (_b !== null && _b !== void 0 ? _b : 1)));
    }
    async update(giveaway) {
        if (giveaway.state === 'FINISHED')
            return null;
        if (giveaway.endsAt <= Date.now())
            return giveaway.finish().catch(() => this.delete(giveaway.messageID));
        this.giveaways.push(giveaway);
        return giveaway.update().catch(() => this.delete(giveaway.messageID));
    }
    refresh() {
        if (!this.giveaways.length)
            return;
        for (const giveaway of this.giveaways) {
            if (giveaway.state !== 'FINISHED')
                setTimeout(this.update.bind(this, giveaway), giveaway.refreshAt - Date.now());
        }
        this.giveaways = [];
        this.running = this.running.filter(gv => gv.state !== 'FINISHED');
    }
    add(data) {
        const giveaway = new Giveaway_1.default(this, data);
        this.giveaways.push(giveaway);
        this.running.push(giveaway);
        return giveaway;
    }
}
exports.default = GiveawayManager;
