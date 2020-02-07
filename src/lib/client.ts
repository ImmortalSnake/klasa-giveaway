import { KlasaClient, KlasaClientOptions, util, Language } from 'klasa';
import GiveawayManager from './structures/GiveawayManager';
import './schemas/Guild';
import { join } from 'path';
import { OPTIONS } from './util/constants';
import { MessageEmbed } from 'discord.js';
import Giveaway from './structures/Giveaway';

export default class GiveawayClient extends KlasaClient {

	public giveawayManager = new GiveawayManager(this);
	public constructor(options?: KlasaClientOptions) {
		super(options);

		// @ts-ignore
		this.constructor[KlasaClient.plugin].call(this);
	}

	public static [KlasaClient.plugin](this: GiveawayClient) {
		util.mergeDefault(OPTIONS, this.options);
		this.giveawayManager = new GiveawayManager(this);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		this.once('klasaReady', () => this.giveawayManager.init());

		const coreDirectory = join(__dirname, '../');

		// @ts-ignore
		this.commands.registerCoreDirectory(coreDirectory);
		// @ts-ignore
		this.languages.registerCoreDirectory(coreDirectory);
		// @ts-ignore
		this.arguments.registerCoreDirectory(coreDirectory);
		// @ts-ignore
		this.tasks.registerCoreDirectory(coreDirectory);
	}

}


declare module 'discord.js' {
	interface ClientOptions {
		giveaway?: GiveawayOptions;
	}
}

export interface GiveawayOptions {
	givewayRunEmbed?: ((giveaway: Giveaway, language: Language) => MessageEmbed | string) | MessageEmbed | string;
	maxGiveaways?: number;
	requiredPermission?: number;
	refreshInterval?: number;
}
