import { CommandStore, Command, KlasaMessage, KlasaClient } from 'klasa';
import { GiveawayClient } from '../..';

export default class extends Command {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			runIn: ['text'],
			usageDelim: ' ',
			description: lang => lang.get('COMMAND_LIST_DESCRIPTION')
		});
	}

	public async run(msg: KlasaMessage): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = (this.client as GiveawayClient).giveawayManager.running.filter(g => g.guildID === msg.guild!.id);
		if (giveaways.length === 0) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		let mess = msg.language.get('GIVEWAY_LIST_TITLE', msg.guild!.name);
		for (let i = 0; i < giveaways.length; i++) {
			const { messageID, channelID, winnerCount, title, endsAt } = giveaways[i].data;
			mess += msg.language.get('GIVEAWAY_LIST_BODY', i + 1, messageID, channelID, winnerCount, endsAt, title);
		}

		return msg.send(mess, { split: true });
	}

}
