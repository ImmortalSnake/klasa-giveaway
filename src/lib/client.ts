import { KlasaClient, KlasaClientOptions, util, Language, CommandOptions, KlasaMessage } from 'klasa';
import GiveawayManager from './structures/GiveawayManager';
import './schemas/Guild';
import { join } from 'path';
import { OPTIONS } from './util/constants';
import { MessageEmbed, GuildMember, MessageOptions } from 'discord.js';
import Giveaway from './structures/Giveaway';

export default class GiveawayClient extends KlasaClient {

	public constructor(options?: KlasaClientOptions) {
		super(options);

		// @ts-ignore
		this.constructor[KlasaClient.plugin].call(this);
	}

	public static [KlasaClient.plugin](this: GiveawayClient): void {
		util.mergeDefault(OPTIONS, this.options);
		this.giveawayManager = new GiveawayManager(this);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		this.once('klasaReady', () => this.giveawayManager.init());

		const coreDirectory = join(__dirname, '../');

		// @ts-ignore
		this.commands.registerCoreDirectory(coreDirectory);
		// @ts-ignore
		this.languages.registerCoreDirectory(coreDirectory);
	}

}


declare module 'discord.js' {
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
	givewayRunMessage?: ((giveaway: Giveaway, language: Language) => string | MessageEmbed | MessageOptions) | string | MessageEmbed | MessageOptions;

	/**
	 * This function is called when the giveaway finishes. Here you can send a message listing the winners
	 * if any.
	 * @param giveaway The giveaway instance
	 * @param winners An array of randomly selected members who have won the giveaway
	 * @param msg The giveaway message that was sent
	 * @see {@link https://github.com/ImmortalSnake/klasa-giveaway/blob/master/src/lib/util/constants.ts#L39|this} for a sample implementation
	 */
	giveawayFinishMessage?: ((giveaway: Giveaway, winners: GuildMember[], msg: KlasaMessage) => Promise<any> | null) | Promise<any> | any;

	/**
	 * Determines the time for the next giveaway refresh
	 * @param giveaway The giveaway instance
	 * @see {@link https://github.com/ImmortalSnake/klasa-giveaway/blob/master/test/config.ts|this} for a sample usage
	 */
	nextRefresh?: (giveaway: Giveaway) => number;

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
	 * @default 300000 (5 Minutes)
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
