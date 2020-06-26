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
        this.constructor[klasa_1.KlasaClient.plugin].call(this);
    }
    static [klasa_1.KlasaClient.plugin]() {
        klasa_1.util.mergeDefault(constants_1.OPTIONS, this.options);
        this.giveawayManager = new GiveawayManager_1.default(this);
        this.once('klasaReady', () => this.giveawayManager.init());
        const coreDirectory = path_1.join(__dirname, '../');
        this.commands.registerCoreDirectory(coreDirectory);
        this.languages.registerCoreDirectory(coreDirectory);
    }
}
exports.default = GiveawayClient;
