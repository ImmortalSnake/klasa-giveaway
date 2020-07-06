import { KlasaMessage, CommandStore, Command, Possible, Language } from 'klasa';
import { Message, TextChannel, Permissions } from '@klasa/core';
import { mergeObjects } from '@klasa/utils';
import { ChannelType } from '@klasa/dapi-types';

export default class extends Command {

	public constructor(store: CommandStore, directory: string, files: string[]) {
		super(store, directory, files, mergeObjects({
			requiredPermissions: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			permissionLevel: store.client.options.giveaway.requiredPermission,
			promptLimit: 1,
			promptTime: 60 * 1000,
			runIn: [ChannelType.GuildText],
			usageDelim: ' ',
			usage: '<channel:textchannel> <duration:duration> <winner_count:int{1,}> <title:...str{0,250}>',
			description: (lang: Language) => lang.get('COMMAND_CREATE_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_CREATE_EXTENDED')
		}, store.client.options.giveaway.commands!.create || {}));

		this.createCustomResolver('textchannel', (arg: string, possible: Possible, message: Message) =>
			this.client.arguments.get('textChannel')!.run(arg, possible, message));
	}

	public async run(msg: KlasaMessage, [channel, time, winnerCount, title]: [TextChannel, Date, number, string]): Promise<Message[]> {
		const giveaways = this.client.giveawayManager.running.filter(gv => gv.guildID === msg.guild!.id);
		const max = this.client.options.giveaway.maxGiveaways!;
		if (giveaways.length >= max) throw msg.language.get('MAX_GIVEAWAYS', max);

		return this.client.giveawayManager.create(channel, {
			endsAt: time.getTime(),
			author: msg.author.id,
			title,
			winnerCount
		})
			.then(() => msg.replyLocale('GIVEAWAY_CREATE_SUCCESS', [channel.toString()]));
	}

}
