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
		if (!message) {
			message = await msg.channel.messages
				.fetch(msg.guildSettings.get('giveaways.finished') as string) as KlasaMessage;

			if (!message) throw msg.language.get('NO_FINISHED_GIVEAWAY', msg.guildSettings.get('prefix'));
		}

		const winners = await this.client.giveawayManager.reroll(message);
		return msg.send(`🎉 **New winner(s) are**: ${winners.map(w => w.toString()).join(', ')}`);
	}

}
