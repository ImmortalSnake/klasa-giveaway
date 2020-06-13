"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const Giveaway_1 = require("./Giveaway");
const util_1 = require("../util/util");
class GiveawayManager {
    /**
     * Constructs the GiveawayManager
     * @param {KlasaClient} client The discord client
     */
    constructor(client) {
        /**
         * A queue of all running giveaways
         */
        this.running = [];
        /**
         * Array of giveaways to be updated
         * @private
         */
        this.giveaways = [];
        this.client = client;
    }
    /**
     * Gets the provider being used by the giveaway manager
     */
    get provider() {
        return this.client.providers.get(this.client.options.giveaway.provider || '') || this.client.providers.default;
    }
    /**
     * Initializes the GiveawayManager and restarts all giveaways
     */
    async init() {
        const hasTable = await this.provider.hasTable('Giveaways');
        if (!hasTable)
            await this.provider.createTable('Giveaways');
        const entries = await this.provider.getAll('Giveaways');
        for (const entry of entries)
            await this.add(entry).init();
        setInterval(this.refresh.bind(this), 5000);
    }
    /**
     * Creates a giveaway in the given channel with the the given giveaway data
     * @param channel TextChannel where the giveaway will run
     * @param rawData Data for the created giveaway
     * @example
     * client.giveawayManager.create(msg.channel, {
     *     endsAt: Date.now() + 1000 * 60 * 60, // 1 hour duration
     *     author: msg.author.id,
     *     title: 'FREE NITRO!!',
     *     winnerCount: 1
     * });
     */
    async create(channel, rawData) {
        const giveaway = await this.add(rawData)
            .create(channel);
        await this.provider.update('Giveaways', giveaway.messageID, giveaway.data);
        return giveaway;
    }
    /**
     * Deletes a giveaway with the given message id (sent by the bot). This giveaway will no longer be run
     * @param id ID of the giveaway to delete
     * @example
     * client.giveawayManager.delete('720919015068925974').catch(() => console.log());
     */
    async delete(id) {
        const index = this.running.findIndex(g => g.messageID === id);
        if (index !== -1)
            this.running.splice(index, 1).forEach(g => g.state = 'FINISHED');
        return this.provider.delete('Giveaways', id);
    }
    /**
     * Ends a giveaway with the given message id (sent by the bot). The giveaway gets finished and the winners are listed
     * @param id ID of the giveaway to end
     * @example
     * client.giveawayManager.end('720919015068925974').catch(() => console.log());
     */
    async end(id) {
        const giveaway = this.running.find(g => g.messageID === id);
        if (!giveaway)
            throw Error(`No giveaway found with ID: ${id}`);
        giveaway.endsAt = Date.now();
        return this.update(giveaway);
    }
    /**
     * Edits the giveaway data with the fields you give
     * @param id ID of the giveaway to edit
     * @param data Giveaway edit data
     * @example
     * client.giveawayManager.edit('720919015068925974', {title: 'FREE GIVEAWAY'})
     */
    async edit(id, data) {
        const giveaway = this.running.find(g => g.messageID === id);
        if (!giveaway)
            throw Error(`No giveaway found with ID: ${id}`);
        klasa_1.util.mergeDefault(giveaway.data, data);
        await this.provider.update('Giveaways', id, giveaway.data);
        return giveaway;
    }
    /**
     * Rerolls a finished giveaway with the given message and Reroll Data and returns an array of winners
     * @param msg Giveaway Message to reroll
     * @param data Giveaway reroll options
     * @example
     * const winners = await client.giveawayManager.reroll(msg)
     * msg.send(`🎉 **New winner(s) are**: ${winners.map(w => w.toString()).join(', ')}`)
     */
    async reroll(msg, data) {
        var _a, _b;
        const reaction = (data && data.reaction) || '🎉';
        if (msg.author.id !== msg.client.user.id
            || !msg.reactions.cache.has(reaction))
            throw msg.language.get('GIVEAWAY_NOT_FOUND');
        const isRunning = this.running.find(g => g.messageID === msg.id);
        if (isRunning)
            throw msg.language.get('GIVEAWAY_RUNNING');
        const users = await ((_a = msg.reactions.resolve(reaction)) === null || _a === void 0 ? void 0 : _a.users.fetch());
        return util_1.default.getWinners(msg, users, (_b = (data && data.winnerCount), (_b !== null && _b !== void 0 ? _b : 1)));
    }
    /**
     * Updates a certain giveaway, if the time is up it gets finished
     * @param giveaway The giveaway instance to update
     */
    async update(giveaway) {
        if (giveaway.state === 'FINISHED')
            return null;
        if (giveaway.endsAt <= Date.now())
            return giveaway.finish().catch();
        this.giveaways.push(giveaway);
        return giveaway.update().catch();
    }
    /**
     * Loops through the giveaway queue and sets the update timeout and also filters out the finished giveaways
     */
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
    /**
     * Creates a giveaway and adds it to the giveaway queue
     * @param data The giveaway data
     */
    add(data) {
        const giveaway = new Giveaway_1.default(this, data);
        this.giveaways.push(giveaway);
        this.running.push(giveaway);
        return giveaway;
    }
}
exports.default = GiveawayManager;
