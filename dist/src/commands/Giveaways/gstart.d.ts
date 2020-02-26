import { KlasaMessage, CommandStore, Command } from 'klasa';
export default class extends Command {
    constructor(store: CommandStore, file: string[], directory: string);
    run(msg: KlasaMessage, [time, winnerCount, title]: [number, number, string]): Promise<KlasaMessage | KlasaMessage[] | null>;
}
