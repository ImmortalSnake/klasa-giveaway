import { Command, CommandStore, KlasaMessage } from 'klasa';
import GiveawayClient from '../../lib/client';

export default class extends Command {

	constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			permissionLevel: 5,
			usage: '[message:message]',
			description: (lang) => lang.get('reroll_description')
		});
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage | null]): Promise<KlasaMessage | KlasaMessage | null> {
		if (message) {
			if (message.author.id === this.client.user!.id && message.embeds.length) {
				await (this.client as GiveawayClient).giveawayManager.finish(message, { reroll: true });
			}
		} else {
			const finished = msg.guildSettings.get('giveaways.finished') as string;
			if (!finished) throw msg.language.get('giveaway_not_found');

			const mess = await msg.channel.messages.fetch(finished) as KlasaMessage;
			if (!mess) throw msg.language.get('giveaway_not_found');

			await (this.client as GiveawayClient).giveawayManager.finish(mess, { reroll: true });
		}

		return null;
	}

}
