import { MessageEmbed } from 'discord.js';
import { KlasaMessage, Language } from 'klasa';

export default class GiveawayEmbed extends MessageEmbed {

	public language: Language;

	public constructor(msg: KlasaMessage, color = '#42f54e') {
		super();

		this.language = msg.language;
		this.setAuthor(msg.client.user!.tag, msg.client.user!.displayAvatarURL());
		this.setColor(color);
		this.setFooter(msg.author.tag, msg.author.displayAvatarURL());
	}

	public setLocaleDescription(key: string, ...args: string[]): this {
		return super.setDescription(this.language.get(key, ...args));
	}

}
