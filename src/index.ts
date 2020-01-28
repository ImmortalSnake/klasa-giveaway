import { KlasaClient } from 'klasa';
import GiveawayClient from './lib/client';

export { GiveawayClient };

// @ts-ignore
exports[KlasaClient.plugin] = GiveawayClient[KlasaClient.plugin];
