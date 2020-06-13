import { KlasaMessage, CommandStore, Command } from 'klasa';
import { TextChannel } from 'discord.js';
export default class extends Command {
    constructor(store: CommandStore, file: string[], directory: string);
    run(msg: KlasaMessage, [channel, time, winnerCount, title]: [TextChannel, number, number, string]): Promise<KlasaMessage | KlasaMessage[] | null>;
}
