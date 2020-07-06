"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawayClient = void 0;
const utils_1 = require("@klasa/utils");
const core_1 = require("@klasa/core");
const GiveawayManager_1 = require("./structures/GiveawayManager");
require("./schemas/Guild");
const constants_1 = require("./util/constants");
const path_1 = require("path");
class GiveawayClient extends core_1.Client {
    static [core_1.Client.plugin]() {
        utils_1.mergeDefault(constants_1.OPTIONS, this.options);
        this.giveawayManager = new GiveawayManager_1.GiveawayManager(this);
        const coreDirectory = path_1.join(__dirname, '../');
        this.once('ready', async () => await this.giveawayManager.init());
        if (this.options.giveaway.enableCommands)
            this.commands.registerCoreDirectory(coreDirectory);
        this.languages.registerCoreDirectory(coreDirectory);
    }
}
exports.GiveawayClient = GiveawayClient;
