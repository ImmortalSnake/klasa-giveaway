import { Second, Minute, Hour, Day } from './constants';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default abstract class Util {

	public static ms(duration: number): string {
		const seconds = Math.floor((duration / Second) % 60);
		const minutes = Math.floor((duration / Minute) % 60);
		const hours = Math.floor((duration / Hour) % 24);
		const days = Math.floor(duration / Day);

		let mess = '';
		if (days) mess += `**${days}** ${days > 1 ? 'days' : 'day'} `;
		if (hours) mess += `**${hours}** ${hours > 1 ? 'hours' : 'hour'} `;
		if (minutes) mess += `**${minutes}** ${minutes > 1 ? 'minutes' : 'minute'} `;
		if (seconds) mess += `**${seconds}** ${seconds > 1 ? 'seconds' : 'second'} `;

		return mess;
	}

}
