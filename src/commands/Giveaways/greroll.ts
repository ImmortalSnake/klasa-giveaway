import { Command, CommandStore, KlasaMessage, Language } from 'klasa';
import { mergeObjects } from '@klasa/utils';
import { ChannelType } from '@klasa/dapi-types';
import { Message, Permissions } from '@klasa/core';

export default class extends Command {

	public constructor(store: CommandStore, directory: string, file: string[]) {
		super(store, directory, file, mergeObjects({
			permissionLevel: 5,
			requiredPermissions: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			runIn: [ChannelType.GuildText],
			usageDelim: ' ',
			usage: '[message:message]',
			enabled: store.client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_REROLL_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_REROLL_EXTENDED')
		}, store.client.options.giveaway.commands!.reroll || {}));
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage | null]): Promise<Message[]> {
		const finished = msg.guildSettings.get('giveaways.finished') as string;
		if (!finished) throw msg.language.get('NO_FINISHED_GIVEAWAY', msg.guildSettings.get('prefix'));
		if (!message) {
			message = await msg.channel.messages.fetch(finished).catch(() => null) as KlasaMessage | null;

			if (!message) throw msg.language.get('NO_FINISHED_GIVEAWAY', msg.guildSettings.get('prefix'));
		}

		const winners = await this.client.giveawayManager.reroll(message);
		if (!winners.length) return msg.replyLocale('COMMAND_REROLL_NO_WINNER');

		return msg.replyLocale('COMMAND_REROLL_SUCCESS', [winners.map(win => win.toString()).join(', ')]);
	}

}
