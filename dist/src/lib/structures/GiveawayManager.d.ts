import { KlasaClient, KlasaMessage } from 'klasa';
import { TextChannel, Message, GuildMember } from 'discord.js';
import Giveaway from './Giveaway';
export default class GiveawayManager {
    /**
     * The Discord Client
     * @readonly
     */
    readonly client: KlasaClient;
    /**
     * A queue of all running giveaways
     */
    running: Giveaway[];
    /**
     * Array of giveaways to be updated
     * @private
     */
    private giveaways;
    /**
     * Constructs the GiveawayManager
     * @param {KlasaClient} client The discord client
     */
    constructor(client: KlasaClient);
    /**
     * Gets the provider being used by the giveaway manager
     */
    get provider(): import("klasa").Provider;
    /**
     * Initializes the GiveawayManager and restarts all giveaways
     */
    init(): Promise<void>;
    /**
     * Creates a giveaway in the given channel with the the given giveaway data
     * @param channel TextChannel where the giveaway will run
     * @param rawData Data for the created giveaway
     * @example
     * client.giveawayManager.create(msg.channel, {
     *     endsAt: Date.now() + 1000 * 60 * 60, // 1 hour duration
     *     author: msg.author.id,
     *     title: 'FREE NITRO!!',
     *     winnerCount: 1
     * });
     */
    create(channel: TextChannel, rawData: GiveawayCreateData): Promise<Giveaway>;
    /**
     * Deletes a giveaway with the given message id (sent by the bot). This giveaway will no longer be run
     * @param id ID of the giveaway to delete
     * @example
     * client.giveawayManager.delete('720919015068925974').catch(() => console.log());
     */
    delete(id: string): Promise<null>;
    /**
     * Ends a giveaway with the given message id (sent by the bot). The giveaway gets finished and the winners are listed
     * @param id ID of the giveaway to end
     * @example
     * client.giveawayManager.end('720919015068925974').catch(() => console.log());
     */
    end(id: string): Promise<Message | null>;
    /**
     * Edits the giveaway data with the fields you give
     * @param id ID of the giveaway to edit
     * @param data Giveaway edit data
     * @example
     * client.giveawayManager.edit('720919015068925974', {title: 'FREE GIVEAWAY'})
     */
    edit(id: string, data: GiveawayEditData): Promise<Giveaway>;
    /**
     * Rerolls a finished giveaway with the given message and Reroll Data and returns an array of winners
     * @param msg Giveaway Message to reroll
     * @param data Giveaway reroll options
     * @example
     * const winners = await client.giveawayManager.reroll(msg)
     * msg.send(`🎉 **New winner(s) are**: ${winners.map(w => w.toString()).join(', ')}`)
     */
    reroll(msg: KlasaMessage, data?: GiveawayRerollData): Promise<GuildMember[]>;
    /**
     * Updates a certain giveaway, if the time is up it gets finished
     * @param giveaway The giveaway instance to update
     */
    private update;
    /**
     * Loops through the giveaway queue and sets the update timeout and also filters out the finished giveaways
     */
    private refresh;
    /**
     * Creates a giveaway and adds it to the giveaway queue
     * @param data The giveaway data
     */
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
