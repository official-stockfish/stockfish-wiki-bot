const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("fen")
		.setDescription("Display a FEN visually.")
		.addStringOption((option) =>
			option.setName("fen").setDescription("Board FEN").setRequired(true)
		),
	async execute(interaction) {
		const fen = interaction.options.getString("fen");

		const stm = fen.split(" ")[1] === "w" ? "white" : "black";

		const imageUrl = `https://lichess1.org/export/fen.gif?fen=${encodeURI(
			fen
		)}&color=${stm}`;

		// return `[Lichess Link](<${analysisUrl}>) | [Image](${imageUrl})`;

		await interaction.reply(`\`\`\`${fen}\`\`\`[Image](${imageUrl})`);
	},
};
