import { KlasaClient, KlasaMessage } from 'klasa';
import { TextChannel, Message, GuildMember } from 'discord.js';
import Giveaway from './Giveaway';
export default class GiveawayManager {
    readonly client: KlasaClient;
    running: Giveaway[];
    private giveaways;
    constructor(client: KlasaClient);
    get provider(): import("klasa").Provider;
    init(): Promise<void>;
    create(channel: TextChannel, rawData: GiveawayCreateData): Promise<Giveaway>;
    delete(id: string): Promise<null>;
    end(id: string): Promise<Message | null>;
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
    winnerCount: number;
    title: string;
    startAt?: number;
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
