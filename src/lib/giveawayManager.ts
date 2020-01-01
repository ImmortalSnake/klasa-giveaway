import { KlasaClient, KlasaMessage } from "klasa";
import { TextChannel, User } from "discord.js";
import GiveawayEmbed from "./structures/GiveawayEmbed";

export default class GiveawayManager {
	public client: KlasaClient;

	constructor(client: KlasaClient) {
		this.client = client;
	}

	public async finish(msg: KlasaMessage) {
		const winners: User[] = [];
		const giveaways = msg.guild!.settings.get('giveaways') as any[];
		let giveaway = giveaways.find(g => g.message === msg.id);
		if (giveaway) {
			msg.guild!.settings.update('giveaways', giveaway, { arrayAction: 'remove' });
			msg.guild!.settings.update('finished', msg.id, { arrayAction: 'add' });
		} else {
			giveaway = {
				title: msg.embeds[0].title,
				winners: msg.embeds[0].fields[0].value
			};
		}
		if(msg.reactions.get('🎉')!.count < 2) {
			const embed2 = new GiveawayEmbed(msg)
				.setTitle(giveaway.title)
				.setLocaleDescription('not_enough_reactions')
				.setTimestamp()
				.addField(msg.language.get('winner_count'), giveaway.winners);
			return msg.edit(embed2);
		}
		else {
			const users = await msg.reactions.get('🎉')!.users.fetch();
			const list = users.filter(u => u.id !== this.client.user!.id).array();
			for (let i = 0; i < giveaway.winners; i++) {
				const x = this.draw(list);
				if (!winners.includes(x)) winners.push(x);
			}
			const winner =  winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(', ');
			const embed3 = new GiveawayEmbed(msg)
				.setTitle(giveaway.title)
				.setDescription(`**Winner: ${winner}**`)
				.setTimestamp()
				.addField(msg.language.get('winner_count'), giveaway.winners);
	
			msg.edit(embed3);
			return msg.channel.send(msg.language.get('giveaway_won', winner, giveaway.title));
		}
	}

	public shuffle(arr: any[]): any[] {
		for (let i = arr.length; i; i--) {
			const j = Math.floor(Math.random() * i);
			[arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
		}
		return arr;
	}

	public draw(list: any[]): any {
		const shuffled = this.shuffle(list);
		return shuffled[Math.floor(Math.random() * shuffled.length)];
	}

	public async validate(msg: string, guild: string): Promise<KlasaMessage | undefined> {
		const Guild = this.client.guilds.get(guild);
		if(Guild) {
			const giveaway = (Guild.settings.get('giveaways') as any[]).find(g => g.message === msg);
			if(giveaway) {
				const chan = this.client.channels.get(giveaway.channel) as TextChannel;
				if(chan) {
					return await chan.messages.fetch(msg) as KlasaMessage;
				}
			}
		}

		return;
	}
};