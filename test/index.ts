import { KlasaClient } from 'klasa';
import { GiveawayClient } from '../src';
import { config } from './config';

KlasaClient.use(GiveawayClient);
const client = new KlasaClient(config);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
client.login('NjEzNjQ5Mjc4MzQyMjY2ODg3.XaySJw.4gqd2dXvcH4_W2nSr06SEcrWlk0');
