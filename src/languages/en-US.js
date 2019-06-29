const { Language } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args, {
			name: 'en-US',
			enabled: true,
		});

		this.language = {
			DEFAULT: (key) => `${key} has not been localized for en-US yet.`,
			DEFAULT_LANGUAGE: 'Default Language',
			SETTING_GATEWAY_EXPECTS_GUILD: 'The parameter <Guild> expects either a Guild or a Guild Object.',
			create_description: 'Creates a giveaway in the specified channel!',
			delete_description: 'Deletes a giveaway! (You could also simply delete the giveaway message)',
			reroll_description: 'Rerolls a previously finished giveaway. If you do not provide a message id, it will reroll the most recently finished giveaway',
			end_description: 'Ends a giveaway immediately. If you do not provide a message id, it will end the most recent running giveaway',
			giveaway_create: 'GIVEAWAY',
			giveaway_delete: (id) => `Successfully deleted the giveaway with the id: **${id}**`,
			giveaway_not_found: 'Could not find the giveaway! Try again!',
			giveaway_won: (winners, title) => `Congratulations ${winners}! You won the **${title}**`,
			not_enough_reactions: 'The Giveaway has ended, not enough people voted..',
			reminder_create: (id) => `A reminder was created with id: ${id}`,
			winner_count: 'Winner Count',
			loading: 'loading....',
			giveaway_description: (winners, tleft) => `
			**React with :tada: to enter**
			Winner Count: ${winners}
			Time Left: **${tleft}**`,
			max_giveaways: 'You can have only upto 10 giveaways in a guild! Remove a giveaway and try again!',
			no_running_giveaway: (prefix) => `There are no running giveaways in this server. Create one using the \`${prefix}create\` command!`,
			COMMAND_CONF_RESET: (key, response) => `The key **${key}** has been reset to: \`${response}\``,
		};
	}


};