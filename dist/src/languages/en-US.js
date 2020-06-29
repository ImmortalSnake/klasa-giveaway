"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const util_1 = require("../lib/util/util");
class default_1 extends klasa_1.Language {
    constructor(store, file, directory) {
        super(store, file, directory);
        this.language = {
            ENDS_AT: 'Ends At:',
            ENDED_AT: 'Ended At:',
            GIVEAWAY_NOT_FOUND: 'Could not find that giveaway! Try again!',
            MAX_GIVEAWAYS: max => `You can have only upto ${max} giveaways in a guild! Remove a giveaway and try again!`,
            GIVEAWAY_RUNNING: 'This giveaway is running right now. Wait for it to end or use the `end` command to stop it now!',
            NO_RUNNING_GIVEAWAY: prefix => `There are no running giveaways in this server. Create one using the \`${prefix}gcreate\` command!`,
            NO_FINISHED_GIVEAWAY: prefix => `No giveaways were completed in this server. Use \`${prefix}gcreate\` to create one and \`${prefix}gend\` to end it`,
            COMMAND_CREATE_DESCRIPTION: 'Creates a giveaway in the specified channel!',
            COMMAND_DELETE_DESCRIPTION: 'Deletes a giveaway! (You could also simply delete the giveaway message)',
            COMMAND_END_DESCRIPTION: 'Ends a giveaway immediately',
            COMMAND_END_EXTENDED: 'If you do not provide a message id, it will end the most recent running giveaway',
            COMMAND_LIST_DESCRIPTION: 'Lists all running giveaways in the server',
            COMMAND_REROLL_DESCRIPTION: 'Rerolls a previously finished giveaway.',
            COMMAND_REROLL_EXTENDED: 'If you do not provide a message id, it will reroll the most recently finished giveaway',
            COMMAND_REROLL_NO_WINNER: 'Sorry! could not determine a winner',
            COMMAND_REROLL_SUCCESS: (winners) => `🎉 **New winner(s) are**: ${winners}`,
            COMMAND_START_DESCRIPTION: 'Immediately starts a giveaway in the current channel',
            GIVEAWAY_CREATE: ':tada: **GIVEAWAY** :tada:',
            GIVEAWAY_END: ':tada: **GIVEAWAY ENDED** :tada:',
            GIVEAWAY_DELETE: id => `Successfully deleted the giveaway with the id: \`${id}\``,
            GIVEAWAY_WON: (winners, title) => `:tada: Congratulations ${winners}! You won **${title}**`,
            GIVEAWAY_CREATE_SUCCESS: chan => `A giveaway was started in ${chan}!`,
            NOT_ENOUGH_REACTIONS: count => `The Giveaway has ended, not enough people voted.\n**Votes Required:** \`${count}\``,
            GIVEAWAY_DESCRIPTION: (winners, tleft, author) => [
                '**React with :tada: to enter**\n',
                `**Winner Count:** \`${winners}\``,
                `**Time Left:** ${tleft}`,
                `**Hosted By:** <@${author}>`
            ].join('\n'),
            GIVEWAY_LIST_TITLE: name => `Active giveaways on **${name}**`,
            GIVEAWAY_LIST_BODY: (i, message, channel, wCount, time, title) => `\n**${i}]** \`${message}\` → <#${channel}> | \`${wCount}\` **Winner(s)** | **Ends At:** ${util_1.default.ms(time - Date.now())} | **Title:** \`${title}\``
        };
    }
}
exports.default = default_1;
