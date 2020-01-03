import { Task } from 'klasa';
import GiveawayClient from '../lib/client';
import { GiveawayUpdateData } from '../lib/structures/GiveawayManager';

export default class extends Task {

	public async run(data: GiveawayUpdateData): Promise<any> {
		return (this.client as GiveawayClient).giveawayManager.update(data);
	}

}
