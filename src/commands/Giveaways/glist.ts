import { CommandStore, Command, KlasaMessage, Language } from 'klasa';
import { mergeObjects } from '@klasa/utils';
import { Message, Permissions } from '@klasa/core';
import { ChannelType } from '@klasa/dapi-types';

export default class extends Command {

	public constructor(store: CommandStore, directory: string, file: string[]) {
		super(store, directory, file, mergeObjects({
			requiredPermissions: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			runIn: [ChannelType.GuildText],
			usageDelim: ' ',
			enabled: store.client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_LIST_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_LIST_EXTENDED')
		}, store.client.options.giveaway.commands!.list || {}));
	}

	public async run(msg: KlasaMessage): Promise<Message[]> {
		const giveaways = this.client.giveawayManager.running.filter(gv => gv.guildID === msg.guild!.id);
		if (giveaways.length === 0) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		let mess = msg.language.get('GIVEWAY_LIST_TITLE', msg.guild!.name);
		for (let i = 0; i < giveaways.length; i++) {
			const { channelID, winnerCount, title, endsAt } = giveaways[i].data;

			mess += msg.language.get('GIVEAWAY_LIST_BODY', i + 1, giveaways[i].messageID, channelID, winnerCount, endsAt, title);
		}

		return msg.channel.send(mb => mb.setContent(mess), { maxLength: 2000 });
	}

}
