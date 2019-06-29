module.exports = class GiveawayManager {
	constructor(client) {
		this.client = client;
	}

	async finish(msg) {
		const winners = [];
		let giveaway = msg.guild.settings.giveaways.find(g => g.message === msg.id);
		if(giveaway) {
			msg.guild.settings.update('giveaways', giveaway, { action: 'remove' });
			msg.guild.settings.update('finished', msg, { action: 'add' });
		}
		else {
			giveaway = {
				title: msg.embeds[0].title,
				winners: msg.embeds[0].fields[0].value
			};
		}
		if(msg.reactions.get('🎉').count < 2) {
			const embed2 = this.client.embed(msg, {
				title: giveaway.title,
				description: msg.language.get('not_enough_reactions'),
				timestamp: true
			}).addField(msg.language.get('winner_count'), giveaway.winners);
			return msg.edit(embed2);
		}
		else {
			const users = await msg.reactions.get('🎉').users.fetch();
			const list = users.filter(u => u.id !== this.client.user.id).array();
			for (let i = 0; i < giveaway.winners; i++) {
				const x = this.draw(list);
				if (!winners.includes(x)) winners.push(x);
			}
			const embed3 = this.client.embed(msg, {
				title: giveaway.title,
				description: `**Winner: ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(', ')}**`,
				timestamp: true
			}).addField(msg.language.get('winner_count'), giveaway.winners);
			msg.edit(embed3);
			return msg.channel.send(msg.language.get('giveaway_won', winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(', '), giveaway.title));
		}
	}

	shuffle(arr) {
		for (let i = arr.length; i; i--) {
			const j = Math.floor(Math.random() * i);
			[arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
		}
		return arr;
	}

	draw(list) {
		const shuffled = this.shuffle(list);
		return shuffled[Math.floor(Math.random() * shuffled.length)];
	}

	async validate(msg, guild) {
		const Guild = this.client.guilds.get(guild);
		if(Guild) {
			const giveaway = Guild.settings.giveaways.find(g => g.message === msg);
			if(giveaway) {
				if(!giveaway.running) return;
				const chan = this.client.channels.get(giveaway.channel);
				if(chan) {
					const message = await chan.messages.fetch(msg);
					return message;
				}
			}
		}
	}
};