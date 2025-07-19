const { SlashCommandBuilder } = require("discord.js");
const VoteManager = require('../app/voteManager.js');

const voteManager = new VoteManager('votes.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("vote-helper")
		.setDescription("Vote a member as helpful")
    .addUserOption((option) =>
      option.setName("username").setDescription("Person to vote for").setRequired(true)
    ),
	async execute(interaction) {
    const voter = interaction.user;
		const target = interaction.options.getUser("username");

    const voterId = voter.id;
    const targetId = target.id;

    if (voterId == targetId) {
      await interaction.reply({ content: "You can't vote for yourself!", ephemeral: true });
      return;
    }

    const success = voteManager.addVote(voterId, targetId);

    if (!success) {
      await interaction.reply({ content: "You have already voted for this user!", ephemeral: true });
      return;
    }

		await interaction.reply({
        content:`voted ${target.username}`,
        ephemeral: true
		});
	},
};
