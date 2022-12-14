const { SlashCommandBuilder } = require('discord.js');

const wikiTable = {
	"home": {
		name: "Home",
		url: "https://github.com/official-stockfish/Stockfish/wiki",
		description: `Stockfish is a free, powerful and open-source UCI chess engine derived from Glaurung 2.1.
		Stockfish is not a complete chess program and requires a UCI-compatible graphical user interface (GUI) (e.g. XBoard with PolyGlot, Scid, Cute Chess, eboard, Arena, Sigma Chess, Shredder, Chess Partner or Fritz) in order to be used comfortably.`,
	},
	"syzygy": {
		name: "Syzygy Tablebases",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Advanced-topics#syzygy-tablebases",
		description: `If the engine is searching a position that is not in the tablebases (e.g. a position with 8 pieces), it will access the tablebases during the search. If the engine reports a very large score, this means it has found a winning line into a tablebase position.

		If the engine is given a position to search that is in the tablebases, it will use the tablebases at the beginning of the search to preselect all good moves, i.e. all moves that preserve the win or preserve the draw while taking into account the 50-move rule. It will then perform a search only on those moves. The engine will not move immediately, unless there is only a single good move. The engine likely will not report a mate score, even if the position is known to be won.`,
	},
	"large_pages": {
		name: "Large Pages",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Advanced-topics#large-pages",
		description: `Stockfish supports large pages on Linux and Windows. Large pages make the hash access more efficient, improving the engine speed, especially on large hash sizes.
		The support is automatic, Stockfish attempts to use large pages when available and will fall back to regular memory allocation when this is not the case.
		Typical increases are 5-10% in terms of nodes per second, but speed increases up to 30% have been measured.`,
	},
	"cluster": {
		name: "Cluster",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Advanced-topics#cluster-version",
		description: `There is a branch developed with a MPI cluster implementation of Stockfish, allowing stockfish to run on clusters of compute nodes connected with a high-speed network. See https://github.com/official-stockfish/Stockfish/pull/1571 for some discussion of the initial implementation and https://github.com/official-stockfish/Stockfish/pull/1931 for some early performance results.`,
	},
	"commands": {
		name: "Commands",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Commands",
		description: `List of all the standard and non-standard commands that Stockfish cli supports.`,
	},
	"compiling": {
		name: "Compiling",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Compiling-from-source",
		description: `Information pertaining to building a Stockfish binary from the source code on different systems.`,
	},
	"participate": {
		name: "Participate",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Developers#participating-in-the-project",
		description: `Stockfish's improvement over the last decade has been a great community effort. There are a few ways to help contribute to its growth.`,
	},
	"download": {
		name: "Download",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Download-and-usage",
		description: `Stockfish binary downloads for different systems and architectures.`,
	},
	"gui": {
		name: "GUI",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Download-and-usage#download-a-chess-gui",
		description: `Good graphical user interfaces to use the Stockfish chess engine with.`,
	},
	"governance": {
		name: "Governance",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Governance-and-responsibilities",
		description: `Governance and responsibilities of various individuals in different Stockfish projects.`,
	},
	"regression_tests": {
		name: "Regression Tests",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Regression-Tests",
		description: ``,
	},
	"current_dev": {
		name: "Current Development",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Regression-Tests#current-development",
		description: ``,
	},
	"faq": {
		name: "FAQ",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Stockfish-FAQ",
		description: `Frequently asked questions pertaining to various Stockfish projects.`,
	},
	"terminology": {
		name: "Terminology",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Terminology",
		description: `List of frequently used terminolory related to engine development.`,
	},
	"depth_vs_tc": {
		name: "Depth vs TC",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#depth-vs-tc",
		description: ``,
	},
	"elo_hash": {
		name: "Elo Hash",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-cost-of-small-hash",
		description: ``,
	},
	"elo_syzygy": {
		name: "Elo syzygy",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-gain-using-syzygy",
		description: ``,
	},
	"threading_effeciency": {
		name: "Threading Efficiency",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#threading-efficiency-and-elo-gain",
		description: ``,
	},
	"elo_speedups": {
		name: "Elo Speedups",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-from-speedups",
		description: ``,
	},
	"time_odds": {
		name: "Time Odds",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-gain-with-time-odds",
		description: ``,
	},
	"fishtest": {
		name: "Fishtest",
		url: "https://github.com/glinscott/fishtest",
		description: ``,
	},
	"nnue_pytorch": {
		name: "NNUE Pytorch",
		url: "https://github.com/glinscott/nnue-pytorch",
		description: ``,
	}
}

var options = []
for (const id in wikiTable) {
	options.push({ name: wikiTable[id].name, value: id })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('Retrieve wiki articles')
		.addStringOption(option =>
			option
				.setName('query')
				.setDescription('name')
				.addChoices(...options)
				.setRequired(true)),
	async execute(interaction) {
		const page = wikiTable[interaction.options.getString('query')]
		const embed = {
			author: {
				name: "Stockfish Wiki Bot",
				icon_url: "https://stockfishchess.org/images/logo/icon_128x128@2x.png",
			},
			title: page.name,
			url: page.url,
			description: page.description,
		}
		await interaction.reply({ embeds: [embed] });
	},
};


