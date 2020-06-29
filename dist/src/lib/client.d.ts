import { KlasaClient, KlasaClientOptions, Language, CommandOptions, KlasaMessage } from 'klasa';
import GiveawayManager from './structures/GiveawayManager';
import './schemas/Guild';
import { MessageEmbed, GuildMember, MessageOptions } from 'discord.js';
import Giveaway from './structures/Giveaway';
export default class GiveawayClient extends KlasaClient {
    constructor(options?: KlasaClientOptions);
}
declare module 'discord.js' {
    interface Client {
        giveawayManager: GiveawayManager;
    }
    interface ClientOptions {
        giveaway?: GiveawayOptions;
    }
}
export interface GiveawayOptions {
    runMessage?: ((giveaway: Giveaway, language: Language) => string | MessageEmbed | MessageOptions) | string | MessageEmbed | MessageOptions;
    finishMessage?: ((giveaway: Giveaway, winners: GuildMember[], msg: KlasaMessage) => Promise<any> | null) | Promise<any> | any;
    nextRefresh?: (giveaway: Giveaway) => number;
    winnersFilter?: (member: GuildMember) => boolean;
    maxGiveaways?: number;
    requiredPermission?: number;
    provider?: string;
    enableCommands?: boolean;
    updateInterval?: number;
    commands?: {
        create?: CommandOptions;
        delete?: CommandOptions;
        end?: CommandOptions;
        list?: CommandOptions;
        reroll?: CommandOptions;
        start?: CommandOptions;
    };
}
