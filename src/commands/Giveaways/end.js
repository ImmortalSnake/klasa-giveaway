const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 5,
			usage: '[message:message]',
			description: (lang) => lang.get('end_description')
		});
	}

	async run(msg, [message]) {
		const giveaways = msg.guild.settings.giveaways;
		if(giveaways.length === 0) return msg.sendLocale('no_running_giveaway', [msg.prefix]);
		if(!message) message = giveaways[0].message;
		const m = await this.client.giveawayManager.validate(message.id || message, msg.guild.id);
		if(!m) return msg.sendLocale('giveaway_not_found');
		return this.client.giveawayManager.finish(m);
	}
};