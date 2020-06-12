/// <reference path="../client.d.ts" />
import GiveawayManager, { GiveawayCreateData, GiveawayData } from './GiveawayManager';
import { TextChannel, GuildMember } from 'discord.js';
import { KlasaMessage, Language } from 'klasa';
export declare type GiveawayState = 'CREATING' | 'RUNNING' | 'ENDING' | 'FINISHED';
export default class Giveaway {
    readonly manager: GiveawayManager;
    endsAt: number;
    startAt: number;
    lastRefresh: number;
    winnerCount: number;
    title: string;
    messageID?: string;
    channelID?: string;
    guildID?: string;
    author?: string;
    message: KlasaMessage | null;
    state: GiveawayState;
    reaction: string;
    constructor(manager: GiveawayManager, data: GiveawayCreateData | GiveawayData);
    get client(): import("klasa").KlasaClient;
    get options(): import("../client").GiveawayOptions;
    get refreshAt(): number;
    get duration(): number;
    get data(): GiveawayCreateData;
    renderMessage(lang: Language): string | import("discord.js").MessageEmbed | undefined;
    finishMessage(winners: GuildMember[], msg: KlasaMessage): Promise<any>;
    init(): Promise<void>;
    create(channel?: TextChannel): Promise<this>;
    update(): Promise<import("discord.js").Message>;
    finish(): Promise<null>;
    private fetchMessage;
}
