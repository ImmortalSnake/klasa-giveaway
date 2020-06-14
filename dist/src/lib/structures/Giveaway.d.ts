import GiveawayManager, { GiveawayCreateData, GiveawayData } from './GiveawayManager';
import { TextChannel, GuildMember, MessageEmbed, Message, MessageOptions } from 'discord.js';
import { KlasaMessage, Language, KlasaClient } from 'klasa';
import { GiveawayOptions } from '../..';
export declare type GiveawayState = 'CREATING' | 'RUNNING' | 'ENDING' | 'FINISHED';
export default class Giveaway {
    /**
     * The giveaway manager that manages this giveaway instance
     * @readonly
     */
    readonly manager: GiveawayManager;
    /**
     * The time in milliseconds when the giveaway ends
     */
    endsAt: number;
    /**
     * The time in milliseconds when the giveaway started
     */
    startAt: number;
    /**
     * The time in milliseconds when the giveaway was last refreshed
     * @default Date.now()
     */
    lastRefresh: number;
    /**
     * Total number of winners to be chosen
     */
    winnerCount: number;
    /**
     * The title given to the giveaway
     */
    title: string;
    /**
     * The giveway message ID
     */
    messageID?: string;
    /**
     * The channel ID of the giveway message
     */
    channelID?: string;
    /**
     * The guild ID of the giveway message
     */
    guildID?: string;
    /**
     * The ID of the author who created the giveaway
     */
    author?: string;
    /**
     * The giveway message
     */
    message: KlasaMessage | null;
    /**
     * Current state of the giveaway
     */
    state: GiveawayState;
    /**
     * The reaction emoji string which the giveaway will count
     * @default '🎉'
     */
    reaction: string;
    /**
     * Constructs the giveaway instance
     * @param manager The giveaway manager that manages this giveaway instance
     * @param data The giveaway data
     */
    constructor(manager: GiveawayManager, data: GiveawayCreateData | GiveawayData);
    /**
     * The Discord client
     */
    get client(): KlasaClient;
    /**
     * The giveaway options provided to the client
     */
    get options(): GiveawayOptions;
    /**
     * Time in milliseconds for the next refresh
     */
    get refreshAt(): number;
    /**
     * Total duration in milliseconds of the giveaway
     */
    get duration(): number;
    /**
     * The giveaway data (stored in database)
     */
    get data(): GiveawayCreateData;
    /**
     * Returns an embed or string after running the `GiveawayOptions.giveawayRunMessage` function
     * @param lang The language to use when rendering the message
     */
    renderMessage(lang: Language): string | MessageEmbed | MessageOptions | undefined;
    /**
     * Returns an embed or string after running the GiveawayOptions.giveawayFinishMessage function
     * @param winners The giveaway winners
     * @param msg The giveaway message that can be edited
     */
    finishMessage(winners: GuildMember[], msg: KlasaMessage): Promise<any>;
    /**
     * Initializes the giveaway, used when initializing giveaways on restart
     */
    init(): Promise<void>;
    /**
     * Creates the giveaway and sends the giveaway message
     * @param channel The channel to send the giveaway message
     */
    create(channel?: TextChannel): Promise<this>;
    /**
     * Updates the giveaway and edits the giveaway message
     */
    update(): Promise<Message | null>;
    /**
     * Finishes the giveaway and sends the giveaway finish message
     */
    finish(): Promise<null>;
    /**
     * Returns the cached message if it exists or else fetches it
     */
    private fetchMessage;
}
