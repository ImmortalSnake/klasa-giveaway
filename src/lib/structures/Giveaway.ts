import GiveawayManager, { GiveawayCreateData, GiveawayData } from './GiveawayManager';
import { TextChannel, GuildMember } from 'discord.js';
import { KlasaMessage, util, Language } from 'klasa';
import Util from '../util/util';

export type GiveawayState = 'CREATING' | 'RUNNING' | 'ENDING' | 'FINISHED';

export default class Giveaway {

	public readonly manager: GiveawayManager;
	public endsAt: number;
	public startAt: number;
	public lastRefresh: number;
	public winnerCount: number;
	public title: string;
	public messageID?: string;
	public channelID?: string;
	public guildID?: string;
	public author?: string;
	public message: KlasaMessage | null = null;
	public state: GiveawayState = 'CREATING';
	public reaction: string;

	public constructor(manager: GiveawayManager, data: GiveawayCreateData | GiveawayData) {

		this.manager = manager;

		this.endsAt = data.endsAt;
		this.winnerCount = data.winnerCount;
		this.messageID = data.messageID || (data as GiveawayData).id;
		this.channelID = data.channelID;
		this.guildID = data.guildID;
		this.title = data.title;
		this.author = data.author;

		this.startAt = data.startAt || Date.now();
		this.lastRefresh = Date.now();
		this.reaction = data.reaction || '🎉';

	}

	public get client() {
		return this.manager.client;
	}

	public get options() {
		return this.client.options.giveaway;
	}

	public get refreshAt() {
		const nextRefresh = this.lastRefresh + this.options.refreshInterval!;
		return Math.min(nextRefresh, this.endsAt);
	}

	public get duration() {
		return this.endsAt - this.startAt;
	}

	public get data(): GiveawayCreateData {
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

	public renderMessage(lang: Language) {
		if (util.isFunction(this.options.givewayRunMessage)) return this.options.givewayRunMessage(this, lang);
		return this.options.givewayRunMessage;
	}

	public finishMessage(winners: GuildMember[], msg: KlasaMessage) {
		if (util.isFunction(this.options.giveawayFinishMessage)) return this.options.giveawayFinishMessage(this, winners, msg);
		return this.options.giveawayFinishMessage;
	}

	public async init() {
		this.message = await this.fetchMessage();
	}

	public async create(channel?: TextChannel) {
		if (!channel) channel = await this.client.channels.fetch(this.channelID!) as TextChannel;
		const { language } = channel.guild;
		const msg = await channel.send(this.renderMessage(language));
		await msg.react(this.reaction);

		this.message = msg as KlasaMessage;
		this.messageID = msg.id;
		this.channelID = msg.channel.id;
		this.guildID = msg.guild!.id;
		return this;
	}

	public async update() {
		this.state = 'RUNNING';
		this.lastRefresh = Date.now();

		const msg = await this.fetchMessage();
		return msg.edit(this.renderMessage(msg.language));
	}

	public async finish() {
		this.state = 'ENDING';
		const msg = await this.fetchMessage();
		const users = await msg.reactions.get(this.reaction)!.users.fetch();
		const winners = Util.getWinners(msg, users, this.winnerCount);
		await this.finishMessage(winners, msg);

		this.state = 'FINISHED';
		await msg.guildSettings.update('giveaways.finished', msg.id);
		return this.manager.delete(this.messageID!);
	}

	private async fetchMessage() {
		if (this.message) return this.message;
		return this.client.channels.fetch(this.channelID!)
			.then(chan => (chan as TextChannel).messages.fetch(this.messageID!))
			.then(msg => msg as KlasaMessage);
	}

}
