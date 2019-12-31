require('dotenv').config();

import { config } from './config';
import GiveawayClient from './lib/client';

// eslint-disable-next-line no-process-env
new GiveawayClient(config).login(process.env.token);
