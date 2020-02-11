import { Second, Minute, Hour, Day } from './constants';
import { KlasaMessage } from 'klasa';
import { Collection, User, GuildMember } from 'discord.js';

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

	public static getWinners(msg: KlasaMessage, users: Collection<string, User>, winnerCount: number) {
		return users
			.mapValues(u => msg.guild!.member(u))
			.filter(u => Boolean(u))
			.random(winnerCount) as GuildMember[];
	}

}
