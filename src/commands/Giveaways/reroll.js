const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 5,
			usage: '[message:message]',
			description: (lang) => lang.get('reroll_description')
		});
	}

	async run(msg, [message]) {
		const finished = msg.guild.settings.finished;
		if(finished.length === 0) return;

		let text = finished[0].split('/');
		if(message) text = finished.find(f => f.split('/')[1] === message.id);
		if(!text) throw msg.language.get('giveaway_not_found');

		const chan = this.client.channels.get(text[0]);
		if(!chan) return msg.sendLocale('giveaway_not_found');
		const m = await chan.messages.fetch(text[1]);
		if(!m) return msg.sendLocale('giveaway_not_found');
		return this.client.giveawayManager.finish(m, true);
	}
};