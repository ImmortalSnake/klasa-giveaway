import GiveawayManager, { GiveawayCreateData, GiveawayData } from './GiveawayManager';
import { TextChannel, GuildMember, MessageEmbed, Message, MessageOptions } from 'discord.js';
import { KlasaMessage, Language, KlasaClient } from 'klasa';
import { GiveawayOptions } from '../..';
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
    get client(): KlasaClient;
    get options(): GiveawayOptions;
    get refreshAt(): number;
    get duration(): number;
    get data(): GiveawayCreateData;
    renderMessage(lang: Language): string | MessageEmbed | MessageOptions | undefined;
    finishMessage(winners: GuildMember[], msg: KlasaMessage): Promise<any>;
    init(): Promise<void>;
    create(channel?: TextChannel): Promise<this>;
    update(): Promise<Message | null>;
    finish(): Promise<null>;
    private fetchMessage;
}
