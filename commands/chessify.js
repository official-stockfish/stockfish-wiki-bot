const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
} = require("discord.js");

const { chessify } = require("../app/chessify");

const data = new ContextMenuCommandBuilder()
	.setName("chessify")
	.setType(ApplicationCommandType.Message);

module.exports = {
	data: data,
	async execute(interaction) {
		const content = await interaction.channel.messages.fetch(
			interaction.targetId
		);

		const formatted = await chessify(content, true);

		if (!formatted || formatted === "error") {
			await interaction.reply({
				content: "Could not format message",
				ephemeral: true,
			});
			return;
		}

		await interaction.reply(formatted);
	},
};
