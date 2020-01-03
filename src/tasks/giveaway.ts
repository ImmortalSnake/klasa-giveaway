import { Task } from 'klasa';
import GiveawayClient from '../lib/client';
import { GiveawayUpdateData } from '../lib/structures/GiveawayManager';

export default class extends Task {

	public async run(data: GiveawayUpdateData): Promise<any> {
		return (this.client as GiveawayClient).giveawayManager.update(data);
		/*
		const msg = await (this.client as GiveawayClient).giveawayManager.validate(message, channel);
		if (!msg) throw undefined;
		const id = this.client.schedule.tasks.find(ex => ex.data.message === message)!.id;

		return await (this.client as GiveawayClient).giveawayManager.finish(msg, { wCount, title, id });
		*/
	}

}
