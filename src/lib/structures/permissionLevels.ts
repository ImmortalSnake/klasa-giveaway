import { PermissionLevels } from 'klasa';

new PermissionLevels()
// everyone
	.add(0, () => true)
// Giveaway role
	.add(5, ({ guild, member }) => Boolean(guild && member && member.roles.has(guild.settings.get('roles.giveaway') as string)), { fetch: true })
// Admins
	.add(6, ({ guild, member }) => Boolean(guild && member && member.permissions.has('ADMINISTRATOR')), { fetch: true });
