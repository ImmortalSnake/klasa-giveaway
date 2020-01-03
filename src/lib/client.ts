import { KlasaClient, KlasaClientOptions } from 'klasa';
import GiveawayManager from './structures/GiveawayManager';
import './schemas/Guild';
import './structures/permissionLevels';

export default class GiveawayClient extends KlasaClient {

	public giveawayManager: GiveawayManager;
	public constructor(options: KlasaClientOptions = {}) {
		super(options);

		this.giveawayManager = new GiveawayManager(this);
	}

}
