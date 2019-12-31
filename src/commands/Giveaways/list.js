const { Command, RichDisplay } = require('klasa');
const GiveawayEmbed = require('../../lib/structures/GiveawayEmbed');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: (lang) => lang.get('end_description')
		});
	}

	async run(msg) {
		const giveaways = msg.guild.settings.giveaways;
		if(giveaways.length === 0) return msg.sendLocale('no_running_giveaway', [msg.prefix]);
		const display = new RichDisplay(new GiveawayEmbed(msg));
		for(let i = 0; i < giveaways.length; i++) {
			if(i % 8 === 0) {
				display.addPage(template => template
					.setDescription(giveaways.slice(i).slice(0, 8).map(p => `**${i + 1}] ${p.message} :: ${p.title}**\n`).join('\n')));
			}
		}
		return display.run(await msg.sendLocale('loading'), { filter: (reaction, user) => user === msg.author });
	}
};