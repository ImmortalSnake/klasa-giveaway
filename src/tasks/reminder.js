const { Task } = require('klasa');

module.exports = class extends Task {
	async run({ user, text }) {
		if(user) await user.send(`Reminder: ${text}`).catch(e => console.log(e));
	}
};