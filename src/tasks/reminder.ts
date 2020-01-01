import { Task } from 'klasa';
import { User } from 'discord.js';

interface ReminderData {
	user: User;
	text: string;
}

export default class extends Task {

	public async run({ user, text }: ReminderData): Promise<void> {
		if (user) await user.send(`Reminder: ${text}`).catch(console.log);
	}

}
