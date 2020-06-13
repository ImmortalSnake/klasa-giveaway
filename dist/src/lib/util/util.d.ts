import { KlasaMessage } from 'klasa';
import { Collection, User, GuildMember } from 'discord.js';
export default abstract class Util {
    static ms(duration: number): string;
    static getWinners(msg: KlasaMessage, users: Collection<string, User>, winnerCount: number): GuildMember[];
}
