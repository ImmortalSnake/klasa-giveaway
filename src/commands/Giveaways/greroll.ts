import { Command, CommandStore, KlasaMessage, KlasaClient } from 'klasa';
import GiveawayClient from '../../lib/client';

export default class extends Command {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '[message:message]',
			description: lang => lang.get('COMMAND_REROLL_DESCRIPTION')
		});
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage | null]): Promise<KlasaMessage | KlasaMessage | null> {
		if (message) {
			if (message.author.id === this.client.user!.id && message.embeds.length) {
				await (this.client as GiveawayClient).giveawayManager.finish(message, { reroll: true });
			}
		} else {
			const finished = msg.guildSettings.get('giveaways.finished') as string;
			if (!finished) throw msg.language.get('GIVEAWAY_NOT_FOUND');

			const mess = await msg.channel.messages.fetch(finished) as KlasaMessage;
			if (!mess) throw msg.language.get('GIVEAWAY_NOT_FOUND');

			await (this.client as GiveawayClient).giveawayManager.finish(mess, { reroll: true });
		}

		return null;
	}

}
