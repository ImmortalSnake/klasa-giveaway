import { Language, CommandOptions, KlasaMessage } from 'klasa';
import { Plugin, GuildMember, MessageBuilder, Client } from '@klasa/core';
import { GiveawayManager } from './structures/GiveawayManager';
import './schemas/Guild';
import { Giveaway } from './structures/Giveaway';
export declare class GiveawayClient extends Client implements Plugin {
    static [Client.plugin](this: Client): void;
}
declare module '@klasa/core/dist/src/lib/client/Client' {
    interface Client {
        giveawayManager: GiveawayManager;
    }
    interface ClientOptions {
        giveaway?: GiveawayOptions;
    }
}
export interface GiveawayOptions {
    runMessage?: ((giveaway: Giveaway, language: Language) => ((arg0: MessageBuilder) => MessageBuilder));
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
