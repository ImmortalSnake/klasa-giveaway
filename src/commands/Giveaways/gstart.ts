import { KlasaMessage, CommandStore, Command, util, Language } from 'klasa';
import { TextChannel } from 'discord.js';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, util.mergeDefault({
			requiredPermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '<duration:duration> <winner_count:int{1,}> <title:...str{0,250}>',
			enabled: store.client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_START_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_START_EXTENDED')
		}, store.client.options.giveaway.commands!.start));
	}

	public async run(msg: KlasaMessage, [time, winnerCount, title]: [Date, number, string]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = this.client.giveawayManager.running.filter(gv => gv.guildID === msg.guild!.id);
		const max = this.client.options.giveaway.maxGiveaways!;
		if (giveaways.length >= max) throw msg.language.get('MAX_GIVEAWAYS', max);

		await this.client.giveawayManager.create(msg.channel as TextChannel, {
			endsAt: time.getTime(),
			author: msg.author.id,
			title,
			winnerCount
		});
		return null;
	}

}
