import GiveawayManager, { GiveawayCreateData } from './GiveawayManager';
import { TextChannel, MessageEmbed } from 'discord.js';
import { KlasaMessage, Language } from 'klasa';
import { COLORS } from '../util/constants';
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
	public message: KlasaMessage | null = null;
	public state: GiveawayState = 'CREATING';
	public reaction = '🎉';
	// public options: { maxGiveaways?: number; requiredPermission?: number };

	public constructor(manager: GiveawayManager, data: GiveawayCreateData) {

		this.manager = manager;
		this.endsAt = data.endsAt;
		this.winnerCount = data.winnerCount;
		this.messageID = data.messageID;
		this.channelID = data.channelID;
		this.guildID = data.guildID;
		this.title = data.title;
		this.startAt = data.startAt || Date.now();
		this.lastRefresh = Date.now();
		console.log(data);
		// this.options = this.client.options.giveaway;

	}

	public get client() {
		return this.manager.client;
	}

	public get refreshAt() {
		const nextRefresh = this.lastRefresh + (5 * 60 * 1000);
		return nextRefresh < this.endsAt ? nextRefresh : this.endsAt;
	}

	public get duration() {
		return this.endsAt - this.startAt;
	}

	public get data(): GiveawayCreateData {
		return {
			messageID: this.messageID,
			channelID: this.channelID,
			startAt: this.startAt,
			endsAt: this.endsAt,
			winnerCount: this.winnerCount,
			title: this.title
		};
	}

	public renderEmbed(lang: Language) {
		return new MessageEmbed()
			.setTitle(this.title)
			.setColor(COLORS.PRIMARY)
			.setDescription(lang.get('GIVEAWAY_DESCRIPTION', this.winnerCount, Util.ms(this.endsAt - Date.now())))
			.setFooter(lang.get('ENDS_AT'))
			.setTimestamp(this.endsAt);
	}

	public async init() {
		this.message = await this.fetchMessage();
	}

	public async create(channel?: TextChannel) {
		if (!channel) channel = await this.client.channels.fetch(this.channelID!) as TextChannel;
		const language = this.client.languages.get(channel.guild.settings.get('language'));
		const msg = await channel.send(this.renderEmbed(language));
		await msg.react(this.reaction);

		this.message = msg as KlasaMessage;
		this.messageID = msg.id;
		this.channelID = msg.channel.id;
		this.guildID = msg.guild!.id;
		return this;
	}

	public async update() {
		this.state = 'RUNNING';
		const msg = await this.fetchMessage();
		return msg.edit(this.renderEmbed(msg.language));
	}

	public async finish() {
		this.state = 'ENDING';
		const msg = await this.fetchMessage();
		const embed = new MessageEmbed()
			.setTitle(this.title)
			.setFooter(msg.language.get('ENDED_AT'))
			.setTimestamp();

		if (msg.reactions.get(this.reaction)?.count! < 2) {
			await msg.edit(msg.language.get('GIVEAWAY_END'), embed
				.setDescription(msg.language.get('NOT_ENOUGH_REACTIONS', this.winnerCount)));
		} else {
			const users = await msg.reactions.get(this.reaction)!.users.fetch();
			const winners = Util.getWinners(msg, users, this.winnerCount)
				.filter(u => u)
				.map(u => u!.toString())
				.join(', ');

			await msg.edit(msg.language.get('GIVEAWAY_END'), embed
				.setDescription(`**Winner: ${winners}**`));

			await msg.channel.send(msg.language.get('GIVEAWAY_WON', winners, this.title));
		}

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
