const { SlashCommandBuilder } = require("discord.js");
const { formatFEN } = require("../app/chessify");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("fen")
		.setDescription("Display a FEN visually.")
		.addStringOption((option) =>
			option.setName("fen").setDescription("Board FEN").setRequired(true)
		),
	async execute(interaction) {
		const fen = interaction.options.getString("fen");

		await interaction.reply(`\`\`\`${fen}\`\`\`${formatFEN(fen)}`);
	},
};
