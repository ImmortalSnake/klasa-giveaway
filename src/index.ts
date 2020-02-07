import { KlasaClient } from 'klasa';
import GiveawayClient from './lib/client';
import GiveawayManager from './lib/structures/GiveawayManager';
import Giveaway from './lib/structures/Giveaway';

export {
	GiveawayClient,
	GiveawayManager,
	Giveaway
};

// @ts-ignore
exports[KlasaClient.plugin] = GiveawayClient[KlasaClient.plugin];
