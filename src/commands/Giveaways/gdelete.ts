import { CommandStore, KlasaMessage, Command, Language } from 'klasa';
import { Message, Permissions } from '@klasa/core';
import { mergeObjects } from '@klasa/utils';
import { ChannelType } from '@klasa/dapi-types';

export default class extends Command {

	public constructor(store: CommandStore, directory: string, file: string[]) {
		super(store, directory, file, mergeObjects({
			requiredPermissions: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.READ_MESSAGE_HISTORY],
			permissionLevel: 5,
			runIn: [ChannelType.GuildText],
			usageDelim: ' ',
			usage: '[message:message]',
			enabled: store.client.options.giveaway.enableCommands,
			description: (lang: Language) => lang.get('COMMAND_DELETE_DESCRIPTION'),
			extendedHelp: (lang: Language) => lang.get('COMMAND_DELETE_EXTENDED')
		}, store.client.options.giveaway.commands!.delete || {}));
	}

	public async run(msg: KlasaMessage, [message]: [KlasaMessage | undefined]): Promise<Message[]> {
		const running = this.client.giveawayManager.running.find(gv => gv.guildID === msg.guild!.id);
		if (!running) throw msg.language.get('NO_RUNNING_GIVEAWAY', msg.guildSettings.get('prefix'));

		const id = message ? message.id : running.messageID;
		const giveaway = this.client.giveawayManager.running.find(gv => gv.messageID === id);
		if (!giveaway) throw msg.language.get('GIVEAWAY_NOT_FOUND');

		await this.client.giveawayManager.delete(id!).catch(() => console.log());
		return msg.channel.send(mb => mb.setContent(msg.language.get('GIVEAWAY_DELETE', id)));
	}

}
