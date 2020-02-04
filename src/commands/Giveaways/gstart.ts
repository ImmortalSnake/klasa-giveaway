import { KlasaMessage, CommandStore, Command, KlasaClient } from 'klasa';
import GiveawayClient from '../../lib/client';
import { TextChannel } from 'discord.js';

export default class extends Command {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			requiredPermissions: ['ADD_REACTIONS'],
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '<duration:timespan> <winner_count:int> <title:...str{0,250}>',
			description: lang => lang.get('COMMAND_START_DESCRIPTION')
		});
	}

	public async run(msg: KlasaMessage, [time, winnerCount, title]: [number, number, string]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = (this.client as GiveawayClient).giveawayManager.running.filter(g => g.guildID === msg.guild!.id);
		if (giveaways.length > this.client.options.giveaway.maxGiveaways!) throw msg.language.get('MAX_GIVEAWAYS');

		return (this.client as GiveawayClient).giveawayManager.create(msg.channel as TextChannel, {
			endsAt: Date.now() + time,
			title,
			winnerCount
		});
	}

}
