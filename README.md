# Klasa Giveaway Plugin

[![npm](https://img.shields.io/npm/v/klasa-giveaway.svg?maxAge=3600)](https://www.npmjs.com/package/klasa-giveaway)
[![npm](https://img.shields.io/npm/dt/klasa-giveaway.svg?maxAge=3600)](https://www.npmjs.com/package/klasa-giveaway)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/ImmortalSnake/klasa-giveaway.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ImmortalSnake/klasa-giveaway/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/ImmortalSnake/klasa-giveaway.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ImmortalSnake/klasa-giveaway/context:javascript)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=ImmortalSnake/klasa-giveaway)](https://dependabot.com)

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

* Customizable built-in commands
* Dynamic refresh intervals
* Automatic loading and restarting of giveaways
* Customizable embeds and locales

## How to use

1. **Install the plugin**

   `npm i klasa-giveaway` 
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

  **For example:**
  
  ```js
  new Client({
      giveaway: {
          maxGiveaways: 5,
          requiredPermission: 5,
          provider: 'mongodb'
      }
  })
  ```

  For a list of giveaway options [see here](https://immortalsnake.github.io/klasa-giveaway/interfaces/giveawayoptions)

* It also allows you to define your own locales. See [built in en-US Locale](./src/languages/en-US.ts)

## Contact
- ImmortalSnake#0449

## Credits
- [https://github.com/skyra-project/skyra](skyra)