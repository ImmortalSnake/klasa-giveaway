import { KlasaClient, KlasaClientOptions, Language, CommandOptions, KlasaMessage } from 'klasa';
import GiveawayManager from './structures/GiveawayManager';
import './schemas/Guild';
import { MessageEmbed, GuildMember } from 'discord.js';
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
    givewayRunMessage?: ((giveaway: Giveaway, language: Language) => MessageEmbed | string) | MessageEmbed | string;
    giveawayFinishMessage?: ((giveaway: Giveaway, winners: GuildMember[], msg: KlasaMessage) => Promise<any> | null) | Promise<any> | any;
    maxGiveaways?: number;
    requiredPermission?: number;
    refreshInterval?: number;
    provider?: string;
    enableCommands?: boolean;
    commands?: {
        create?: CommandOptions;
        delete?: CommandOptions;
        end?: CommandOptions;
        list?: CommandOptions;
        reroll?: CommandOptions;
        start?: CommandOptions;
    };
}
