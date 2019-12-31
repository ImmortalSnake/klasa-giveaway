const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 5,
			usage: '[message:message]',
			description: (lang) => lang.get('delete_description')
		});
	}

	async run(msg, [message]) {
		const giveaway = msg.guild.settings.giveaways.find(g => g.message === message.id);
		if(!giveaway) throw msg.language.get('giveaway_not_found');
		await msg.guild.settings.update('giveaways', giveaway, { action: 'remove' });

		return msg.sendLocale('giveaway_delete', [message.id]);
	}
};