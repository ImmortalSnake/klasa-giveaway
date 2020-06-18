import { KlasaClient, KlasaMessage, util } from 'klasa';
import { TextChannel, Message, GuildMember } from 'discord.js';
import Giveaway from './Giveaway';
import Util from '../util/util';

export default class GiveawayManager {

	/**
	 * The Discord Client 
	 * @readonly
	 */
	public readonly client: KlasaClient;

	/**
	 * A queue of all running giveaways
	 */
	public running: Giveaway[] = [];

	/**
	 * Array of giveaways to be updated
	 * @private
	 */
	private giveaways: Giveaway[] = [];

	/**
	 * Constructs the GiveawayManager
	 * @param {KlasaClient} client The discord client
	 */
	public constructor(client: KlasaClient) {
		this.client = client;
	}

	/**
	 * Gets the provider being used by the giveaway manager
	 */
	public get provider() {
		return this.client.providers.get(this.client.options.giveaway.provider || '') || this.client.providers.default;
	}

	/**
	 * Initializes the GiveawayManager and restarts all giveaways
	 */
	public async init(): Promise<void> {
		const hasTable = await this.provider.hasTable('Giveaways');
		if (!hasTable) await this.provider.createTable('Giveaways');

		const entries = await this.provider.getAll('Giveaways') as GiveawayData[];
		for (const entry of entries) await this.add(entry).init();

		setInterval(this.refresh.bind(this), 5000);
	}

	/**
	 * Creates a giveaway in the given channel with the the given giveaway data
	 * @param channel TextChannel where the giveaway will run
	 * @param rawData Data for the created giveaway
	 * @example
	 * ```js
	 * client.giveawayManager.create(msg.channel, {
	 *     endsAt: Date.now() + 1000 * 60 * 60, // 1 hour duration
	 *     author: msg.author.id,
	 *     title: 'FREE NITRO!!',
	 *     winnerCount: 1
	 * });
	 * ```
	 */
	public async create(channel: TextChannel, rawData: GiveawayCreateData): Promise<Giveaway> {
		const giveaway = await this.add(rawData)
			.create(channel);

		await this.provider.update('Giveaways', giveaway.messageID!, giveaway.data);
		return giveaway;
	}

	/**
	 * Deletes a giveaway with the given message id (sent by the bot). This giveaway will no longer be run
	 * @param id ID of the giveaway to delete
	 * @example 
	 * ```js
	 * client.giveawayManager.delete('720919015068925974').catch(() => console.log());
	 * ```
	 */
	public async delete(id: string): Promise<null> {
		const index = this.running.findIndex(g => g.messageID === id);
		if (index !== -1) this.running.splice(index, 1).forEach(g => g.state = 'FINISHED');

		return this.provider.delete('Giveaways', id);
	}

	/**
	 * Ends a giveaway with the given message id (sent by the bot). The giveaway gets finished and the winners are listed
	 * @param id ID of the giveaway to end
	 * @example
	 * ```js
	 * client.giveawayManager.end('720919015068925974').catch(() => console.log());
	 * ```
	 */
	public async end(id: string): Promise<Message | null> {
		const giveaway = this.running.find(g => g.messageID === id);
		if (!giveaway) throw Error(`No giveaway found with ID: ${id}`);

		giveaway.endsAt = Date.now();
		return this.update(giveaway);
	}

	/**
	 * Edits the giveaway data with the fields you give
	 * @param id ID of the giveaway to edit
	 * @param data Giveaway edit data
	 * @example
	 * ```js
	 * client.giveawayManager.edit('720919015068925974', {title: 'FREE GIVEAWAY'})
	 * ```
	 */
	public async edit(id: string, data: GiveawayEditData): Promise<Giveaway> {
		const giveaway = this.running.find(g => g.messageID === id);
		if (!giveaway) throw Error(`No giveaway found with ID: ${id}`);

		util.mergeDefault(giveaway.data, data);
		await this.provider.update('Giveaways', id, giveaway.data);
		return giveaway;
	}

	/**
	 * Rerolls a finished giveaway with the given message and Reroll Data and returns an array of winners
	 * @param msg Giveaway Message to reroll
	 * @param data Giveaway reroll options
	 * @example
	 * ```js
	 * const winners = await client.giveawayManager.reroll(msg)
	 * msg.send(`🎉 **New winner(s) are**: ${winners.map(w => w.toString()).join(', ')}`)
	 * ```
	 */
	public async reroll(msg: KlasaMessage, data?: GiveawayRerollData): Promise<GuildMember[]> {
		const reaction = (data && data.reaction) || '🎉';
		if (msg.author.id !== msg.client.user!.id
			|| !msg.reactions.cache.has(reaction)) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		const isRunning = this.running.find(g => g.messageID === msg.id);
		if (isRunning) throw msg.language.get('GIVEAWAY_RUNNING');

		const users = await msg.reactions.resolve(reaction)?.users.fetch();
		return Util.getWinners(msg, users!, (data && data.winnerCount) ?? 1);
	}

	/**
	 * Updates a certain giveaway, if the time is up it gets finished
	 * @param giveaway The giveaway instance to update
	 */
	private async update(giveaway: Giveaway): Promise<Message | null> {
		if (giveaway.state === 'FINISHED') return null;
		if (giveaway.endsAt <= Date.now()) return giveaway.finish().catch();

		this.giveaways.push(giveaway);
		return giveaway.update().catch();
	}

	/**
	 * Loops through the giveaway queue and sets the update timeout and also filters out the finished giveaways
	 */
	private refresh(): void {
		if (!this.giveaways.length) return;
		for (const giveaway of this.giveaways) {
			if (giveaway.state !== 'FINISHED') setTimeout(this.update.bind(this, giveaway), giveaway.refreshAt - Date.now());
		}

		this.giveaways = [];
		this.running = this.running.filter(g => g.state !== 'FINISHED');
	}

	/**
	 * Creates a giveaway and adds it to the giveaway queue
	 * @param data The giveaway data
	 */
	private add(data: GiveawayCreateData): Giveaway {
		const giveaway = new Giveaway(this, data);
		this.giveaways.push(giveaway);
		this.running.push(giveaway);

		return giveaway;
	}

}


export interface GiveawayData extends GiveawayCreateData {
	/**
	 * ID of the giveaway message
	 */
	id: string;

	/**
	 * ID of the textchannel, the giveaaway was started in
	 */
	channelID: string;

	/**
	 * Time in milliseconds when the giveaway ends
	 */
	endsAt: number;

	/**
	 * Time in milliseconds when the giveaway start
	 * @optional
	 */
	startAt?: number;

	/**
	 * Number of winners to be selected
	 */
	winnerCount: number;

	/**
	 * The giveaway title
	 */
	title: string;

	/**
	 * Reaction to be used for the giveaway
	 */
	reaction: string;

	/**
	 * The user who created the giveaewa
	 */
	author: string;
}

export interface GiveawayCreateData extends Record<string, any> {
	messageID?: string;
	channelID?: string;
	guildID?: string;
	title: string;
	winnerCount: number;
	endsAt: number;
	author?: string;
	startAt?: number;
	reaction?: string;
}

export interface GiveawayEditData {
	/**
	 * New title for the giveaway
	 */
	title?: string;

	/**
	 * New winner count for the giveaway
	 */
	winnerCount?: number;

	/**
	 * Time in milliseconds when the edited giveaway ends
	 */
	endsAt?: number;

	/**
	 * New reaction to be used
	 */
	reaction?: string;
}

export interface GiveawayRerollData {
	/**
	 * Number of winners to choose
	 * @default 1
	 */
	winnerCount?: number;
	/**
	 * Reaction to use for getting the participants
	 * @default '🎉'
	 */
	reaction?: string;
}
