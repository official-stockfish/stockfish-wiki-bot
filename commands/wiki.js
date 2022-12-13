const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('Retrieve wiki articles')
		.addStringOption(option =>
			option
				.setName('query')
				.setDescription('name')
				.addChoices(
					{ name: 'Home', value: '<https://github.com/official-stockfish/Stockfish/wiki>' },
					{ name: 'Syzygy', value: '<https://github.com/official-stockfish/Stockfish/wiki/Advanced-topics#syzygy-tablebases>' },
					{ name: 'Large Pages', value: '<https://github.com/official-stockfish/Stockfish/wiki/Advanced-topics#large-pages>' },
					{ name: 'Cluster', value: '<https://github.com/official-stockfish/Stockfish/wiki/Advanced-topics#cluster-version>' },
					{ name: 'Commands', value: '<https://github.com/official-stockfish/Stockfish/wiki/Commands>' },
					{ name: 'Compiling', value: '<https://github.com/official-stockfish/Stockfish/wiki/Compiling-from-source>' },
					{ name: 'Use Stockfish', value: '<https://github.com/official-stockfish/Stockfish/wiki/Developers#using-stockfish-in-your-own-project>' },
					{ name: 'Participate', value: '<https://github.com/official-stockfish/Stockfish/wiki/Developers#participating-in-the-project>' },
					{ name: 'Download', value: '<https://github.com/official-stockfish/Stockfish/wiki/Download-and-usage>' },
					{ name: 'GUI', value: '<https://github.com/official-stockfish/Stockfish/wiki/Download-and-usage#download-a-chess-gui>' },
					{ name: 'Governance', value: '<https://github.com/official-stockfish/Stockfish/wiki/Governance-and-responsibilities>' },
					{ name: 'Regression Tests', value: '<https://github.com/official-stockfish/Stockfish/wiki/Regression-Tests>' },
					{ name: 'Current Development', value: '<https://github.com/official-stockfish/Stockfish/wiki/Regression-Tests#current-development>' },
					{ name: 'FAQ', value: '<https://github.com/official-stockfish/Stockfish/wiki/Stockfish-FAQ>' },
					{ name: 'Terminology', value: '<https://github.com/official-stockfish/Stockfish/wiki/Terminology>' },
					{ name: 'Depth vs TC', value: '<https://github.com/official-stockfish/Stockfish/wiki/Useful-data#depth-vs-tc>' },
					{ name: 'Elo hash', value: '<https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-cost-of-small-hash>' },
					{ name: 'Elo syzygy', value: '<https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-gain-using-syzygy>' },
					{ name: 'Threading efficiency', value: '<https://github.com/official-stockfish/Stockfish/wiki/Useful-data#threading-efficiency-and-elo-gain>' },
					{ name: 'Elo speedups', value: '<https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-from-speedups>' },
					{ name: 'Game length', value: '<https://github.com/official-stockfish/Stockfish/wiki/Useful-data#distribution-of-lengths-of-games-at-ltc-6006-on-fishtest>' },
					{ name: 'Time odds', value: '<https://github.com/official-stockfish/Stockfish/wiki/Useful-data#elo-gain-with-time-odds>' },
					{ name: 'One year of nnue', value: '<https://github.com/official-stockfish/Stockfish/wiki/Useful-data#one-year-of-nnue-speed-improvements>' },
					{ name: 'Fishtest', value: '<https://github.com/glinscott/fishtest>' },
					{ name: 'nnue-pytorch', value: '<https://github.com/glinscott/nnue-pytorch>' },
				)
				.setRequired(true)),
	async execute(interaction) {
		await interaction.reply(interaction.options.getString('query'));
	},
};