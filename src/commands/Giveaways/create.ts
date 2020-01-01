import { Command, KlasaMessage, CommandStore, Duration } from 'klasa';
import GiveawayEmbed from '../../lib/structures/GiveawayEmbed';
import { GiveawayOptions } from '../../config';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			requiredPermissions: ['ADD_REACTIONS'],
			permissionLevel: 5,
			promptLimit: 1,
			cooldown: 10000,
			usage: '<time:time> <winner_count:int> <title:...str{0,250}>',
			description: lang => lang.get('create_description')
		});
	}

	public async run(msg: KlasaMessage, [time, winners, title]: [Date, number, string]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = msg.guild!.settings.get('giveaways') as any[];
		if (giveaways.length > GiveawayOptions.maxGiveaway) throw msg.language.get('max_giveaways');
		const tleft = time.getTime() - Date.now();
		const Embed = new GiveawayEmbed(msg)
			.setTitle(title)
			.setLocaleDescription('giveaway_description', winners, Duration.toNow(time.getTime()));

		msg.send(msg.language.get('giveaway_create'), { embed: Embed })
			.then(message => message.react('🎉'))
			.then(reaction => {
				msg.guild!.settings.update('giveaways', { channel: msg.channel.id, message: reaction.message.id, tleft, title, winners });
				return this.client.schedule.create('giveaway', tleft > 120000 ? 120000 : tleft, {
					data: {
						guild: reaction.message.guild!.id,
						channel: msg.channel.id,
						message: reaction.message.id,
						tleft,
						title,
						winners
					},

					catchUp: true
				});
			});

		return null;
	}

}
