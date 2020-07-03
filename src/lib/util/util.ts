import { Second, Minute, Hour, Day } from './constants';
import { GuildMember, MessageReactionUserStore, Message } from '@klasa/core';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default abstract class Util {

	public static ms(duration: number): string {
		const seconds = Math.floor((duration / Second) % 60);
		const minutes = Math.floor((duration / Minute) % 60);
		const hours = Math.floor((duration / Hour) % 24);
		const days = Math.floor(duration / Day);

		let mess = '';
		if (days) mess += `**${days}** day${days > 1 ? 's' : ''} `;
		if (hours) mess += `**${hours}** hour${hours > 1 ? 's' : ''} `;
		if (minutes) mess += `**${minutes}** minute${minutes > 1 ? 's' : ''} `;
		if (seconds) mess += `**${seconds}** second${seconds > 1 ? 's' : ''} `;

		return mess;
	}

	public static getWinners(msg: Message, users: MessageReactionUserStore, winnerCount: number): GuildMember[] {
		const filtered = users
			.map(us => msg.guild!.members.resolve(us))
			.filter(us => Boolean(us))
			.filter(us => msg.client.options.giveaway.winnersFilter!(us!));

		return Util.sample(filtered, winnerCount)
			.filter(us => Boolean(us)) as GuildMember[];
	}

	public static sample<V>(array: V[], size: number): V[] {
		return Array.from({ length: size }, () => array.splice(Math.floor(Math.random() * array.length), 1)[0]);
	}

}
