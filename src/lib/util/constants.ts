import { GiveawayOptions } from '../client';
import { MessageEmbed, GuildMember, Message } from 'discord.js';
import Util from './util';
import { Giveaway } from '../..';
import { KlasaMessage, Language } from 'klasa';

export const Second = 1000;
export const Minute = 60 * Second;
export const Hour = 60 * Minute;
export const Day = 24 * Hour;

export const OPTIONS = {
	giveaway: {
		maxGiveaways: Infinity,
		requiredPermission: 5,
		updateInterval: 5000,
		enableCommands: true,
		commands: {},
		nextRefresh: (giveaway) => giveaway.lastRefresh + (5 * Minute),

		givewayRunMessage,
		giveawayFinishMessage
	} as GiveawayOptions
};


function givewayRunMessage(giveaway: Giveaway, language: Language): { content: string, embed: MessageEmbed } {
	return {
		content: language.get('GIVEAWAY_CREATE'),
		embed: new MessageEmbed()
			.setTitle(giveaway.title)
			.setColor('#42f54e')
			.setDescription(language.get('GIVEAWAY_DESCRIPTION', giveaway.winnerCount, Util.ms(giveaway.endsAt - Date.now()), giveaway.author))
			.setFooter(language.get('ENDS_AT'))
			.setTimestamp(giveaway.endsAt)
	};
}

async function giveawayFinishMessage(giveaway: Giveaway, winners: GuildMember[], msg: KlasaMessage): Promise<Message> {
	const embed = new MessageEmbed()
		.setTitle(giveaway.title)
		.setFooter(msg.language.get('ENDED_AT'))
		.setTimestamp();

	if (winners.length < giveaway.winnerCount) {
		return msg.edit(msg.language.get('GIVEAWAY_END'), embed
			.setDescription(msg.language.get('NOT_ENOUGH_REACTIONS', giveaway.winnerCount)));
	}

	await msg.edit(msg.language.get('GIVEAWAY_END'), embed
		.setDescription(`**Winner: ${winners.map(us => us.toString()).join(', ')}**`));

	return msg.channel.send(msg.language.get('GIVEAWAY_WON', winners, giveaway.title));
}
