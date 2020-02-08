import { CommandStore, KlasaMessage, Command, KlasaClient, util, Language } from 'klasa';
import { Message } from 'discord.js';
import GiveawayClient from '../../lib/client';

export default class extends Command {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, util.mergeDefault({
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '[message:message]',
			enabled: client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_END_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_END_EXTENDED')
		}, client.options.giveaway.commands!.end));
	}

	public async run(msg: KlasaMessage, [message]: [Message?]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const running = (this.client as GiveawayClient).giveawayManager.running.find(g => g.guildID === msg.guild!.id);
		if (!running) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		const id = message ? message.id : running.messageID;
		const giveaway = running || (this.client as GiveawayClient).giveawayManager.running.find(g => g.messageID === id);
		if (!giveaway) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		await (this.client as GiveawayClient).giveawayManager.end(id!);
		return null;
	}

}
