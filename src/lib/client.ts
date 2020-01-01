import { KlasaClient, KlasaClientOptions } from 'klasa';
import './schemas/Guild';
import GiveawayManager from './giveawayManager';

export default class GiveawayClient extends KlasaClient {

	public giveawayManager: GiveawayManager;
	public constructor(options: KlasaClientOptions = {}) {
		super(options);

		this.giveawayManager = new GiveawayManager(this);
	}

}
