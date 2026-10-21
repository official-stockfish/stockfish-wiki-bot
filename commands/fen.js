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

		const analysisUrl = `https://lichess.org/analysis/standard/${encodeURI(
			fen
		)}`;

		const cdbUrl = `https://www.chessdb.cn/queryc_en/?${encodeURI(
			fen
		)}`;

		const imageUrl = `https://lichess1.org/export/fen.gif?fen=${encodeURI(
			fen
		)}&color=${stm}`;

		const queueUrl = `https://www.chessdb.cn/cdb.php?action=queue&board=${encodeURI(
			fen
		)}`;

		fetch(queueUrl).catch(() => {});

		await interaction.reply(
			`\`\`\`${fen}\`\`\`[Lichess](<${analysisUrl}>) | [Chessdb](<${cdbUrl}>) | [Image](${imageUrl})`
		);
	},
};
