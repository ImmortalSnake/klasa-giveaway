import { KlasaMessage, CommandStore, Command } from 'klasa';
import { Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, file: string[]);
    run(msg: KlasaMessage, [time, winnerCount, title]: [Date, number, string]): Promise<Message[]>;
}
