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
		const finished = msg.guild!.settings.get('finished') as string[];
		if (finished.length === 0) return null;

		if (message) {
			const text = finished.find(ex => ex === message.id);
			if (!text) throw msg.language.get('giveaway_not_found');

			await (this.client as GiveawayClient).giveawayManager.finish(message);
		} else {
			const text = finished[0];
			const mess = await msg.channel.messages.fetch(text) as KlasaMessage;

			if (!mess) throw msg.language.get('giveaway_not_found');
			await (this.client as GiveawayClient).giveawayManager.finish(mess);
		}

		return null;
	}

}
