"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const client_1 = require("./lib/client");
exports.GiveawayClient = client_1.default;
const GiveawayManager_1 = require("./lib/structures/GiveawayManager");
exports.GiveawayManager = GiveawayManager_1.default;
const Giveaway_1 = require("./lib/structures/Giveaway");
exports.Giveaway = Giveaway_1.default;
// @ts-ignore
exports[klasa_1.KlasaClient.plugin] = client_1.default[klasa_1.KlasaClient.plugin];
