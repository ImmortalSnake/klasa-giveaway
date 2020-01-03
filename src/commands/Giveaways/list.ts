import { CommandStore, Command, KlasaMessage } from "klasa";

export default class extends Command {
	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: (lang) => lang.get('end_description')
		});
	}

	public async run(msg: KlasaMessage): Promise<KlasaMessage | KlasaMessage[] | null> {
		const giveaways = msg.guildSettings.get('giveaways.running') as string[];
		if(giveaways.length === 0) throw msg.language.get('no_running_giveaway', msg.guildSettings.get('prefix'));
		
		let mess = `Active giveaways on **${msg.guild!.name}**\n`;
		for(let i = 0; i < giveaways.length; i++) {
			const giveaway = this.client.schedule.tasks.find(ex => ex.data.message === giveaways[i]);
			if (!giveaway) continue;

			const { message, channel, wCount, title } = giveaway.data
			mess += `\`${message}\` → <#${channel}> | **${wCount}** Winner(s) | Title: **${title}**`;
		}

		return msg.send(mess);
	}
};