import { Command, CommandStore, CommandOptions } from 'klasa';
import GiveawayClient from '../client';

interface GiveawayCommandOptions extends CommandOptions {
	examples?: string[];
}

export default class GiveawayCommand extends Command {

	public readonly client: GiveawayClient;
	public examples: string[];
	public constructor(store: CommandStore, file: string[], directory: string, options: GiveawayCommandOptions = {}) {
		super(store, file, directory, options);

		this.client = store.client as GiveawayClient;
		this.examples = options.examples || [''];
	}

	public displayExamples(prefix: string): string {
		return this.examples.map(example => `→ \`${prefix}${this.name} ${example}\``).join('\n');
	}

}
