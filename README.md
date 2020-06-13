# Klasa Giveaway Plugin

This plugin adds a customisable giveway feature in your discord klasa bot. It comes with the following commands:

1. **gcreate** - Creates a giveaway in the specified channel!
2. **gdelete** - Deletes a giveaway!
3. **gend** - Ends a giveaway immediately
4. **glist** - Lists all running giveaways in the server
5. **greroll** - Rerolls a previously finished giveaway.
6. **gstart** - Immediately starts a giveaway in the current channel

**NOTE**: 
- Use this version if you are using [klasa v0.5.0 (stable)](https://www.npmjs.com/package/klasa) and [discord.js v12](https://www.npmjs.com/package/discord.js)


## Features

* Customizable Built-in commands
* Customizable update interval
* Automatic loading and restarting of giveaways
* Customizable embeds and locales

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
  
  | Option             | Type    | Default   | Description |
  |--------------------|---------|-----------|-------------|
  | refreshInterval    | Number  | 5 Minutes | Duration between each giveaway refresh (in ms) |
  | maxGiveaways       | Number  | Infinite  | Maximum number of giveaways a guild can have |
  | requiredPermission | Number  | 5         | Minimum permission level required to run these commands |
  | provider           | String  | Default Provider | Database provider to store giveaway data |
  | enableCommands     | Boolean | true      | Whether to enable built-in commands or not |
  | commands           | Object  | {}        | Customize default Command Options |
  | giveawayRunMessage   | Function, string  | [See Here](src/lib/util/constants.ts) | The message that will be shown when giveaway starts |
  | giveawayFinishMessage | Function, any | [See Here](src/lib/util/constants.ts) | Message that will be displayed once the giveaway is over |

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

## Credits
- https://github.com/skyra-project/skyra for [timespan](./src/arguments/timespan.ts) argument and Giveaway Queue Structure