require('dotenv').config();

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const token = process.env.GITHUB_API_TOKEN;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dev-builds')
		.setDescription('The latest stockfish dev builds'),
	async execute(interaction) {
		const repository = 'official-stockfish/Stockfish';
		const headers = {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/vnd.github+json',
		};
		try {
			const response = await axios.get(`https://api.github.com/repos/${repository}/releases`, { headers });
			const latestRelease = response.data[0];
			const name = latestRelease.name;
			const link = latestRelease.html_url;
			const embed = {
				author: {
					name: 'Stockfish Releases',
					icon_url: 'https://raw.githubusercontent.com/daylen/stockfish-web/master/static/images/logo/icon_128x128.png',
					url: `https://github.com/${repository}/releases`,
				},
				title: `**Latest release**: ${name}`,
				url: link,
				description: '',
				color: parseInt('518047', 16),
			};
			if (latestRelease.assets.length > 0) {
				for (const asset of latestRelease.assets) {
					embed.description += `- [${asset.name}](${asset.browser_download_url})\n`;
				}
			}
			await interaction.reply({ embeds: [embed] });
		}
		catch (error) {
			console.log(error);
			interaction.reply('Sorry, an error occurred while trying to retrieve the latest build.');
		}
	},
};
