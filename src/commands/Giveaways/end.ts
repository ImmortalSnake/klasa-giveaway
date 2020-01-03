import { CommandStore, KlasaMessage } from 'klasa';
import GiveawayCommand from '../../lib/base/GiveawayCommand';
import { Message } from 'discord.js';

export default class extends GiveawayCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			permissionLevel: 5,
			usage: '[message:message]',
			description: lang => lang.get('end_description')
		});
	}

	public async run(msg: KlasaMessage, [message]: [Message | undefined]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = msg.guildSettings.get('giveaways.running') as string[];
		if (giveaways.length === 0) throw msg.language.get('no_running_giveaway', msg.prefix);

		const id = message ? message.id : giveaways[0];
		const giveaway = this.client.schedule.tasks.find(task => task.data.message === id);

		if (!giveaway) throw msg.language.get('giveaway_not_found');
		message = message ?? await msg.channel.messages.fetch(id);

		if (!message) throw msg.language.get('giveaway_not_found');

		const { title, wCount } = giveaway.data;
		await this.client.giveawayManager.finish(message as KlasaMessage, { title, wCount });
		await giveaway.delete();
		return null;
	}

}
