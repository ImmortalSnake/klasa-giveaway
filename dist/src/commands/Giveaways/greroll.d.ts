import { Command, CommandStore, KlasaMessage } from 'klasa';
export default class extends Command {
    constructor(store: CommandStore, file: string[], directory: string);
    run(msg: KlasaMessage, [message]: [KlasaMessage | null]): Promise<KlasaMessage | KlasaMessage[] | null>;
}
