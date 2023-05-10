const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const marked = require('marked');

// Read the markdown files in the Stockfish-wiki directory
const wikiDirectory = path.join(__dirname, '..', 'Stockfish.wiki');
const files = fs.readdirSync(wikiDirectory);

// Create an object to store the subcommands
const subcommands = {};

const reduce = (inputString) => {
	return inputString.replace(/[^\w- ]/g, '').replace(/\s/g, '-').toLowerCase();
};

const baseUrl = 'https://github.com/official-stockfish/Stockfish/wiki/';

// Parse the markdown files to extract the headings
files.forEach((file) => {
	// Ignore files like _Footer.md or _Sidebar.md
	if (file.endsWith('.md') && !file.startsWith('_')) {
		const filePath = path.join(wikiDirectory, file);
		const fileName = path.basename(file, '.md');
		const markdownContent = fs.readFileSync(filePath, 'utf-8');
		const tokens = marked.lexer(markdownContent);

		subcommands[reduce(fileName)] = {
			file: fileName,
			queries: [],
		};

		tokens.forEach(token => {
			if (token.type === 'heading' && token.depth === 1) {
				subcommands[reduce(fileName)].queries.push([token.text, []]);
			}
			else if (token.type === 'heading' && token.depth === 2) {
				const previoush1 = subcommands[reduce(fileName)].queries[subcommands[reduce(fileName)].queries.length - 1];
				if (previoush1) {
					previoush1[1].push(token.text);
				}
			}
		});

		if (subcommands.length > 25) {
			subcommands.length = 25;
		}
	}
});

// Create the slash command data
const commandData = new SlashCommandBuilder()
	.setName('wiki')
	.setDescription('Retrieve wiki articles');

// loop over keys
for (const [key, value] of Object.entries(subcommands)) {
	const choices = value.queries.map(query => ({ name: query[0], value: query[0] }));
	commandData.addSubcommand((subcommand) => {
		const option = subcommand
			.setName(key)
			.setDescription(value.file.replace(/-/g, ' '));

		if (value.queries.length > 0) {
			option.addStringOption((opt) =>
				opt
					.setName('query')
					.setDescription('Choose a heading')
					.addChoices(...choices.slice(0, 25))
					.setRequired(false),
			);
		}

		return subcommand;
	});
}

// Export the slash command data and execute function
module.exports = {
	data: commandData,
	async execute(interaction) {
		const requestedQuery = interaction.options.getString('query');
		const requestedSub = subcommands[interaction.options.getSubcommand()];

		const embed = {
			author: {
				name: 'Stockfish Wiki',
				icon_url: 'https://raw.githubusercontent.com/daylen/stockfish-web/master/static/images/logo/icon_128x128.png',
				url: baseUrl,
			},
			title: `**${requestedSub.file.replace(/-/g, ' ')}**`,
			url: baseUrl + reduce(requestedSub.file),
			color: parseInt('518047', 16),
			description: '',
		};

		if (requestedQuery) {
			for (const subQuery of requestedSub.queries) {
				if (subQuery[0] === requestedQuery) {
					embed.title += ': ' + requestedQuery;
					embed.url += '#' + reduce(requestedQuery);
					subQuery[1].forEach(h2 => {
						embed.description += `- [${h2}](${baseUrl + reduce(requestedSub.file)}#${reduce(h2)})\n`;
					});
					break;
				}
			}
		}
		else {
			for (const subQuery of requestedSub.queries) {
				embed.description += `- [${subQuery[0]}](${baseUrl + reduce(requestedSub.file)}#${reduce(subQuery[0])})\n`;
			}
		}

		await interaction.reply({ embeds: [embed] });
	},
};
