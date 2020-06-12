import { KlasaClient, KlasaMessage, util } from 'klasa';
import { TextChannel, Message, GuildMember } from 'discord.js';
import Giveaway from './Giveaway';
import Util from '../util/util';

export default class GiveawayManager {

	public readonly client: KlasaClient;
	public running: Giveaway[] = [];
	private giveaways: Giveaway[] = [];

	public constructor(client: KlasaClient) {
		this.client = client;
	}

	public get provider() {
		return this.client.providers.get(this.client.options.giveaway.provider || '') || this.client.providers.default;
	}

	public async init() {
		const hasTable = await this.provider.hasTable('Giveaways');
		if (!hasTable) await this.provider.createTable('Giveaways');

		const entries = await this.provider.getAll('Giveaways') as GiveawayData[];
		for (const entry of entries) await this.add(entry).init();

		setInterval(this.refresh.bind(this), 5000);
	}

	public async create(channel: TextChannel, rawData: GiveawayCreateData): Promise<Giveaway> {
		const giveaway = await this.add(rawData)
			.create(channel);

		await this.provider.update('Giveaways', giveaway.messageID!, giveaway.data);
		return giveaway;
	}

	public async delete(id: string): Promise<null> {
		const index = this.running.findIndex(g => g.messageID === id);
		if (index !== -1) this.running.splice(index, 1).forEach(g => g.state = 'FINISHED');

		return this.provider.delete('Giveaways', id);
	}

	public async end(id: string): Promise<Message | null> {
		const giveaway = this.running.find(g => g.messageID === id);
		if (!giveaway) throw Error(`No giveaway found with ID: ${id}`);

		giveaway.endsAt = Date.now();
		return this.update(giveaway);
	}

	public async edit(id: string, data: GiveawayEditData): Promise<Giveaway> {
		const giveaway = this.running.find(g => g.messageID === id);
		if (!giveaway) throw Error(`No giveaway found with ID: ${id}`);

		util.mergeDefault(giveaway.data, data);
		await this.provider.update('Giveaways', id, giveaway.data);
		return giveaway;
	}

	public async reroll(msg: KlasaMessage, data?: GiveawayRerollData): Promise<GuildMember[]> {
		const reaction = data?.reaction || '🎉';
		if (msg?.author.id !== msg.client.user!.id
			|| !msg.reactions.cache.has(reaction)) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		const isRunning = this.running.find(g => g.messageID === msg.id);
		if (isRunning) throw msg.language.get('GIVEAWAY_RUNNING');

		const users = await msg.reactions.resolve(reaction)?.users.fetch();
		return Util.getWinners(msg, users!, data?.winnerCount ?? 1);
	}

	private async update(giveaway: Giveaway): Promise<Message | null> {
		if (giveaway.state === 'FINISHED') return null;
		if (giveaway.endsAt <= Date.now()) return giveaway.finish().catch();

		this.giveaways.push(giveaway);
		return giveaway.update().catch();
	}

	private refresh(): void {
		if (!this.giveaways.length) return;
		for (const giveaway of this.giveaways) {
			if (giveaway.state !== 'FINISHED') setTimeout(this.update.bind(this, giveaway), giveaway.refreshAt - Date.now());
		}

		this.giveaways = [];
		this.running = this.running.filter(g => g.state !== 'FINISHED');
	}

	private add(data: GiveawayCreateData): Giveaway {
		const giveaway = new Giveaway(this, data);
		this.giveaways.push(giveaway);
		this.running.push(giveaway);

		return giveaway;
	}

}


export interface GiveawayData extends GiveawayCreateData {
	id: string;
	channelID: string;
	endsAt: number;
	winnerCount: number;
	title: string;
	startAt?: number;
	reaction: string;
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
	title?: string;
	winnerCount?: number;
	endsAt?: number;
	reaction?: string;
}

export interface GiveawayRerollData {
	winnerCount?: number;
	reaction?: string;
}
