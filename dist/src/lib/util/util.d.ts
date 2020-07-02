import { KlasaMessage } from 'klasa';
import { GuildMember, MessageReactionUserStore } from '@klasa/core';
export default abstract class Util {
    static ms(duration: number): string;
    static getWinners(msg: KlasaMessage, users: MessageReactionUserStore, winnerCount: number): GuildMember[];
    static sample<V>(array: V[], size: number): V[];
}
