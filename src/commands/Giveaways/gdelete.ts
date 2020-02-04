import { CommandStore, KlasaMessage, Command, KlasaClient } from 'klasa';
import GiveawayClient from '../../lib/client';

export default class extends Command {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '[message:message]',
			description: lang => lang.get('COMMAND_DELETE_DESCRIPTION')
		});
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage | undefined]): Promise<KlasaMessage | KlasaMessage[]> {
		const running = (this.client as GiveawayClient).giveawayManager.running.find(g => g.guildID === msg.guild!.id);
		if (!running) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		const id = message ? message.id : running.messageID;
		const giveaway = (this.client as GiveawayClient).giveawayManager.running.find(g => g.messageID === id);
		if (!giveaway) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		// await msg.guildSettings.update('giveaways.running', id, { action: 'remove' });
		await (this.client as GiveawayClient).giveawayManager.delete(id!);

		return msg.sendLocale('GIVEAWAY_DELETE', [id]);
	}

}
