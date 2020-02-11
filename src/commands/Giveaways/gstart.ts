import { KlasaMessage, CommandStore, Command, KlasaClient, util, Language } from 'klasa';
import { TextChannel } from 'discord.js';

export default class extends Command {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, util.mergeDefault({
			requiredPermissions: ['ADD_REACTIONS'],
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '<duration:timespan> <winner_count:int> <title:...str{0,250}>',
			enabled: client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_START_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_START_EXTENDED')
		}, client.options.giveaway.commands!.start));
	}

	public async run(msg: KlasaMessage, [time, winnerCount, title]: [number, number, string]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = this.client.giveawayManager.running.filter(g => g.guildID === msg.guild!.id);
		const max = this.client.options.giveaway.maxGiveaways!;
		if (giveaways.length > max) throw msg.language.get('MAX_GIVEAWAYS', max);

		return this.client.giveawayManager.create(msg.channel as TextChannel, {
			endsAt: Date.now() + time,
			author: msg.author.id,
			title,
			winnerCount
		});
	}

}
