const { MessageFlags, SlashCommandSubcommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("Vote a member as helpful")
    .addUserOption(option =>
      option
        .setName("target")
        .setDescription("The user to vote for")
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

    const success = voteManager.addVote(voterId, targetId);

    if (!success) {
      await interaction.reply({
        content: "You have already voted for this user!",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    await interaction.reply({
      content:`Voted ${target.username}`,
      flags: MessageFlags.Ephemeral
    });
  },
};
