require("dotenv").config();

const { MessageFlags, PermissionFlagsBits, SlashCommandSubcommandBuilder } = require("discord.js");
const { updateTopHelperRole } = require('../../app/updateRole.js');
const { guildId, topHelperRoleId } = { 'guildId': process.env.GUILD_ID, 'topHelperRoleId': process.env.TOP_HELPER_ROLE_ID };

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("force-refresh")
        .setDescription("Force refresh helper role assignments"),
    async execute(interaction, dependencies) {
    const { client, voteManager } = dependencies;

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      interaction.reply({
        content: "You do not have the required permissions to use this command.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const guild = await client.guilds.fetch(guildId).catch(() => null);

    if (!guild) {
      console.error(`[CRON-ERROR] Could not find guild with ID ${guildId} from config.`);
      return;
    }

    await updateTopHelperRole(guild, voteManager, topHelperRoleId);

    await interaction.reply("Refreshed helper role assignments");
  },
};
