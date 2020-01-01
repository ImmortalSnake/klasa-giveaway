import { CommandStore, Command, RichDisplay, KlasaMessage } from "klasa";
import GiveawayEmbed from "../../lib/structures/GiveawayEmbed";

export default class extends Command {
	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: (lang) => lang.get('end_description')
		});
	}

	public async run(msg: KlasaMessage): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = msg.guildSettings.get('giveaways') as any[];
		if(giveaways.length === 0) throw msg.language.get('no_running_giveaway', msg.guildSettings.get('prefix'));
		const display = new RichDisplay(new GiveawayEmbed(msg));
		for(let i = 0; i < giveaways.length; i++) {
			if(i % 8 === 0) {
				display.addPage((template: GiveawayEmbed) => template
					.setDescription(giveaways.slice(i).slice(0, 8).map(p => `**${i + 1}] ${p.message} :: ${p.title}**\n`).join('\n')));
			}
		}

		await display.run(await msg.sendLocale('loading'), { filter: (reaction, user) => user === msg.author });
		return null;
	}
};