const { Client } = require('klasa');
const { MessageEmbed } = require('discord.js');
const giveawayManager = require('./giveawayManager');
require('./schemas/guildSchema');

module.exports = class giveawayClient extends Client {
	constructor(...args) {
		super(...args);
		this.giveawayManager = new giveawayManager(this);
	}

	embed(msg, { description, color, image, title, thumbnail, url, timestamp }) {
		const embed = new MessageEmbed()
			.setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL())
			.setColor(color || '#42f54e')
			.setFooter(msg.author.tag, msg.author.displayAvatarURL());
		if(description) embed.setDescription(description);
		if(image) embed.setImage(image);
		if(title) embed.setTitle(title);
		if(thumbnail) embed.setThumbnail(thumbnail);
		if(url) embed.setURL(url);
		if(timestamp) embed.setTimestamp();

		return embed;
	}
};