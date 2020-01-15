import { Language, LanguageStore, KlasaClient } from 'klasa';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/camelcase */


export default class extends Language {

	public constructor(client: KlasaClient, store: LanguageStore, file: string[], directory: string) {
		super(client, store, file, directory);

		this.language = {

			ENDS_AT: 'Ends At:',
			ENDED_AT: 'Ended At:',
			GIVEAWAY_NOT_FOUND: 'Could not find that giveaway! Try again!',
			MAX_GIVEAWAYS: 'You can have only upto 10 giveaways in a guild! Remove a giveaway and try again!',
			NO_RUNNING_GIVEAWAY: prefix => `There are no running giveaways in this server. Create one using the \`${prefix}create\` command!`,
			NO_FINISHED_GIVEAWAY: prefix => `No giveaways were completed in this server. Use \`${prefix}create\` to create one and \`${prefix}end\` to end it`,

			COMMAND_CREATE_DESCRIPTION: 'Creates a giveaway in the specified channel!',
			COMMAND_DELETE_DESCRIPTION: 'Deletes a giveaway! (You could also simply delete the giveaway message)',
			COMMAND_END_DESCRIPTION: 'Ends a giveaway immediately. If you do not provide a message id, it will end the most recent running giveaway',
			COMMAND_LIST_DESCRIPTION: 'Lists all running giveaways in the server',
			COMMAND_REROLL_DESCRIPTION: 'Rerolls a previously finished giveaway. If you do not provide a message id, it will reroll the most recently finished giveaway',
			COMMAND_START_DESCRIPTION: 'Immediately starts a giveaway in the current channel',

			GIVEAWAY_CREATE: ':tada: **GIVEAWAY** :tada:',
			GIVEAWAY_END: ':tada: **GIVEAWAY ENDED** :tada:',
			GIVEAWAY_DELETE: id => `Successfully deleted the giveaway with the id: \`${id}\``,
			GIVEAWAY_WON: (winners, title) => `:tada: Congratulations ${winners}! You won **${title}**`,
			GIVEAWAY_CREATE_SUCCESS: chan => `A giveaway was started in ${chan}!`,
			NOT_ENOUGH_REACTIONS: count =>
				`The Giveaway has ended, not enough people voted.
				**Votes Required:** \`${count}\``,
			GIVEAWAY_DESCRIPTION: (winners, tleft) =>
				`**React with :tada: to enter**

				**Winner Count:** \`${winners}\`
				**Time Left:** ${tleft}`,

			GIVEWAY_LIST_TITLE: name => `Active giveaways on **${name}**`,
			GIVEAWAY_LIST_BODY: (i, message, channel, wCount, time, title) =>
				`\n**${i}]** \`${message}\` → <#${channel}> | \`${wCount}\` **Winner(s)** | **Ends At:** ${time} | **Title:** \`${title}\``
		};

	}

}
