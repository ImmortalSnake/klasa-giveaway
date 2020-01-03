import { Client } from 'klasa';

Client.defaultGuildSchema
	.add('giveaways', folder => folder
		.add('running', 'string', { 'array': true, 'default': [] })
		.add('finished', 'string'))
	.add('roles', folder => folder
		.add('giveaway', 'Role'));
