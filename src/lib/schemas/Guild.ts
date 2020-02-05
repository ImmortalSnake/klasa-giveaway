import { Client } from 'klasa';

Client.defaultGuildSchema
	.add('giveaways', folder => folder
		.add('finished', 'string', { configurable: false }));
