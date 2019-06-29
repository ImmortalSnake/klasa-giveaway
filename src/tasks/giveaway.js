const { Task } = require('klasa');
const ms = require('ms');

module.exports = class extends Task {

	async run({ guild, channel, message, tleft, winners, title }) {
		const msg = await this.client.giveawayManager.validate(message, guild);
		if(!msg) return this.end(guild, message);
		tleft -= 120 * 1000;
		if(tleft <= 0) return await this.client.giveawayManager.finish(msg);
		const Embed = this.client.embed(msg, {
			title: title,
			description: msg.language.get('giveaway_description', winners, ms(tleft)),
		});
		await msg.edit(msg.language.get('giveaway_create'), { embed: Embed });
		return this.client.schedule.create('giveaway', tleft > 120000 ? 120000 : tleft, {
			data: { guild, channel, message, tleft, winners, title },
			catchUp: true
		});
	}

	async end(guild, message) {
		const Guild = this.client.guilds.get(guild);
		const giveaway = Guild.settings.giveaways.find(g => g.message === message);
		return Guild.settings.update('giveaways', giveaway, { action: 'remove' });
	}
};