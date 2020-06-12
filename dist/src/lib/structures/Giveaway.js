"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const util_1 = require("../util/util");
class Giveaway {
    constructor(manager, data) {
        this.message = null;
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
    get client() {
        return this.manager.client;
    }
    get options() {
        return this.client.options.giveaway;
    }
    get refreshAt() {
        const nextRefresh = this.lastRefresh + this.options.refreshInterval;
        return Math.min(nextRefresh, this.endsAt);
    }
    get duration() {
        return this.endsAt - this.startAt;
    }
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
    renderMessage(lang) {
        if (klasa_1.util.isFunction(this.options.givewayRunMessage))
            return this.options.givewayRunMessage(this, lang);
        return this.options.givewayRunMessage;
    }
    async finishMessage(winners, msg) {
        if (klasa_1.util.isFunction(this.options.giveawayFinishMessage))
            return this.options.giveawayFinishMessage(this, winners, msg);
        return this.options.giveawayFinishMessage;
    }
    async init() {
        this.message = await this.fetchMessage();
    }
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
    async update() {
        this.state = 'RUNNING';
        this.lastRefresh = Date.now();
        const msg = await this.fetchMessage();
        return msg.edit(this.renderMessage(msg.language));
    }
    async finish() {
        this.state = 'ENDING';
        const msg = await this.fetchMessage();
        const users = await msg.reactions.resolve(this.reaction).users.fetch();
        const winners = util_1.default.getWinners(msg, users, this.winnerCount);
        await this.finishMessage(winners, msg);
        this.state = 'FINISHED';
        await msg.guildSettings.update('giveaways.finished', msg.id);
        return this.manager.delete(this.messageID);
    }
    async fetchMessage() {
        if (this.message)
            return this.message;
        return this.client.channels.fetch(this.channelID)
            .then(chan => chan.messages.fetch(this.messageID))
            .then(msg => msg);
    }
}
exports.default = Giveaway;
