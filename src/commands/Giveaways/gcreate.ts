import { KlasaMessage, CommandStore, Command, KlasaClient, Possible } from 'klasa';
import GiveawayClient from '../../lib/client';
import { TextChannel } from 'discord.js';

export default class extends Command {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			requiredPermissions: ['ADD_REACTIONS'],
			permissionLevel: store.client.options.giveaway.requiredPermission,
			promptLimit: 1,
			promptTime: 60 * 1000,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '<channel:textchannel> <duration:timespan> <winner_count:int> <title:...str{0,250}>',
			description: lang => lang.get('COMMAND_CREATE_DESCRIPTION')
		});

		this.createCustomResolver('textchannel', (arg: string, possible: Possible, message: KlasaMessage) =>
			this.client.arguments.get('textChannel')!.run(arg, possible, message));
	}

	public async run(msg: KlasaMessage, [channel, time, winnerCount, title]: [TextChannel, number, number, string]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = (this.client as GiveawayClient).giveawayManager.running.filter(g => g.guildID === msg.guild!.id);
		const max = this.client.options.giveaway.maxGiveaways!;
		if (giveaways.length > max) throw msg.language.get('MAX_GIVEAWAYS', max);

		return (this.client as GiveawayClient).giveawayManager.create(channel, {
			endsAt: Date.now() + time,
			title,
			winnerCount
		})
			.then(() => msg.sendLocale('GIVEAWAY_CREATE_SUCCESS', [channel.toString()]));
	}

}
