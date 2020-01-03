import { CommandStore, KlasaMessage, Command } from 'klasa';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			permissionLevel: 5,
			usage: '[message:message]',
			description: lang => lang.get('delete_description')
		});
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage | undefined]): Promise<KlasaMessage | KlasaMessage[]> {
		const giveaways = msg.guildSettings.get('giveaways') as string[];
		if (giveaways.length === 0) throw msg.language.get('no_running_giveaway', msg.prefix);

		const id = message ? message.id : giveaways[0];
		const giveaway = this.client.schedule.tasks.find(task => task.data.message === id);
		if (!giveaway || !giveaways.includes(id)) throw msg.language.get('giveaway_not_found');

		await msg.guildSettings.update('giveaways.running', id, { arrayAction: 'remove' });
		await giveaway.delete();

		return msg.sendLocale('giveaway_delete', [id]);
	}

}
