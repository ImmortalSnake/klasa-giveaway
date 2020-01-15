import { KlasaClient, KlasaClientOptions, util } from 'klasa';
import GiveawayManager from './structures/GiveawayManager';
import './schemas/Guild';
import './structures/permissionLevels';
import { join } from 'path';
import { OPTIONS } from './util/constants';

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
		giveaway?: {
			maxGiveaways: number;
			requiredPermission: number;
		};
	}
}
