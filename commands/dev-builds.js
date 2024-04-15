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
			const customOrder = [
				'apple-silicon', 'armv8-dotprod', 'armv8', 'armv7-neon',
				'armv7', 'x86-64-vnni512', 'x86-64-vnni256', 'x86-64-avx512',
				'x86-64-avxvnni', 'x86-64-bmi2', 'x86-64-avx2',
				'x86-64-sse41-popcnt', 'x86-64-ssse3', 'x86-64-sse3-popcnt',
				'x86-64', 'x86-32-sse41-popcnt', 'x86-32-sse2', 'x86-32',
				'general-64', 'general-32',
			];
			const response = await axios.get(`https://api.github.com/repos/${repository}/releases`, { headers });
			const latestRelease = response.data[0];
			const preRelease = latestRelease.prerelease;
			const name = latestRelease.name;
			const link = latestRelease.html_url;
			const publishedAt = latestRelease.published_at;
			const embed = {
				author: {
					name: 'Stockfish Releases',
					icon_url: 'https://raw.githubusercontent.com/official-stockfish/stockfish-web/master/static/images/logo/icon_128x128.png',
					url: `https://github.com/${repository}/releases`,
				},
				title: `**Latest ${preRelease ? 'pre-' : ''}release**: ${name}`,
				url: link,
				description: '',
				color: parseInt('518047', 16),
				timestamp: publishedAt,
			};
			const assetsByOS = {
				'ARM': [],
				'macOS': [],
				'Linux': [],
				'Windows': [],
			};
			if (latestRelease.assets.length > 0) {
				for (const asset of latestRelease.assets) {
					const assetName = asset.name.toLowerCase();
					const formattedAssetName = assetName.split('-').slice(2).join('-').split('.')[0];
					if (assetName.includes('android')) {
						assetsByOS['ARM'].push({ ...asset, name: formattedAssetName });
					}
					else if (assetName.includes('macos')) {
						assetsByOS['macOS'].push({ ...asset, name: formattedAssetName });
					}
					else if (assetName.includes('ubuntu')) {
						assetsByOS['Linux'].push({ ...asset, name: formattedAssetName });
					}
					else if (assetName.includes('windows')) {
						assetsByOS['Windows'].push({ ...asset, name: formattedAssetName });
					}
				}
				for (const os in assetsByOS) {
					if (assetsByOS[os].length > 0) {
						embed.description += `**${os}**\n`;
						assetsByOS[os].sort((a, b) => {
							const orderA = customOrder.findIndex(item => a.name.toLowerCase().includes(item));
							const orderB = customOrder.findIndex(item => b.name.toLowerCase().includes(item));
							return orderA - orderB;
						});
						const assets = assetsByOS[os].map(asset => `[${asset.name}](${asset.browser_download_url})`).join(' | ');
						embed.description += assets + '\n\n';
					}
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
