require('dotenv').config();
const giveawayClient = require('./lib/client');
const { config } = require('./config');

new giveawayClient(config).login(process.env.token);