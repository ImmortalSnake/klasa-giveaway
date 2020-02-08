import { KlasaClient, KlasaMessage, util } from 'klasa';
import { TextChannel } from 'discord.js';
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
		const entries = await this.provider.getAll('Giveaways') as GiveawayData[];

		for (const entry of entries) await this.add(entry).init();
		setInterval(this.refresh.bind(this), 5000);
	}

	public async create(channel: TextChannel, rawData: GiveawayCreateData) {
		const giveaway = await this.add(rawData)
			.create(channel);

		await this.provider.update('Giveaways', giveaway.messageID!, giveaway.data);
		return null;
	}

	public delete(id: string) {
		const index = this.running.findIndex(g => g.messageID === id);
		if (index !== -1) this.running.splice(index, 1).forEach(g => g.state = 'FINISHED');

		return this.provider.delete('Giveaways', id);
	}

	public async end(id: string) {
		const giveaway = this.running.find(g => g.messageID === id);
		if (!giveaway) throw Error(`No giveaway found with ID: ${id}`);

		giveaway.endsAt = Date.now();
		return this.update(giveaway);
	}

	public async edit(id: string, data: GiveawayEditData) {
		const giveaway = this.running.find(g => g.messageID === id);
		if (!giveaway) throw Error(`No giveaway found with ID: ${id}`);

		util.mergeDefault(giveaway.data, data);
		return this.provider.update('Giveaways', id, giveaway.data);
	}

	public async reroll(msg: KlasaMessage, data?: GiveawayRerollData) {
		const reaction = data?.reaction || '🎉';
		if (msg?.author.id !== msg.client.user!.id
			|| !msg.reactions.has(reaction)) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		const isRunning = this.running.find(g => g.messageID === msg.id);
		if (isRunning) throw msg.language.get('GIVEAWAY_RUNNING');

		const users = await msg.reactions.get(reaction)?.users.fetch();
		return Util.getWinners(msg, users!, data?.winnerCount ?? 1);
	}

	private async update(giveaway: Giveaway) {
		if (giveaway.state === 'FINISHED') return;
		if (giveaway.endsAt <= Date.now()) return giveaway.finish();

		this.giveaways.push(giveaway);
		return giveaway.update();
	}

	private refresh() {
		if (!this.giveaways.length) return;
		for (const giveaway of this.giveaways) {
			if (giveaway.state !== 'FINISHED') setTimeout(this.update.bind(this, giveaway), giveaway.refreshAt - Date.now());
		}

		this.giveaways = [];
		this.running = this.running.filter(g => g.state !== 'FINISHED');
	}

	private add(data: GiveawayCreateData) {
		const giveaway = new Giveaway(this, data);
		this.giveaways.push(giveaway);
		this.running.push(giveaway);

		return giveaway;
	}

}


export interface GiveawayData extends GiveawayCreateData {
	messageID: string;
	channelID: string;
	guildID: string;
	endsAt: number;
	winnerCount: number;
	title: string;
	startAt?: number;
	reaction: string;
}

export interface GiveawayCreateData {
	messageID?: string;
	channelID?: string;
	guildID?: string;
	title: string;
	winnerCount: number;
	endsAt: number;
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
