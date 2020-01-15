# Klasa Giveaway Plugin

This plugin adds a customisable giveway feature in your discord klasa bot. It comes with the following commands:

1. **create** - Creates a giveaway in the specified channel!
2. **delete** - Deletes a giveaway!
3. **end** - Ends a giveaway immediately
4. **list** - Lists all running giveaways in the server
5. **reroll** - Rerolls a previously finished giveaway.
6. **start** - Immediately starts a giveaway in the current channel

## How to use

1. **Install the plugin**

   `npm i ImmortalSnake/Giveaway`\
   or if you use yarn\
   `yarn add ImmortalSnake/Giveaway`

2. **Use the plugin in your code**

   ```js
   const { Client } = require("klasa");

   Client.use(require("@kcp/functions"));
   new Client().login("Your Beautiful Token");
   ```

   or in typescript

   ```ts
   import { Client } from 'klasa';
   import { Client as FunctionsClient } from '@kcp/functions';

   Client.use(FunctionsClient);
   new Client().login("Your Beautiful Token");
   ```

## GiveawayOptions

* To your KlasaClientOptions you can optionally add giveaway options. For example:
  
  ```js
  new Client({
      giveaway: {
          maxGiveaways: 5, // default Infinite
          requiredPermission: 5 // default 5
      }
  })
  ```

* It also allows you to define your own locales. See [built in en-US Locale](./src/languages/en-US.ts)
