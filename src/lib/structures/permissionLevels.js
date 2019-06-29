const { PermissionLevels } = require('klasa');

PermissionLevels
// everyone
	.add(0, () => true)
// Giveaway role
	.add(5, ({ guild, member }) => guild && member && member.roles.has(guild.settings.roles.giveaway), { fetch: true })
// Admins
	.add(6, ({ guild, member }) => guild && member && member.permissions.has('ADMINISTRATOR'), { fetch: true });