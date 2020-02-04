import { Client } from 'klasa';

Client.defaultClientSchema
	.add('giveaways', 'any', { 'array': true, 'default': [] });
