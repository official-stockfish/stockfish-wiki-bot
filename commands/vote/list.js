const { EmbedBuilder, MessageFlags, SlashCommandSubcommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("list")
    .setDescription("List your votes"),
  async execute(interaction, dependencies) {
    const { client, voteManager } = dependencies;

    const voter = interaction.user;
    const voterId = voter.id;

    const votedForIds = voteManager.getVotesCastByUser(voterId);

    if (votedForIds.length == 0) {
      await interaction.reply({
        content: "You haven't voted for anyone yet.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const userPromises = votedForIds.map(id =>
      client.users.fetch(id).catch(() => ({ tag: `Unknown User (ID: ${id})` }))
    );
    const votedForUsers = await Promise.all(userPromises);

    const description = votedForUsers
      .map((user, index) => `${index + 1}. ${user}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Your Voted Users')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(description)
      .setTimestamp()
      .setFooter({ text: `You have voted for ${votedForUsers.length} user(s).` });

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  },
};
