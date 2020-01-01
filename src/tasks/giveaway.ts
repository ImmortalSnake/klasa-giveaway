import { Task, SettingsFolderUpdateResult } from 'klasa';
import GiveawayClient from '../lib/client';
import GiveawayEmbed from '../lib/structures/GiveawayEmbed';

interface GiveawayObject {
	guild: string;
	channel: string;
	message: string;
	tleft: number;
	winners: number;
	title: string;
}

export default class extends Task {

	public async run({ guild, channel, message, tleft, winners, title }: GiveawayObject): Promise<any> {
		const msg = await (this.client as GiveawayClient).giveawayManager.validate(message, guild);
		if (!msg) return this.end(guild, message);
		tleft -= 120 * 1000;
		if (tleft <= 0) return await (this.client as GiveawayClient).giveawayManager.finish(msg);
		const Embed = new GiveawayEmbed(msg)
			.setTitle(title)
			.setLocaleDescription('giveaway_description', winners, tleft);

		await msg.edit(msg.language.get('giveaway_create'), Embed);
		return this.client.schedule.create('giveaway', tleft > 120000 ? 120000 : tleft, {
			data: { guild, channel, message, tleft, winners, title },
			catchUp: true
		});
	}

	public async end(guild: string, message: string): Promise<SettingsFolderUpdateResult> {
		const Guild = this.client.guilds.get(guild)!;
		const giveaway = (Guild.settings.get('giveaways') as any[]).find(gi => gi.message === message);
		return Guild.settings.update('giveaways', giveaway, { arrayAction: 'remove' });
	}

}
