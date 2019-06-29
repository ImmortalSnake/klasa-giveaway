const { Client } = require('klasa');

Client.defaultGuildSchema
	.add('giveaways', 'any', {
		array: true,
		configurable: false
	}).add('finished', 'message', {
		array: true,
		configurable: false
	}).add('roles', folder => folder
		.add('giveaway', 'Role'));