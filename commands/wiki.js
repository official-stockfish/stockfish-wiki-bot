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
	"use_stockfish": {
		name: "Use Stockfish",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Developers#using-stockfish-in-your-own-project",
		description: ``,
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
		description: `Regression testing is re-running functional and non-functional tests to ensure that previously developed and tested software still performs as expected after a change.
		If not, that would be called a regression.`,
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
		description: `Statistics about the reached depth in fishtest testing conditions.`,
	},
	"elo_hash": {
		name: "Elo Hash",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-cost-of-small-hash",
		description: `We measure the influence of Hash on the playing strength, using games of SF15.1 at LTC (60+0.6s) and VLTC (240+2.4s) on the UHO book.
		Hash is varied between 1 and 64 MB and 256MB in powers of two, leading to as average hashfull between 100 and 950 per thousand.
		The data suggests that keeping hashfull below 30% is best to maintain strength.`,
	},
	"elo_syzygy": {
		name: "Elo syzygy",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-gain-using-syzygy",
		description: `Consistent measurement of Elo gain (syzygy 6men vs none) for various SF versions:`,
	},
	"threading_effeciency": {
		name: "Threading Efficiency",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#threading-efficiency-and-elo-gain",
		description: `Here we look at the threading efficiency of the lazySMP parallelization scheme.
		To focus on the algorithm we play games with a given budget of nodes rather than at a given TC.
		In principle, lazySMP has excellent scaling of the nps with cores, but practical measurement is influenced by e.g. frequency adjustments, SMT/hyperthreading, and sometimes hardware limitation.`,
	},
	"elo_speedups": {
		name: "Elo Speedups",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-from-speedups",
		description: `For small speedups (<~5%) the linear estimate can be used that gives Elo gain as a function of speedup percentage (x) as:

		Elo_stc(x) = 2.10 x
		Elo_ltc(x) = 1.43 x
		To have 50% passing chance at STC<-0.5,1.5>, we need a 0.24% speedup, while at LTC<0.25,1.75> we need 0.70% speedup. A 1% speedup has nearly 85% passing chance at LTC.`,
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
	"nnue_one_year": {
		name: "One year on NNUE",
		url: "https://github.com/official-stockfish/Stockfish/wiki/Useful-data#one-year-of-nnue-speed-improvements",
		description: `Presents nodes per second (nps) measurements for all SF version between the first NNUE commit (SF_NNUE, Aug 2th 2020) and end of July 2021 on a AMD Ryzen 9 3950X compiled with make -j ARCH=x86-64-avx2 profile-build.
		The last nps reported for a depth 22 search from startpos using NNUE (best over about 20 measurements) is shown in the graph.
		For reference, the last classical evaluation (SF_classical, July 30 2020) has 2.30 Mnps.`,
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


