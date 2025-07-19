const { MessageFlags, SlashCommandSubcommandBuilder } = require("discord.js");
const voteManager = require("../../app/voteManager.js");

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("remove")
    .setDescription("Remove a vote from a member")
    .addUserOption(option =>
      option
        .setName("target")
        .setDescription("The user to remove vote from")
        .setRequired(true)
    ),
  async execute(interaction, dependencies) {
    const { voteManager } = dependencies;

    const voter = interaction.user;
    const target = interaction.options.getUser("target");

    const voterId = voter.id;
    const targetId = target.id;

    if (voterId == targetId) {
      await interaction.reply({
        content: "You can't vote for yourself!",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const success = voteManager.removeVote(voterId, targetId);

    if (!success) {
      await interaction.reply({
        content: "You had not voted for this user!",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    await interaction.reply({
      content:`Removed vote from ${target.username}`,
      flags: MessageFlags.Ephemeral
    });
  },
};
