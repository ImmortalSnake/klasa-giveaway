import { KlasaMessage, CommandStore } from 'klasa';
import GiveawayEmbed from '../../lib/structures/GiveawayEmbed';
import { GiveawayOptions } from '../../config';
import GiveawayCommand from '../../lib/base/GiveawayCommand';
import Util from '../../lib/util/util';

export default class extends GiveawayCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			requiredPermissions: ['ADD_REACTIONS'],
			permissionLevel: 5,
			promptLimit: 1,
			cooldown: 10,
			usage: '<duration:timespan> <winner_count:int> <title:...str{0,250}>',
			description: lang => lang.get('COMMAND_CREATE_DESCRIPTION')
		});
	}

	public async run(msg: KlasaMessage, [time, wCount, title]: [number, number, string]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = msg.guildSettings.get('giveaways.running') as string[];
		if (giveaways.length > GiveawayOptions.maxGiveaway) throw msg.language.get('MAX_GIVEAWAYS');

		const Embed = new GiveawayEmbed(msg)
			.setTitle(title)
			.setLocaleDescription('GIVEAWAY_DESCRIPTION', wCount, Util.ms(time));

		await msg.sendLocale('GIVEAWAY_CREATE', { embed: Embed })
			.then(message => message.react('🎉'))
			.then(reaction => this.client.giveawayManager.create({
				message: reaction.message,
				time: Date.now() + time,
				title,
				wCount
			}))
			.then(task => msg.guildSettings.update('giveaways.running', task.data.message));

		return null;
	}

}
