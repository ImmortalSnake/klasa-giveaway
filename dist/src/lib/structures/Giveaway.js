"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const util_1 = require("../util/util");
class Giveaway {
    /**
     * Constructs the giveaway instance
     * @param manager The giveaway manager that manages this giveaway instance
     * @param data The giveaway data
     */
    constructor(manager, data) {
        /**
         * The giveway message
         */
        this.message = null;
        /**
         * Current state of the giveaway
         */
        this.state = 'CREATING';
        this.manager = manager;
        this.endsAt = data.endsAt;
        this.winnerCount = data.winnerCount;
        this.messageID = data.messageID || data.id;
        this.channelID = data.channelID;
        this.guildID = data.guildID;
        this.title = data.title;
        this.author = data.author;
        this.startAt = data.startAt || Date.now();
        this.lastRefresh = Date.now();
        this.reaction = data.reaction || '🎉';
    }
    /**
     * The Discord client
     */
    get client() {
        return this.manager.client;
    }
    /**
     * The giveaway options provided to the client
     */
    get options() {
        return this.client.options.giveaway;
    }
    /**
     * Time in milliseconds for the next refresh
     */
    get refreshAt() {
        const nextRefresh = this.lastRefresh + this.options.refreshInterval;
        return Math.min(nextRefresh, this.endsAt);
    }
    /**
     * Total duration in milliseconds of the giveaway
     */
    get duration() {
        return this.endsAt - this.startAt;
    }
    /**
     * The giveaway data (stored in database)
     */
    get data() {
        return {
            channelID: this.channelID,
            startAt: this.startAt,
            endsAt: this.endsAt,
            winnerCount: this.winnerCount,
            title: this.title,
            reaction: this.reaction,
            author: this.author
        };
    }
    /**
     * Returns an embed or string after running the `GiveawayOptions.giveawayRunMessage` function
     * @param lang The language to use when rendering the message
     */
    renderMessage(lang) {
        if (klasa_1.util.isFunction(this.options.givewayRunMessage))
            return this.options.givewayRunMessage(this, lang);
        return this.options.givewayRunMessage;
    }
    /**
     * Returns an embed or string after running the GiveawayOptions.giveawayFinishMessage function
     * @param winners The giveaway winners
     * @param msg The giveaway message that can be edited
     */
    async finishMessage(winners, msg) {
        if (klasa_1.util.isFunction(this.options.giveawayFinishMessage))
            return this.options.giveawayFinishMessage(this, winners, msg);
        return this.options.giveawayFinishMessage;
    }
    /**
     * Initializes the giveaway, used when initializing giveaways on restart
     */
    async init() {
        this.message = await this.fetchMessage().catch(() => null);
        this.manager.delete(this.messageID);
    }
    /**
     * Creates the giveaway and sends the giveaway message
     * @param channel The channel to send the giveaway message
     */
    async create(channel) {
        if (!channel)
            channel = await this.client.channels.fetch(this.channelID);
        const { language } = channel.guild;
        const msg = await channel.send(this.renderMessage(language));
        await msg.react(this.reaction);
        this.message = msg;
        this.messageID = msg.id;
        this.channelID = msg.channel.id;
        this.guildID = msg.guild.id;
        return this;
    }
    /**
     * Updates the giveaway and edits the giveaway message
     */
    async update() {
        this.state = 'RUNNING';
        this.lastRefresh = Date.now();
        const msg = await this.fetchMessage().catch(() => null);
        if (!msg)
            return this.manager.delete(this.messageID);
        return msg.edit(this.renderMessage(msg.language));
    }
    /**
     * Finishes the giveaway and sends the giveaway finish message
     */
    async finish() {
        this.state = 'ENDING';
        const msg = await this.fetchMessage().catch(() => null);
        if (!msg)
            return this.manager.delete(this.messageID);
        const users = await msg.reactions.resolve(this.reaction).users.fetch();
        const winners = util_1.default.getWinners(msg, users, this.winnerCount);
        await this.finishMessage(winners, msg);
        this.state = 'FINISHED';
        await msg.guildSettings.update('giveaways.finished', msg.id);
        return this.manager.delete(this.messageID);
    }
    /**
     * Returns the cached message if it exists or else fetches it
     */
    async fetchMessage() {
        if (this.message)
            return this.message;
        return this.client.channels.fetch(this.channelID)
            .then(chan => chan.messages.fetch(this.messageID))
            .then(msg => msg);
    }
}
exports.default = Giveaway;
