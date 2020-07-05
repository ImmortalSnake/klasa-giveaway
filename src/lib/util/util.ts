import { Second, Minute, Hour, Day } from './constants';
import { GuildMember, MessageReactionUserStore, Message } from '@klasa/core';

export default abstract class Util {

	/**
	 * Utility function to convert duration to human friendly format
	 * @param duration Duration in milliseconds
	 */
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

	/**
	 * Filters and selects the given number of winners from the users who reacted
	 * @param msg Any message
	 * @param users Users who reacted to the giveaway
	 * @param winnerCount Number of winners to select
	 */
	public static getWinners(msg: Message, users: MessageReactionUserStore, winnerCount: number): GuildMember[] {
		const filtered = users
			.map(us => msg.guild?.members.resolve(us))
			.filter(us => Boolean(us))
			.filter(us => msg.client.options.giveaway.winnersFilter!(us!));

		return Util.sample(filtered, winnerCount)
			.filter(us => Boolean(us)) as GuildMember[];
	}

	/**
	 * Randomly chooses a given number of elements from an array
	 * @param array Any array of elements
	 * @param size Number of elemets to select
	 */
	public static sample<V>(array: V[], size: number): V[] {
		return Array.from({ length: size }, () => array.splice(Math.floor(Math.random() * array.length), 1)[0]);
	}

}
