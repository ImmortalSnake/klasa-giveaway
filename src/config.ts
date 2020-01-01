import { KlasaClientOptions } from 'klasa';

export const config = {
	prefix: '..',
	commandEditing: true,
	typing: true,
	preserveSettings: false,
	noPrefixDM: true,
	disabledCorePieces: [],
	providers: {
		default: 'json'
	},
	pieceDefaults: {
		commands: {
			quotedStringSupport: true,
			runIn: ['text'],
			usageDelim: ' '
		}
	}
} as KlasaClientOptions;

export const mongoOptions = {
	// eslint-disable-next-line no-process-env
	uri: process.env.DATABASE_URL,
	options: {
		useNewUrlParser: true,
		reconnectInterval: 500,
		reconnectTries: Number.MAX_VALUE,
		poolSize: 5,
		connectTimeoutMS: 10000,
		autoIndex: false
	}
};

export const GiveawayOptions = {
	// support server link here
	support: '',
	version: '',
	maxGiveaway: 10
};
