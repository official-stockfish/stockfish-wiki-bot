const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('Replies with your input!')
		.addStringOption(option =>
			option
				.setName('query')
				.setDescription('Wiki page')
				.addChoices(
					{ name: 'Home', value: 'https://github.com/official-stockfish/Stockfish/wiki' },
					{ name: 'Commands', value: 'https://github.com/official-stockfish/Stockfish/wiki/Commands' },
				)
				.setRequired(true)),
	async execute(interaction) {
		await interaction.reply(interaction.options.getString('query'));
	},
};