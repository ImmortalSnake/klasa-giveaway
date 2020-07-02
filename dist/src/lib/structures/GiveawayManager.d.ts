import { KlasaMessage, Provider } from 'klasa';
import { Client, TextChannel, Message, GuildMember } from '@klasa/core';
import { Giveaway } from './Giveaway';
export declare class GiveawayManager {
    readonly client: Client;
    running: Giveaway[];
    private giveaways;
    constructor(client: Client);
    get provider(): Provider;
    init(): Promise<void>;
    create(channel: TextChannel, rawData: GiveawayCreateData): Promise<Giveaway>;
    delete(id: string): Promise<unknown>;
    end(id: string): Promise<Message | unknown>;
    edit(id: string, data: GiveawayEditData): Promise<Giveaway>;
    reroll(msg: KlasaMessage, data?: GiveawayRerollData): Promise<GuildMember[]>;
    private update;
    private refresh;
    private add;
}
export interface GiveawayData extends GiveawayCreateData {
    id: string;
    channelID: string;
    endsAt: number;
    startAt?: number;
    winnerCount: number;
    title: string;
    reaction: string;
    author: string;
}
export interface GiveawayCreateData extends Record<string, any> {
    messageID?: string;
    channelID?: string;
    guildID?: string;
    title: string;
    winnerCount: number;
    endsAt: number;
    author?: string;
    startAt?: number;
    reaction?: string;
}
export interface GiveawayEditData {
    title?: string;
    winnerCount?: number;
    endsAt?: number;
    reaction?: string;
}
export interface GiveawayRerollData {
    winnerCount?: number;
    reaction?: string;
}
