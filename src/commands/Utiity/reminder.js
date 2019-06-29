const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			promptLimit: 1,
			subcommands: true,
			aliases: ['remind'],
			description: 'creates a reminder',
			usage: '<when:time> <text:...str>'
		});
	}

	async set(msg, [when, text]) {
		const reminder = await this.client.schedule.create('reminder', when, {
			data: {
				user: msg.author.id,
				text,
			},
		});
		return msg.sendLocale('reminder_create', [reminder.id]);
	}
};