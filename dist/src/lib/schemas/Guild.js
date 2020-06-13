"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
klasa_1.Client.defaultGuildSchema
    .add('giveaways', folder => folder
    .add('finished', 'string', { configurable: false }));
