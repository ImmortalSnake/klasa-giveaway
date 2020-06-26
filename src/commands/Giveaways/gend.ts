import { CommandStore, KlasaMessage, Command, util, Language } from 'klasa';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, util.mergeDefault({
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '[message:message]',
			enabled: store.client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_END_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_END_EXTENDED')
		}, store.client.options.giveaway.commands!.end));
	}

	public async run(msg: KlasaMessage, [message]: [Message?]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const running = this.client.giveawayManager.running.find(gv => gv.guildID === msg.guild!.id);
		if (!running) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		const id = message ? message.id : running.messageID;
		const giveaway = running || this.client.giveawayManager.running.find(gv => gv.messageID === id);
		if (!giveaway) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		await this.client.giveawayManager.end(id!);
		return null;
	}

}
