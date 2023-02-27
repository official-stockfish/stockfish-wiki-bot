const { SlashCommandBuilder } = require('discord.js');

const wikiTable = {
	"home": {
		name: "Home",
		url: "https://github.com/official-stockfish/Stockfish/wiki",
		description: `Stockfish is a free, powerful and open-source UCI chess engine derived from Glaurung 2.1.
		Stockfish is not a complete chess program and requires a UCI-compatible graphical user interface (GUI) in order to be used comfortably.`,
	},
	"syzygy": {
		name: "Syzygy Tablebases",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Advanced-topics#syzygy-tablebases",
		description: `If the engine is searching a position that is not in the tablebases (e.g. a position with 8 pieces), it will access the tablebases during the search. If the engine reports a very large score, this means it has found a winning line into a tablebase position.

		If the engine is given a position to search that is in the tablebases, it will use the tablebases at the beginning of the search to preselect all good moves, i.e. all moves that preserve the win or preserve the draw while taking into account the 50-move rule. It will then perform a search only on those moves. The engine will not move immediately, unless there is only a single good move. The engine likely will not report a mate score, even if the position is known to be won.
		
		How much elo does syzygy gain?
		https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-gain-using-syzygy`,
	},
	"large_pages": {
		name: "Large Pages",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Advanced-topics#large-pages",
		description: `Stockfish supports large pages on Linux and Windows.
		Large pages make the hash access more efficient, improving the engine speed, especially on large hash sizes.

		The support is automatic, Stockfish attempts to use large pages when available and will fall back to regular memory allocation when this is not the case.
		Typical increases are 5-10% in terms of nodes per second, but speed increases up to 30% have been measured.`,
	},
	"cluster": {
		name: "Cluster",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Advanced-topics#cluster-version",
		description: `There is a branch developed with a MPI cluster implementation of Stockfish, allowing stockfish to run on clusters of compute nodes connected with a high-speed network.
		See https://github.com/official-stockfish/Stockfish/pull/1571 for some discussion of the initial implementation and https://github.com/official-stockfish/Stockfish/pull/1931 for some early performance results.`,
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
	"license": {
		name: "Use Stockfish",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Developers#using-stockfish-in-your-own-project",
		description: `Stockfish is free, and distributed under the GNU General Public License version 3 (GPL v3).
		Essentially, this means you are free to do almost exactly what you want with the program,
		including distributing it among your friends, making it available for download from your website,
		selling it (either by itself or as part of some bigger software package), or using it as the starting point for a software project of your own.`,
	},
	"participate": {
		name: "Participate",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Developers#participating-in-the-project",
		description: `Stockfish's improvement over the last decade has been a great community effort. There are a few ways to help contribute to its growth.`,
	},
	"howto": {
		name: "How to use Stockfish",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Download-and-usage",
		description: `A guide on how you can download Stockfish and run it on your PC.`,
	},
	"gui": {
		name: "GUI",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Download-and-usage#download-a-chess-gui",
		description: `Good graphical user interfaces to use the Stockfish chess engine with.`,
	},
	"uci": {
		name: "UCI",
		url: "https://backscattering.de/chess/uci/",
		description: `How to use UCI to operate a chess engine via command line.`,
	}
	"governance": {
		name: "Governance",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Governance-and-responsibilities",
		description: `Governance and responsibilities of various individuals in different Stockfish projects.`,
	},
	"regression_tests": {
		name: "Regression Tests",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Regression-Tests",
		description: `Regression testing is re-running functional and non-functional tests to ensure that previously developed and tested software still performs as expected after a change.
		If not, that would be called a regression.`,
	},
	"faq": {
		name: "FAQ",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Stockfish-FAQ",
		description: `Frequently asked questions pertaining to various Stockfish projects.`,
	},
	// "eval_interpretation": {
	// 	name: "Interpretation of the evaluation",
	// 	url: "https://github.com/official-stockfish/Stockfish/wiki/Stockfish-FAQ#interpretation-of-the-stockfish-evaluation",
	// 	description: `The evaluation of a position that results from search has traditionally been measured in pawns or centipawns (1 pawn = 100 centipawns).
	// 	A value of 1, implied a 1 pawn advantage. However, with engines being so strong, and the NNUE evaluation being much less tied to material value, a new scheme was needed.
	// 	The new normalized evaluation is now linked to the probability of winning, with a 1.0 pawn advantage being a 0.5 (that is 50%) win probability.
	// 	An evaluation of 0.0 means equal chances for a win or a loss, but also nearly 100% chance of a draw.`,
	// },
	"depth_vs_tc": {
		name: "Depth vs TC",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#depth-vs-tc",
		description: `Statistics about the reached depth in fishtest testing conditions.`,
	},
	"elo_hash": {
		name: "Optimal Hash",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-cost-of-small-hash",
		description: `The amount of hash allocated for the engine to use is an important factor in the playing strength.
		Data suggests that keeping hashfull below 30% is best to maintain strength.`,
	},
	"threading_effeciency": {
		name: "Threading Efficiency",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#threading-efficiency-and-elo-gain",
		description: `Here we look at the threading efficiency of the lazySMP parallelization scheme.
		In principle, lazySMP has excellent scaling of the nps with cores, but practical measurement is influenced by e.g. frequency adjustments, SMT/hyperthreading, and sometimes hardware limitation.`,
	},
	"elo_speedups": {
		name: "Elo Speedups",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-from-speedups",
		description: `For small speedups (<~5%) the linear estimate can be used that gives Elo gain as a function of speedup percentage (x) as:

		Elo_stc(x) = 2.10 x
		Elo_ltc(x) = 1.43 x

		To have 50% passing chance at STC<-0.5,1.5>, we need a 0.24% speedup, while at LTC<0.25,1.75> we need 0.70% speedup.
		A 1% speedup has nearly 85% passing chance at LTC.`,
	},
	"game_length": {
		name: "Game Length",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#distribution-of-lengths-of-games-at-ltc-6006-on-fishtest",
		description: `In a collection of a few million games, the longest was 902 plies.`,
	},
	"time_odds": {
		name: "Time Odds",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-gain-with-time-odds",
		description: `Elo gain with time odds`,
	},
	"fishtest": {
		name: "Fishtest",
		url: "https://github.com/glinscott/fishtest",
		description: `Fishtest is a distributed task queue for testing chess engines.`,
	},
	"nnue_pytorch": {
		name: "NNUE Pytorch",
		url: "https://github.com/glinscott/nnue-pytorch",
		description: `Stockfish NNUE (Chess evaluation) trainer in Pytorch.`,
	},
	"optimal_settings": {
		name: "Optimal Settings",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Stockfish-FAQ#optimal-settings",
		description: `Threads: 
		
		Set the number of threads to the maximum available, possibly leaving 1 or 2 threads free for other tasks.
		SMT or Hyper-threading is beneficial, so normally the number of threads available is twice the number of cores available.
		
		Hash: 
		Set the hash to nearly the maximum amount of memory (RAM) available, leaving some memory free for other tasks.
		The Hash can be any value, not just powers of two. The value is specified in MiB.

		MultiPV: 1`,
	},
	"elo_rating": {
		name: "Elo rating",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Stockfish-FAQ#the-elo-rating-of-stockfish",
		description: `Interpretation of elo ratings.`,
	},
	"crash": {
		name: "Stockfish crashed",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Stockfish-FAQ#stockfish-crashed",
		description: `Stockfish may crash if fed incorrect fens, or fens with illegal positions.
		Follow the link to read more about it.`,
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
			title: page.name,
			url: page.url,
			description: page.description,
		}
		await interaction.reply({ embeds: [embed] });
	},
};


