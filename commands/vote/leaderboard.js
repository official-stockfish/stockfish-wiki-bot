const { EmbedBuilder, MessageFlags, SlashCommandSubcommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName("leaderboard")
    .setDescription("List votes leaderboard"),
  async execute(interaction, dependencies) {
    const { client, voteManager } = dependencies;

    const leaderboardData = voteManager.getLeaderboard(15);

    if (leaderboardData.length == 0) {
      await interaction.reply("There are no votes yet.");
      return;
    }

    const userPromises = leaderboardData.map(entry =>
      client.users.fetch(entry.target_id).catch(() => ({ tag: `Unknown User (ID: ${entry.target_id})` }))
    );
    const users = await Promise.all(userPromises);

    const leaderboardText = users.map((user, index) => {
      const votes = leaderboardData[index].votes;
      return `**#${index + 1}:** ${user} - ${votes} votes`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🏆 Most Helpful Users')
      .setDescription(leaderboardText)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
