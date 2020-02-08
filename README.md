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

   `npm i klasa-giveaway`\
   or if you use yarn\
   `yarn add klasa-giveaway`

2. **Use the plugin in your code**

   ```js
   const { Client } = require("klasa");

   Client.use(require("klasa-giveaway"));
   new Client().login("Your Beautiful Token");
   ```

   or in typescript

   ```ts
   import { Client } from 'klasa';
   import { GiveawayClient } from 'klasa-giveaway';

   Client.use(GiveawayClient);
   new Client().login("Your Beautiful Token");
   ```

## GiveawayOptions

* To your KlasaClientOptions you can optionally add giveaway options.
  
  | Option             | Type   | Default   | Description |
  |--------------------|--------|-----------|-------------|
  | refreshInterval    | number | 5 Minutes | Duration between each giveaway refresh |
  | maxGiveaways       | number | Infinite  | Maximum number of giveaways a guild can have|
  | requiredPermission | number | 5         | Minimum permission level required to run these commands |
  | giveawayRunEmbed   | Function, string  | [See Here](src/lib/util/constants.ts) | The embed that will be shown when giveaway starts |

  **For example:**
  
  ```js
  new Client({
      giveaway: {
          refreshInterval: 1000,
          maxGiveaways: 5,
          requiredPermission: 5
      }
  })
  ```

* It also allows you to define your own locales. See [built in en-US Locale](./src/languages/en-US.ts)
* Coming Soon:
  * Customizable giveaway finished embed
