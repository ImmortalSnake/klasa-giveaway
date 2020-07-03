import { GiveawayManager, GiveawayCreateData, GiveawayData } from './GiveawayManager';
import { Language } from 'klasa';
import { Message, TextChannel, Client, GuildMember, MessageBuilder } from '@klasa/core';
import { isFunction } from '@klasa/utils';
import Util from '../util/util';
import { GiveawayOptions } from '../..';

export type GiveawayState = 'CREATING' | 'RUNNING' | 'ENDING' | 'FINISHED';

export class Giveaway {

	/**
	 * The giveaway manager that manages this giveaway instance
	 * @readonly
	 */
	public readonly manager: GiveawayManager;

	/**
	 * The time in milliseconds when the giveaway ends
	 */
	public endsAt: number;

	/**
	 * The time in milliseconds when the giveaway started
	 */
	public startAt: number;

	/**
	 * The time in milliseconds when the giveaway was last refreshed
	 * @default Date.now()
	 */
	public lastRefresh: number;

	/**
	 * Total number of winners to be chosen
	 */
	public winnerCount: number;

	/**
	 * The title given to the giveaway
	 */
	public title: string;

	/**
	 * The giveway message ID
	 */
	public messageID?: string;

	/**
	 * The channel ID of the giveway message
	 */
	public channelID?: string;

	/**
	 * The guild ID of the giveway message
	 */
	public guildID?: string;

	/**
	 * The ID of the author who created the giveaway
	 */
	public author?: string;

	/**
	 * The giveway message
	 */
	public message: Message | null = null;

	/**
	 * Current state of the giveaway
	 */
	public state: GiveawayState = 'CREATING';

	/**
	 * The reaction emoji string which the giveaway will count
	 * @default '🎉'
	 */
	public reaction: string;

	/**
	 * Constructs the giveaway instance
	 * @param manager The giveaway manager that manages this giveaway instance
	 * @param data The giveaway data
	 */
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

	/**
	 * The Discord client
	 */
	public get client(): Client {
		return this.manager.client;
	}

	/**
	 * The giveaway options provided to the client
	 */
	public get options(): GiveawayOptions {
		return this.client.options.giveaway;
	}

	/**
	 * Time in milliseconds for the next refresh
	 */
	public get refreshAt(): number {
		const nextRefresh = this.options.nextRefresh!(this);
		return Math.min(nextRefresh, this.endsAt);
	}

	/**
	 * Total duration in milliseconds of the giveaway
	 */
	public get duration(): number {
		return this.endsAt - this.startAt;
	}

	/**
	 * The giveaway data (stored in database)
	 */
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

	/**
	 * Returns an embed or string after running the `GiveawayOptions.giveawayRunMessage` function
	 * @param lang The language to use when rendering the message
	 */
	public renderMessage(lang: Language): ((arg0: MessageBuilder) => MessageBuilder) | undefined {
		if (isFunction(this.options.runMessage)) return this.options.runMessage(this, lang);
		return this.options.runMessage;
	}

	/**
	 * Returns an embed or string after running the GiveawayOptions.giveawayFinishMessage function
	 * @param winners The giveaway winners
	 * @param msg The giveaway message that can be edited
	 */
	public async finishMessage(winners: GuildMember[], msg: Message): Promise<any> {
		if (isFunction(this.options.finishMessage)) return this.options.finishMessage(this, winners, msg);
		return this.options.finishMessage;
	}

	/**
	 * Initializes the giveaway, used when initializing giveaways on restart
	 */
	public async init(): Promise<void> {
		this.message = await this.fetchMessage().catch(() => null);
		if (!this.message) this.manager.delete(this.messageID!);
	}

	/**
	 * Creates the giveaway and sends the giveaway message
	 * @param channel The channel to send the giveaway message
	 */
	public async create(channel?: TextChannel): Promise<this> {
		if (!channel) channel = await this.client.channels.fetch(this.channelID!) as TextChannel;
		const { language } = channel.guild;
		const [msg] = await channel.send(this.renderMessage(language)!);
		await msg.reactions.add(this.reaction);

		this.message = msg;
		this.messageID = msg.id;
		this.channelID = msg.channel.id;
		this.guildID = msg.guild!.id;
		return this;
	}

	/**
	 * Updates the giveaway and edits the giveaway message
	 */
	public async update(): Promise<Message | unknown> {
		this.state = 'RUNNING';
		this.lastRefresh = Date.now();

		const msg = await this.fetchMessage().catch(() => null);
		if (!msg) return this.manager.delete(this.messageID!);

		return msg.edit(this.renderMessage(msg.language)!);
	}

	/**
	 * Finishes the giveaway and sends the giveaway finish message
	 */
	public async finish(): Promise<unknown> {
		this.state = 'ENDING';

		const msg = await this.fetchMessage().catch(() => null);
		if (!msg) return this.manager.delete(this.messageID!);

		const users = await msg.reactions.resolve(this.reaction)!.users.fetch();
		const winners = Util.getWinners(msg, users, this.winnerCount);
		await this.finishMessage(winners, msg);

		this.state = 'FINISHED';
		await msg.guildSettings.update('giveaways.finished', msg.id);
		return this.manager.delete(this.messageID!);
	}

	/**
	 * Returns the cached message if it exists or else fetches it
	 */
	private async fetchMessage(): Promise<Message> {
		if (this.message) return this.message;
		return this.client.channels.fetch(this.channelID!)
			.then(chan => {
				this.guildID = (chan as TextChannel).guild.id;
				return (chan as TextChannel).messages.fetch(this.messageID!);
			});
	}

}
