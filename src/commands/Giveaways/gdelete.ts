import { CommandStore, KlasaMessage, Command, KlasaClient, util, Language } from 'klasa';

export default class extends Command {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, util.mergeDefault({
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '[message:message]',
			enabled: client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_DELETE_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_DELETE_EXTENDED')
		}, client.options.giveaway.commands!.delete));
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage | undefined]): Promise<KlasaMessage | KlasaMessage[]> {
		const running = this.client.giveawayManager.running.find(g => g.guildID === msg.guild!.id);
		if (!running) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		const id = message ? message.id : running.messageID;
		const giveaway = this.client.giveawayManager.running.find(g => g.messageID === id);
		if (!giveaway) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		await this.client.giveawayManager.delete(id!).catch(() => console.log());
		return msg.sendLocale('GIVEAWAY_DELETE', [id]);
	}

}
