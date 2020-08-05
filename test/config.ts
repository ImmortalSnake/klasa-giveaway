import { KlasaClientOptions } from 'klasa';
import { Giveaway } from '../src';
import { GuildMember } from 'discord.js';

export const config: KlasaClientOptions = {
	owners: ['410806297580011520'],
	prefix: '..',
	preserveSettings: false,
	noPrefixDM: true,
	giveaway: {
		maxGiveaways: 2,
		nextRefresh(giveaway: Giveaway): number {
			const timeLeft = giveaway.endsAt - Date.now();
			let nextRefresh = 4 * 3600 * 1000; // 4 hours at more than 1 day

			if (timeLeft < 180 * 1000) nextRefresh = 15 * 1000; // 15 seconds at less than 3 minute
			else if (timeLeft < 3600 * 1000) nextRefresh = 120 * 1000; // 2 minutes at less than 1 hour
			else if (timeLeft < 24 * 3600 * 1000) nextRefresh = 3600 * 1000; // 1 hour at less than 1 day

			return giveaway.lastRefresh + nextRefresh;
		},
		winnersFilter(member: GuildMember) : boolean {
			return !member.user.bot && member.guild.ownerID !== member.id;
		}
	}
};
