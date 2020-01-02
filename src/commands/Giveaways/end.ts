import { Command, CommandStore, KlasaMessage } from 'klasa';
import GiveawayClient from '../../lib/client';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			permissionLevel: 5,
			usage: '[message:message]',
			description: (lang) => lang.get('end_description')
		});
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = msg.guildSettings.get('giveaways') as any[];
		if (giveaways.length === 0) throw msg.language.get('no_running_giveaway', msg.prefix);

		// eslint-disable-next-line prefer-destructuring
		if (!message) message = giveaways[0].message;
		const mess = await (this.client as GiveawayClient).giveawayManager.validate(message.id, msg.guild!.id);
		if (!mess) throw msg.language.get('giveaway_not_found');
		await (this.client as GiveawayClient).giveawayManager.finish(mess);
		return null;
	}

}
