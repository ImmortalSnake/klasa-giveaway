import { Command, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			permissionLevel: 5,
			usage: '[message:message]',
			description: (lang) => lang.get('delete_description')
		});
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage]): Promise<KlasaMessage | KlasaMessage[]> {
		const giveaway = (msg.guildSettings.get('giveaways') as any[]).find(ex => ex.message === message.id);
		if (!giveaway) throw msg.language.get('giveaway_not_found');
		await msg.guildSettings.update('giveaways', giveaway, { arrayAction: 'remove' });

		return msg.sendLocale('giveaway_delete', [message.id]);
	}

}
