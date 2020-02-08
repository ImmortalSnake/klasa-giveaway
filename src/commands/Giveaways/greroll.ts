import { Command, CommandStore, KlasaMessage, KlasaClient, util, Language } from 'klasa';
import { GiveawayClient } from '../..';

export default class extends Command {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, util.mergeDefault({
			permissionLevel: 5,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '[message:message]',
			enabled: client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_REROLL_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_REROLL_EXTENDED')
		}, client.options.giveaway.commands!.reroll));
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage | null]): Promise<KlasaMessage | KlasaMessage[] | null> {
		if (!message) {
			message = await msg.channel.messages
				.fetch(msg.guildSettings.get('giveaways.finished') as string) as KlasaMessage;

			if (!message) throw msg.language.get('NO_FINISHED_GIVEAWAY', msg.guildSettings.get('prefix'));
		}

		const winners = await (this.client as GiveawayClient).giveawayManager.reroll(message);
		return msg.send(`🎉 **New winner(s) are**: ${winners.map(w => w.toString()).join(', ')}`);
	}

}
