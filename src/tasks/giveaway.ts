import { Task } from 'klasa';

export default class extends Task {

	public async run(): Promise<void> {
		return; // (this.client as GiveawayClient).giveawayManager.update(data);
	}

}
