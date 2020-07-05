import { Giveaway } from '../..';
import { Language } from 'klasa';
import { GuildMember, Message, MessageBuilder } from '@klasa/core';
export declare const Second = 1000;
export declare const Minute: number;
export declare const Hour: number;
export declare const Day: number;
export declare const OPTIONS: {
    giveaway: {
        maxGiveaways: number;
        requiredPermission: number;
        updateInterval: number;
        enableCommands: boolean;
        provider: string;
        commands: {};
        nextRefresh: (giveaway: Giveaway) => number;
        winnersFilter: (member: GuildMember) => boolean;
        runMessage: typeof runMessage;
        finishMessage: typeof finishMessage;
    };
};
declare function runMessage(giveaway: Giveaway, language: Language): (arg0: MessageBuilder) => MessageBuilder;
declare function finishMessage(giveaway: Giveaway, winners: GuildMember[], msg: Message): Promise<Message | Message[]>;
export {};
