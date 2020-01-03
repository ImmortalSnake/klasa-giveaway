import { CommandStore, Command, KlasaMessage } from 'klasa';
import Util from '../../lib/util/util';
import { GiveawayUpdateData } from '../../lib/structures/GiveawayManager';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: lang => lang.get('COMMAND_LIST_DESCRIPTION')
		});
	}

	public async run(msg: KlasaMessage): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = msg.guildSettings.get('giveaways.running') as string[];
		if (giveaways.length === 0) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		let mess = msg.language.get('GIVEWAY_LIST_TITLE', msg.guild!.name);
		for (let i = 0; i < giveaways.length; i++) {
			const giveaway = this.client.schedule.tasks.find(ex => ex.data.message === giveaways[i]);
			if (!giveaway) continue;

			const { message, channel, wCount, title, endAt } = giveaway.data as GiveawayUpdateData;
			mess += msg.language.get('GIVEAWAY_LIST_BODY', i, message, channel, wCount, Util.ms(endAt - Date.now()), title);
		}

		return msg.send(mess, { split: true });
	}

}
