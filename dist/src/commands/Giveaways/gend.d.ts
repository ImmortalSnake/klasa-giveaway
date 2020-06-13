import { CommandStore, KlasaMessage, Command } from 'klasa';
import { Message } from 'discord.js';
export default class extends Command {
    constructor(store: CommandStore, file: string[], directory: string);
    run(msg: KlasaMessage, [message]: [Message?]): Promise<KlasaMessage | KlasaMessage[] | null>;
}
