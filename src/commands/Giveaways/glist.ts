import { CommandStore, Command, KlasaMessage, util, Language } from 'klasa';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, util.mergeDefault({
			runIn: ['text'],
			usageDelim: ' ',
			enabled: store.client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_LIST_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_LIST_EXTENDED')
		}, store.client.options.giveaway.commands!.list));
	}

	public async run(msg: KlasaMessage): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = this.client.giveawayManager.running.filter(g => g.guildID === msg.guild!.id);
		if (giveaways.length === 0) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		let mess = msg.language.get('GIVEWAY_LIST_TITLE', msg.guild!.name);
		for (let i = 0; i < giveaways.length; i++) {
			const { messageID, channelID, winnerCount, title, endsAt } = giveaways[i].data;
			mess += msg.language.get('GIVEAWAY_LIST_BODY', i + 1, messageID, channelID, winnerCount, endsAt, title);
		}

		return msg.send(mess, { split: true });
	}

}
