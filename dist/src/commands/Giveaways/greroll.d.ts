import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, file: string[]);
    run(msg: KlasaMessage, [message]: [KlasaMessage | null]): Promise<Message[]>;
}
