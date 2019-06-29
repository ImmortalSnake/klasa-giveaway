const { Command } = require('klasa');
const ms = require('ms');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			requiredPermissions: ['ADD_REACTIONS'],
			permissionLevel: 5,
			promptLimit: 1,
			cooldown: 10000,
			usage: '<channel:channel> <time:time> <winner_count:int> <title:...str{0,250}>',
			description: (lang) => lang.get('create_description'),
		});
	}

	async run(msg, [chan, time, winners, title]) {
		const giveaways = await msg.guild.settings.get('giveaways');
		if(giveaways.length > 10) return msg.sendLocale('max_giveaways');
		const totalTime = time - Date.now();
		const Embed = this.client.embed(msg, {
			title: title,
			description: msg.language.get('giveaway_description', winners, ms(totalTime)),
		});
		return chan.send(msg.language.get('giveaway_create'), { embed: Embed })
			.then(async message => {
				await message.react('🎉');
				msg.guild.settings.update('giveaways', { channel: chan.id, message: message.id, tleft: totalTime, title, winners, running: true });
				return this.client.schedule.create('giveaway', totalTime > 120000 ? 120000 : totalTime, {
					data: { guild: message.guild.id, channel: chan.id, message: message.id, tleft: totalTime, title, winners },
					catchUp: true
				});
			});
	}
};