require("dotenv").config();

const { Events } = require('discord.js');
const cron = require('node-cron');
const { updateTopHelperRole } = require('../app/updateRole.js');
const { guildId, topHelperRoleId } = { 'guildId': process.env.GUILD_ID, 'topHelperRoleId': process.env.TOP_HELPER_ROLE_ID };

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client, dependencies) {
		const { voteManager } = dependencies;
		console.log(`Ready! Logged in as ${client.user.tag}`);

		cron.schedule('0 0 1 * *', async () => {
			console.log('[CRON] Running monthly role update...');
			const guild = await client.guilds.fetch(guildId).catch(() => null);

			if (!guild) {
				console.error(`[CRON-ERROR] Could not find guild with ID ${guildId} from config.`);
				return;
			}

			await updateTopHelperRole(guild, voteManager, topHelperRoleId);
		}, {
			scheduled: true,
			timezone: "Etc/UTC"
		});
	},
};
