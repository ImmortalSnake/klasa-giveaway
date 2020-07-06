import { Language, CommandOptions, KlasaMessage } from 'klasa';
import { mergeDefault } from '@klasa/utils';
import { Plugin, GuildMember, MessageBuilder, Client } from '@klasa/core';
import { GiveawayManager } from './structures/GiveawayManager';
import './schemas/Guild';
import { OPTIONS } from './util/constants';
import { Giveaway } from './structures/Giveaway';
import { join } from 'path';

export class GiveawayClient extends Client implements Plugin {

	public static [Client.plugin](this: Client): void {
		mergeDefault(OPTIONS, this.options);
		this.giveawayManager = new GiveawayManager(this);

		const coreDirectory = join(__dirname, '../');
		this.once('ready', async () => await this.giveawayManager.init());

		if (this.options.giveaway.enableCommands) this.commands.registerCoreDirectory(coreDirectory);
		this.languages.registerCoreDirectory(coreDirectory);
	}

}


declare module '@klasa/core/dist/src/lib/client/Client' {
	interface Client {
		giveawayManager: GiveawayManager;
	}
	interface ClientOptions {
		giveaway?: GiveawayOptions;
	}
}

export interface GiveawayOptions {
	/**
	 * This function is called on creating and editing the giveaway message. You can customize your
	 * giveaway message with this. Make sure to return a value that can be used on <Message>.send()
	 * @param giveaway The giveaway instance
	 * @param language Language setting of the guild
	 * @see {@link https://github.com/ImmortalSnake/klasa-giveaway/blob/master/src/lib/util/constants.ts#L27|this} for a sample implementation
	 */
	runMessage?: ((giveaway: Giveaway, language: Language) => ((arg0: MessageBuilder) => MessageBuilder));

	/**
	 * This function is called when the giveaway finishes. Here you can send a message listing the winners
	 * if any.
	 * @param giveaway The giveaway instance
	 * @param winners An array of randomly selected members who have won the giveaway
	 * @param msg The giveaway message that was sent
	 * @see {@link https://github.com/ImmortalSnake/klasa-giveaway/blob/master/src/lib/util/constants.ts#L39|this} for a sample implementation
	 */
	finishMessage?: ((giveaway: Giveaway, winners: GuildMember[], msg: KlasaMessage) => Promise<any> | null) | Promise<any> | any;

	/**
	 * Determines the time for the next giveaway refresh
	 * @param giveaway The giveaway instance
	 * @see {@link https://github.com/ImmortalSnake/klasa-giveaway/blob/master/test/config.ts|this} for a sample usage
	 */
	nextRefresh?: (giveaway: Giveaway) => number;

	/**
	 * Filters out certain users who reacted to the giveaway, use this if you would like to add additional filters before selecting a winner
	 * @param member A guild member who reacted to the giveaway
	 */
	winnersFilter?: (member: GuildMember) => boolean;

	/**
	 * Total number of giveaways allowed in a guild (used in default commands)
	 * @default Infinite
	 */
	maxGiveaways?: number;

	/**
	 * Required permission level to start and manage giveaways (used in default commands)
	 * @default 5
	 */
	requiredPermission?: number;

	/**
	 * The provider to use for the giveaways
	 * @default ""
	 */
	provider?: string;

	/**
	 * Toggle enabling default commands
	 * @default true
	 */
	enableCommands?: boolean;

	/**
	 * Time in milliseconds in which the manager updates each giveaway
	 * @default 5000
	 */
	updateInterval?: number;

	/**
	 * Configure command options for default commands
	 */
	commands?: {
		create?: CommandOptions,
		delete?: CommandOptions,
		end?: CommandOptions,
		list?: CommandOptions,
		reroll?: CommandOptions,
		start?: CommandOptions
	};
}
