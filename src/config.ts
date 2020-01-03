import { KlasaClientOptions } from 'klasa';

export const config = {
	owners: ['410806297580011520'],
	prefix: '..',
	commandEditing: true,
	preserveSettings: false,
	noPrefixDM: true,
	providers: {
		'default': 'json'
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
