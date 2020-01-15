import { Client } from 'klasa';

Client.defaultGuildSchema
	.add('giveaways', folder => folder
		.add('running', 'string', { 'array': true, 'default': [], 'configurable': false })
		.add('finished', 'string', { configurable: false }));
