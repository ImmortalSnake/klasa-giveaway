import { GiveawayClient } from '../src';
import { config } from './config';
import { KlasaClient } from 'klasa';

KlasaClient.use(GiveawayClient);

const client = new KlasaClient(config);
// @ts-ignore
// client.loadPlugins();

client.token = 'TOKEN GOES HERE';
client.connect();
