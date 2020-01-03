import { CommandStore, KlasaMessage, Command } from 'klasa';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '[message:message]',
			description: lang => lang.get('COMMAND_DELETE_DESCRIPTION')
		});
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage | undefined]): Promise<KlasaMessage | KlasaMessage[]> {
		const giveaways = msg.guildSettings.get('giveaways') as string[];
		if (giveaways.length === 0) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		const id = message ? message.id : giveaways[0];
		const giveaway = this.client.schedule.tasks.find(task => task.data && task.data.message === id);
		if (!giveaway || !giveaways.includes(id)) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		await msg.guildSettings.update('giveaways.running', id, { arrayAction: 'remove' });
		await giveaway.delete();

		return msg.sendLocale('GIVEAWAY_DELETE', [id]);
	}

}
