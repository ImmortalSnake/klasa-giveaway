/* eslint-disable no-throw-literal */
import { KlasaClient, KlasaMessage } from 'klasa';
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
		return this.client.providers.default;
	}

	public async init() {
		const entries = await this.provider.getAll('Giveaways') as GiveawayData[];

		for (const entry of entries) await this.add(entry).init();
		setInterval(this.refresh.bind(this), 5000);
	}

	public async update(giveaway: Giveaway) {
		if (giveaway.state === 'FINISHED') return;
		if (giveaway.endsAt <= Date.now()) return giveaway.finish();

		this.giveaways.push(giveaway);
		return giveaway.update();
	}

	public async create(channel: TextChannel, rawData: GiveawayCreateData) {
		const giveaway = await this.add(rawData)
			.create(channel);

		await this.provider.update('Giveaways', giveaway.messageID!, giveaway.data);
		return null;
	}

	public delete(id: string) {
		const index = this.giveaways.findIndex(g => g.messageID === id);
		if (index !== -1) this.giveaways.splice(index, 1);

		return this.provider.delete('Giveaways', id);
	}

	public async reroll(msg: KlasaMessage, amount = 1) {
		if (msg?.author.id !== msg.client.user!.id
			|| !msg.reactions.has('🎉')) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		const isRunning = this.running.find(g => g.messageID === msg.id);
		if (isRunning) throw msg.language.get('GIVEAWAY_RUNNING');

		const users = await msg.reactions.get('🎉')?.users.fetch();
		return Util.getWinners(msg, users!, amount);
	}

	private refresh() {
		if (!this.giveaways.length) return;
		for (const giveaway of this.giveaways) {
			if (giveaway.state !== 'FINISHED') setTimeout(this.update.bind(this, giveaway), giveaway!.refreshAt - Date.now());
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
}

export interface GiveawayUpdateData {
	channel: string;
	message: string;
	wCount: number;
	title: string;
	endAt: number;
}

export interface GiveawayCreateData {
	messageID?: string;
	channelID?: string;
	guildID?: string;
	title: string;
	winnerCount: number;
	endsAt: number;
	startAt?: number;
}
