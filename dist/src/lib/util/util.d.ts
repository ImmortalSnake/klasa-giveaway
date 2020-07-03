import { GuildMember, MessageReactionUserStore, Message } from '@klasa/core';
export default abstract class Util {
    static ms(duration: number): string;
    static getWinners(msg: Message, users: MessageReactionUserStore, winnerCount: number): GuildMember[];
    static sample<V>(array: V[], size: number): V[];
}
