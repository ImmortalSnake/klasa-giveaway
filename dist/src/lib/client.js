"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const GiveawayManager_1 = require("./structures/GiveawayManager");
require("./schemas/Guild");
const path_1 = require("path");
const constants_1 = require("./util/constants");
class GiveawayClient extends klasa_1.KlasaClient {
    constructor(options) {
        super(options);
        // @ts-ignore
        this.constructor[klasa_1.KlasaClient.plugin].call(this);
    }
    static [klasa_1.KlasaClient.plugin]() {
        klasa_1.util.mergeDefault(constants_1.OPTIONS, this.options);
        this.giveawayManager = new GiveawayManager_1.default(this);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.once('klasaReady', () => this.giveawayManager.init());
        const coreDirectory = path_1.join(__dirname, '../');
        // @ts-ignore
        this.commands.registerCoreDirectory(coreDirectory);
        // @ts-ignore
        this.languages.registerCoreDirectory(coreDirectory);
        // @ts-ignore
        this.arguments.registerCoreDirectory(coreDirectory);
        // @ts-ignore
        this.tasks.registerCoreDirectory(coreDirectory);
    }
}
exports.default = GiveawayClient;
