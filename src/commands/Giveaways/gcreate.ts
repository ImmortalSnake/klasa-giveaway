import { KlasaMessage, CommandStore, Command, KlasaClient } from 'klasa';
import Util from '../../lib/util/util';
import GiveawayClient from '../../lib/client';
import { MessageEmbed, TextChannel } from 'discord.js';

export default class extends Command {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			requiredPermissions: ['ADD_REACTIONS'],
			permissionLevel: store.client.options.giveaway.requiredPermission,
			promptLimit: 1,
			promptTime: 60,
			runIn: ['text'],
			usageDelim: ' ',
			usage: '<channel:textChannel> <duration:timespan> <winner_count:int> <title:...str{0,250}>',
			description: lang => lang.get('COMMAND_CREATE_DESCRIPTION')
		});
	}

	public async run(msg: KlasaMessage, [channel, time, wCount, title]: [TextChannel, number, number, string]): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = msg.guildSettings.get('giveaways.running') as string[];
		if (giveaways.length > this.client.options.giveaway.maxGiveaways!) throw msg.language.get('MAX_GIVEAWAYS');

		const embed = new MessageEmbed()
			.setTitle(title)
			.setColor(msg.member!.displayColor)
			.setDescription(msg.language.get('GIVEAWAY_DESCRIPTION', wCount, Util.ms(time)))
			.setFooter(msg.language.get('ENDS_AT'))
			.setTimestamp(Date.now() + time);

		return channel.send(msg.language.get('GIVEAWAY_CREATE'), embed)
			.then(message => message.react('🎉'))
			.then(reaction => (this.client as GiveawayClient).giveawayManager.create({
				message: reaction.message,
				time: Date.now() + time,
				title,
				wCount
			}))
			.then(task => msg.guildSettings.update('giveaways.running', task.data.message))
			.then(() => msg.sendLocale('GIVEAWAY_CREATE_SUCCESS', [channel.toString()]));
	}

}
