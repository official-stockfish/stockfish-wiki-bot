const PGN_PATTERN =
	/\s*(\d{1,3})\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)(?:\s*\d+\.?\d+?m?s)?\.?\s*((?:(?:O-O(?:-O)?)|(?:[KQNBR][1-8a-h]?x?[a-h]x?[1-8])|(?:[a-h]x?[a-h]?[1-8]\=?[QRNB]?))\+?)?(?:\s*\d+\.?\d+?m?s)?/g;
const FEN_PATTERN =
	/[rnbqkpRNBQKP1-8\/]+ [wb-]+ (K?Q?k?q?|-) ([a-h][1-8]|-)( \d+ \d+)?/gm;

function formatFEN(fen) {
	const encodedFen = encodeURI(fen);

	const analysisUrl = `https://lichess.org/analysis/standard/${encodedFen}`;

	const cdbUrl = `https://chessdb-explorer.static.hf.space/#fen=${encodedFen}`;

	const stm = fen.split(" ")[1] === "w" ? "white" : "black";

	const imageUrl = `https://lichess1.org/export/fen.gif?fen=${encodedFen}&color=${stm}`;

	return `[Lichess](<${analysisUrl}>) | [ChessDB](<${cdbUrl}>) | [Image](${imageUrl})`;
}

function formatPGN(pgn) {
	const newLines = [];

	let line = "";

	for (const word of pgn.split(" ")) {
		// cap the length of each line to 80 characters
		if (line.length + word.length > 80) {
			newLines.push(line);
			line = "";
		}

		if (word.trim().length === 0) continue;

		line += word.trim() + " ";
	}

	newLines.push(line.trim());

	return newLines.join("\n");
}

async function fetchReply(message) {
	const repliedMessage = await message.fetchReference();
	if (!repliedMessage.content.length) return undefined;

	return repliedMessage.content.trim();
}

async function chessify(message, isAppsCommand = false) {
	const prefix = "/";

	// dont format messages from bots, might be recursive
	if (message.author.bot) return undefined;

	if (
		!isAppsCommand &&
		(message.reference === null ||
			message.content.trim() !== `${prefix}chessify`)
	) {
		return undefined;
	}

	const content = isAppsCommand
		? message.content.trim()
		: await fetchReply(message);

	if (!content) return undefined;

	// Check if the original message contains a PGN or FEN
	const matchFEN = content.match(FEN_PATTERN);

	if (matchFEN) {
		return formatFEN(matchFEN[0]);
	}

	const matchPGN = content.match(PGN_PATTERN);

	if (matchPGN) {
		// loop over all the groups in each match and join them
		const pgn = matchPGN.map((match) => match.split("\n").join(" ")).join(" ");

		return `\`\`\`${formatPGN(pgn)}\`\`\``;
	}

	return "error";
}

module.exports = {
	chessify,
	formatFEN,
};
