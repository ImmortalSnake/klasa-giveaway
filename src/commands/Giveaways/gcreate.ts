import { KlasaMessage, CommandStore, Command, Possible, util, Language } from 'klasa';
import { TextChannel } from 'discord.js';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, util.mergeDefault({
			requiredPermissions: ['ADD_REACTIONS'],
			permissionLevel: store.client.options.giveaway.requiredPermission,
			promptLimit: 1,
			promptTime: 60 * 1000,
			runIn: ['text'],
			usageDelim: ' ',
			enabled: store.client.options.giveaway.enableCommands,
			usage: '<channel:textchannel> <duration:duration> <winner_count:int{1,}> <title:...str{0,250}>',
			description: (lang: Language) => lang.get('COMMAND_CREATE_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_CREATE_EXTENDED')
		}, store.client.options.giveaway.commands!.create));

		this.createCustomResolver('textchannel', (arg: string, possible: Possible, message: KlasaMessage) =>
			this.client.arguments.get('textChannel')!.run(arg, possible, message));
	}

	public async run(msg: KlasaMessage, [channel, time, winnerCount, title]: [TextChannel, number, number, string]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = this.client.giveawayManager.running.filter(g => g.guildID === msg.guild!.id);
		const max = this.client.options.giveaway.maxGiveaways!;
		if (giveaways.length > max) throw msg.language.get('MAX_GIVEAWAYS', max);

		return this.client.giveawayManager.create(channel, {
			endsAt: time,
			author: msg.author.id,
			title,
			winnerCount
		})
			.then(() => msg.sendLocale('GIVEAWAY_CREATE_SUCCESS', [channel.toString()]));
	}

}
