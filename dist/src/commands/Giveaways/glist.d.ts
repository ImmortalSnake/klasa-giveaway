import { CommandStore, Command, KlasaMessage } from 'klasa';
export default class extends Command {
    constructor(store: CommandStore, file: string[], directory: string);
    run(msg: KlasaMessage): Promise<KlasaMessage | KlasaMessage[] | null>;
}
