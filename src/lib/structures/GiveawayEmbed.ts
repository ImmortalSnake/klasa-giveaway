import { MessageEmbed, ColorResolvable } from 'discord.js';
import { KlasaMessage, Language } from 'klasa';
import { COLORS } from '../util/constants';

export default class GiveawayEmbed extends MessageEmbed {

	public language: Language;

	public constructor(msg: KlasaMessage, color?: ColorResolvable) {
		super();

		this.language = msg.language;
		this.setColor(color || msg.guild ? msg.member!.displayColor : COLORS.PRIMARY);
		this.setFooter(msg.author.tag, msg.author.displayAvatarURL());
	}

	public setLocaleDescription(key: string, ...args: any[]): this {
		return super.setDescription(this.language.get(key, ...args));
	}

}
