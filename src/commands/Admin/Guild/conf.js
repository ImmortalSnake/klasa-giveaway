const { Command, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			guarded: true,
			subcommands: true,
			description: language => language.get('COMMAND_CONF_SERVER_DESCRIPTION'),
			usage: '<set|show|remove|reset> (key:key) (value:value)'
		});

		this
			.createCustomResolver('key', (arg, __, msg, [action]) => {
				if (action === 'show' || arg) return arg;
				throw msg.language.get('COMMAND_CONF_NOKEY');
			})
			.createCustomResolver('value', (arg, possible, msg, [action]) => {
				if (!['set', 'remove'].includes(action)) return null;
				if (arg) return this.client.arguments.get('...string').run(arg, possible, msg);
				throw msg.language.get('COMMAND_CONF_NOVALUE');
			});
	}

	async show(msg, [key]) {
		const entry = this.getPath(key);
		if (!entry || (entry.type === 'Folder' ? !entry.configurableKeys.length : !entry.configurableKeys.length)) return msg.sendLocale('COMMAND_CONF_GET_NOEXT', [key]);
		if (entry.type === 'Folder') {
			return msg.sendLocale('COMMAND_CONF_SERVER', [
				key ? `: ${key.split('.').map(util.toTitleCase).join('/')}` : '',
				util.codeBlock('asciidoc', msg.guild.settings.display(msg, entry))
			]);
		}
		return msg.sendLocale('COMMAND_CONF_GET', [entry.path, msg.guild.settings.display(msg, entry)]);
	}

	async set(msg, [key, valueToSet]) {
		const entry = this.check(msg, key, await msg.guild.settings.update(key, valueToSet, { onlyConfigurable: true, arrayAction: 'add' }));
		return msg.sendLocale('COMMAND_CONF_UPDATED', [key, msg.guild.settings.display(msg, entry)]);
	}

	async remove(msg, [key, valueToRemove]) {
		const entry = this.check(msg, key, await msg.guild.settings.update(key, valueToRemove, { onlyConfigurable: true, arrayAction: 'remove' }));
		return msg.sendLocale('COMMAND_CONF_UPDATED', [key, msg.guild.settings.display(msg, entry)]);
	}

	async reset(msg, [key]) {
		const entry = this.check(msg, key, await msg.guild.settings.reset(key));
		return msg.sendLocale('COMMAND_CONF_RESET', [key, msg.guild.settings.display(msg, entry)]);
	}

	check(msg, key, { errors, updated }) {
		if (errors.length) throw String(errors[0]);
		if (!updated.length) throw msg.language.get('COMMAND_CONF_NOCHANGE', key);
		return updated[0].entry;
	}

	getPath(key) {
		const { schema } = this.client.gateways.get('guilds');
		if (!key) return schema;
		try {
			return schema.get(key);
		} catch (__) {
			return undefined;
		}
	}

};
