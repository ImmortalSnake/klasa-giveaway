import { Command, CommandStore, KlasaMessage, util, Language } from 'klasa';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, util.mergeDefault({
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '[message:message]',
			enabled: store.client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_REROLL_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_REROLL_EXTENDED')
		}, store.client.options.giveaway.commands!.reroll));
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage | null]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const finished = msg.guildSettings.get('giveaways.finished');
		if (!finished) throw msg.language.get('NO_FINISHED_GIVEAWAY', msg.guildSettings.get('prefix'));
		if (!message) {
			message = await msg.channel.messages.fetch(finished) as KlasaMessage;

			if (!message) throw msg.language.get('NO_FINISHED_GIVEAWAY', msg.guildSettings.get('prefix'));
		}

		const winners = await this.client.giveawayManager.reroll(message);
		return msg.sendLocale('COMMAND_REROLL_SUCCESS', [winners.map(win => win.toString()).join(', ')]);
	}

}
