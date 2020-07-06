import { KlasaMessage, CommandStore, Command, Language } from 'klasa';
import { Message, TextChannel, Permissions } from '@klasa/core';
import { mergeObjects } from '@klasa/utils';
import { ChannelType } from '@klasa/dapi-types';

export default class extends Command {

	public constructor(store: CommandStore, directory: string, file: string[]) {
		super(store, directory, file, mergeObjects({
			requiredPermissions: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			permissionLevel: 5,
			runIn: [ChannelType.GuildText],
			usageDelim: ' ',
			usage: '<duration:duration> <winner_count:int{1,}> <title:...str{0,250}>',
			description: (lang: Language) => lang.get('COMMAND_START_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_START_EXTENDED')
		}, store.client.options.giveaway.commands!.start || {}));
	}

	public async run(msg: KlasaMessage, [time, winnerCount, title]: [Date, number, string]): Promise<Message[]> {
		const giveaways = this.client.giveawayManager.running.filter(gv => gv.guildID === msg.guild!.id);
		const max = this.client.options.giveaway.maxGiveaways!;
		if (giveaways.length >= max) throw msg.language.get('MAX_GIVEAWAYS', max);

		await this.client.giveawayManager.create(msg.channel as TextChannel, {
			endsAt: time.getTime(),
			author: msg.author.id,
			title,
			winnerCount
		});
		return [msg];
	}

}
