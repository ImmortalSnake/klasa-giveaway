const { MessageEmbed } = require('discord.js');

module.exports = class GiveawayEmbed extends MessageEmbed {
	constructor(msg, color = '#42f54e') {
		super();

		this.language = msg.language;
		this.setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL());
		this.setColor(color);
		this.setFooter(msg.author.tag, msg.author.displayAvatarURL());
	}

	setLocaleDescription(key, ...args) {
		return super.setDescription(this.language.get(key, ...args));
	}
};
