import { Client } from 'klasa';

Client.defaultGuildSchema
	.add('giveaways', 'any', {
		array: true,
		configurable: false
	}).add('finished', 'string', {
		array: true,
		configurable: false
	}).add('roles', folder => folder
		.add('giveaway', 'Role'));
