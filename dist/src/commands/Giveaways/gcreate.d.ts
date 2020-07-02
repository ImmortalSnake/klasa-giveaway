import { KlasaMessage, CommandStore, Command } from 'klasa';
import { Message, TextChannel } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, files: string[]);
    run(msg: KlasaMessage, [channel, time, winnerCount, title]: [TextChannel, Date, number, string]): Promise<Message[]>;
}
