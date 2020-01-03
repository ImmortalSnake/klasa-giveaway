import { Command, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			promptLimit: 1,
			subcommands: true,
			aliases: ['remind'],
			description: 'creates a reminder',
			usage: '<when:time> <text:...str>'
		});
	}

	public async set(msg: KlasaMessage, [when, text]: [Date, string]): Promise<KlasaMessage | KlasaMessage[]> {
		const reminder = await this.client.schedule.create('reminder', when, {
			data: {
				user: msg.author.id,
				text
			}
		});
		return msg.sendLocale('REMINDER_CREATE', [reminder.id]);
	}

}
