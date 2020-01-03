import { KlasaClient, KlasaMessage, ScheduledTask } from 'klasa';
import { TextChannel, User, Message, Collection, MessageEmbed } from 'discord.js';
import Util from '../util/util';
import { Second, Minute, COLORS } from '../util/constants';

interface GiveawayFinishData {
	title?: string;
	wCount?: number;
	reroll?: boolean;
}

interface GiveawayCreateData {
	message: Message;
	time: number;
	wCount: number;
	title: string;
}

export interface GiveawayUpdateData {
	channel: string;
	message: string;
	wCount: number;
	title: string;
	endAt: number;
}

export default class GiveawayManager {

	public client: KlasaClient;
	public constructor(client: KlasaClient) {
		this.client = client;
	}

	public async finish(msg: KlasaMessage, { reroll, title, wCount }: GiveawayFinishData): Promise<Message> {
		if (!title || !wCount) {
			title = msg.embeds[0].title;
			wCount = 1;
		}

		if (!reroll) {
			await msg.guildSettings.update('giveaways.finished', msg.id);
			await msg.guildSettings.update('giveaways.running', msg.id, { arrayAction: 'remove' });
		}

		const embed = new MessageEmbed()
			.setTitle(title)
			.setColor(msg.guild ? msg.member!.displayColor : COLORS.PRIMARY)
			.setFooter(msg.language.get('ENDED_AT'))
			.setTimestamp();

		if (msg.reactions.get('🎉')!.count < 2) {
			return msg.edit(msg.language.get('GIVEAWAY_END'), embed
				.setDescription(msg.language.get('NOT_ENOUGH_REACTIONS', wCount)));
		}

		const users = await msg.reactions.get('🎉')!.users.fetch();
		const winner = this.getWinners(users, wCount);

		await msg.edit(msg.language.get('GIVEAWAY_END'), embed
			.setDescription(`**Winner: ${winner}**`));

		return msg.channel.send(msg.language.get('GIVEAWAY_WON', winner, title));

	}

	public shuffle(arr: any[]): any[] {
		for (let i = arr.length; i; i--) {
			const j = Math.floor(Math.random() * i);
			[arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
		}
		return arr;
	}

	public draw(list: any[]): any {
		const shuffled = this.shuffle(list);
		return shuffled[Math.floor(Math.random() * shuffled.length)];
	}


	public async update({ message, channel, endAt, title, wCount }: GiveawayUpdateData) {
		const chan = await this.client.channels.fetch(channel) as TextChannel;
		const msg = await chan.messages.fetch(message) as KlasaMessage;
		if (!msg) return;

		if (endAt <= Date.now()) return this.finish(msg, { title, wCount });

		return msg.edit(new MessageEmbed()
			.setTitle(title)
			.setColor(msg.guild ? msg.member!.displayColor : COLORS.PRIMARY)
			.setDescription(msg.language.get('GIVEAWAY_DESCRIPTION', wCount, Util.ms(endAt - Date.now())))
			.setFooter(msg.language.get('ENDS_AT'))
			.setTimestamp(endAt))
			.then(() => this.create({
				message: msg,
				title,
				wCount,
				time: endAt
			}));
	}

	public create({ message, title, wCount, time }: GiveawayCreateData): Promise<ScheduledTask> {
		return this.client.schedule.create('giveaway', this.nextRefresh(time - Date.now()), {
			data: {
				channel: message.channel.id,
				message: message.id,
				endAt: time,
				title,
				wCount
			},

			catchUp: true
		});
	}

	private nextRefresh(remaining: number) {
		if (remaining < 5 * Second) return Date.now() + Second;
		if (remaining < 30 * Second) return Date.now() + Math.min(remaining - (6 * Second), 5 * Second);
		if (remaining < 2 * Minute) return Date.now() + (15 * Second);
		if (remaining < 5 * Minute) return Date.now() + (20 * Second);

		if (remaining < 15 * Minute) return Date.now() + Minute;
		if (remaining < 30 * Minute) return Date.now() + (2 * Minute);
		return Date.now() + (5 * Minute);
	}

	private getWinners(users: Collection<string, User>, amount: number): string {
		const winners: User[] = [];

		const list = users.filter(user => user.id !== this.client.user!.id).array();
		for (let i = 0; i < amount; i++) {
			const x = this.draw(list);
			if (!winners.includes(x)) winners.push(x);
		}

		return winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(', ');
	}

}
