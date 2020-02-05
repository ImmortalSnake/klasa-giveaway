import { GiveawayOptions } from '../client';
import { MessageEmbed } from 'discord.js';
import Util from './util';

export const OPTIONS = {
	giveaway: {
		maxGiveaways: Infinity,
		requiredPermission: 5,
		givewayRunEmbed: (giveaway, language) => new MessageEmbed()
			.setTitle(giveaway.title)
			.setColor('#42f54e')
			.setDescription(language.get('GIVEAWAY_DESCRIPTION', giveaway.winnerCount, Util.ms(giveaway.endsAt - Date.now())))
			.setFooter(language.get('ENDS_AT'))
			.setTimestamp(giveaway.endsAt)
	} as GiveawayOptions
};

export const Second = 1000;
export const Minute = 60 * Second;
export const Hour = 60 * Minute;
export const Day = 24 * Hour;
