import { CommandStore, KlasaMessage, Command } from 'klasa';
import { Message } from 'discord.js';
import GiveawayClient from '../../lib/client';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '[message:message]',
			description: lang => lang.get('COMMAND_END_DESCRIPTION')
		});
	}

	public async run(msg: KlasaMessage, [message]: [Message | undefined]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = msg.guildSettings.get('giveaways.running') as string[];
		if (giveaways.length === 0) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		const id = message ? message.id : giveaways[0];
		const giveaway = this.client.schedule.tasks.find(task => task.data && task.data.message === id);

		if (!giveaway) throw msg.language.get('GIVEAWAY_NOT_FOUND');
		message = message ?? await msg.channel.messages.fetch(id);

		if (!message) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		const { title, wCount } = giveaway.data;
		await (this.client as GiveawayClient).giveawayManager.finish(message as KlasaMessage, { title, wCount });
		await giveaway.delete();
		return null;
	}

}
